import { geminiModel } from './client';
import { buildGeminiPrompt } from './prompt';
import { GeminiParser } from './parser';
import { GeminiResponse } from '../../types';

export class GeminiService {
  /**
   * Main AI Engine call.
   * Uploads the image (base64) to Gemini, asks for the structured JSON payload, 
   * and retries once if parsing fails.
   */
  static async analyzeImage(base64Image: string, mimeType: string): Promise<Omit<GeminiResponse, 'duplicateDetection'>> {
    const prompt = buildGeminiPrompt();
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    let attempt = 0;
    while (attempt < 2) {
      try {
        const result = await geminiModel.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        
        return GeminiParser.parse(text);
      } catch (error) {
        attempt++;
        console.warn(`Gemini API call or parse failed on attempt ${attempt}. Error:`, error);
        
        if (attempt >= 2) {
          throw new Error('Gemini API failed to return valid data after 2 attempts.');
        }
      }
    }
    
    throw new Error('Unexpected exit from retry loop.');
  }
}
