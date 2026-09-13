import { TrailheadLocation } from '../types';
import { getGoogleMapsApiKey } from '../utils/apiKey';

export const COMMON_TRAILHEAD_COORDINATES: Record<string, TrailheadLocation> = {
  屯原登山口: { name: '屯原登山口', latitude: 24.0381, longitude: 121.2372 },
  屯原: { name: '屯原登山口', latitude: 24.0381, longitude: 121.2372 },
  塔塔加登山口: { name: '塔塔加登山口', latitude: 23.4842, longitude: 120.8931 },
  塔塔加: { name: '塔塔加登山口', latitude: 23.4842, longitude: 120.8931 },
  玉山登山口: { name: '玉山登山口', latitude: 23.4842, longitude: 120.8931 },
  雪山登山口: { name: '雪山登山口', latitude: 24.3989, longitude: 121.3217 },
  武陵農場: { name: '武陵農場', latitude: 24.3577, longitude: 121.3121 },
  向陽登山口: { name: '向陽登山口', latitude: 23.2422, longitude: 120.9856 },
  向陽: { name: '向陽登山口', latitude: 23.2422, longitude: 120.9856 },
  嘉明湖登山口: { name: '向陽登山口', latitude: 23.2422, longitude: 120.9856 },
  小風口: { name: '小風口登山口', latitude: 24.1627, longitude: 121.2858 },
  合歡山登山口: { name: '合歡山登山口', latitude: 24.1424, longitude: 121.2721 },
  松雪樓: { name: '松雪樓', latitude: 24.1424, longitude: 121.2721 },
  勝光登山口: { name: '勝光登山口', latitude: 24.3644, longitude: 121.3411 },
  思源埡口: { name: '思源埡口', latitude: 24.3855, longitude: 121.3533 },
  南湖大山登山口: { name: '南湖大山思源登山口', latitude: 24.3855, longitude: 121.3533 },
  東埔登山口: { name: '東埔登山口', latitude: 23.5592, longitude: 120.9322 },
  八通關登山口: { name: '東埔登山口', latitude: 23.5592, longitude: 120.9322 },
  戒茂斯登山口: { name: '戒茂斯登山口', latitude: 23.2201, longitude: 121.0315 },
  觀霧: { name: '觀霧森林遊樂區', latitude: 24.5074, longitude: 121.1189 },
  大鹿林道: { name: '大鹿林道東線登山口', latitude: 24.5074, longitude: 121.1189 },
  鎮西堡登山口: { name: '鎮西堡登山口', latitude: 24.5518, longitude: 121.3134 },
  司馬庫斯: { name: '司馬庫斯登山口', latitude: 24.5772, longitude: 121.3341 },
};

/**
 * 登山口詳細搜尋關鍵字對照表（加上台灣與所在鄉鎮以提升 Geocoding 精準度）
 */
const TRAILHEAD_SEARCH_HINTS: Record<string, string> = {
  屯原登山口: '台灣 南投縣仁愛鄉 屯原登山口',
  屯原: '台灣 南投縣仁愛鄉 屯原登山口',
  塔塔加登山口: '台灣 嘉義縣阿里山鄉 塔塔加鞍部 玉山登山口',
  塔塔加: '台灣 嘉義縣阿里山鄉 塔塔加鞍部 玉山登山口',
  玉山登山口: '台灣 嘉義縣阿里山鄉 塔塔加鞍部 玉山登山口',
  雪山登山口: '台灣 台中市和平區 武陵農場 雪山登山口服務站',
  武陵農場: '台灣 台中市和平區 武陵農場',
  向陽登山口: '台灣 台東縣海端鄉 向陽國家森林遊樂區 向陽登山口',
  向陽: '台灣 台東縣海端鄉 向陽國家森林遊樂區 向陽登山口',
  嘉明湖登山口: '台灣 台東縣海端鄉 向陽國家森林遊樂區 向陽登山口',
  小風口: '台灣 南投縣仁愛鄉 合歡山小風口',
  合歡山登山口: '台灣 花蓮縣秀林鄉 松雪樓 合歡東峰登山口',
  松雪樓: '台灣 花蓮縣秀林鄉 松雪樓',
  勝光登山口: '台灣 宜蘭縣大同鄉 勝光登山口',
  思源埡口: '台灣 宜蘭縣大同鄉 思源埡口',
  南湖大山登山口: '台灣 宜蘭縣大同鄉 南湖大山思源登山口',
  東埔登山口: '台灣 南投縣信義鄉 東埔登山口 八通關古道',
  八通關登山口: '台灣 南投縣信義鄉 東埔登山口 八通關古道',
  戒茂斯登山口: '台灣 台東縣海端鄉 戒茂斯登山口',
  觀霧: '台灣 苗栗縣泰安鄉 觀霧國家森林遊樂區',
  大鹿林道: '台灣 苗栗縣泰安鄉 大鹿林道東線登山口',
  鎮西堡登山口: '台灣 新竹縣尖石鄉 鎮西堡巨木群登山口',
  司馬庫斯: '台灣 新竹縣尖石鄉 司馬庫斯巨木群步道登山口',
};

