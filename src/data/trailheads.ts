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

export function getTrailheadLocation(query: string): TrailheadLocation {
  const clean = query.trim();
  if (!clean) {
    return { name: '屯原登山口', latitude: 24.0381, longitude: 121.2372 };
  }

  for (const [key, val] of Object.entries(COMMON_TRAILHEAD_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return { ...val, name: clean };
    }
  }

  // 預設台灣中央山脈核心基準點（合歡/埔里山區）
  return { name: clean, latitude: 23.9738, longitude: 120.9820 };
}
