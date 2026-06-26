import { GeminiResponse, ContextData } from '../../types';

export class ContextAgent {
  /**
   * Processes the raw Gemini JSON to extract and transform Context data.
   */
  static process(rawGeminiData: Omit<GeminiResponse, 'duplicateDetection'>): ContextData {
    const context = rawGeminiData.context;
    
    return {
      nearbyLandmarks: context.nearbyLandmarks || [],
      citizenImpact: context.citizenImpact || 'Minimal immediate impact.',
      longTermRisk: context.longTermRisk || 'Requires continued monitoring.',
    };
  }
}
