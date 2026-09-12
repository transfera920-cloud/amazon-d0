import React, { useState, useEffect } from 'react';
import { Key, X, Check, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import {
  getGoogleMapsApiKey,
  setGoogleMapsApiKey,
  hasCustomApiKey,
  hasEnvApiKey,
  API_KEY_STORAGE_KEY,
} from '../utils/apiKey';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);
  const isEnvSet = hasEnvApiKey();
  const isCustomSet = hasCustomApiKey();

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(API_KEY_STORAGE_KEY) || '';
      setApiKeyInput(saved);
      setIsSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleMapsApiKey(apiKeyInput);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onSaved?.();
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setGoogleMapsApiKey('');
    setApiKeyInput('');
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onSaved?.();
      onClose();
    }, 600);
  };

  return (
    <div
      id="api-key-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="api-key-modal-content"
        className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full p-5 sm:p-6 text-stone-900 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 關閉按鈕 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="關閉設定視窗"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 標題與圖示 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              設定 Google Maps Platform API 金鑰
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              用於啟用地圖地理編碼、真實旅宿搜尋與真實駕車車程計算
            </p>
          </div>
        </div>

        {/* 當前狀態標籤 */}
        <div className="mb-4 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
          <span className="font-medium text-stone-700">目前金鑰生效狀態：</span>
          {isCustomSet ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              已儲存瀏覽器專屬金鑰
            </span>
          ) : isEnvSet ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              使用環境變數金鑰
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-amber-100 text-amber-800">
              未設定（離線備援模式）
            </span>
          )}
        </div>

        {/* 金鑰輸入表單 */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="google-maps-api-key-input" className="block text-xs sm:text-sm font-semibold text-stone-800 mb-1.5">
              Google Maps API Key
            </label>
            <input
              id="google-maps-api-key-input"
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="請貼上您的 AIzaSy..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-mono"
              autoComplete="off"
              spellCheck="false"
            />
            <p className="text-[11px] sm:text-xs text-stone-500 mt-1.5">
              金鑰會安全保存在您目前瀏覽器的本機儲存空間（Local Storage），不會上傳到任何第三方伺服器。
            </p>
          </div>

          {/* 需求服務提醒 */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 space-y-1.5">
            <div className="font-semibold flex items-center gap-1 text-emerald-900">
              <span>📌 您的 Google Cloud 專案需已啟用以下 3 個服務：</span>
            </div>
            <ul className="list-disc list-inside text-emerald-800 space-y-0.5 pl-1">
              <li><strong>Places API (New)</strong>（⚠️ 務必是新版 New，非舊版 Places API）</li>
              <li><strong>Geocoding API</strong>（自訂登山口經緯度定位）</li>
              <li><strong>Routes API</strong>（真實山區駕車距離與行車時間）</li>
            </ul>
          </div>

          {/* 403 常見原因排查提醒 */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] sm:text-xs text-amber-900 space-y-1.5">
            <div className="font-bold text-amber-950 flex items-center gap-1">
              <span>💡 若輸入金鑰後出現「403 授權失敗」，請檢查以下 3 點：</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-amber-900 pl-0.5 leading-relaxed">
              <li>
                <strong>啟用新版 Places API (New)</strong>：Google Cloud 同時有舊版「Places API」與新版「Places API (New)」，若只啟用舊版會回傳 403。
              </li>
              <li>
                <strong>金鑰限制設定</strong>：在 Google Cloud「憑證」中檢查此金鑰，若「API 限制」或「應用程式限制（網站網址）」有防護設定，請暫時切為「不限制」測試。
              </li>
              <li>
                <strong>專案帳單關聯</strong>：Google Maps Platform API 要求專案必須關聯帳單帳戶（每月有 200 美元免費額度），未綁定帳單的專案呼叫會直接 403。
              </li>
            </ol>
          </div>

          {/* 操作按鈕 */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {isCustomSet ? (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5 border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                清除已儲存金鑰
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                {isSavedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    已儲存！
                  </>
                ) : (
                  '儲存並套用'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
