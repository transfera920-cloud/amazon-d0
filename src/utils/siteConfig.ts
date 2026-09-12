export interface SiteTextConfig {
  // 頁首與網站資訊
  headerTitle: string;
  headerSubtitle: string;

  // 搜尋表單文字
  searchSectionTitle: string;
  trailheadLabel: string;
  trailheadPlaceholder: string;
  quickFillOptions: string; // 逗號分隔字串
  driveTimeLabel: string;
  priceLabel: string;
  ratingLabel: string;
  lodgingTypeLabel: string;
  searchButtonText: string;

  // 提示與警語
  googleLiveBadgeText: string;
  offlineFallbackTitle: string;
  offlineDriveWarning: string;
  noResultsMessage: string;
  geocodingErrorMessage: string;

  // 頁尾文字
  footerCopyright: string;
}

export const DEFAULT_SITE_TEXT: SiteTextConfig = {
  headerTitle: 'D0 住宿搜尋',
  headerSubtitle: '百岳前夜住宿 • 車程時間快速篩選',
  searchSectionTitle: '搜尋條件設定',
  trailheadLabel: '1. 登山口',
  trailheadPlaceholder: '請手動輸入登山口名稱（例如：屯原登山口、塔塔加登山口、雪山登山口）',
  quickFillOptions: '屯原登山口, 塔塔加登山口, 雪山登山口, 向陽登山口',
  driveTimeLabel: '2. 車程',
  priceLabel: '3. 價格',
  ratingLabel: '4. 最低評分',
  lodgingTypeLabel: '5. 住宿類型',
  searchButtonText: '開始搜尋周邊住宿',
  googleLiveBadgeText: '即時 Google 資料：Places API (New) 住宿與 Routes API 駕車時間',
  offlineFallbackTitle: '目前顯示離線備援資料，非即時 Google 資料',
  offlineDriveWarning: '※ 車程為粗估，山區實際車程可能更長，請以 Google 地圖實際路線為準',
  noResultsMessage: '經車程與條件篩選後暫無符合之住宿，建議放寬車程或評分門檻。',
  geocodingErrorMessage: '查無此登山口，請確認名稱或改用鄰近鄉鎮知名地標進行搜尋。',
  footerCopyright: '© 2026 亞馬遜國家山岳協會',
};

export const SITE_TEXT_STORAGE_KEY = 'd0_site_text_config';

export function getSiteTextConfig(): SiteTextConfig {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(SITE_TEXT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SITE_TEXT, ...parsed };
      }
    } catch {
      // 剖析失敗則回傳預設
    }
  }
  return { ...DEFAULT_SITE_TEXT };
}

export function saveSiteTextConfig(config: Partial<SiteTextConfig>): void {
  if (typeof window !== 'undefined') {
    const current = getSiteTextConfig();
    const merged = { ...current, ...config };
    localStorage.setItem(SITE_TEXT_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event('site-text-changed'));
  }
}

export function resetSiteTextConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SITE_TEXT_STORAGE_KEY);
    window.dispatchEvent(new Event('site-text-changed'));
  }
}
