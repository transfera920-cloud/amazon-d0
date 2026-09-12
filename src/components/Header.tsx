import React from 'react';
import { Key, ShieldCheck, Settings } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export const Header: React.FC = () => {
  const { siteText, apiKey, openAdmin } = useSiteConfig();
  const hasKey = Boolean(apiKey);

  return (
    <header id="site-header" className="border-b border-stone-200 bg-white shadow-xs sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div>
          <h1 id="page-h1-title" className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {siteText.headerTitle}
          </h1>
          <p className="text-xs text-stone-500 hidden sm:block">{siteText.headerSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* 金鑰狀態與快速管理按鈕 */}
          <button
            id="open-api-key-settings-btn"
            type="button"
            onClick={openAdmin}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              hasKey
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100 hover:border-stone-400'
            }`}
            title="點擊前往後台金鑰管理"
          >
            {hasKey ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>API 金鑰已生效</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>設定 API 金鑰</span>
              </>
            )}
          </button>

          {/* 後台管理主按鈕 */}
          <button
            id="open-admin-panel-btn"
            type="button"
            onClick={openAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
            title="開啟後台管理系統（文字編輯與金鑰設定）"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>後台管理</span>
          </button>
        </div>
      </div>
    </header>
  );
};


