import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Key, Loader2 } from 'lucide-react';
import { SearchCriteria, TrailheadLocation } from '../types';
import { getTrailheadLocation } from '../data/trailheads';
import { getNearbyAccommodations, AccommodationsSearchResult } from '../data/lodgings';
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
            criteria.minRating
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
    </section>
  );
};
