import { useState, useEffect, useCallback } from 'react';
import {
  GitCompare,
  ScanLine,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  ArrowRight,
  Activity,
} from 'lucide-react';
import type { Page, SkinScan } from '../types';
import { fetchAllScans } from '../lib/api';

interface ComparePageProps {
  onNavigate: (page: Page) => void;
  onViewScan: (scan: SkinScan) => void;
}

export function ComparePage({ onNavigate, onViewScan }: ComparePageProps) {
  const [scans, setScans] = useState<SkinScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanAId, setScanAId] = useState<string | null>(null);
  const [scanBId, setScanBId] = useState<string | null>(null);

  const loadScans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllScans();
      setScans(data);
      if (data.length >= 2) {
        setScanAId(data[0].id);
        setScanBId(data[1].id);
      }
    } catch {
      setError('Failed to load scans. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScans();
  }, [loadScans]);

  const scanA = scans.find((s) => s.id === scanAId) || null;
  const scanB = scans.find((s) => s.id === scanBId) || null;

  const riskScoreDelta =
    scanA && scanB ? scanB.cancer_risk_score - scanA.cancer_risk_score : 0;
  const confidenceDelta =
    scanA && scanB ? scanB.confidence - scanA.confidence : 0;
  const cancerStatusChanged =
    scanA && scanB ? scanA.is_cancer !== scanB.is_cancer : false;

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
          <GitCompare className="h-4 w-4" />
          Scan Comparison
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Compare Your Scans
        </h1>
        <p className="mt-3 text-neutral-600">
          Track changes in your skin over time by comparing two scans side by side.
        </p>
      </div>

      {loading && (
        <div className="mt-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-3 text-sm text-neutral-500">Loading your scans...</p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-2xl border border-error-500/30 bg-error-50 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-error-600" />
          <p className="mt-3 font-semibold text-error-700">{error}</p>
          <button onClick={loadScans} className="mt-4 btn-secondary">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && scans.length < 2 && (
        <div className="mt-12 card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <GitCompare className="h-8 w-8 text-neutral-400" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-neutral-900">
            Not enough scans to compare
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            You need at least two scans to use the comparison feature. Run a new
            scan to get started.
          </p>
          <button onClick={() => onNavigate('scan')} className="mt-6 btn-primary">
            <ScanLine className="h-4 w-4" />
            New Scan
          </button>
        </div>
      )}

      {!loading && !error && scans.length >= 2 && (
        <>
          {/* Scan selectors */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card p-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Previous Scan
              </label>
              <select
                value={scanAId || ''}
                onChange={(e) => setScanAId(e.target.value)}
                className="input-field mt-2"
              >
                {scans.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.condition_name} — {new Date(s.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="card p-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Current Scan
              </label>
              <select
                value={scanBId || ''}
                onChange={(e) => setScanBId(e.target.value)}
                className="input-field mt-2"
              >
                {scans.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.condition_name} — {new Date(s.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-side images */}
          {scanA && scanB && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Scan A */}
              <div className="card overflow-hidden animate-fade-in-up">
                <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                    Previous
                  </span>
                </div>
                <img
                  src={scanA.image_url}
                  alt="Previous scan"
                  className="h-64 w-full bg-neutral-900 object-contain"
                />
                <div className="p-4">
                  <h3 className="font-display text-lg font-bold text-neutral-900">
                    {scanA.condition_name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {scanA.is_cancer ? (
                      <span className="flex items-center gap-1 rounded-full bg-error-100 px-2 py-0.5 text-[10px] font-bold text-error-700">
                        <ShieldAlert className="h-3 w-3" /> CANCER
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-bold text-secondary-700">
                        <ShieldCheck className="h-3 w-3" /> NO CANCER
                      </span>
                    )}
                    <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                      <Calendar className="h-3 w-3" />
                      {new Date(scanA.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-neutral-500">
                    <div className="flex justify-between">
                      <span>Cancer Risk Score</span>
                      <span className="font-bold text-neutral-700">{scanA.cancer_risk_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence</span>
                      <span className="font-bold text-neutral-700">{scanA.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Severity</span>
                      <span className="font-bold capitalize text-neutral-700">{scanA.severity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan B */}
              <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-primary-600">
                    Current
                  </span>
                </div>
                <img
                  src={scanB.image_url}
                  alt="Current scan"
                  className="h-64 w-full bg-neutral-900 object-contain"
                />
                <div className="p-4">
                  <h3 className="font-display text-lg font-bold text-neutral-900">
                    {scanB.condition_name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {scanB.is_cancer ? (
                      <span className="flex items-center gap-1 rounded-full bg-error-100 px-2 py-0.5 text-[10px] font-bold text-error-700">
                        <ShieldAlert className="h-3 w-3" /> CANCER
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-bold text-secondary-700">
                        <ShieldCheck className="h-3 w-3" /> NO CANCER
                      </span>
                    )}
                    <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                      <Calendar className="h-3 w-3" />
                      {new Date(scanB.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-neutral-500">
                    <div className="flex justify-between">
                      <span>Cancer Risk Score</span>
                      <span className="font-bold text-neutral-700">{scanB.cancer_risk_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence</span>
                      <span className="font-bold text-neutral-700">{scanB.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Severity</span>
                      <span className="font-bold capitalize text-neutral-700">{scanB.severity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Change analysis */}
          {scanA && scanB && (
            <div className="mt-6 space-y-4">
              {/* Cancer status change alert */}
              {cancerStatusChanged && (
                <div
                  className={`flex items-center gap-3 rounded-2xl border-2 p-5 animate-scale-in ${
                    scanB.is_cancer
                      ? 'border-error-300 bg-error-50'
                      : 'border-secondary-300 bg-secondary-50'
                  }`}
                >
                  {scanB.is_cancer ? (
                    <ShieldAlert className="h-8 w-8 shrink-0 text-error-600" />
                  ) : (
                    <ShieldCheck className="h-8 w-8 shrink-0 text-secondary-600" />
                  )}
                  <div>
                    <p className="font-display text-base font-bold text-neutral-900">
                      {scanB.is_cancer
                        ? 'Cancer status changed: cancer now detected'
                        : 'Cancer status changed: no longer showing cancer indicators'}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {scanB.is_cancer
                        ? 'Please consult a dermatologist immediately for professional evaluation.'
                        : 'Continue monitoring regularly and maintain sun protection practices.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Delta metrics */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Cancer risk delta */}
                <div className="card p-5 animate-fade-in-up">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <Activity className="h-4 w-4" />
                    Cancer Risk Change
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {riskScoreDelta > 0 ? (
                      <TrendingUp className="h-6 w-6 text-error-600" />
                    ) : riskScoreDelta < 0 ? (
                      <TrendingDown className="h-6 w-6 text-secondary-600" />
                    ) : (
                      <Minus className="h-6 w-6 text-neutral-400" />
                    )}
                    <span
                      className={`font-display text-2xl font-bold ${
                        riskScoreDelta > 0
                          ? 'text-error-700'
                          : riskScoreDelta < 0
                            ? 'text-secondary-700'
                            : 'text-neutral-500'
                      }`}
                    >
                      {riskScoreDelta > 0 ? '+' : ''}
                      {riskScoreDelta} pts
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    {riskScoreDelta > 5
                      ? 'Risk increased significantly'
                      : riskScoreDelta < -5
                        ? 'Risk decreased significantly'
                        : 'Risk remained stable'}
                  </p>
                </div>

                {/* Confidence delta */}
                <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <TrendingUp className="h-4 w-4" />
                    Confidence Change
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {confidenceDelta > 0 ? (
                      <TrendingUp className="h-6 w-6 text-primary-600" />
                    ) : confidenceDelta < 0 ? (
                      <TrendingDown className="h-6 w-6 text-neutral-400" />
                    ) : (
                      <Minus className="h-6 w-6 text-neutral-400" />
                    )}
                    <span
                      className={`font-display text-2xl font-bold ${
                        confidenceDelta > 0
                          ? 'text-primary-700'
                          : confidenceDelta < 0
                            ? 'text-neutral-500'
                            : 'text-neutral-500'
                      }`}
                    >
                      {confidenceDelta > 0 ? '+' : ''}
                      {confidenceDelta}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Detection confidence difference
                  </p>
                </div>

                {/* Time gap */}
                <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <Clock className="h-4 w-4" />
                    Time Between Scans
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-accent-600" />
                    <span className="font-display text-2xl font-bold text-neutral-900">
                      {Math.max(
                        0,
                        Math.round(
                          (new Date(scanB.created_at).getTime() -
                            new Date(scanA.created_at).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}
                    </span>
                    <span className="text-sm font-medium text-neutral-500">days</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    {new Date(scanA.created_at).toLocaleDateString()} →{' '}
                    {new Date(scanB.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Condition change summary */}
              <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <h3 className="font-display text-lg font-semibold text-neutral-900">
                  Condition Summary
                </h3>
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <div className="flex-1 rounded-xl bg-neutral-50 p-3 text-center">
                    <p className="text-xs font-medium text-neutral-500">Previous</p>
                    <p className="mt-1 font-semibold text-neutral-900">{scanA.condition_name}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-neutral-400" />
                  <div className="flex-1 rounded-xl bg-primary-50 p-3 text-center">
                    <p className="text-xs font-medium text-primary-600">Current</p>
                    <p className="mt-1 font-semibold text-neutral-900">{scanB.condition_name}</p>
                  </div>
                </div>
                {scanA.condition_name !== scanB.condition_name && (
                  <p className="mt-4 text-sm text-neutral-600">
                    The detected condition has changed between scans. If this is
                    unexpected, consider consulting a dermatologist.
                  </p>
                )}
                {scanA.condition_name === scanB.condition_name && (
                  <p className="mt-4 text-sm text-neutral-600">
                    The detected condition remains the same. Continue monitoring
                    for any changes.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <button
                  onClick={() => {
                    onViewScan(scanA);
                    onNavigate('results');
                  }}
                  className="btn-secondary"
                >
                  View Previous Details
                </button>
                <button
                  onClick={() => {
                    onViewScan(scanB);
                    onNavigate('results');
                  }}
                  className="btn-secondary"
                >
                  View Current Details
                </button>
                <button onClick={() => onNavigate('scan')} className="btn-primary">
                  <ScanLine className="h-4 w-4" />
                  New Scan
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
