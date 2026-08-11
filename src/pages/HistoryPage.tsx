import { useState, useEffect, useCallback } from 'react';
import {
  ScanLine,
  Trash2,
  Clock,
  AlertCircle,
  Loader2,
  Search,
  ChevronRight,
  Calendar,
  TrendingUp,
  Inbox,
  ShieldCheck,
  ShieldAlert,
  GitCompare,
} from 'lucide-react';
import type { Page, SkinScan } from '../types';
import { fetchAllScans, deleteScan as apiDeleteScan } from '../lib/api';

interface HistoryPageProps {
  onNavigate: (page: Page) => void;
  onViewScan: (scan: SkinScan) => void;
}

export function HistoryPage({ onNavigate, onViewScan }: HistoryPageProps) {
  const [scans, setScans] = useState<SkinScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadScans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllScans();
      setScans(data);
    } catch {
      setError('Failed to load scan history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScans();
  }, [loadScans]);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await apiDeleteScan(id);
      setScans((prev) => prev.filter((s) => s.id !== id));
      setDeleteId(null);
    } catch {
      setError('Failed to delete scan. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredScans = scans.filter(
    (s) =>
      s.condition_name.toLowerCase().includes(search.toLowerCase()) ||
      s.skin_tone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Scan History
          </h1>
          <p className="mt-2 text-neutral-600">
            Track your skin analysis results over time.
          </p>
        </div>
        <button onClick={() => onNavigate('scan')} className="btn-primary shrink-0">
          <ScanLine className="h-4 w-4" />
          New Scan
        </button>
        {scans.length >= 2 && (
          <button onClick={() => onNavigate('compare')} className="btn-secondary shrink-0">
            <GitCompare className="h-4 w-4" />
            Compare Scans
          </button>
        )}
      </div>

      {/* Stats summary */}
      {scans.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-xs font-medium text-neutral-500">Total Scans</p>
            <p className="mt-1 font-display text-2xl font-bold text-neutral-900">{scans.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-medium text-neutral-500">Unique Conditions</p>
            <p className="mt-1 font-display text-2xl font-bold text-neutral-900">
              {new Set(scans.map((s) => s.condition_name)).size}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-medium text-neutral-500">Avg Confidence</p>
            <p className="mt-1 font-display text-2xl font-bold text-neutral-900">
              {Math.round(scans.reduce((sum, s) => sum + s.confidence, 0) / scans.length)}%
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      {scans.length > 0 && (
        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by condition or skin tone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-3 text-sm text-neutral-500">Loading your scans...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mt-8 rounded-2xl border border-error-500/30 bg-error-50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-500/10">
            <AlertCircle className="h-6 w-6 text-error-600" />
          </div>
          <p className="mt-3 font-semibold text-error-700">{error}</p>
          <button onClick={loadScans} className="mt-4 btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && scans.length === 0 && (
        <div className="mt-12 card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Inbox className="h-8 w-8 text-neutral-400" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-neutral-900">
            No scans yet
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Run your first skin analysis to start tracking your results here.
          </p>
          <button onClick={() => onNavigate('scan')} className="mt-6 btn-primary">
            <ScanLine className="h-4 w-4" />
            Start Your First Scan
          </button>
        </div>
      )}

      {/* No search results */}
      {!loading && !error && scans.length > 0 && filteredScans.length === 0 && (
        <div className="mt-8 card p-8 text-center">
          <p className="text-sm text-neutral-500">No scans match "{search}".</p>
        </div>
      )}

      {/* Scan list */}
      {!loading && !error && filteredScans.length > 0 && (
        <div className="mt-8 space-y-4">
          {filteredScans.map((scan, idx) => (
            <div
              key={scan.id}
              className="group card flex items-center gap-4 overflow-hidden p-4 transition-all hover:shadow-lg hover:shadow-neutral-900/5 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-900">
                <img
                  src={scan.image_url}
                  alt={scan.condition_name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-display text-base font-semibold text-neutral-900">
                    {scan.condition_name}
                  </h3>
                  {scan.is_cancer ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-error-100 px-2 py-0.5 text-[10px] font-bold text-error-700">
                      <ShieldAlert className="h-3 w-3" />
                      CANCER
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-bold text-secondary-700">
                      <ShieldCheck className="h-3 w-3" />
                      NO CANCER
                    </span>
                  )}
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      scan.severity === 'high'
                        ? 'bg-error-50 text-error-700'
                        : scan.severity === 'moderate'
                          ? 'bg-accent-50 text-accent-700'
                          : 'bg-secondary-50 text-secondary-700'
                    }`}
                  >
                    {scan.severity}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(scan.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(scan.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {scan.confidence}% confidence
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => {
                    onViewScan(scan);
                    onNavigate('results');
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-all hover:bg-primary-50 hover:text-primary-600"
                  title="View details"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setDeleteId(scan.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-all hover:bg-error-50 hover:text-error-600"
                  title="Delete scan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => !deleting && setDeleteId(null)}
        >
          <div
            className="w-full max-w-sm animate-scale-in rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-50">
              <Trash2 className="h-6 w-6 text-error-600" />
            </div>
            <h3 className="mt-4 text-center font-display text-lg font-semibold text-neutral-900">
              Delete this scan?
            </h3>
            <p className="mt-2 text-center text-sm text-neutral-500">
              This action cannot be undone. The scan and its results will be permanently removed.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-error-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-error-600/20 transition-all hover:bg-error-700 active:scale-95 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
