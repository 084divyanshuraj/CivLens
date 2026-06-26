import { GeminiResponse, ExecutiveSummaryData } from '../../types';

export class ExecutiveSummaryAgent {
  /**
   * Processes the raw Gemini JSON to extract the Executive Summary.
   */
  static process(rawGeminiData: Omit<GeminiResponse, 'duplicateDetection'>): ExecutiveSummaryData {
    const exec = rawGeminiData.executiveSummary;
    
    return {
      summary: exec.summary || 'An issue has been reported and requires review.',
    };
  }
}
