import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

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

    const genAI = new GoogleGenerativeAI(apiKey);

    const fetchResponse = await fetch(websiteUrl);
    const html = await fetchResponse.text();

    const cleanText = html
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<style[^>]*>.*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 15000);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Return valid JSON only:

{
  "summary": "...",
  "bullets": [],
  "keywords": [],
  "signals": []
}

Website content:
${cleanText}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

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
    console.error(error);
    return res.status(500).json({
      error: "Enrichment failed",
    });
  }
}