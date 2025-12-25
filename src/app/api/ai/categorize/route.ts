import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

const commandSchema = z.object({
  command: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { command } = commandSchema.parse(body);

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
      contents: `Process this command: "${command}". 
      Categorize it into a structured notebook item. 
      Output should be JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Short title for the note (max 100 chars)",
            },
            type: {
              type: Type.STRING,
              enum: ["NOTE", "ARTICLE", "PHOTOGRAPH", "VIDEO", "LINK"],
              description: "The type of content",
            },
            icon: {
              type: Type.STRING,
              description:
                "A Google Material Symbol name fitting the content (e.g., description, image, article, play_circle, link)",
            },
            iconColor: {
              type: Type.STRING,
              description:
                "Tailwind color class (e.g., text-red-500, text-blue-400) or empty string",
            },
          },
          required: ["title", "type", "icon"],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response from AI");
    }

    const result = JSON.parse(text);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI categorization failed:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "AI categorization failed" },
      { status: 500 }
    );
  }
}
