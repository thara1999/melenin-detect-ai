import cors from "cors";
import express from "express";

import { connectDB } from "./db";

import {
  createScan,
  deleteScan,
  getAllScans,
  getScanById,
  submitFeedback,
} from "./controllers/scanController";

import {
  getInferenceMode,
  isModelLoaded,
  runInference,
} from "../ml/inference/predict";

export async function createServer() {
  await connectDB();

  const app = express();

  app.use(cors());

  app.use(express.json({ limit: "15mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      inferenceMode: getInferenceMode(),
      modelLoaded: isModelLoaded(),
    });
  });

  app.get("/api/scans", getAllScans);

  app.get("/api/scans/:id", getScanById);

  app.post("/api/scans", createScan);

  app.delete("/api/scans/:id", deleteScan);

  app.post("/api/scans/:id/feedback", submitFeedback);

  app.post("/api/predict", async (req, res) => {
    try {
      const { imageData } = req.body;

      if (!imageData) {
        return res.status(400).json({
          error: "imageData is required",
        });
      }

      const result = await runInference(imageData);

      res.json(result);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Inference failed",
      });
    }
  });

  return app;
}