import type { SkinScan, AlternativeCondition, CancerRiskLevel, Severity } from '../types';

const API_BASE = '/api';

interface ScanResponse {
  id: string;
  conditionName: string;
  confidence: number;
  severity: string;
  description: string;
  recommendations: string[];
  alternativeConditions: AlternativeCondition[];
  skinTone: string;
  processingTimeMs: number;
  imageData: string;
  createdAt: string;
  isCancer: boolean;
  cancerRiskLevel: string;
  cancerRiskScore: number;
  cancerType: string | null;
  cancerDescription: string;
  urgency: string;
}

function mapResponse(data: ScanResponse): SkinScan {
  return {
    id: data.id,
    image_url: data.imageData,
    condition_name: data.conditionName,
    confidence: data.confidence,
    severity: data.severity as Severity,
    description: data.description,
    recommendations: data.recommendations,
    alternative_conditions: data.alternativeConditions,
    skin_tone: data.skinTone,
    processing_time_ms: data.processingTimeMs,
    created_at: data.createdAt,
    is_cancer: data.isCancer,
    cancer_risk_level: data.cancerRiskLevel as CancerRiskLevel,
    cancer_risk_score: data.cancerRiskScore,
    cancer_type: data.cancerType,
    cancer_description: data.cancerDescription,
    urgency: data.urgency as 'routine' | 'see_doctor' | 'urgent',
  };
}

export async function fetchAllScans(): Promise<SkinScan[]> {
  const res = await fetch(`${API_BASE}/scans`);
  if (!res.ok) throw new Error(`Failed to fetch scans (${res.status})`);
  const data: ScanResponse[] = await res.json();
  return data.map(mapResponse);
}

export async function createScan(payload: {
  imageData: string;
  conditionName: string;
  confidence: number;
  severity: string;
  description: string;
  recommendations: string[];
  alternativeConditions: AlternativeCondition[];
  skinTone: string;
  processingTimeMs: number;
  isCancer: boolean;
  cancerRiskLevel: string;
  cancerRiskScore: number;
  cancerType: string | null;
  cancerDescription: string;
  urgency: string;
}): Promise<SkinScan> {
  const res = await fetch(`${API_BASE}/scans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create scan (${res.status})`);
  const data: ScanResponse = await res.json();
  return mapResponse(data);
}

export async function deleteScan(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/scans/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete scan (${res.status})`);
}

export async function submitFeedback(scanId: string, rating: number): Promise<void> {
  const res = await fetch(`${API_BASE}/scans/${scanId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scanId, rating }),
  });
  if (!res.ok) throw new Error(`Failed to submit feedback (${res.status})`);
}