/**
 * 取得登山口經緯度座標：
 * 1. 優先呼叫 Google Geocoding API 查詢真實地理座標（自動補上地區關鍵字增加精確度）
 * 2. 若 Geocoding 查詢成功，直接使用 Google 回傳之真實座標（標記 isFromGoogle: true）
 * 3. 只有在 Geocoding API 失敗時（無金鑰、403限制、額度用盡、網路斷線），才退回使用 COMMON_TRAILHEAD_COORDINATES 寫死清單做為離線備援
 * 4. 若 Google 失敗且不在備援清單中，拋出明確錯誤提示
 */
export async function getTrailheadLocation(query: string): Promise<TrailheadLocation> {
  const clean = query.trim();
  if (!clean) {
    return {
      name: '屯原登山口',
      latitude: 24.0381,
      longitude: 121.2372,
      isFromGoogle: false,
      isOfflineFallback: true,
      sourceDescription: '離線備援座標，非即時查詢',
    };
  }

  // 尋找此登山口是否有離線備援資料
  let fallbackCoord: TrailheadLocation | null = null;
  for (const [key, val] of Object.entries(COMMON_TRAILHEAD_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      fallbackCoord = {
        ...val,
        name: clean,
        isFromGoogle: false,
        isOfflineFallback: true,
        sourceDescription: '離線備援座標，非即時查詢',
      };
      break;
    }
  }

  // 1. 優先嘗試呼叫 Google Geocoding API 查詢即時真實座標
  const apiKey = getGoogleMapsApiKey();
  let geocodingError: string | null = null;

  if (apiKey) {
    // 建立搜尋關鍵字：優先採用特製增強關鍵字（含台灣/縣市），確保地圖定位精確
    const searchAddress = TRAILHEAD_SEARCH_HINTS[clean] || `台灣 ${clean}`;

    const directUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      searchAddress
    )}&key=${apiKey}&language=zh-TW`;
    const proxyUrl = `/proxy-google-maps/maps/api/geocode/json?address=${encodeURIComponent(
      searchAddress
    )}&key=${apiKey}&language=zh-TW`;

    const isDev =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    let response: Response | null = null;
    try {
      response = await fetch(directUrl);
    } catch {
      if (isDev) {
        try {
          response = await fetch(proxyUrl);
        } catch {
          geocodingError = '無法連線至 Google Maps Geocoding API 伺服器';
        }
      } else {
        geocodingError = '無法連線至 Google Maps Geocoding API 伺服器';
      }
    }

    if (response) {
      if (response.status === 403) {
        geocodingError = 'Google Maps API 授權失敗（403）：請確認金鑰是否有效，且已在 Google Cloud 啟用 Geocoding API。';
      } else if (response.status === 429) {
        geocodingError = 'Google Maps API 額度用盡或頻率過高（429）：請稍後再試。';
      } else if (!response.ok) {
        geocodingError = `Google Maps API 回應異常（HTTP ${response.status}）`;
      } else {
        try {
          const data = await response.json();
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result = data.results[0];
            const { lat, lng } = result.geometry.location;
            return {
              name: clean,
              latitude: lat,
              longitude: lng,
              formattedAddress: result.formatted_address,
              isFromGoogle: true,
              isOfflineFallback: false,
              sourceDescription: 'Google Maps 即時驗證真實座標',
            };
          } else if (data.status === 'ZERO_RESULTS') {
            geocodingError = `Google Maps 查無「${clean}」相關座標`;
          } else if (data.status === 'REQUEST_DENIED') {
            geocodingError = `Google Maps 授權拒絕（REQUEST_DENIED）：${data.error_message || '請確認金鑰權限'}`;
          } else {
            geocodingError = `Google Maps 地理編碼失敗（${data.status}）：${data.error_message || ''}`;
          }
        } catch (parseErr) {
          geocodingError = '解析 Google Geocoding API 回應失敗';
        }
      }
    }
  } else {
    geocodingError = '尚未設定 Google Maps API 金鑰';
  }

  // 2. Google Geocoding 失敗時，檢查是否有離線備援座標可用
  if (fallbackCoord) {
    return fallbackCoord;
  }

  // 3. 無法連線 Google 且不在內建清單中，拋出明確錯誤訊息
  throw new Error(
    geocodingError
      ? `無法取得「${clean}」之真實座標（${geocodingError}），且不在常用登山口備援清單中。請點選右上角「金鑰設定」輸入金鑰，或使用常見百岳登山口。`
      : `查無此登山口「${clean}」，請確認名稱或改用鄰近鄉鎮`
  );
}
