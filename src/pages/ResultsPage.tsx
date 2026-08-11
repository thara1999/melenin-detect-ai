import { useState } from 'react';
import {
  ScanLine,
  AlertCircle,
  AlertTriangle,
  Heart,
  Stethoscope,
  Clock,
  ChevronRight,
  Star,
  CheckCircle2,
  TrendingUp,
  Palette,
  Activity,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Calendar,
  Zap,
  GitCompare,
} from 'lucide-react';
import type { Page, CancerRiskLevel } from '../types';
import { submitFeedback as apiSubmitFeedback } from '../lib/api';

interface ResultsPageProps {
  scan: import('../types').SkinScan | null;
  onNavigate: (page: Page) => void;
  onNewScan: () => void;
}

const riskConfig: Record<
  CancerRiskLevel,
  { label: string; color: string; bg: string; border: string; barColor: string; icon: typeof ShieldCheck }
> = {
  no_risk: {
    label: 'No Cancer Risk',
    color: 'text-secondary-700',
    bg: 'bg-secondary-50',
    border: 'border-secondary-300',
    barColor: 'from-secondary-400 to-secondary-600',
    icon: ShieldCheck,
  },
  low_risk: {
    label: 'Low Cancer Risk',
    color: 'text-accent-700',
    bg: 'bg-accent-50',
    border: 'border-accent-300',
    barColor: 'from-accent-400 to-accent-600',
    icon: AlertCircle,
  },
  moderate_risk: {
    label: 'Moderate Cancer Risk',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    barColor: 'from-orange-400 to-orange-600',
    icon: AlertTriangle,
  },
  high_risk: {
    label: 'High Cancer Risk',
    color: 'text-error-700',
    bg: 'bg-error-50',
    border: 'border-error-300',
    barColor: 'from-error-400 to-error-600',
    icon: ShieldAlert,
  },
};

const urgencyConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof Activity }
> = {
  routine: {
    label: 'Routine Monitoring',
    color: 'text-secondary-700',
    bg: 'bg-secondary-100',
    icon: CheckCircle2,
  },
  see_doctor: {
    label: 'See a Doctor Soon',
    color: 'text-accent-700',
    bg: 'bg-accent-100',
    icon: Calendar,
  },
  urgent: {
    label: 'URGENT — See Doctor Immediately',
    color: 'text-error-700',
    bg: 'bg-error-100',
    icon: Zap,
  },
};

