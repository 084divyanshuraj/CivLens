import { GeminiResponse, VisionData } from '../../types';

export class VisionAgent {
  /**
   * Processes the raw Gemini JSON to extract and transform Vision data.
   */
  static process(rawGeminiData: Omit<GeminiResponse, 'duplicateDetection'>): VisionData {
    const vision = rawGeminiData.vision;
    
    // In a more complex app, we might do extra transformations here.
    // For now, it simply validates and passes through the data.
    return {
      issueType: vision.issueType || 'Unknown Issue',
      severity: vision.severity || 'MEDIUM',
      confidence: vision.confidence || 0.5,
      probableCause: vision.probableCause || 'Analysis inconclusive.',
    };
  }
}
