import {
  ScanLine,
  Brain,
  ShieldCheck,
  HeartPulse,
  Database,
  Eye,
  Users,
  Microscope,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Lock,
  Code2,
  Palette,
} from 'lucide-react';
import type { Page } from '../types';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl" />
          <div className="absolute right-1/3 bottom-0 h-72 w-72 rounded-full bg-secondary-200/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            <Sparkles className="h-4 w-4" />
            Our Mission
          </div>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            Equitable skin care through{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              inclusive AI
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            MelaninDetect AI was built to address a critical gap in dermatological AI: most
            models are trained on lighter skin tones, leading to misdiagnosis and delayed care
            for people with melanin-rich skin. We're here to change that.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error-50">
              <Eye className="h-6 w-6 text-error-600" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-neutral-900">
              The Problem
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Studies show that AI dermatology models trained primarily on lighter skin can
              have accuracy drops of 15–30% on darker skin tones. Conditions like eczema,
              psoriasis, and even melanoma present differently on melanin-rich skin — and
              traditional models often miss the signs.
            </p>
          </div>

          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-50">
              <HeartPulse className="h-6 w-6 text-secondary-600" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-neutral-900">
              Our Solution
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              MelaninDetect AI uses a melanin-aware model that accounts for how skin conditions
              visually present across the full Fitzpatrick scale (I–VI). By understanding the
              unique characteristics of melanin-rich skin, we deliver more accurate, more
              relevant analysis for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works — Detailed */}
      <section className="bg-gradient-to-b from-white to-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
              The Technology
            </h2>
            <p className="mt-3 text-neutral-600">
              How our AI analyzes your skin, step by step.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {[
              {
                icon: ScanLine,
                title: 'Image Preprocessing',
                description:
                  'When you upload a photo, our system first normalizes the image — adjusting lighting, removing noise, and enhancing contrast. This ensures consistent analysis regardless of your camera or lighting conditions.',
              },
              {
                icon: Palette,
                title: 'Skin Tone Detection',
                description:
                  'The AI identifies your skin tone using the Fitzpatrick scale (I–VI). This is crucial because the same condition can look completely different on different skin tones — what appears red on light skin might look purple, gray, or dark brown on melanin-rich skin.',
              },
              {
                icon: Microscope,
                title: 'Feature Extraction',
                description:
                  'Our model extracts visual features — texture, color patterns, shape, size, and distribution — that are characteristic of specific skin conditions, adjusted for how they manifest on your detected skin tone.',
              },
              {
                icon: Brain,
                title: 'Condition Matching',
                description:
                  'The extracted features are matched against our database of skin conditions, with the model weighting matches based on skin-tone-specific presentations. This produces a ranked list of likely conditions with confidence scores.',
              },
              {
                icon: HeartPulse,
                title: 'Recommendation Generation',
                description:
                  'Based on the detected condition and your skin tone, the system generates personalized care recommendations — including skincare products, routines, and lifestyle adjustments suited to melanin-rich skin.',
              },
            ].map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="flex items-start gap-4 card p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-600/20">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm font-bold text-primary-600">
                      Step {i + 1}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-neutral-900">{title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions We Detect */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
            Conditions We Detect
          </h2>
          <p className="mt-3 text-neutral-600">
            Our AI recognizes common skin conditions as they present on melanin-rich skin.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { name: 'Acne Vulgaris', desc: 'Clogged pores, blemishes, and post-inflammatory hyperpigmentation' },
            { name: 'Eczema', desc: 'Dry, itchy, inflamed patches — may appear grayish or purplish on darker skin' },
            { name: 'Post-Inflammatory Hyperpigmentation', desc: 'Dark spots left after skin inflammation or injury' },
            { name: 'Melasma', desc: 'Brown or gray-brown patches, often triggered by hormones or sun' },
            { name: 'Keloid Scarring', desc: 'Raised scars that extend beyond the original wound' },
            { name: 'Seborrheic Dermatitis', desc: 'Scaly, flaky patches on scalp, face, or chest' },
            { name: 'Vitiligo', desc: 'Depigmented white patches where melanin is lost' },
            { name: 'Tinea Versicolor', desc: 'Fungal infection causing lighter or darker patches' },
          ].map(({ name, desc }) => (
            <div key={name} className="card flex items-start gap-3 p-5 transition-all hover:shadow-md">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <Microscope className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">{name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-gradient-to-br from-neutral-900 to-neutral-800">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white">
              Our Values
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: Users, title: 'Inclusivity', desc: 'Skincare AI should work for everyone, regardless of skin tone.' },
              { icon: Lock, title: 'Privacy', desc: 'Your data is yours. We never share it, and you can delete it anytime.' },
              { icon: Lightbulb, title: 'Education', desc: 'We empower users with knowledge to make informed skincare decisions.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/20">
                  <Icon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
            Built With Modern Technology
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Brain, label: 'AI Model', sub: 'Melanin-aware v3.2' },
            { icon: Database, label: 'Storage', sub: 'Supabase cloud' },
            { icon: Code2, label: 'Frontend', sub: 'React + TypeScript' },
            { icon: ShieldCheck, label: 'Security', sub: 'RLS + encryption' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="card p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                <Icon className="h-5 w-5 text-neutral-700" />
              </div>
              <p className="mt-3 text-sm font-semibold text-neutral-900">{label}</p>
              <p className="text-xs text-neutral-500">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
            Ready to try it?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-600">
            Get your first skin analysis in seconds. No sign-up, no cost, just answers.
          </p>
          <button onClick={() => onNavigate('scan')} className="mt-8 btn-primary text-base">
            <ScanLine className="h-5 w-5" />
            Start Your Scan
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}


