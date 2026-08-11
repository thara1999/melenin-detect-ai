import {
  ScanLine,
  Sparkles,
  ShieldCheck,
  Brain,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
  Activity,
  Zap,
  Eye,
} from 'lucide-react';
import type { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-80 w-80 rounded-full bg-secondary-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent-200/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
                <Sparkles className="h-4 w-4" />
                AI-Powered Skin Analysis
              </div>
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                Skin detection built for{' '}
                <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  melanin-rich skin
                </span>
              </h1>
              <p className="mt-4 font-display text-lg font-bold tracking-wide text-primary-700 sm:text-xl">
                Closing the Gap in Skin Cancer Detection
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
                Traditional dermatology AI often misses or misdiagnoses conditions on
                darker skin tones. MelaninDetect AI is trained to recognize the unique
                ways skin conditions present on melanin-rich skin — giving you accurate,
                instant analysis and personalized care recommendations.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => onNavigate('scan')}
                  className="btn-primary text-base"
                >
                  <ScanLine className="h-5 w-5" />
                  Start a Scan
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="btn-secondary text-base"
                >
                  How It Works
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-secondary-500" />
                  No sign-up required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-secondary-500" />
                  Private & secure
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-secondary-500" />
                  Instant results
                </span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400/20 to-secondary-400/20 blur-2xl" />
                <div className="relative rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-neutral-900/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-600/30">
                        <ScanLine className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">AI Analysis</p>
                        <p className="text-xs text-neutral-500">Processing image...</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1 text-xs font-medium text-secondary-700">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-500" />
                      Live
                    </span>
                  </div>

                  <div className="relative mt-4 overflow-hidden rounded-2xl">
                    <div className="aspect-square w-full bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400">
                      <div className="relative h-full w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-700/60 via-amber-800/50 to-stone-800/60" />
                        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-400/80 shadow-lg shadow-primary-500/50" />
                        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-primary-400/40" />
                        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 animate-scan-line bg-gradient-to-b from-transparent via-primary-400 to-transparent" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                      <span className="text-xs font-medium text-neutral-600">Detected Condition</span>
                      <span className="text-xs font-semibold text-primary-700">Analyzing...</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full w-3/4 animate-pulse rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -left-6 top-20 hidden animate-float rounded-2xl border border-neutral-100 bg-white p-3 shadow-xl lg:flex lg:items-center lg:gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-100">
                    <Brain className="h-4 w-4 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">AI Model</p>
                    <p className="text-[10px] text-neutral-500">Dermatology v3.2</p>
                  </div>
                </div>

                <div
                  className="absolute -right-4 bottom-16 hidden animate-float rounded-2xl border border-neutral-100 bg-white p-3 shadow-xl lg:flex lg:items-center lg:gap-2"
                  style={{ animationDelay: '1s' }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
                    <HeartPulse className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Confidence</p>
                    <p className="text-[10px] text-neutral-500">91% match</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: '8+', label: 'Skin conditions detected', icon: Activity },
              { value: '<3s', label: 'Average analysis time', icon: Zap },
              { value: '6', label: 'Skin tone categories', icon: Eye },
              { value: '100%', label: 'Private & secure', icon: ShieldCheck },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <p className="mt-3 font-display text-2xl font-bold text-neutral-900">{value}</p>
                <p className="mt-1 text-sm text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Why MelaninDetect AI?
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Most dermatology AI tools are trained primarily on lighter skin tones, leading
            to misdiagnosis and delayed care for people of color. We're changing that.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: Brain,
              title: 'Melanin-Aware AI',
              description:
                'Our model is specifically trained to recognize how skin conditions present differently across the full spectrum of skin tones — from Fitzpatrick I to VI.',
              color: 'primary',
            },
            {
              icon: Zap,
              title: 'Instant Results',
              description:
                'Upload a photo and get a detailed analysis in seconds. No waiting rooms, no referrals, no delays in getting the information you need.',
              color: 'secondary',
            },
            {
              icon: ShieldCheck,
              title: 'Privacy First',
              description:
                'Your scans are stored securely and never shared. You have full control over your data and can delete your history at any time.',
              color: 'accent',
            },
            {
              icon: HeartPulse,
              title: 'Personalized Care',
              description:
                'Get tailored recommendations based on your specific skin tone and condition, including products and routines suited to melanin-rich skin.',
              color: 'primary',
            },
            {
              icon: Eye,
              title: 'Visual Understanding',
              description:
                'Our AI explains how conditions look on your skin tone specifically, so you can recognize patterns and monitor changes over time.',
              color: 'secondary',
            },
            {
              icon: Activity,
              title: 'Track Progress',
              description:
                'Save your scans and monitor how your skin changes over time. See what works and share insights with your dermatologist.',
              color: 'accent',
            },
          ].map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="group card p-6 transition-all hover:shadow-lg hover:shadow-neutral-900/5"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${color}-100 transition-transform group-hover:scale-110`}
              >
                <Icon className={`h-6 w-6 text-${color}-600`} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Three simple steps to get your skin analysis.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Upload a Photo',
                description:
                  'Take or upload a clear, well-lit photo of the affected skin area. Our system works with any modern phone camera.',
                icon: ScanLine,
              },
              {
                step: '02',
                title: 'AI Analysis',
                description:
                  'Our melanin-aware AI model analyzes the image, detecting skin conditions and assessing severity specific to your skin tone.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Get Recommendations',
                description:
                  'Receive a detailed report with the detected condition, confidence level, and personalized care recommendations.',
                icon: HeartPulse,
              },
            ].map(({ step, title, description, icon: Icon }) => (
              <div key={step} className="relative">
                <div className="card p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-600/20">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-display text-4xl font-extrabold text-neutral-200">
                      {step}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-neutral-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('scan')}
              className="btn-primary text-base"
            >
              <ScanLine className="h-5 w-5" />
              Try It Now — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-secondary-500/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your skin deserves accurate analysis
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300">
            Join the movement toward equitable dermatological care. Get your first scan
            today — no sign-up, no cost, just answers.
          </p>
          <button
            onClick={() => onNavigate('scan')}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-neutral-900 shadow-xl transition-all hover:bg-neutral-100 hover:shadow-2xl active:scale-95"
          >
            <ScanLine className="h-5 w-5" />
            Start Your Scan
          </button>
        </div>
      </section>
    </div>
  );
}
