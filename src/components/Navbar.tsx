import { ScanLine, History, Info, Home, Sparkles, GitCompare } from 'lucide-react';
import type { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: typeof Home }[] = [
  { page: 'home', label: 'Home', icon: Home },
  { page: 'scan', label: 'Scan', icon: ScanLine },
  { page: 'compare', label: 'Compare', icon: GitCompare },
  { page: 'history', label: 'History', icon: History },
  { page: 'about', label: 'About', icon: Info },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-600/30">
            <ScanLine className="h-5 w-5 text-white" strokeWidth={2.5} />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute h-full w-full animate-ping rounded-full bg-secondary-400 opacity-75" />
              <span className="relative h-3 w-3 rounded-full bg-secondary-500" />
            </span>
          </div>
          <div className="text-left">
            <span className="block text-sm font-bold leading-tight text-neutral-900">
              MelaninDetect
            </span>
            <span className="block text-[10px] font-medium leading-tight text-primary-600">
              AI Skin Analysis
            </span>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => onNavigate('scan')}
          className="hidden items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 active:scale-95 sm:flex"
        >
          <Sparkles className="h-4 w-4" />
          New Scan
        </button>

        <button
          onClick={() => onNavigate('scan')}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition-all hover:bg-primary-700 active:scale-95 md:hidden"
        >
          <ScanLine className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
