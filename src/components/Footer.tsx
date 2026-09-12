import React from 'react';
import { Settings } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export const Footer: React.FC = () => {
  const { siteText, openAdmin } = useSiteConfig();

  return (
    <footer id="site-footer" className="mt-12 py-6 border-t border-stone-200 bg-white text-stone-500 text-xs text-center">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>{siteText.footerCopyright}</div>
        <button
          type="button"
          onClick={openAdmin}
          className="inline-flex items-center gap-1 text-stone-400 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>系統後台管理</span>
        </button>
      </div>
    </footer>
  );
};

