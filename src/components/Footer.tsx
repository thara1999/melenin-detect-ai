import { ScanLine, Heart } from 'lucide-react';
import type { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-600/30">
                <ScanLine className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="block text-sm font-bold text-neutral-900">
                  MelaninDetect AI
                </span>
                <span className="block text-[10px] font-medium text-primary-600">
                  AI Skin Analysis
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
              AI-powered skin condition detection designed specifically for melanin-rich
              skin tones. We bridge the gap in dermatological AI by focusing on the
              unique presentations of skin conditions on darker skin.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900">Navigate</h4>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Home', page: 'home' as Page },
                { label: 'New Scan', page: 'scan' as Page },
                { label: 'History', page: 'history' as Page },
                { label: 'About', page: 'about' as Page },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => onNavigate(page)}
                    className="text-sm text-neutral-500 transition-colors hover:text-primary-600"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900">Important</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-neutral-500">
                This tool is for informational purposes only and does not replace
                professional medical advice.
              </li>
              <li className="text-sm text-neutral-500">
                Always consult a qualified dermatologist for diagnosis and treatment.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-6 sm:flex-row">
          <p className="text-xs text-neutral-400">
            © 2026 MelaninDetect AI. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-neutral-400">
            Made with <Heart className="h-3 w-3 fill-primary-500 text-primary-500" /> for
            melanin-rich skin
          </p>
        </div>
      </div>
    </footer>
  );
}
