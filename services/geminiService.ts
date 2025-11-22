import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GeneratedResult } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateEditedImage = async (
  imageBase64: string,
  mimeType: string,
  prompt: string,
  aspectRatio: AspectRatio,
  secondaryImageBase64?: string | null,
  secondaryMimeType?: string | null,
): Promise<GeneratedResult> => {
  try {
    const modelId = 'gemini-2.5-flash-image';

    const parts: any[] = [
      {
        text: prompt,
      },
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ];

    // If a second image (Character/Subject) is provided, add it to the request
    if (secondaryImageBase64 && secondaryMimeType) {
      parts.push({
        inlineData: {
          data: secondaryImageBase64,
          mimeType: secondaryMimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio
        }
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const responseMimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${responseMimeType};base64,${base64EncodeString}`;
        } else if (part.text) {
          text = part.text;
        }
      }
    }

    return { imageUrl, text };

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};