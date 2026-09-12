import { LodgingPlace } from '../types';

// 計算兩經緯度直線距離（公里）
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

// 估算山區路程開車時間（山路彎曲係數約 1.35，平均車速約 35 km/h）
export function estimateDriveMinutes(distanceKm: number): number {
  const mountainRoadDistance = distanceKm * 1.35;
  const minutes = Math.round((mountainRoadDistance / 35) * 60);
  return Math.max(10, minutes);
}

// 台灣各大主要百岳登山口周邊登記旅宿與山莊資料，涵蓋各價位帶（以500元為級距）與不同評分
export const KNOWN_MOUNTAIN_LODGINGS: Omit<LodgingPlace, 'driveMinutes'>[] = [
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
  { id: 'ty-11', name: '廬山天下第一泉溫泉會館', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.0180, longitude: 121.1820, area: '廬山溫泉區', price: 3600, rating: 4.3 },
  { id: 'ty-12', name: '廬山背包客棧棧點', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 24.0195, longitude: 121.1855, area: '廬山溫泉區', price: 1200, rating: 4.2 },

  // --- 塔塔加登山口 / 玉山口周邊（東埔溫泉、同富、阿里山園區） ---
  { id: 'tt-1', name: '東埔大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.5621, longitude: 120.9298, area: '東埔溫泉區', price: 2200, rating: 3.8 },
  { id: 'tt-2', name: '帝綸溫泉渡假大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.5605, longitude: 120.9312, area: '東埔溫泉區', price: 3300, rating: 4.2 },
  { id: 'tt-3', name: '沙里仙溫泉渡假村', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 23.5678, longitude: 120.9215, area: '東埔溫泉區', price: 3800, rating: 4.5 },
  { id: 'tt-4', name: '勝華溫泉大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.5615, longitude: 120.9305, area: '東埔溫泉區', price: 1700, rating: 3.7 },
  { id: 'tt-5', name: '達瑪巒風味民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 23.5850, longitude: 120.8950, area: '信義鄉同富', price: 1300, rating: 4.3 },
  { id: 'tt-6', name: '望鄉部落老爹農莊民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 23.5930, longitude: 120.8920, area: '望鄉部落', price: 1450, rating: 4.6 },
  { id: 'tt-7', name: '阿里山閣大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.5185, longitude: 120.8140, area: '阿里山遊樂區', price: 4200, rating: 4.0 },
  { id: 'tt-8', name: '櫻山大飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.5122, longitude: 120.8035, area: '阿里山遊樂區', price: 2900, rating: 3.9 },
  { id: 'tt-9', name: '阿里山天主堂登山背包客中心', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 23.5110, longitude: 120.8020, area: '阿里山遊樂區', price: 850, rating: 4.4 },
  { id: 'tt-10', name: '自忠廢棄派出所周邊野營地', type: '露營區 / 登山山莊', typeCategory: 'camp', latitude: 23.4980, longitude: 120.8520, area: '自忠特富野', price: 600, rating: 4.1 },
  { id: 'tt-11', name: '阿里山賓館', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.5140, longitude: 120.8060, area: '阿里山遊樂區', price: 7800, rating: 4.6 },
  { id: 'tt-12', name: '東埔源頭溫泉山莊', type: '露營區 / 登山山莊', typeCategory: 'camp', latitude: 23.5640, longitude: 120.9320, area: '東埔溫泉區', price: 1100, rating: 4.0 },

  // --- 雪山登山口 / 武陵周邊 ---
  { id: 'sy-1', name: '武陵國民賓館', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.3582, longitude: 121.3115, area: '武陵農場', price: 3400, rating: 4.3 },
  { id: 'sy-2', name: '武陵富野渡假村', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.3601, longitude: 121.3130, area: '武陵農場', price: 5200, rating: 4.5 },
  { id: 'sy-3', name: '武陵農場露營區', type: '露營區 / 登山山莊', typeCategory: 'camp', latitude: 24.3810, longitude: 121.3150, area: '武陵農場高山區', price: 1000, rating: 4.4 },
  { id: 'sy-4', name: '環山部落屋民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.3120, longitude: 121.2950, area: '環山部落', price: 1300, rating: 4.6 },
  { id: 'sy-5', name: '詩歌謠天空民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.3135, longitude: 121.2940, area: '環山部落', price: 1700, rating: 4.7 },
  { id: 'sy-6', name: '環山光果背包客之家', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 24.3110, longitude: 121.2930, area: '環山部落', price: 900, rating: 4.5 },
  { id: 'sy-7', name: '武陵青葉農場民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.3410, longitude: 121.3250, area: '武陵外圍', price: 2600, rating: 4.2 },

  // --- 向陽登山口 / 嘉明湖周邊 ---
  { id: 'xy-1', name: '利稻喜度民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 23.1895, longitude: 121.0320, area: '利稻部落', price: 1200, rating: 4.5 },
  { id: 'xy-2', name: '利稻陳大姐名產民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 23.1880, longitude: 121.0310, area: '利稻部落', price: 1400, rating: 4.3 },
  { id: 'xy-3', name: '天龍溫泉飯店', type: '飯店旅館', typeCategory: 'hotel', latitude: 23.1670, longitude: 121.0450, area: '霧鹿溫泉區', price: 3200, rating: 4.2 },
  { id: 'xy-4', name: '向陽青年旅棧', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 23.1870, longitude: 121.0335, area: '利稻部落', price: 800, rating: 4.4 },
  { id: 'xy-5', name: '南橫下馬溫泉露營區', type: '露營區 / 登山山莊', typeCategory: 'camp', latitude: 23.1720, longitude: 121.0410, area: '下馬部落', price: 900, rating: 4.1 },
  { id: 'xy-6', name: '霧鹿部落星空民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 23.1690, longitude: 121.0430, area: '霧鹿部落', price: 2200, rating: 4.6 },

  // --- 合歡山 / 小風口 / 松雪樓周邊 ---
  { id: 'hh-1', name: '松雪樓', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.1424, longitude: 121.2721, area: '合歡山', price: 4200, rating: 4.5 },
  { id: 'hh-2', name: '滑雪山莊', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 24.1415, longitude: 121.2735, area: '合歡山', price: 1200, rating: 4.3 },
  { id: 'hh-3', name: '觀雲山莊', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 24.1785, longitude: 121.3250, area: '大禹嶺關原', price: 950, rating: 4.4 },
  { id: 'hh-4', name: '合歡山小風口露營車宿區', type: '露營區 / 登山山莊', typeCategory: 'camp', latitude: 24.1610, longitude: 121.2840, area: '合歡山小風口', price: 700, rating: 4.0 },
  { id: 'hh-5', name: '大禹嶺欣欣民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.1810, longitude: 121.3150, area: '大禹嶺', price: 1600, rating: 3.9 },

  // --- 鎮西堡 / 司馬庫斯周邊 ---
  { id: 'zs-1', name: '鎮西堡阿慕依民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.5530, longitude: 121.3120, area: '鎮西堡部落', price: 1500, rating: 4.4 },
  { id: 'zs-2', name: '司馬庫斯喜籟民宿', type: '民宿 / B&B', typeCategory: 'homestay', latitude: 24.5780, longitude: 121.3320, area: '司馬庫斯部落', price: 2300, rating: 4.6 },
  { id: 'zs-3', name: '秀巒溫泉野營民宿', type: '露營區 / 登山山莊', typeCategory: 'camp', latitude: 24.6200, longitude: 121.2850, area: '秀巒部落', price: 800, rating: 4.1 },
  { id: 'zs-4', name: '鎮西堡波塔斯背包客棧', type: '青年旅館 / 背包客棧', typeCategory: 'hostel', latitude: 24.5510, longitude: 121.3140, area: '鎮西堡部落', price: 950, rating: 4.3 },
  { id: 'zs-5', name: '泰崗部落景觀渡假會館', type: '飯店旅館', typeCategory: 'hotel', latitude: 24.5910, longitude: 121.3050, area: '泰崗部落', price: 3500, rating: 4.5 },
];

/**
 * 嚴格比對價格區間（以500元為級距）
 */
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

/**
 * 嚴格比對最低評分要求
 */
function matchesRating(rating: number, minRating: string): boolean {
  switch (minRating) {
    case '3.5':
      return rating >= 3.5;
    case '4.0':
      return rating >= 4.0;
    case '4.5':
      return rating >= 4.5;
    case 'any':
    default:
      return true;
  }
}

/**
 * 依登山口座標與完整設定條件查詢周邊住宿點
 */
export async function getNearbyAccommodations(
  trailheadLat: number,
  trailheadLon: number,
  maxDriveMinutes: number,
  typeFilter: string,
  priceRange: string = 'any',
  minRating: string = 'any'
): Promise<LodgingPlace[]> {
  // 1. 先計算所有已知山區旅宿的實際距離與車程
  const allCalculated: LodgingPlace[] = KNOWN_MOUNTAIN_LODGINGS.map((item) => {
    const distKm = calculateDistanceKm(trailheadLat, trailheadLon, item.latitude, item.longitude);
    const driveMinutes = estimateDriveMinutes(distKm);
    return {
      ...item,
      driveMinutes,
    };
  });

  // 2. 嚴格依五大條件篩選
  const filtered = allCalculated.filter((item) => {
    // 條件一：車程限制
    const driveMatch = maxDriveMinutes >= 999 || item.driveMinutes <= maxDriveMinutes;
    // 條件二：住宿類型
    const typeMatch = typeFilter === 'all' || item.typeCategory === typeFilter;
    // 條件三：價格等級（以500元為級距）
    const priceMatch = matchesPrice(item.price, priceRange);
    // 條件四：最低評分
    const ratingMatch = matchesRating(item.rating, minRating);

    // 最大物理距離限制在 75 公里內
    const distanceKm = calculateDistanceKm(trailheadLat, trailheadLon, item.latitude, item.longitude);
    return driveMatch && typeMatch && priceMatch && ratingMatch && distanceKm <= 75;
  });

  // 3. 如果自訂登山口附近已知資料較少，從公開 OpenStreetMap 補充點位
  if (filtered.length < 2) {
    try {
      const radiusMeters = Math.min(45000, Math.max(15000, (maxDriveMinutes >= 999 ? 60 : maxDriveMinutes) * 600));
      const query = `[out:json][timeout:3];(node["tourism"~"hotel|guest_house|hostel|camp_site|chalet|motel"](around:${radiusMeters},${trailheadLat},${trailheadLon}););out 12;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.elements)) {
          const livePlaces = data.elements
            .filter((el: any) => el.tags && (el.tags.name || el.tags['name:zh']))
            .map((el: any, index: number): LodgingPlace => {
              const name = el.tags['name:zh'] || el.tags.name;
              const tourism = el.tags.tourism;
              let type = '民宿 / B&B';
              let typeCategory: 'homestay' | 'hostel' | 'hotel' | 'camp' = 'homestay';
              let estimatedPrice = 1600;
              let estimatedRating = 4.2;

              if (tourism === 'hotel' || tourism === 'motel') {
                type = '飯店旅館';
                typeCategory = 'hotel';
                estimatedPrice = 2800;
                estimatedRating = 4.1;
              } else if (tourism === 'hostel') {
                type = '青年旅館 / 背包客棧';
                typeCategory = 'hostel';
                estimatedPrice = 900;
                estimatedRating = 4.4;
              } else if (tourism === 'camp_site' || tourism === 'chalet') {
                type = '露營區 / 登山山莊';
                typeCategory = 'camp';
                estimatedPrice = 850;
                estimatedRating = 4.3;
              }

              const distKm = calculateDistanceKm(trailheadLat, trailheadLon, el.lat, el.lon);
              const driveMinutes = estimateDriveMinutes(distKm);

              return {
                id: `osm-${el.id || index}`,
                name,
                type,
                typeCategory,
                latitude: el.lat,
                longitude: el.lon,
                driveMinutes,
                area: el.tags['addr:town'] || el.tags['addr:district'] || '鄰近山區',
                price: estimatedPrice,
                rating: estimatedRating,
              };
            })
            .filter((item: LodgingPlace) => {
              const driveMatch = maxDriveMinutes >= 999 || item.driveMinutes <= maxDriveMinutes;
              const typeMatch = typeFilter === 'all' || item.typeCategory === typeFilter;
              const priceMatch = matchesPrice(item.price, priceRange);
              const ratingMatch = matchesRating(item.rating, minRating);
              return driveMatch && typeMatch && priceMatch && ratingMatch;
            });

          filtered.push(...livePlaces);
        }
      }
    } catch {
      // 網路逾時維持本地計算
    }
  }

  // 去重並依車程由近至遠排序
  const uniqueMap = new Map<string, LodgingPlace>();
  filtered.forEach((item) => {
    const key = `${item.name.slice(0, 4)}_${item.latitude.toFixed(3)}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });

  return Array.from(uniqueMap.values()).sort((a, b) => a.driveMinutes - b.driveMinutes);
}
