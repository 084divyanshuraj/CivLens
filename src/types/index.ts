export interface Location {
  lat: number;
  lng: number;
}

export interface VisionData {
  issueType: string;
  severity: string;
  confidence: number;
  probableCause: string;
}

export interface ContextData {
  nearbyLandmarks: string[];
  citizenImpact: string;
  longTermRisk: string;
}

export interface PriorityData {
  score: number;
  municipalPriorityReason: string;
}

export interface RecommendationData {
  department: string;
  temporarySolution: string;
  permanentSolution: string;
  repairComplexity: string;
  estimatedBudgetRange: string;
}

export interface ExecutiveSummaryData {
  summary: string;
}

export interface CommunicationsData {
  tweetDraft: string;
  emailDraft: string;
}

export interface DuplicateDetectionData {
  similarIssuesNearby: boolean;
  duplicateIssueIds?: string[];
}

export interface GeminiResponse {
  vision: VisionData;
  context: ContextData;
  priority: PriorityData;
  recommendation: RecommendationData;
  executiveSummary: ExecutiveSummaryData;
  duplicateDetection: DuplicateDetectionData;
  communications: CommunicationsData;
}

export interface Issue {
  id: string;
  imageUrl: string;
  location: Location;
  status: 'REPORTED' | 'AI_ANALYSED' | 'COMMUNITY_VALIDATED' | 'IN_PROGRESS' | 'RESOLVED';
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Enriched AI Data
  vision: VisionData;
  context: ContextData;
  priority: PriorityData;
  recommendation: RecommendationData;
  executiveSummary: ExecutiveSummaryData;
  duplicateDetection: DuplicateDetectionData;
  communications: CommunicationsData;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'CITIZEN' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}
