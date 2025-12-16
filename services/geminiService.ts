import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a background image from scratch.
 */
export const generateBackground = async (
  prompt: string,
  width: number,
  height: number
): Promise<string> => {
  // Use gemini-2.5-flash-image for general availability
  const model = 'gemini-2.5-flash-image';
  
  // Calculate best aspect ratio based on requested dimensions.
  // The API supports limited aspect ratios. We default to 16:9 for landscape backgrounds.
  const aspectRatio = '16:9';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt + " -- cinematic lighting, high resolution, animation style background art, detailed environment" }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // imageSize is not supported in gemini-2.5-flash-image
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from API");
  } catch (error) {
    console.error("Error generating background:", error);
    throw error;
  }
};

/**
 * Expands an existing background using the uploaded image as a reference.
 * Note: Since the API is Image-to-Image generation, we prompt it to 'expand' the scene.
 */
export const expandBackground = async (
  base64Image: string,
  prompt: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';

  // Construct a prompt that guides the model to treat the input as a reference to be expanded
  const expansionPrompt = `
    Input is a reference animation background. 
    Create a new, wider version of this scene extending to the sides for a camera pan.
    Target style: identical to reference.
    Context: ${prompt}.
    Maintain the same lighting, color palette, and art style.
  `;

  try {
    // Strip header if present to get raw base64
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            text: expansionPrompt
          },
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG/JPEG input, API handles standard types
              data: cleanBase64
            }
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: '16:9', // Wide aspect for panning
          // imageSize is not supported in gemini-2.5-flash-image
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from API");

  } catch (error) {
    console.error("Error expanding background:", error);
    throw error;
  }
};