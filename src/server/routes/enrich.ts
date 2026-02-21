import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

/* ===============================
   Gemini Initialization
================================ */
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY not found.");
}

const genAI = apiKey
  ? new GoogleGenerativeAI(apiKey)
  : null;

/* ===============================
   Types
================================ */
interface EnrichRequest {
  websiteUrl: string;
}

interface EnrichResponse {
  summary: string;
  bullets: string[];
  keywords: string[];
  signals: {
    label: string;
    detected: boolean;
  }[];
  sources: {
    url: string;
    fetchedAt: string;
  }[];
  fetchedAt: string;
}

/* ===============================
   Route
================================ */
router.post("/enrich", async (req: Request, res: Response) => {
  try {
    if (!genAI) {
      return res.status(401).json({
        error: "Gemini API key not configured.",
      });
    }

    const { websiteUrl } = req.body as EnrichRequest;

    if (!websiteUrl) {
      return res.status(400).json({
        error: "Website URL is required.",
      });
    }

    try {
      new URL(websiteUrl);
    } catch {
      return res.status(400).json({
        error: "Invalid URL format.",
      });
    }

    /* ===============================
       Fetch Website
    =============================== */
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      10000
    );

    let fetchResponse: globalThis.Response;

    try {
      fetchResponse = await fetch(websiteUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "ScoutFlow VC Intelligence Bot/1.0",
        },
      });
    } catch (err: any) {
      clearTimeout(timeout);

      if (err.name === "AbortError") {
        return res.status(408).json({
          error: "Website request timed out.",
        });
      }

      return res.status(400).json({
        error: "Failed to fetch website.",
      });
    }

    clearTimeout(timeout);

    if (!fetchResponse.ok) {
      return res.status(400).json({
        error: `Failed to fetch website. Status: ${fetchResponse.status}`,
      });
    }

    const html = await fetchResponse.text();

    /* ===============================
       Clean HTML
    =============================== */
    const cleanText = html
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<style[^>]*>.*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 15000);

    if (cleanText.length < 500) {
      return res.status(400).json({
        error: "Website content too small to analyze.",
      });
    }

    /* ===============================
       Gemini Prompt
    =============================== */
    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

    const prompt = `
You are a startup intelligence analyst.

From the website content below, extract structured insights.

Return ONLY valid JSON in this exact format:

{
  "summary": "1-2 sentence company description",
  "bullets": ["3-6 key activities"],
  "keywords": ["5-10 relevant keywords"],
  "signals": [
    {"label": "Careers page exists", "detected": true/false},
    {"label": "Blog active", "detected": true/false},
    {"label": "API documentation found", "detected": true/false},
    {"label": "Funding mentioned", "detected": true/false},
    {"label": "Changelog detected", "detected": true/false}
  ]
}

Rules:
- Strict JSON only.
- No markdown.
- No explanation text.
- All fields must exist.

Website Content:
${cleanText}
`;

    const result =
      await model.generateContent(prompt);

    const responseText =
      result.response.text();

    /* ===============================
       Safe JSON Parse
    =============================== */
    let parsed: Partial<EnrichResponse>;

    try {
      const jsonMatch =
        responseText.match(/\{[\s\S]*\}/);

      const jsonString =
        jsonMatch?.[0] ?? responseText;

      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.error(
        "AI returned invalid JSON:",
        responseText
      );

      return res.status(500).json({
        error:
          "AI returned invalid JSON format.",
      });
    }

    /* ===============================
       Final Safe Response
    =============================== */
    const enrichedData: EnrichResponse = {
      summary:
        typeof parsed.summary === "string"
          ? parsed.summary
          : "",

      bullets: Array.isArray(parsed.bullets)
        ? parsed.bullets
        : [],

      keywords: Array.isArray(parsed.keywords)
        ? parsed.keywords
        : [],

      signals: Array.isArray(parsed.signals)
        ? parsed.signals
        : [],

      sources: [
        {
          url: websiteUrl,
          fetchedAt:
            new Date().toISOString(),
        },
      ],

      fetchedAt:
        new Date().toISOString(),
    };

    console.log(
      "✅ Enrichment successful:",
      websiteUrl
    );

    return res.status(200).json(
      enrichedData
    );
  } catch (error: any) {
    console.error("❌ Enrichment error:", error);

    if (error.message?.includes("quota")) {
      return res.status(429).json({
        error: "API quota exceeded.",
      });
    }

    return res.status(500).json({
      error:
        "Enrichment failed. Please try again later.",
    });
  }
});

export default router;