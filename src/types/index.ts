export type Severity = 'low' | 'moderate' | 'high' | 'none';

export type CancerRiskLevel = 'no_risk' | 'low_risk' | 'moderate_risk' | 'high_risk';

export interface AlternativeCondition {
  name: string;
  confidence: number;
  isCancer: boolean;
}

export interface SkinScan {
  id: string;
  image_url: string;
  condition_name: string;
  confidence: number;
  severity: Severity;
  description: string;
  recommendations: string[];
  alternative_conditions: AlternativeCondition[];
  skin_tone: string;
  processing_time_ms: number;
  created_at: string;
  is_cancer: boolean;
  cancer_risk_level: CancerRiskLevel;
  cancer_risk_score: number;
  cancer_type: string | null;
  cancer_description: string;
  urgency: 'routine' | 'see_doctor' | 'urgent';
}

export interface ScanFeedback {
  id: string;
  scan_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export type Page = 'home' | 'scan' | 'results' | 'history' | 'about' | 'compare';
