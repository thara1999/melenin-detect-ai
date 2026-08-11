import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import {
  getAllScans,
  getScanById,
  createScan,
  deleteScan,
  submitFeedback,
} from './controllers/scanController';
import { runInference, getInferenceMode, isModelLoaded } from '../ml/inference/predict';

export async function createServer() {
  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      inferenceMode: getInferenceMode(),
      modelLoaded: isModelLoaded(),
    });
  });

  app.get('/api/scans', getAllScans);
  app.get('/api/scans/:id', getScanById);
  app.post('/api/scans', createScan);
  app.delete('/api/scans/:id', deleteScan);
  app.post('/api/scans/:id/feedback', submitFeedback);

  // Server-side inference endpoint — runs the ONNX model (or simulation fallback)
  app.post('/api/predict', async (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        res.status(400).json({ error: 'imageData is required' });
        return;
      }
      const result = await runInference(imageData);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Inference failed' });
    }
  });

  return app;
}
