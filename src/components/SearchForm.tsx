import React from 'react';
import { Search, MapPin, Clock, DollarSign, Star, Home, Navigation } from 'lucide-react';
import { SearchCriteria } from '../types';

interface SearchFormProps {
  criteria: SearchCriteria;
  onCriteriaChange: (newCriteria: SearchCriteria) => void;
  onSearch: (e: React.FormEvent) => void;
  isSearching: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  criteria,
  onCriteriaChange,
  onSearch,
  isSearching,
}) => {
  const handleChange = (field: keyof SearchCriteria, value: string) => {
    onCriteriaChange({
      ...criteria,
      [field]: value,
    });
  };

  const handleQuickFill = (name: string) => {
    onCriteriaChange({
      ...criteria,
      trailhead: name,
    });
  };

  return (
    <section id="search-criteria-section" className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-7">
      <div className="border-b border-stone-100 pb-4 mb-6">
        <h2 id="search-criteria-h2" className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center justify-center gap-2.5 text-center">
          <Navigation className="w-5 h-5 text-emerald-700" />
          <span>搜尋條件設定</span>
        </h2>
      </div>

      <form id="d0-search-form" onSubmit={onSearch} className="space-y-5">
        {/* 1. 登山口手動輸入 */}
        <div className="space-y-2">
          <label htmlFor="input-trailhead" className="block text-sm font-semibold text-stone-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>1. 登山口</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="input-trailhead"
              type="text"
              value={criteria.trailhead}
              onChange={(e) => handleChange('trailhead', e.target.value)}
              placeholder="請手動輸入登山口名稱（例如：屯原登山口、塔塔加登山口、雪山登山口）"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder:text-stone-400"
              required
            />
          </div>
          {/* 快速填寫建議 */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-stone-500">
            <span className="font-medium text-stone-400">快速填入：</span>
            {['屯原登山口', '塔塔加登山口', '雪山登山口', '向陽登山口'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickFill(item)}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-600 transition-colors border border-stone-200/80 cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
          {/* 2. 車程（僅顯示車程） */}
          <div className="space-y-1.5">
            <label htmlFor="select-drive-time" className="block text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>2. 車程</span>
            </label>
            <select
              id="select-drive-time"
              value={criteria.driveTime}
              onChange={(e) => handleChange('driveTime', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            >
              <option value="any">不限車程</option>
              <option value="30m">車程 30 分鐘以內</option>
              <option value="60m">車程 1 小時以內</option>
              <option value="90m">車程 1.5 小時以內</option>
              <option value="120m">車程 2 小時以內</option>
            </select>
          </div>

          {/* 3. 價格等級（僅顯示價格，以500元為級距） */}
          <div className="space-y-1.5">
            <label htmlFor="select-price" className="block text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>3. 價格</span>
            </label>
            <select
              id="select-price"
              value={criteria.priceRange}
              onChange={(e) => handleChange('priceRange', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            >
              <option value="any">不限價格</option>
              <option value="1000">1,000 元以下</option>
              <option value="1500">1,000 - 1,500 元</option>
              <option value="2000">1,500 - 2,000 元</option>
              <option value="2500">2,000 - 2,500 元</option>
              <option value="3000">2,500 - 3,000 元</option>
              <option value="3500">3,000 - 3,500 元</option>
              <option value="4000">3,500 - 4,000 元</option>
              <option value="above4000">4,000 元以上</option>
            </select>
          </div>

          {/* 4. 最低評分（無 GOOGLE 字樣） */}
          <div className="space-y-1.5">
            <label htmlFor="select-rating" className="block text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-emerald-700" />
              <span>4. 最低評分</span>
            </label>
            <select
              id="select-rating"
              value={criteria.minRating}
              onChange={(e) => handleChange('minRating', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            >
              <option value="any">不限評分</option>
              <option value="3.5">評分 3.5 星以上</option>
              <option value="4.0">評分 4.0 星以上</option>
              <option value="4.5">評分 4.5 星以上</option>
            </select>
          </div>

          {/* 5. 住宿類型 */}
          <div className="space-y-1.5">
            <label htmlFor="select-lodging-type" className="block text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <Home className="w-4 h-4 text-emerald-700" />
              <span>5. 住宿類型</span>
            </label>
            <select
              id="select-lodging-type"
              value={criteria.lodgingType}
              onChange={(e) => handleChange('lodgingType', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            >
              <option value="all">不限類型（全數列出）</option>
              <option value="homestay">民宿 / B&amp;B</option>
              <option value="hostel">青年旅館 / 背包客棧</option>
              <option value="hotel">飯店 / 旅館</option>
              <option value="camp">露營區 / 登山山莊</option>
            </select>
          </div>
        </div>

        {/* 搜尋按鈕 */}
        <div className="pt-2">
          <button
            id="btn-execute-search"
            type="submit"
            disabled={isSearching}
            className="w-full py-3.5 px-6 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-base rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-75 cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>{isSearching ? '正在產生查詢條件...' : '搜尋最新住宿資訊'}</span>
          </button>
        </div>
      </form>
    </section>
  );
};
