import type { Request, Response } from 'express';
import { SkinScanModel, type ISkinScan } from '../models/SkinScan';
import { isMongoConnected, inMemoryStore, type InMemoryScan } from '../db';

interface ScanDoc {
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

function toDoc(scan: ISkinScan): ScanDoc {
  return {
    id: scan._id.toString(),
    conditionName: scan.conditionName,
    confidence: scan.confidence,
    severity: scan.severity,
    description: scan.description,
    recommendations: scan.recommendations,
    alternativeConditions: scan.alternativeConditions,
    skinTone: scan.skinTone,
    processingTimeMs: scan.processingTimeMs,
    imageData: scan.imageData,
    createdAt: scan.createdAt.toISOString(),
    isCancer: scan.isCancer,
    cancerRiskLevel: scan.cancerRiskLevel,
    cancerRiskScore: scan.cancerRiskScore,
    cancerType: scan.cancerType,
    cancerDescription: scan.cancerDescription,
    urgency: scan.urgency,
  };
}

function toDocFromMemory(scan: InMemoryScan): ScanDoc {
  return {
    id: scan.id,
    conditionName: scan.conditionName,
    confidence: scan.confidence,
    severity: scan.severity,
    description: scan.description,
    recommendations: scan.recommendations,
    alternativeConditions: scan.alternativeConditions,
    skinTone: scan.skinTone,
    processingTimeMs: scan.processingTimeMs,
    imageData: scan.imageData,
    createdAt: scan.createdAt,
    isCancer: scan.isCancer,
    cancerRiskLevel: scan.cancerRiskLevel,
    cancerRiskScore: scan.cancerRiskScore,
    cancerType: scan.cancerType,
    cancerDescription: scan.cancerDescription,
    urgency: scan.urgency,
  };
}

export async function getAllScans(_req: Request, res: Response) {
  try {
    if (isMongoConnected) {
      const scans = await SkinScanModel.find().sort({ createdAt: -1 }).lean();
      res.json(scans.map((s) => toDoc(s as unknown as ISkinScan)));
    } else {
      const sorted = [...inMemoryStore].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.json(sorted.map(toDocFromMemory));
    }
  } catch {
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
}

export async function getScanById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const scan = await SkinScanModel.findById(id).lean();
      if (!scan) {
        res.status(404).json({ error: 'Scan not found' });
        return;
      }
      res.json(toDoc(scan as unknown as ISkinScan));
    } else {
      const scan = inMemoryStore.find((s) => s.id === id);
      if (!scan) {
        res.status(404).json({ error: 'Scan not found' });
        return;
      }
      res.json(toDocFromMemory(scan));
    }
  } catch {
    res.status(500).json({ error: 'Failed to fetch scan' });
  }
}

export async function createScan(req: Request, res: Response) {
  try {
    const {
      conditionName,
      confidence,
      severity,
      description,
      recommendations,
      alternativeConditions,
      skinTone,
      processingTimeMs,
      imageData,
      isCancer,
      cancerRiskLevel,
      cancerRiskScore,
      cancerType,
      cancerDescription,
      urgency,
    } = req.body;

    if (!conditionName || !imageData) {
      res.status(400).json({ error: 'conditionName and imageData are required' });
      return;
    }

    if (isMongoConnected) {
      const scan = new SkinScanModel({
        conditionName,
        confidence: confidence || 0,
        severity: severity || 'low',
        description: description || '',
        recommendations: recommendations || [],
        alternativeConditions: alternativeConditions || [],
        skinTone: skinTone || 'medium',
        processingTimeMs: processingTimeMs || 0,
        imageData,
        isCancer: isCancer || false,
        cancerRiskLevel: cancerRiskLevel || 'no_risk',
        cancerRiskScore: cancerRiskScore || 0,
        cancerType: cancerType ?? null,
        cancerDescription: cancerDescription || '',
        urgency: urgency || 'routine',
      });
      await scan.save();
      res.status(201).json(toDoc(scan));
    } else {
      const doc: InMemoryScan = {
        id: crypto.randomUUID(),
        conditionName,
        confidence: confidence || 0,
        severity: severity || 'low',
        description: description || '',
        recommendations: recommendations || [],
        alternativeConditions: alternativeConditions || [],
        skinTone: skinTone || 'medium',
        processingTimeMs: processingTimeMs || 0,
        imageData,
        createdAt: new Date().toISOString(),
        isCancer: isCancer || false,
        cancerRiskLevel: cancerRiskLevel || 'no_risk',
        cancerRiskScore: cancerRiskScore || 0,
        cancerType: cancerType ?? null,
        cancerDescription: cancerDescription || '',
        urgency: urgency || 'routine',
      };
      inMemoryStore.push(doc);
      res.status(201).json(toDocFromMemory(doc));
    }
  } catch {
    res.status(500).json({ error: 'Failed to create scan' });
  }
}

export async function deleteScan(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const result = await SkinScanModel.findByIdAndDelete(id);
      if (!result) {
        res.status(404).json({ error: 'Scan not found' });
        return;
      }
      res.json({ success: true });
    } else {
      const idx = inMemoryStore.findIndex((s) => s.id === id);
      if (idx === -1) {
        res.status(404).json({ error: 'Scan not found' });
        return;
      }
      inMemoryStore.splice(idx, 1);
      res.json({ success: true });
    }
  } catch {
    res.status(500).json({ error: 'Failed to delete scan' });
  }
}

export async function submitFeedback(req: Request, res: Response) {
  try {
    const { scanId, rating } = req.body;
    if (!scanId || !rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'scanId and rating (1-5) are required' });
      return;
    }
    res.status(201).json({ success: true, scanId, rating });
  } catch {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
}
