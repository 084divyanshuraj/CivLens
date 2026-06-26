import { GeminiResponse, PriorityData } from '../../types';

export class PriorityAgent {
  /**
   * Processes the raw Gemini JSON to extract Priority data.
   * This module could theoretically accept the base score from Gemini 
   * and further augment it based on external factors like user upvotes.
   */
  static process(rawGeminiData: Omit<GeminiResponse, 'duplicateDetection'>, currentUpvotes: number = 0): PriorityData {
    const priority = rawGeminiData.priority;
    
    // A simple heuristic: every 10 upvotes increases priority score by 1, up to a max of 100.
    const calculatedScore = Math.min(100, (priority.score || 50) + Math.floor(currentUpvotes / 10));

    return {
      score: calculatedScore,
      municipalPriorityReason: priority.municipalPriorityReason || 'Standard queue priority.',
    };
  }
}
