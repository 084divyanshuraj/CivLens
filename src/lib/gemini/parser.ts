import { GeminiResponse } from '../../types';

export class GeminiParser {
  /**
   * Safely parses the Gemini text response into our typed JSON structure.
   */
  static parse(responseText: string): Omit<GeminiResponse, 'duplicateDetection'> {
    // Strip markdown code blocks if the LLM accidentally includes them
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    
    cleanText = cleanText.trim();

    try {
      const parsed = JSON.parse(cleanText);
      // Optional: Add strict Zod schema validation here for production, 
      // but for a hackathon we assume the LLM follows instructions.
      return parsed as Omit<GeminiResponse, 'duplicateDetection'>;
    } catch (error) {
      console.error('Failed to parse Gemini JSON:', cleanText);
      throw new Error('Invalid JSON format returned by Gemini.');
    }
  }
}
