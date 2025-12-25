import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1),
});

interface GroundingChunk {
  web?: {
    title?: string;
    uri?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = searchSchema.parse(body);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources =
      groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || "#",
      })) || [];

    return NextResponse.json({ text, sources });
  } catch (error) {
    console.error("AI search failed:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "AI search failed" }, { status: 500 });
  }
}
