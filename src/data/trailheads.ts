import { TrailheadLocation } from '../types';

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
 * 取得登山口經緯度座標：
 * 1. 優先比對 COMMON_TRAILHEAD_COORDINATES 內建精準常用登山口
 * 2. 若不在清單中，呼叫 Google Geocoding API 查詢真實地理座標
 * 3. 若 Google 也查無結果，拋出明確錯誤：「查無此登山口，請確認名稱或改用鄰近鄉鎮」
 */
export async function getTrailheadLocation(query: string): Promise<TrailheadLocation> {
  const clean = query.trim();
  if (!clean) {
    return { name: '屯原登山口', latitude: 24.0381, longitude: 121.2372 };
  }

  // 1. 先比對內建精準清單
  for (const [key, val] of Object.entries(COMMON_TRAILHEAD_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return { ...val, name: clean, isFromGoogle: false };
    }
  }

  // 2. 使用者自訂非清單登山口：呼叫 Google Geocoding API
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();

  if (!apiKey) {
    throw new Error(
      `未設定 VITE_GOOGLE_MAPS_API_KEY 金鑰，且「${clean}」不在常用清單中。請改用清單登山口（如屯原、塔塔加、雪山、向陽等）或設定 Google Maps API 金鑰。`
    );
  }

  const directUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    clean
  )}&key=${apiKey}&language=zh-TW`;
  const proxyUrl = `/proxy-google-maps/maps/api/geocode/json?address=${encodeURIComponent(
    clean
  )}&key=${apiKey}&language=zh-TW`;

  let response: Response;
  try {
    response = await fetch(directUrl);
  } catch (directErr) {
    // 瀏覽器端若遇 CORS 限制，平滑改走開發代理
    try {
      response = await fetch(proxyUrl);
    } catch {
      throw new Error('無法連線至 Google Maps Geocoding API，請檢查網路連線或金鑰設定。');
    }
  }

  if (response.status === 403) {
    throw new Error('Google Maps API 授權失敗（403）：請確認金鑰是否有效，且已在 Google Cloud 啟用 Geocoding API。');
  }

  if (response.status === 429) {
    throw new Error('Google Maps API 額度用盡或頻率過高（429）：請稍後再試。');
  }

  if (!response.ok) {
    throw new Error(`Google Maps API 回應異常（HTTP ${response.status}）`);
  }

  const data = await response.json();

  if (data.status === 'ZERO_RESULTS' || !data.results || data.results.length === 0) {
    throw new Error('查無此登山口，請確認名稱或改用鄰近鄉鎮');
  }

  if (data.status === 'REQUEST_DENIED') {
    throw new Error(
      `Google Maps API 授權失敗（403/REQUEST_DENIED）：${data.error_message || '請確認已啟用 Geocoding API 且金鑰權限設定正確。'}`
    );
  }

  if (data.status === 'OVER_QUERY_LIMIT') {
    throw new Error('Google Maps API 呼叫次數或額度已用盡（429/OVER_QUERY_LIMIT）：請稍後再試。');
  }

  if (data.status !== 'OK') {
    throw new Error(`Google Maps 地理編碼查詢失敗（${data.status}）：${data.error_message || '請確認登山口名稱後重試。'}`);
  }

  const result = data.results[0];
  const { lat, lng } = result.geometry.location;

  return {
    name: clean,
    latitude: lat,
    longitude: lng,
    formattedAddress: result.formatted_address,
    isFromGoogle: true,
  };
}
