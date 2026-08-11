import mongoose from 'mongoose';

export interface ISkinScan extends mongoose.Document {
  conditionName: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high' | 'none';
  description: string;
  recommendations: string[];
  alternativeConditions: { name: string; confidence: number; isCancer: boolean }[];
  skinTone: string;
  processingTimeMs: number;
  imageData: string;
  createdAt: Date;
  isCancer: boolean;
  cancerRiskLevel: string;
  cancerRiskScore: number;
  cancerType: string | null;
  cancerDescription: string;
  urgency: string;
}

const SkinScanSchema = new mongoose.Schema<ISkinScan>({
  conditionName: { type: String, required: true },
  confidence: { type: Number, required: true, default: 0 },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'moderate', 'high', 'none'],
    default: 'low',
  },
  description: { type: String, required: true, default: '' },
  recommendations: { type: [String], required: true, default: [] },
  alternativeConditions: {
    type: [
      {
        name: String,
        confidence: Number,
        isCancer: Boolean,
      },
    ],
    required: true,
    default: [],
  },
  skinTone: { type: String, required: true, default: 'medium' },
  processingTimeMs: { type: Number, required: true, default: 0 },
  imageData: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isCancer: { type: Boolean, required: true, default: false },
  cancerRiskLevel: {
    type: String,
    required: true,
    enum: ['no_risk', 'low_risk', 'moderate_risk', 'high_risk'],
    default: 'no_risk',
  },
  cancerRiskScore: { type: Number, required: true, default: 0 },
  cancerType: { type: String, default: null },
  cancerDescription: { type: String, required: true, default: '' },
  urgency: {
    type: String,
    required: true,
    enum: ['routine', 'see_doctor', 'urgent'],
    default: 'routine',
  },
});

SkinScanSchema.index({ createdAt: -1 });

export const SkinScanModel =
  (mongoose.models.SkinScan as mongoose.Model<ISkinScan>) ||
  mongoose.model<ISkinScan>('SkinScan', SkinScanSchema);
