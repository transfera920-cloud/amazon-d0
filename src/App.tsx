import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { SearchResults } from './components/SearchResults';
import { Footer } from './components/Footer';
import { SearchCriteria } from './types';

export default function App() {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    trailhead: '屯原登山口',
    driveTime: '30m',
    priceRange: 'any',
    minRating: 'any',
    lodgingType: 'all',
  });

  const [hasSearched, setHasSearched] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setHasSearched(true);
      setIsSearching(false);
      const resultsElement = document.getElementById('search-results-section');
      resultsElement?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      <main id="main-content" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* 搜尋條件設定（手動輸入登山口、車程、價格以500元為級距） */}
        <SearchForm
          criteria={criteria}
          onCriteriaChange={setCriteria}
          onSearch={handleSearch}
          isSearching={isSearching}
        />

        {/* 搜尋結果（地圖預覽確實顯示，預覽地圖以下方塊全部拿掉） */}
        <SearchResults
          criteria={criteria}
          hasSearched={hasSearched}
        />
      </main>

      <Footer />
    </div>
  );
}
