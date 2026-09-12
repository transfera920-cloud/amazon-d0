import React from 'react';

export const Header: React.FC = () => {
  return (
    <header id="site-header" className="border-b border-stone-200 bg-white shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-6 text-center">
        <h1 id="page-h1-title" className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          D0 住宿搜尋
        </h1>
      </div>
    </header>
  );
};
