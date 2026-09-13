import { ManualLodgingEntry } from '../types';

const STORAGE_KEY = 'd0_manual_lodgings';
export const MANUAL_LODGINGS_UPDATED_EVENT = 'd0_manual_lodgings_updated';

// 預設示範資料（初次使用或查無自訂資料時自動載入）
export const DEFAULT_MANUAL_LODGINGS: ManualLodgingEntry[] = [
  {
    id: 'manual-wuling-inn',
    name: '武陵客棧-登山旅遊協助站',
    trailheadName: '武陵農場',
    contact: 'Facebook 專頁私訊：https://www.facebook.com/wulinginn / 電話：0912-345678 / Line ID: wuling_inn',
    notes: '僅接受 Facebook 私訊或電話預約、無法線上即時查詢空房。提供山友 D0 行前通鋪過夜、熱水淋浴與武陵雪山登山口接駁協助。',
    latitude: 24.3468,
    longitude: 121.3135,
    driveDescription: '位於台7甲線約53K處（中興路二段33號），車程距武陵農場收費站約 12-15 分鐘',
    createdAt: '2026-09-12T10:00:00.000Z',
  },
  {
    id: 'manual-shengguang-house',
    name: '南湖大山勝光登山口方便屋',
    trailheadName: '勝光登山口',
    contact: '電話洽詢：0921-889922 / Line ID: sgmountlodge',
    notes: '南湖大山熱門前哨補給過夜站，提供乾淨通鋪、熱水洗澡與清晨早餐代訂，無 Google 官方訂房系統。',
    latitude: 24.3667,
    longitude: 121.3418,
    driveDescription: '緊鄰台7甲線50K勝光登山口農路入口約 400 公尺，步行約 5 分鐘',
    createdAt: '2026-09-12T10:00:00.000Z',
  },
];

/**
 * 讀取所有手動輸入的口碑住宿清單
 */
export function getManualLodgings(): ManualLodgingEntry[] {
  if (typeof window === 'undefined') {
    return DEFAULT_MANUAL_LODGINGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // 初次載入寫入預設資料以供立即展示
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MANUAL_LODGINGS));
      return DEFAULT_MANUAL_LODGINGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return DEFAULT_MANUAL_LODGINGS;
  } catch (err) {
    console.warn('無法解析 localStorage 內的手動口碑住宿資料:', err);
    return DEFAULT_MANUAL_LODGINGS;
  }
}

/**
 * 儲存口碑住宿清單至 localStorage 並發送事件通知前台即時更新
 */
export function saveManualLodgings(list: ManualLodgingEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(MANUAL_LODGINGS_UPDATED_EVENT));
  } catch (err) {
    console.error('儲存手動口碑住宿資料失敗:', err);
  }
}

/**
 * 新增一筆口碑住宿
 */
export function addManualLodging(entry: Omit<ManualLodgingEntry, 'id' | 'createdAt' | 'updatedAt'>): ManualLodgingEntry {
  const list = getManualLodgings();
  const newEntry: ManualLodgingEntry = {
    ...entry,
    id: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  list.unshift(newEntry);
  saveManualLodgings(list);
  return newEntry;
}

/**
 * 更新一筆口碑住宿
 */
export function updateManualLodging(id: string, updates: Partial<ManualLodgingEntry>): boolean {
  const list = getManualLodgings();
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return false;

  list[index] = {
    ...list[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveManualLodgings(list);
  return true;
}

/**
 * 刪除一筆口碑住宿
 */
export function deleteManualLodging(id: string): boolean {
  const list = getManualLodgings();
  const filtered = list.filter((item) => item.id !== id);
  if (filtered.length === list.length) return false;
  saveManualLodgings(filtered);
  return true;
}

/**
 * 重設為預設示範清單
 */
export function resetManualLodgingsToDefault(): void {
  saveManualLodgings(DEFAULT_MANUAL_LODGINGS);
}

/**
 * 依登山口名稱過濾手動口碑住宿
 * 支援模糊與精確對齊（例如「武陵農場」可比對「武陵農場」、「雪山登山口」、「武陵」）
 */
export function getManualLodgingsForTrailhead(trailheadName: string): ManualLodgingEntry[] {
  if (!trailheadName) return [];
  const all = getManualLodgings();
  const normalizedTarget = trailheadName.trim().toLowerCase().replace(/登山口$/, '');

  return all.filter((entry) => {
    const entryTh = (entry.trailheadName || '').trim().toLowerCase();
    const entryThClean = entryTh.replace(/登山口$/, '');

    // 1. 完全相同
    if (entryTh === trailheadName.trim().toLowerCase()) return true;
    if (entryThClean === normalizedTarget) return true;

    // 2. 包含彼此關鍵字（如「武陵」包含在「武陵農場」）
    if (entryTh.length >= 2 && trailheadName.toLowerCase().includes(entryThClean)) return true;
    if (normalizedTarget.length >= 2 && entryTh.includes(normalizedTarget)) return true;

    // 3. 武陵與雪山同屬同一區
    if (
      (entryTh.includes('武陵') || entryTh.includes('雪山')) &&
      (trailheadName.includes('武陵') || trailheadName.includes('雪山'))
    ) {
      return true;
    }

    // 4. 勝光、思源、南湖大山同屬思源埡口稜線區
    if (
      (entryTh.includes('勝光') || entryTh.includes('思源') || entryTh.includes('南湖')) &&
      (trailheadName.includes('勝光') || trailheadName.includes('思源') || trailheadName.includes('南湖'))
    ) {
      return true;
    }

    return false;
  });
}
