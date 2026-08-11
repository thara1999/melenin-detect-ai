import { useState, useEffect } from 'react';
import type { Page, SkinScan } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ScanPage } from './pages/ScanPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import { ComparePage } from './pages/ComparePage';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [currentScan, setCurrentScan] = useState<SkinScan | null>(null);

  const navigate = (target: Page) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanComplete = (scan: SkinScan) => {
    setCurrentScan(scan);
  };

  const handleViewScan = (scan: SkinScan) => {
    setCurrentScan(scan);
  };

  const handleNewScan = () => {
    setCurrentScan(null);
    navigate('scan');
  };

  useEffect(() => {
    document.title = 'MelaninDetect AI — Skin Analysis for Melanin-Rich Skin';
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar currentPage={page} onNavigate={navigate} />
      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'scan' && (
          <ScanPage onNavigate={navigate} onScanComplete={handleScanComplete} />
        )}
        {page === 'results' && (
          <ResultsPage
            scan={currentScan}
            onNavigate={navigate}
            onNewScan={handleNewScan}
          />
        )}
        {page === 'history' && (
          <HistoryPage onNavigate={navigate} onViewScan={handleViewScan} />
        )}
        {page === 'compare' && (
          <ComparePage onNavigate={navigate} onViewScan={handleViewScan} />
        )}
        {page === 'about' && <AboutPage onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
