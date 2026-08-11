import { useState, useCallback, useRef } from 'react';
import {
  Upload,
  Camera,
  ScanLine,
  X,
  AlertCircle,
  Loader2,
  ImageIcon,
  Sun,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { Page, SkinScan } from '../types';
import { analyzeImage } from '../lib/analysis';
import { createScan as apiCreateScan } from '../lib/api';

interface ServerInferenceResult {
  conditionName: string;
  confidence: number;
  severity: string;
  description: string;
  recommendations: string[];
  alternativeConditions: { name: string; confidence: number; isCancer: boolean }[];
  skinTone: string;
  processingTimeMs: number;
  isCancer: boolean;
  cancerRiskLevel: string;
  cancerRiskScore: number;
  cancerType: string | null;
  cancerDescription: string;
  urgency: string;
  modelUsed: string;
}

async function runServerInference(imageData: string): Promise<ServerInferenceResult | null> {
  try {
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData }),
    });
    if (!res.ok) return null;
    return (await res.json()) as ServerInferenceResult;
  } catch {
    return null;
  }
}

interface ScanPageProps {
  onNavigate: (page: Page) => void;
  onScanComplete: (scan: SkinScan) => void;
}

type Stage = 'idle' | 'preview' | 'analyzing' | 'saving' | 'error';

