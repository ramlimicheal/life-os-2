
import { GoogleGenAI, Type } from "@google/genai";
import { NoteType } from "../types";

export const processAICommand = async (command: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Process this command: "${command}". 
    Categorize it into a structured notebook item. 
    Output should be JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short title for the note" },
          type: { 
            type: Type.STRING, 
            enum: Object.values(NoteType),
            description: "The type of content" 
          },
          icon: { type: Type.STRING, description: "A Google Material Symbol name fitting the content" },
          iconColor: { type: Type.STRING, description: "Tailwind color class (e.g., text-red-500) or empty" }
        },
        required: ["title", "type", "icon"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};

export const searchGrounding = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;

  interface GroundingChunk {
    web?: {
      title?: string;
      uri?: string;
    };
  }

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => ({
    title: chunk.web?.title || "Source",
    uri: chunk.web?.uri || "#"
  })) || [];

  return { text, sources };
};
