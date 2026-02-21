import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

function extractMeta(html: string) {
  const getMatch = (regex: RegExp) => {
    const match = html.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    title: getMatch(/<title>(.*?)<\/title>/i),
    description: getMatch(
      /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i
    ),
    ogTitle: getMatch(
      /<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i
    ),
    ogDescription: getMatch(
      /<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i
    ),
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY not configured",
    });
  }

  try {
    const { websiteUrl } = req.body;

    if (!websiteUrl) {
      return res.status(400).json({
        error: "Website URL is required",
      });
    }

    // 🌐 Fetch with real browser headers
    const fetchResponse = await fetch(websiteUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!fetchResponse.ok) {
      return res.status(200).json({
        summary: "Website could not be accessed directly.",
        bullets: [],
        keywords: [],
        signals: [{ label: "Access restricted", detected: true }],
        fetchedAt: new Date().toISOString(),
      });
    }

    const html = await fetchResponse.text();
    const meta = extractMeta(html);

    const contentForAI = `
Title: ${meta.title}
Meta Description: ${meta.description}
OG Title: ${meta.ogTitle}
OG Description: ${meta.ogDescription}
`;

    // 🧠 Gemini Setup
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a venture capital intelligence analyst.

Based on the startup metadata below, return STRICT VALID JSON only.

{
  "summary": "2-3 sentence professional startup summary",
  "bullets": ["key insight 1", "key insight 2"],
  "keywords": ["keyword1", "keyword2"],
  "signals": [
    { "label": "AI-enabled", "detected": true },
    { "label": "B2B model", "detected": false },
    { "label": "Fintech", "detected": false }
  ]
}

Startup Metadata:
${contentForAI}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 🛡 Safe JSON extraction
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(
      jsonMatch ? jsonMatch[0] : responseText
    );

    return res.status(200).json({
      ...parsed,
      fetchedAt: new Date().toISOString(),
      sources: [
        {
          url: websiteUrl,
          fetchedAt: new Date().toISOString(),
        },
      ],
    });
  } catch (error: any) {
    console.error("Enrichment error:", error);

    return res.status(200).json({
      summary: "Enrichment failed due to processing issue.",
      bullets: [],
      keywords: [],
      signals: [{ label: "Processing error", detected: true }],
      fetchedAt: new Date().toISOString(),
    });
  }
}