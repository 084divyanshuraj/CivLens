import { GeminiResponse, RecommendationData } from '../../types';

export class RecommendationAgent {
  /**
   * Processes the raw Gemini JSON to extract Recommendation data.
   */
  static process(rawGeminiData: Omit<GeminiResponse, 'duplicateDetection'>): RecommendationData {
    const rec = rawGeminiData.recommendation;
    
    return {
      department: rec.department || 'General Services',
      temporarySolution: rec.temporarySolution || 'Block off area to prevent incidents.',
      permanentSolution: rec.permanentSolution || 'Requires full municipal assessment.',
      repairComplexity: rec.repairComplexity || 'MEDIUM',
      estimatedBudgetRange: rec.estimatedBudgetRange || 'Unknown',
    };
  }
}
