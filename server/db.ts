import mongoose from 'mongoose';

// const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://tamilkrishnan20:thara1999@cluster0.8ag3rmk.mongodb.net/melenin-detect-ai?retryWrites=true&w=majority&appName=Cluster0';
const MONGO_URI = 'mongodb+srv://tamilkrishnan20:thara1999@cluster0.8ag3rmk.mongodb.net/melenin-detect-ai?retryWrites=true&w=majority&appName=Cluster0';
export let isMongoConnected = false;

export interface InMemoryScan {
  id: string;
  conditionName: string;
  confidence: number;
  severity: string;
  description: string;
  recommendations: string[];
  alternativeConditions: { name: string; confidence: number; isCancer: boolean }[];
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

export const inMemoryStore: InMemoryScan[] = [];

export async function connectDB(): Promise<void> {
  if (!MONGO_URI) {
    console.log('[db] No MONGODB_URI set — using in-memory store fallback.');
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI);
    isMongoConnected = true;
    console.log('[db] MongoDB connected successfully.');
  } catch (err) {
    console.error('[db] MongoDB connection failed — falling back to in-memory store:', err);
  }
}

export async function disconnectDB(): Promise<void> {
  if (isMongoConnected) {
    await mongoose.disconnect();
    isMongoConnected = false;
  }
}
