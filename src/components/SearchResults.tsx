import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Key,
  Loader2,
  Phone,
  ExternalLink,
  MapPin,
  Car,
} from 'lucide-react';
import { SearchCriteria, TrailheadLocation, ManualLodgingEntry } from '../types';
import { getTrailheadLocation } from '../data/trailheads';
import { getNearbyAccommodations, AccommodationsSearchResult } from '../data/lodgings';
import {
  getManualLodgingsForTrailhead,
  MANUAL_LODGINGS_UPDATED_EVENT,
} from '../utils/manualLodgings';
import { MapPreview } from './MapPreview';
import { LodgingCardsList } from './LodgingCardsList';
import { useSiteConfig } from '../context/SiteConfigContext';

interface SearchResultsProps {
  criteria: SearchCriteria;
  hasSearched: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ criteria, hasSearched }) => {
  const { siteText, openAdmin } = useSiteConfig();
  const currentTrailheadName = criteria.trailhead.trim() || '屯原登山口';

  const [location, setLocation] = useState<TrailheadLocation | null>(null);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<AccommodationsSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLodgingId, setSelectedLodgingId] = useState<string | null>(null);
  const [keyUpdateTick, setKeyUpdateTick] = useState<number>(0);
  const [manualLodgings, setManualLodgings] = useState<ManualLodgingEntry[]>([]);

  // 監聽在地口碑住宿更新與當前登山口變更
  useEffect(() => {
    const targetTh = location?.name || criteria.trailhead.trim();
    setManualLodgings(getManualLodgingsForTrailhead(targetTh));

    const handleManualUpdate = () => {
      const activeTh = location?.name || criteria.trailhead.trim();
      setManualLodgings(getManualLodgingsForTrailhead(activeTh));
    };

    window.addEventListener(MANUAL_LODGINGS_UPDATED_EVENT, handleManualUpdate);
    return () => {
      window.removeEventListener(MANUAL_LODGINGS_UPDATED_EVENT, handleManualUpdate);
    };
  }, [location, criteria.trailhead]);

  // 輔助函式：將文字中的網址轉為可直接點擊之超連結
  const renderClickableContact = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 hover:text-purple-900 underline font-semibold inline-flex items-center gap-0.5 break-all"
          >
            {part}
            <ExternalLink className="w-3 h-3 inline shrink-0" />
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // 監聽金鑰變更，即時重新查詢
  useEffect(() => {
    const handleKeyChange = () => {
      setKeyUpdateTick((prev) => prev + 1);
    };
    window.addEventListener('google-api-key-changed', handleKeyChange);
    return () => {
      window.removeEventListener('google-api-key-changed', handleKeyChange);
    };
  }, []);

  useEffect(() => {
    if (!hasSearched) return;

    let isMounted = true;
    setIsLoading(true);
    setGeocodingError(null);

    const maxMinutes =
      criteria.driveTime === '30m'
        ? 30
        : criteria.driveTime === '60m'
        ? 60
        : criteria.driveTime === '90m'
        ? 90
        : criteria.driveTime === '120m'
        ? 120
        : Infinity;

    // 1. 地理編碼：查詢登山口座標
    getTrailheadLocation(currentTrailheadName)
      .then(async (loc) => {
        if (!isMounted) return;
        setLocation(loc);

        // 2. 住宿資料：呼叫 Google Places API (New) 與 Google Routes API
        try {
          const result = await getNearbyAccommodations(
            loc.latitude,
            loc.longitude,
            maxMinutes,
            criteria.lodgingType,
            criteria.priceRange,
            criteria.minRating,
            loc.name
          );
          if (isMounted) {
            setSearchResult(result);
            setIsLoading(false);
          }
        } catch (err: any) {
          if (isMounted) {
            setSearchResult({
              lodgings: [],
              dataSource: 'offline_fallback',
              errorType: 'NETWORK_ERROR',
              errorMessage: err.message || '查詢住宿時發生異常',
            });
            setIsLoading(false);
          }
        }
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setLocation(null);
        setGeocodingError(err.message || '查無此登山口，請確認名稱或改用鄰近鄉鎮');
        setSearchResult(null);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    hasSearched,
    criteria.trailhead,
    criteria.driveTime,
    criteria.priceRange,
    criteria.minRating,
    criteria.lodgingType,
    keyUpdateTick,
  ]);

  if (!hasSearched) {
    return null;
  }

  return (
    <section
      id="search-results-section"
      className="bg-white rounded-2xl border border-stone-200 shadow-xs p-3 sm:p-5"
    >
      {/* 載入中狀態 */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-3 text-xs sm:text-sm text-stone-600 mb-3 bg-stone-50 border border-stone-200 rounded-xl">
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>正在透過 Google Maps Platform 查詢座標與周邊住宿...</span>
        </div>
      )}

      {/* 地理編碼明確錯誤提示（Google 查無登山口或金鑰授權問題） */}
      {geocodingError && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl text-center">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
          <h3 className="font-bold text-rose-900 text-base mb-1">{geocodingError}</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto mt-1 mb-3">
            {siteText.geocodingErrorMessage}
          </p>
          <button
            type="button"
            onClick={openAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            前往後台設定 API 金鑰
          </button>
        </div>
      )}

      {/* 登山口座標來源提示（若使用離線備援座標則明確標註警示） */}
      {location && (
        <div
          className={`mb-3 px-3.5 py-2 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 border ${
            location.isFromGoogle
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">⛰️ 登山口座標：</span>
            <span>
              {location.name}（{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}）
            </span>
            {location.formattedAddress && (
              <span className="text-[11px] opacity-75 hidden sm:inline">
                • {location.formattedAddress}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                location.isFromGoogle ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>
              {location.isFromGoogle
                ? 'Google 即時查證座標'
                : '離線備援座標（非即時查詢，可能略有偏差）'}
            </span>
          </div>
        </div>
      )}

      {/* 資料來源與異常狀態提示區塊 */}
      {!geocodingError && searchResult && (
        <>
          {searchResult.dataSource === 'offline_fallback' ? (
            <div className="mb-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">{siteText.offlineFallbackTitle}</div>
                  <div className="text-amber-800 text-xs mt-1 whitespace-pre-line leading-relaxed">
                    {searchResult.errorMessage || '未設定 Google Maps API 金鑰或 API 連線異常'}
                  </div>
                  <div className="text-amber-700 text-xs font-medium mt-1">
                    {siteText.offlineDriveWarning}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={openAdmin}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                後台金鑰設定
              </button>
            </div>
          ) : (
            <div className="mb-3 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  {siteText.googleLiveBadgeText}
                </span>
              </div>
            </div>
          )}

          {/* 查無符合結果的特定提示 */}
          {searchResult.errorType === 'ZERO_RESULTS' && (
            <div className="mb-3 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-stone-500 shrink-0" />
              <span>{searchResult.errorMessage || siteText.noResultsMessage}</span>
            </div>
          )}
        </>
      )}

      {/* 直接顯示地圖預覽 */}
      {location && (
        <MapPreview
          trailheadName={location.name}
          latitude={location.latitude}
          longitude={location.longitude}
          driveTime={criteria.driveTime}
          lodgings={searchResult?.lodgings || []}
          manualLodgings={manualLodgings}
          isLoadingLodgings={isLoading}
          dataSource={searchResult?.dataSource || 'google'}
          selectedLodgingId={selectedLodgingId}
          onSelectLodging={setSelectedLodgingId}
        />
      )}

      {/* 搜尋結果詳細資訊方塊（顯示於地圖下方） */}
      {location && searchResult && (
        <LodgingCardsList
          lodgings={searchResult.lodgings}
          selectedLodgingId={selectedLodgingId}
          onSelectLodging={setSelectedLodgingId}
          trailheadName={location.name}
        />
      )}

      {/* 在地口碑住宿（非 Google 即時收錄）獨立區塊 */}
      {manualLodgings.length > 0 && (
        <div id="manual-lodgings-section" className="mt-7 pt-6 border-t-2 border-stone-100">
          {/* 區塊標題列 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1 rounded-lg bg-purple-100 text-purple-700 text-sm">
                📌
              </span>
              <h3 className="text-base font-bold text-stone-900">
                在地口碑住宿（非 Google 即時收錄）
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                {manualLodgings.length} 處山友私房／接駁站
              </span>
            </div>

            <div className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>對應登山口：{location?.name || currentTrailheadName}</span>
            </div>
          </div>

          {/* 醒目警示提醒橫幅 */}
          <div className="mb-4 px-3.5 py-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold text-amber-950">山友預約叮嚀：</strong>
              以下資料為後台人工建立之在地接駁站、部落私房通鋪或 FB 私訊借宿點。
              <strong className="text-rose-700 font-bold ml-1">
                「非 Google 地圖收錄資料，請自行聯繫確認空房與實際狀況」
              </strong>
              ，亦無法保證現場營業與安全條件。
            </div>
          </div>

          {/* 口碑住宿卡片清單 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {manualLodgings.map((entry) => {
              const hasCoords =
                typeof entry.latitude === 'number' &&
                Number.isFinite(entry.latitude) &&
                typeof entry.longitude === 'number' &&
                Number.isFinite(entry.longitude);

              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl border border-stone-200 hover:border-purple-300 p-4 transition-all shadow-xs flex flex-col justify-between gap-3 relative overflow-hidden"
                >
                  {/* 左側高對比紫色色條 */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600" />

                  <div className="space-y-2.5 pl-1.5">
                    {/* 卡片標題與標籤 */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                          {entry.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ⛰️ {entry.trailheadName}
                          </span>
                          {hasCoords ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-purple-600" />
                              <span>已標示於上方地圖</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-600">
                              📝 無座標（文字收錄）
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 大概車程／位置描述 */}
                    {entry.driveDescription && (
                      <div className="text-xs text-amber-900 bg-amber-50/70 px-2.5 py-1.5 rounded-lg border border-amber-200/60 flex items-start gap-1.5 font-medium">
                        <Car className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{entry.driveDescription}</span>
                      </div>
                    )}

                    {/* 聯絡方式 */}
                    <div className="text-xs text-stone-800 flex items-start gap-1.5 pt-0.5">
                      <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-semibold text-stone-900">聯絡方式：</span>{' '}
                        {renderClickableContact(entry.contact)}
                      </div>
                    </div>

                    {/* 備註說明 */}
                    {entry.notes && (
                      <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 leading-relaxed">
                        <span className="font-semibold text-stone-700">說明備註：</span>
                        {entry.notes}
                      </div>
                    )}
                  </div>

                  {/* 每筆項目的免責防呆標示 */}
                  <div className="pl-1.5 pt-2 border-t border-stone-100 text-[11px] text-amber-800 font-medium flex items-center gap-1">
                    <span className="shrink-0">⚠️</span>
                    <span>非 Google 地圖收錄資料，請自行聯繫確認空房與實際狀況</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
