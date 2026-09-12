import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  ExternalLink,
  ArrowUpDown,
  Navigation,
  Compass,
} from 'lucide-react';
import { LodgingPlace } from '../types';

interface LodgingCardsListProps {
  lodgings: LodgingPlace[];
  selectedLodgingId?: string | null;
  onSelectLodging: (id: string) => void;
  trailheadName: string;
}

type SortType = 'driveTime' | 'rating' | 'price';

export const LodgingCardsList: React.FC<LodgingCardsListProps> = ({
  lodgings,
  selectedLodgingId,
  onSelectLodging,
  trailheadName,
}) => {
  const [sortBy, setSortBy] = useState<SortType>('driveTime');

  // 排序計算
  const sortedLodgings = useMemo(() => {
    const list = [...lodgings];
    if (sortBy === 'driveTime') {
      return list.sort((a, b) => a.driveMinutes - b.driveMinutes);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'price') {
      return list.sort((a, b) => a.price - b.price);
    }
    return list;
  }, [lodgings, sortBy]);

  const handleCardClick = (id: string) => {
    onSelectLodging(id);
    // 平滑滾動讓使用者看到地圖定位
    const mapEl = document.getElementById('search-results-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (lodgings.length === 0) {
    return null;
  }

  return (
    <div id="lodging-cards-section" className="mt-6 pt-6 border-t border-stone-200">
      {/* 標題列與排序控制 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-700" />
            <span>推薦住宿詳細資訊方塊</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              共 {lodgings.length} 間
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            以「{trailheadName}」為起點，點擊任一方塊可在上方地圖即時定位與展開說明
          </p>
        </div>

        {/* 排序方式選單 */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 ml-1.5 shrink-0" />
          <span className="text-stone-500 font-medium mr-1">排序：</span>
          <button
            type="button"
            onClick={() => setSortBy('driveTime')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              sortBy === 'driveTime'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            車程最短
          </button>
          <button
            type="button"
            onClick={() => setSortBy('rating')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              sortBy === 'rating'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            評分最高
          </button>
          <button
            type="button"
            onClick={() => setSortBy('price')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              sortBy === 'price'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            價格最低
          </button>
        </div>
      </div>

      {/* 詳細資訊方塊網格 (Cards Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedLodgings.map((lodging) => {
          const isSelected = selectedLodgingId === lodging.id;

          const isHotel = lodging.typeCategory === 'hotel';
          const isCamp = lodging.typeCategory === 'camp';
          const isHostel = lodging.typeCategory === 'hostel';

          const badgeStyles = isHotel
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : isCamp
            ? 'bg-teal-50 text-teal-800 border-teal-200'
            : isHostel
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200';

          const typeIcon = isHotel ? '🏨' : isCamp ? '⛺' : isHostel ? '🛏️' : '🏡';

          const navUrl =
            lodging.googleMapsUri ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              lodging.name
            )}+${lodging.latitude},${lodging.longitude}`;

          return (
            <div
              key={lodging.id}
              id={`lodging-card-${lodging.id}`}
              className={`rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between bg-white relative ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md bg-emerald-50/15'
                  : 'border-stone-200 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              {/* 卡片頂部：類型標籤與預估車程標籤 */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeStyles}`}
                  >
                    <span>{typeIcon}</span>
                    <span>{lodging.type}</span>
                  </span>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>約 {lodging.driveMinutes} 分鐘車程</span>
                  </div>
                </div>

                {/* 旅宿名稱 */}
                <h4 className="text-base sm:text-lg font-bold text-stone-900 leading-snug mb-2 hover:text-emerald-800 transition-colors">
                  {lodging.name}
                </h4>

                {/* 地區 / 地址 */}
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="line-clamp-1">{lodging.area}</span>
                  {lodging.driveDistanceKm && (
                    <span className="text-stone-400 shrink-0">
                      (約 {lodging.driveDistanceKm} km)
                    </span>
                  )}
                </div>

                {/* 數據資訊方塊：價格與評分 */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mb-0.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                      平日參考價格
                    </span>
                    <span className="text-sm sm:text-base font-bold text-emerald-800">
                      {lodging.price > 0 ? `NT$ ${lodging.price.toLocaleString()}` : lodging.priceText}
                      {lodging.price > 0 && <span className="text-xs font-normal text-stone-500"> 起</span>}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mb-0.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      旅客評分
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-base font-bold text-stone-900">
                        {lodging.rating > 0 ? lodging.rating.toFixed(1) : '尚無評分'}
                      </span>
                      {lodging.userRatingCount && lodging.userRatingCount > 0 && (
                        <span className="text-[11px] text-stone-400">
                          ({lodging.userRatingCount.toLocaleString()} 則)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部操作功能按鈕 */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100 mt-auto">
                <button
                  type="button"
                  onClick={() => handleCardClick(lodging.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isSelected ? '已在地圖選中' : '地圖定位'}</span>
                </button>

                <a
                  href={navUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Google 導航</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