export function ScanPage({ onNavigate, onScanComplete }: ScanPageProps) {
  const [stage, setStage] = useState<Stage>('idle');
  const [imageData, setImageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const analysisSteps = [
    'Preprocessing image...',
    'Detecting skin tone...',
    'Analyzing texture & patterns...',
    'Matching against condition database...',
    'Generating recommendations...',
  ];

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      setStage('error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Please upload an image under 10MB.');
      setStage('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageData(e.target?.result as string);
      setStage('preview');
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read the image. Please try again.');
      setStage('error');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetScan = () => {
    setImageData(null);
    setStage('idle');
    setError(null);
    setAnalysisStep(0);
  };

  const runAnalysis = async () => {
    if (!imageData) return;
    setStage('analyzing');
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) =>
        prev < analysisSteps.length - 1 ? prev + 1 : prev
      );
    }, 600);

    try {
      // Try server-side inference (ONNX model) first; fall back to client-side simulation
      const serverResult = await runServerInference(imageData);
      clearInterval(stepInterval);

      setStage('saving');

      let scanPayload: Parameters<typeof apiCreateScan>[0];

      if (serverResult) {
        scanPayload = {
          imageData,
          conditionName: serverResult.conditionName,
          confidence: serverResult.confidence,
          severity: serverResult.severity,
          description: serverResult.description,
          recommendations: serverResult.recommendations,
          alternativeConditions: serverResult.alternativeConditions,
          skinTone: serverResult.skinTone,
          processingTimeMs: serverResult.processingTimeMs,
          isCancer: serverResult.isCancer,
          cancerRiskLevel: serverResult.cancerRiskLevel,
          cancerRiskScore: serverResult.cancerRiskScore,
          cancerType: serverResult.cancerType,
          cancerDescription: serverResult.cancerDescription,
          urgency: serverResult.urgency,
        };
      } else {
        const result = await analyzeImage(imageData);
        scanPayload = {
          imageData,
          conditionName: result.condition_name,
          confidence: result.confidence,
          severity: result.severity,
          description: result.description,
          recommendations: result.recommendations,
          alternativeConditions: result.alternative_conditions,
          skinTone: result.skin_tone,
          processingTimeMs: result.processing_time_ms,
          isCancer: result.is_cancer,
          cancerRiskLevel: result.cancer_risk_level,
          cancerRiskScore: result.cancer_risk_score,
          cancerType: result.cancer_type,
          cancerDescription: result.cancer_description,
          urgency: result.urgency,
        };
      }

      const scan = await apiCreateScan(scanPayload);

      onScanComplete(scan);
      onNavigate('results');
    } catch {
      clearInterval(stepInterval);
      setError('Analysis failed. Please check your connection and try again.');
      setStage('error');
    }
  };

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
          <Sparkles className="h-4 w-4" />
          AI Skin Analysis
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Analyize Your Skin
        </h1>
        <p className="mt-3 text-neutral-600">
          Upload a clear, well-lit photo of the affected area for instant AI analysis.
        </p>
      </div>

      {/* Error State */}
      {stage === 'error' && (
        <div className="mt-8 animate-scale-in rounded-2xl border border-error-500/30 bg-error-50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-500/10">
            <AlertCircle className="h-6 w-6 text-error-600" />
          </div>
          <p className="mt-3 font-semibold text-error-700">{error}</p>
          <button onClick={resetScan} className="mt-4 btn-secondary">
            Try Again
          </button>
        </div>
      )}

      {/* Upload Zone */}
      {stage === 'idle' && (
        <div className="mt-8 animate-fade-in-up">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="group relative cursor-pointer rounded-3xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center transition-all hover:border-primary-400 hover:bg-primary-50/30"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 transition-transform group-hover:scale-110">
              <Upload className="h-8 w-8 text-primary-600" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-neutral-900">
              Drag & drop your image here
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              or click to browse — JPG, PNG, WEBP up to 10MB
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <ImageIcon className="h-4 w-4" />
                Choose File
              </button>
              <button
                className="btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {/* Tips */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Sun, title: 'Good Lighting', text: 'Use natural daylight when possible' },
              { icon: Camera, title: 'Clear Focus', text: 'Keep the camera steady and close' },
              { icon: CheckCircle2, title: 'Clean Background', text: 'Use a plain, uncluttered background' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="card flex items-start gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{title}</p>
                  <p className="text-xs text-neutral-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {stage === 'preview' && imageData && (
        <div className="mt-8 animate-scale-in">
          <div className="card overflow-hidden">
            <div className="relative">
              <img
                src={imageData}
                alt="Skin scan preview"
                className="max-h-[400px] w-full object-contain bg-neutral-900"
              />
              <button
                onClick={resetScan}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3 rounded-xl bg-accent-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-accent-600" />
                <p className="text-sm text-neutral-700">
                  This AI analysis is for informational purposes only and is not a medical
                  diagnosis. Always consult a qualified dermatologist for professional advice.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button onClick={resetScan} className="btn-secondary">
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button onClick={runAnalysis} className="btn-primary">
                  <ScanLine className="h-4 w-4" />
                  Analyize Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing */}
      {stage === 'analyzing' && imageData && (
        <div className="mt-8 animate-scale-in">
          <div className="card overflow-hidden">
            <div className="relative">
              <img
                src={imageData}
                alt="Analyzing skin scan"
                className="max-h-[400px] w-full object-contain bg-neutral-900"
              />
              <div className="absolute inset-0 bg-primary-500/10" />
              <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 animate-scan-line bg-gradient-to-b from-transparent via-primary-400 to-transparent shadow-lg shadow-primary-500/50" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-400/60" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-primary-400/30" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-primary-700">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-semibold">AI Analysis in Progress</span>
              </div>
              <div className="mt-6 space-y-3">
                {analysisSteps.map((step, i) => (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      i <= analysisStep
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-neutral-50 text-neutral-400'
                    }`}
                  >
                    {i < analysisStep ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary-500" />
                    ) : i === analysisStep ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-neutral-200" />
                    )}
                    <span className="text-sm font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saving */}
      {stage === 'saving' && (
        <div className="mt-8 animate-scale-in">
          <div className="card p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary-50">
              <Loader2 className="h-8 w-8 animate-spin text-secondary-600" />
            </div>
            <p className="mt-4 font-semibold text-neutral-900">Saving your results...</p>
            <p className="mt-1 text-sm text-neutral-500">Storing analysis securely</p>
          </div>
        </div>
      )}
    </div>
  );
}
