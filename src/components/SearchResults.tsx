import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { SearchCriteria, TrailheadLocation } from '../types';
import { getTrailheadLocation } from '../data/trailheads';
import { getNearbyAccommodations, AccommodationsSearchResult } from '../data/lodgings';
import { MapPreview } from './MapPreview';

interface SearchResultsProps {
  criteria: SearchCriteria;
  hasSearched: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ criteria, hasSearched }) => {
  const currentTrailheadName = criteria.trailhead.trim() || '屯原登山口';

  const [location, setLocation] = useState<TrailheadLocation | null>(null);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<AccommodationsSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          <p className="text-xs text-rose-700 max-w-md mx-auto mt-1">
            請確認登山口名稱是否正確（例：屯原、塔塔加、雪山、向陽、小風口等），或改用鄰近鄉鎮知名地標進行搜尋。
          </p>
        </div>
      )}

      {/* 資料來源與異常狀態提示區塊 */}
      {!geocodingError && searchResult && (
        <>
          {searchResult.dataSource === 'offline_fallback' ? (
            <div className="mb-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-bold">目前顯示離線備援資料，非即時 Google 資料</div>
                <div className="text-amber-800 text-xs mt-0.5">
                  {searchResult.errorMessage || '未設定 Google Maps API 金鑰或 API 連線異常'}
                </div>
                <div className="text-amber-700 text-xs font-medium mt-1">
                  ※ 車程為粗估，山區實際車程可能更長，請以 Google 地圖實際路線為準
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-3 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  即時 Google 資料：Places API (New) 住宿與 Routes API 駕車時間
                </span>
              </div>
            </div>
          )}

          {/* 查無符合結果的特定提示 */}
          {searchResult.errorType === 'ZERO_RESULTS' && (
            <div className="mb-3 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-stone-500 shrink-0" />
              <span>{searchResult.errorMessage || '目前條件下無相符旅宿，請嘗試放寬車程或類型條件。'}</span>
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
        />
      )}
    </section>
  );
};