export function ResultsPage({ scan, onNavigate, onNewScan }: ResultsPageProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!scan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="card p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <ScanLine className="h-8 w-8 text-neutral-400" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-neutral-900">
            No scan results to display
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Run a scan first to see your analysis results here.
          </p>
          <button onClick={onNewScan} className="mt-6 btn-primary">
            <ScanLine className="h-4 w-4" />
            Start a Scan
          </button>
        </div>
      </div>
    );
  }

  const risk = riskConfig[scan.cancer_risk_level];
  const RiskIcon = risk.icon;
  const urgency = urgencyConfig[scan.urgency] || urgencyConfig.routine;
  const UrgencyIcon = urgency.icon;

  const submitFeedback = async () => {
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    try {
      await apiSubmitFeedback(scan.id, rating);
      setFeedbackSaved(true);
    } catch {
      // Non-critical
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50 px-4 py-1.5 text-sm font-medium text-secondary-700">
          <CheckCircle2 className="h-4 w-4" />
          Analysis Complete
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Your Skin Analysis Results
        </h1>
      </div>

      {/* ===== CANCER VERDICT — the main thing the user sees ===== */}
      <div
        className={`mt-8 overflow-hidden rounded-3xl border-2 ${risk.border} ${risk.bg} animate-scale-in`}
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${
                scan.is_cancer ? 'bg-error-500/10' : 'bg-secondary-500/10'
              }`}
            >
              {scan.is_cancer ? (
                <XCircle className="h-10 w-10 text-error-600" strokeWidth={2.5} />
              ) : (
                <CheckCircle2 className="h-10 w-10 text-secondary-600" strokeWidth={2.5} />
              )}
            </div>
            <div className="mt-4 sm:ml-6 sm:mt-0">
              <p className="text-sm font-medium text-neutral-500">Cancer Detection Result</p>
              <h2
                className={`mt-1 font-display text-3xl font-extrabold ${
                  scan.is_cancer ? 'text-error-700' : 'text-secondary-700'
                }`}
              >
                {scan.is_cancer ? 'CANCER DETECTED' : 'NO CANCER DETECTED'}
              </h2>
              {scan.cancer_type && (
                <p className="mt-1 text-sm font-semibold text-neutral-700">
                  Type: {scan.cancer_type}
                </p>
              )}
            </div>
          </div>

          {/* Cancer risk score bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-neutral-700">Cancer Risk Level</span>
              <span className={`font-display text-lg font-bold ${risk.color}`}>
                {risk.label}
              </span>
            </div>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-neutral-200/60">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${risk.barColor} transition-all duration-1000 ease-out`}
                style={{ width: `${scan.cancer_risk_score}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] font-medium text-neutral-400">
              <span>0% — No Risk</span>
              <span>50% — Moderate</span>
              <span>100% — High Risk</span>
            </div>
          </div>

          {/* Urgency badge */}
          <div
            className={`mt-5 flex items-center justify-center gap-2 rounded-xl ${urgency.bg} px-4 py-3`}
          >
            <UrgencyIcon className={`h-5 w-5 ${urgency.color}`} />
            <span className={`text-sm font-bold ${urgency.color}`}>{urgency.label}</span>
          </div>
        </div>
      </div>

      {/* Main result grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Image */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden lg:sticky lg:top-20">
            <img
              src={scan.image_url}
              alt="Analyzed skin scan"
              className="w-full bg-neutral-900 object-contain"
              style={{ maxHeight: '400px' }}
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Clock className="h-3.5 w-3.5" />
                {new Date(scan.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Results Detail */}
        <div className="space-y-4 lg:col-span-3">
          {/* Primary condition */}
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500">Detected Condition</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-neutral-900">
                  {scan.condition_name}
                </h2>
              </div>
              <div
                className={`flex items-center gap-1.5 rounded-full border ${risk.border} ${risk.bg} px-3 py-1.5`}
              >
                <RiskIcon className={`h-4 w-4 ${risk.color}`} />
                <span className={`text-xs font-semibold ${risk.color}`}>{risk.label}</span>
              </div>
            </div>

            {/* Confidence bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-600">Detection Confidence</span>
                <span className="font-display text-lg font-bold text-primary-600">
                  {scan.confidence}%
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-1000 ease-out"
                  style={{ width: `${scan.confidence}%` }}
                />
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-neutral-50 p-3">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Palette className="h-4 w-4" />
                  <span className="text-xs font-medium">Skin Tone</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-neutral-900">{scan.skin_tone}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs font-medium">Processing Time</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {(scan.processing_time_ms / 1000).toFixed(1)}s
                </p>
              </div>
            </div>
          </div>

          {/* Cancer-specific description */}
          <div
            className={`rounded-2xl border p-6 animate-fade-in-up ${
              scan.is_cancer
                ? 'border-error-200 bg-error-50/50'
                : 'border-secondary-200 bg-secondary-50/50'
            }`}
            style={{ animationDelay: '0.08s' }}
          >
            <div className="flex items-center gap-2">
              {scan.is_cancer ? (
                <ShieldAlert className="h-5 w-5 text-error-600" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-secondary-600" />
              )}
              <h3 className="font-display text-lg font-semibold text-neutral-900">
                {scan.is_cancer ? 'Cancer Assessment' : 'Cancer Assessment'}
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {scan.cancer_description}
            </p>
          </div>

          {/* General description */}
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary-600" />
              <h3 className="font-display text-lg font-semibold text-neutral-900">
                About This Condition
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">{scan.description}</p>
          </div>

          {/* Alternative conditions */}
          {scan.alternative_conditions.length > 0 && (
            <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent-600" />
                <h3 className="font-display text-lg font-semibold text-neutral-900">
                  Other Possible Conditions
                </h3>
              </div>
              <div className="mt-4 space-y-3">
                {scan.alternative_conditions.map((alt, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-700">{alt.name}</span>
                      {alt.isCancer && (
                        <span className="rounded-full bg-error-100 px-2 py-0.5 text-[10px] font-bold text-error-700">
                          CANCER
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className={`h-full rounded-full ${
                            alt.isCancer ? 'bg-error-400' : 'bg-accent-400'
                          }`}
                          style={{ width: `${alt.confidence}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-semibold text-neutral-500">
                        {alt.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-secondary-600" />
              <h3 className="font-display text-lg font-semibold text-neutral-900">
                {scan.is_cancer ? 'Immediate Actions' : 'Care Recommendations'}
              </h3>
            </div>
            <ul className="mt-4 space-y-3">
              {scan.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      scan.is_cancer ? 'bg-error-100' : 'bg-secondary-100'
                    }`}
                  >
                    {scan.is_cancer ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-error-600" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-secondary-600" />
                    )}
                  </div>
                  <span className="text-sm leading-relaxed text-neutral-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Medical disclaimer */}
          <div
            className="flex items-start gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4 animate-fade-in-up"
            style={{ animationDelay: '0.25s' }}
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-accent-600" />
            <p className="text-sm leading-relaxed text-neutral-700">
              <strong>Important:</strong> This AI analysis is for informational purposes only and
              is not a substitute for professional medical diagnosis.{' '}
              {scan.is_cancer
                ? 'CANCER DETECTED — please consult a qualified dermatologist or oncologist immediately.'
                : 'Please consult a qualified dermatologist for proper diagnosis and treatment.'}
            </p>
          </div>

          {/* Feedback */}
          {!feedbackSaved ? (
            <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="font-display text-base font-semibold text-neutral-900">
                Was this analysis helpful?
              </h3>
              <div className="mt-3 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-accent-400 text-accent-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <button
                  onClick={submitFeedback}
                  disabled={submitting}
                  className="mt-4 btn-secondary text-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              )}
            </div>
          ) : (
            <div className="card flex items-center gap-3 p-6 animate-scale-in">
              <CheckCircle2 className="h-6 w-6 text-secondary-500" />
              <p className="text-sm font-medium text-neutral-900">
                Thank you for your feedback!
              </p>
            </div>
          )}

          {/* Actions */}
          <div
            className="flex flex-col gap-3 sm:flex-row sm:justify-between animate-fade-in-up"
            style={{ animationDelay: '0.35s' }}
          >
            <button onClick={() => onNavigate('history')} className="btn-secondary">
              View All Scans
              <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={onNewScan} className="btn-primary">
              <ScanLine className="h-4 w-4" />
              New Scan
            </button>
            <button onClick={() => onNavigate('compare')} className="btn-secondary">
              <GitCompare className="h-4 w-4" />
              Compare Scans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
