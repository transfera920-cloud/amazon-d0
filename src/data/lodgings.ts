import { LodgingPlace, SearchDataSource, SearchErrorType } from '../types';

export interface AccommodationsSearchResult {
  lodgings: LodgingPlace[];
  dataSource: SearchDataSource;
  errorType: SearchErrorType;
  errorMessage?: string;
}

// 備援計算：兩經緯度直線距離（公里）
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球半徑 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 備援計算：山區離線估算車程（僅在無 Google API 金鑰或 API 斷線備援時使用）
export function estimateOfflineDriveMinutes(distanceKm: number): number {
  const mountainRoadDistance = distanceKm * 1.6;
  const minutes = Math.round((mountainRoadDistance / 25) * 60);
  return Math.max(15, minutes);
}

// 離線備援資料庫：僅在 Google API 完全連不上或未設定金鑰時作為最後備援
export const KNOWN_MOUNTAIN_LODGINGS: Omit<LodgingPlace, 'driveMinutes' | 'priceText'>[] = [
  // --- 屯原登山口周邊（廬山溫泉、春陽、霧社、仁愛鄉、清境） ---
  { id: 'ty-1', name: '蜜月館大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.0205, longitude: 121.1852, area: '廬山溫泉區', price: 2300, rating: 4.1 },
  { id: 'ty-2', name: '碧綠大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.0198, longitude: 121.1835, area: '廬山溫泉區', price: 1800, rating: 3.9 },
  { id: 'ty-3', name: '廬山一品居溫泉民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.0189, longitude: 121.1870, area: '廬山溫泉區', price: 1400, rating: 4.4 },
  { id: 'ty-4', name: '春陽溫泉瑪莉溫泉景觀山莊', type: '露營區 / 登山山莊', typeCategory: 'camp', latitude: 24.0152, longitude: 121.1645, area: '春陽部落', price: 900, rating: 4.3 },
  { id: 'ty-5', name: '櫻宿溫泉會館', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.0192, longitude: 121.1848, area: '廬山溫泉區', price: 2800, rating: 4.6 },
  { id: 'ty-6', name: '春陽櫻花露營區', type: '露營區 / 登山山莊', typeCategory: 'camp', latitude: 24.0140, longitude: 121.1680, area: '春陽部落', price: 800, rating: 4.2 },
  { id: 'ty-7', name: '霧社大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.9892, longitude: 121.1345, area: '霧社市區', price: 1600, rating: 3.8 },
  { id: 'ty-8', name: '雲海景觀山莊', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.0320, longitude: 121.1550, area: '仁愛鄉清境方向', price: 3200, rating: 4.5 },
  { id: 'ty-9', name: '清境天星棧青年旅舍', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 24.0450, longitude: 121.1610, area: '清境農場周邊', price: 950, rating: 4.6 },
  { id: 'ty-10', name: '清境老英格蘭莊園', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.0410, longitude: 121.1580, area: '清境農場周邊', price: 6500, rating: 4.7 },

  // --- 塔塔加登山口 / 玉山口周邊 ---
  { id: 'tt-1', name: '東埔大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.5621, longitude: 120.9298, area: '東埔溫泉區', price: 2200, rating: 3.8 },
  { id: 'tt-2', name: '帝綸溫泉渡假大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.5605, longitude: 120.9312, area: '東埔溫泉區', price: 3300, rating: 4.2 },
  { id: 'tt-3', name: '沙里仙溫泉渡假村', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 23.5678, longitude: 120.9215, area: '東埔溫泉區', price: 3800, rating: 4.5 },
  { id: 'tt-5', name: '達瑪巒風味民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 23.5850, longitude: 120.8950, area: '信義鄉同富', price: 1300, rating: 4.3 },
  { id: 'tt-7', name: '阿里山閣大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.5185, longitude: 120.8140, area: '阿里山遊樂區', price: 4200, rating: 4.0 },
  { id: 'tt-9', name: '阿里山天主堂登山背包客中心', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 23.5110, longitude: 120.8020, area: '阿里山遊樂區', price: 850, rating: 4.4 },

  // --- 雪山登山口 / 武陵周邊 ---
  { id: 'sy-1', name: '武陵國民賓館', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.3582, longitude: 121.3115, area: '武陵農場', price: 3400, rating: 4.3 },
  { id: 'sy-2', name: '武陵富野渡假村', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.3601, longitude: 121.3130, area: '武陵農場', price: 5200, rating: 4.5 },
  { id: 'sy-3', name: '武陵農場露營區', type: '露營區 / 登山山莊', typeCategory: 'camp', latitude: 24.3810, longitude: 121.3150, area: '武陵農場高山區', price: 1000, rating: 4.4 },
  { id: 'sy-4', name: '環山部落屋民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.3120, longitude: 121.2950, area: '環山部落', price: 1300, rating: 4.6 },

  // --- 向陽登山口 / 嘉明湖周邊 ---
  { id: 'xy-1', name: '利稻喜度民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 23.1895, longitude: 121.0320, area: '利稻部落', price: 1200, rating: 4.5 },
  { id: 'xy-3', name: '天龍溫泉飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.1670, longitude: 121.0450, area: '霧鹿溫泉區', price: 3200, rating: 4.2 },
  { id: 'xy-4', name: '向陽青年旅棧', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 23.1870, longitude: 121.0335, area: '利稻部落', price: 800, rating: 4.4 },

  // --- 合歡山周邊 ---
  { id: 'hh-1', name: '松雪樓', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.1424, longitude: 121.2721, area: '合歡山', price: 4200, rating: 4.5 },
  { id: 'hh-2', name: '滑雪山莊', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 24.1415, longitude: 121.2735, area: '合歡山', price: 1200, rating: 4.3 },
  { id: 'hh-3', name: '觀雲山莊', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 24.1785, longitude: 121.3250, area: '大禹嶺關原', price: 950, rating: 4.4 },
];

/**
 * 依住宿類型對應 Google 官方 Place (New) 類型：
 * hotel（飯店旅館）→ hotel
 * homestay（民宿）→ guest_house、bed_and_breakfast
 * hostel（青年旅館/背包客棧）→ hostel
 * camp（露營/山莊）→ campground
 * all（不分類）→ 上述全部一起放進 includedTypes
 */
function getIncludedPlaceTypes(typeCategory: string): string[] {
  switch (typeCategory) {
    case 'hotel':
      return ['hotel'];
    case 'homestay':
      return ['guest_house', 'bed_and_breakfast'];
    case 'hostel':
      return ['hostel'];
    case 'camp':
      return ['campground'];
    case 'all':
    default:
      return ['hotel', 'guest_house', 'bed_and_breakfast', 'hostel', 'campground'];
  }
}

/**
 * 將 Google Place Types 解析為內部分類
 */
function parseTypeCategory(types: string[] = []): { category: 'homestay' | 'hostel' | 'hotel' | 'camp'; label: string } {
  if (types.includes('campground')) {
    return { category: 'camp', label: '露營 / 山莊' };
  }
  if (types.includes('hostel')) {
    return { category: 'hostel', label: '青年旅館 / 背包客棧' };
  }
  if (types.includes('hotel')) {
    return { category: 'hotel', label: '飯店旅館' };
  }
  if (types.includes('guest_house') || types.includes('bed_and_breakfast')) {
    return { category: 'homestay', label: '民宿 / B&B' };
  }
  return { category: 'homestay', label: '旅宿' };
}

/**
 * 依 Google priceLevel 格式化文字（未提供則顯示「未提供，請洽詢」）
 */
function formatPriceText(priceLevel?: string): { text: string; price: number } {
  switch (priceLevel) {
    case 'PRICE_LEVEL_FREE':
      return { text: '免費提供', price: 0 };
    case 'PRICE_LEVEL_INEXPENSIVE':
      return { text: '平價 ($)', price: 1000 };
    case 'PRICE_LEVEL_MODERATE':
      return { text: '中等 ($$)', price: 2200 };
    case 'PRICE_LEVEL_EXPENSIVE':
      return { text: '高價 ($$$)', price: 3500 };
    case 'PRICE_LEVEL_VERY_EXPENSIVE':
      return { text: '頂級奢華 ($$$$)', price: 5000 };
    default:
      // Google 沒有該筆價格資訊時，顯示「未提供，請洽詢」，不自行編造數字
      return { text: '未提供，請洽詢', price: -1 };
  }
}

/**
 * 呼叫 Google Places API (New) Nearby Search
 */
async function searchGoogleNearbyPlaces(
  lat: number,
  lng: number,
  radiusMeters: number,
  typeCategory: string,
  apiKey: string
): Promise<any[]> {
  const directUrl = 'https://places.googleapis.com/v1/places:searchNearby';
  const proxyUrl = '/proxy-google-places/v1/places:searchNearby';

  const requestBody = {
    includedTypes: getIncludedPlaceTypes(typeCategory),
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng,
        },
        // Places API (New) 的半徑上限為 50,000 公尺
        radius: Math.min(50000.0, Math.max(5000.0, radiusMeters)),
      },
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask':
      'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.types,places.googleMapsUri',
  };

  let response: Response;
  try {
    response = await fetch(directUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
  } catch {
    // 透過本機代理重試
    response = await fetch(proxyUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
  }

  if (response.status === 403) {
    throw { code: 'AUTH_403', message: 'Google Places API 授權失敗（403）：請確認金鑰已啟用「Places API (New)」，並檢查權限限制。' };
  }
  if (response.status === 429) {
    throw { code: 'QUOTA_429', message: 'Google Places API 額度用盡或頻率過高（429）：請稍後再試。' };
  }
  if (!response.ok) {
    const errText = await response.text();
    throw { code: 'API_ERROR', message: `Google Places API 錯誤（HTTP ${response.status}）：${errText}` };
  }

  const data = await response.json();
  return data.places || [];
}

/**
 * 呼叫 Google Routes API computeRouteMatrix 取得真實駕車距離與時間
 */
async function computeRealDriveRoutes(
  originLat: number,
  originLng: number,
  destinations: { lat: number; lng: number }[],
  apiKey: string
): Promise<{ driveMinutes: number; distanceKm: number }[]> {
  if (destinations.length === 0) return [];

  const directUrl = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';
  const proxyUrl = '/proxy-google-routes/distanceMatrix/v2:computeRouteMatrix';

  const requestBody = {
    origins: [
      {
        waypoint: {
          location: {
            latLng: {
              latitude: originLat,
              longitude: originLng,
            },
          },
        },
      },
    ],
    destinations: destinations.map((d) => ({
      waypoint: {
        location: {
          latLng: {
            latitude: d.lat,
            longitude: d.lng,
          },
        },
      },
    })),
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_UNAWARE',
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'originIndex,destinationIndex,status,condition,distanceMeters,duration',
  };

  let response: Response;
  try {
    response = await fetch(directUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
  } catch {
    response = await fetch(proxyUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
  }

  if (!response.ok) {
    // 若 Routes API 暫時無法計算，回退無有效路程
    return destinations.map(() => ({ driveMinutes: Infinity, distanceKm: 0 }));
  }

  const elements = await response.json();
  // elements 是一組陣列：每個物件有 destinationIndex, duration ('1230s'), distanceMeters
  const resultMap: Record<number, { driveMinutes: number; distanceKm: number }> = {};

  if (Array.isArray(elements)) {
    elements.forEach((item: any) => {
      const idx = item.destinationIndex ?? 0;
      if (item.condition === 'ROUTE_EXISTS' && item.duration) {
        const seconds = parseInt(item.duration.replace('s', ''), 10) || 0;
        const driveMinutes = Math.max(1, Math.round(seconds / 60));
        const distanceKm = Math.round(((item.distanceMeters || 0) / 1000) * 10) / 10;
        resultMap[idx] = { driveMinutes, distanceKm };
      } else {
        resultMap[idx] = { driveMinutes: Infinity, distanceKm: 0 };
      }
    });
  }

  return destinations.map((_, i) => resultMap[i] || { driveMinutes: Infinity, distanceKm: 0 });
}

/**
 * 取得周邊住宿資料：
 * 1. 主要呼叫 Google Places API (New) Nearby Search 與 Google Routes API computeRouteMatrix
 * 2. 只有在 Google API 完全連不上或未設定金鑰時，才作為最後備援回退到 KNOWN_MOUNTAIN_LODGINGS
 * 3. 畫面上依 dataSource 清楚揭露「目前顯示離線備援資料，非即時 Google 資料」
 */
export async function getNearbyAccommodations(
  trailheadLat: number,
  trailheadLon: number,
  maxDriveMinutes: number,
  typeFilter: string,
  priceRange: string = 'any',
  minRating: string = 'any'
): Promise<AccommodationsSearchResult> {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();

  // 若未設定 API 金鑰，使用離線備援資料並明確標示
  if (!apiKey) {
    const offlineLodgings = getOfflineFallbackLodgings(
      trailheadLat,
      trailheadLon,
      maxDriveMinutes,
      typeFilter,
      priceRange,
      minRating
    );
    return {
      lodgings: offlineLodgings,
      dataSource: 'offline_fallback',
      errorType: 'NO_API_KEY',
      errorMessage: '未設定 VITE_GOOGLE_MAPS_API_KEY 金鑰，目前顯示離線備援資料，非即時 Google 資料。車程為粗估，山區實際車程可能更長，請以 Google 地圖實際路線為準。',
    };
  }

  // 設定搜尋半徑：車程越長搜尋半徑越大，最高 50 公里
  let radiusMeters = 30000;
  if (maxDriveMinutes <= 30) radiusMeters = 18000;
  else if (maxDriveMinutes <= 60) radiusMeters = 32000;
  else if (maxDriveMinutes <= 90) radiusMeters = 45000;
  else radiusMeters = 50000;

  try {
    // 步驟 1：呼叫 Google Places API (New) 搜尋即時旅宿
    const rawPlaces = await searchGoogleNearbyPlaces(trailheadLat, trailheadLon, radiusMeters, typeFilter, apiKey);

    if (rawPlaces.length === 0) {
      return {
        lodgings: [],
        dataSource: 'google',
        errorType: 'ZERO_RESULTS',
        errorMessage: '在設定的範圍與條件內，Google Places 查無相關住宿，建議擴大車程時間或住宿類型。',
      };
    }

    // 步驟 2：呼叫 Google Routes API computeRouteMatrix 取得真實駕車時間與距離
    const destinations = rawPlaces.map((p) => ({
      lat: p.location.latitude,
      lng: p.location.longitude,
    }));

    const routeResults = await computeRealDriveRoutes(trailheadLat, trailheadLon, destinations, apiKey);

    // 步驟 3：組合真實資料
    const googleLodgings: LodgingPlace[] = rawPlaces.map((p, idx) => {
      const typeInfo = parseTypeCategory(p.types);
      const priceInfo = formatPriceText(p.priceLevel);
      const route = routeResults[idx] || { driveMinutes: Infinity, distanceKm: 0 };

      return {
        id: p.id || `google-${idx}`,
        name: p.displayName?.text || '旅宿',
        type: typeInfo.label,
        typeCategory: typeInfo.category,
        latitude: p.location.latitude,
        longitude: p.location.longitude,
        driveMinutes: route.driveMinutes,
        driveDistanceKm: route.distanceKm,
        area: p.formattedAddress || 'Google 地圖登記地點',
        price: priceInfo.price,
        priceText: priceInfo.text,
        priceLevel: p.priceLevel,
        rating: typeof p.rating === 'number' ? p.rating : 0,
        userRatingCount: p.userRatingCount || 0,
        googleMapsUri: p.googleMapsUri,
      };
    });

    // 步驟 4：依使用者選擇的條件過濾
    const filtered = googleLodgings.filter((item) => {
      // 只要 driveMinutes 不是有限數字（!Number.isFinite），不論使用者是否選擇「不限車程」，一律排除
      if (!Number.isFinite(item.driveMinutes)) {
        return false;
      }
      // 車程條件過濾（如果限制了最大車程時間）
      if (Number.isFinite(maxDriveMinutes) && item.driveMinutes > maxDriveMinutes) {
        return false;
      }
      // 最低評分條件過濾
      if (minRating !== 'any') {
        const min = parseFloat(minRating);
        if (item.rating < min) return false;
      }
      // 價格過濾：若 Google 未提供價格資訊則不強制排除，若有提供則嚴格比對
      if (priceRange !== 'any' && item.price > 0) {
        if (!matchesPrice(item.price, priceRange)) return false;
      }
      return true;
    });

    // 依真實車程時間由近至遠排序
    filtered.sort((a, b) => a.driveMinutes - b.driveMinutes);

    if (filtered.length === 0) {
      return {
        lodgings: [],
        dataSource: 'google',
        errorType: 'ZERO_RESULTS',
        errorMessage: '經車程與條件篩選後暫無符合之住宿，建議放寬車程或評分門檻。',
      };
    }

    return {
      lodgings: filtered,
      dataSource: 'google',
      errorType: 'NONE',
    };
  } catch (err: any) {
    // 依錯誤類型產生詳細提示，並切換至離線備援資料
    const errorType: SearchErrorType =
      err.code === 'AUTH_403' ? 'AUTH_403' : err.code === 'QUOTA_429' ? 'QUOTA_429' : 'NETWORK_ERROR';

    const fallbackList = getOfflineFallbackLodgings(
      trailheadLat,
      trailheadLon,
      maxDriveMinutes,
      typeFilter,
      priceRange,
      minRating
    );

    return {
      lodgings: fallbackList,
      dataSource: 'offline_fallback',
      errorType,
      errorMessage:
        err.message || '無法連線至 Google Maps API，目前顯示離線備援資料，非即時 Google 資料。車程為粗估，山區實際車程可能更長，請以 Google 地圖實際路線為準。',
    };
  }
}

/**
 * 離線備援篩選函式（僅在 API 失敗或未設金鑰時執行）
 */
function getOfflineFallbackLodgings(
  trailheadLat: number,
  trailheadLon: number,
  maxDriveMinutes: number,
  typeFilter: string,
  priceRange: string,
  minRating: string
): LodgingPlace[] {
  return KNOWN_MOUNTAIN_LODGINGS.map((item) => {
    const distKm = calculateDistanceKm(trailheadLat, trailheadLon, item.latitude, item.longitude);
    const driveMinutes = estimateOfflineDriveMinutes(distKm);
    return {
      ...item,
      driveMinutes,
      driveDistanceKm: Math.round(distKm * 10) / 10,
      priceText: `約 NT$ ${item.price.toLocaleString()}`,
    };
  })
    .filter((item) => {
      if (!Number.isFinite(item.driveMinutes)) return false;
      const driveMatch = !Number.isFinite(maxDriveMinutes) || item.driveMinutes <= maxDriveMinutes;
      const typeMatch = typeFilter === 'all' || item.typeCategory === typeFilter;
      const priceMatch = matchesPrice(item.price, priceRange);
      const ratingMatch = minRating === 'any' || item.rating >= parseFloat(minRating);
      const dist = calculateDistanceKm(trailheadLat, trailheadLon, item.latitude, item.longitude);
      return driveMatch && typeMatch && priceMatch && ratingMatch && dist <= 75;
    })
    .sort((a, b) => a.driveMinutes - b.driveMinutes);
}

function matchesPrice(price: number, priceRange: string): boolean {
  switch (priceRange) {
    case '1000':
      return price <= 1000;
    case '1500':
      return price > 1000 && price <= 1500;
    case '2000':
      return price > 1500 && price <= 2000;
    case '2500':
      return price > 2000 && price <= 2500;
    case '3000':
      return price > 2500 && price <= 3000;
    case '3500':
      return price > 3000 && price <= 3500;
    case '4000':
      return price > 3500 && price <= 4000;
    case 'above4000':
      return price > 4000;
    case 'any':
    default:
      return true;
  }
}
