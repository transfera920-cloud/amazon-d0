export const API_KEY_STORAGE_KEY = 'custom_google_maps_api_key';

export function getGoogleMapsApiKey(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  }
  return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
}

export function setGoogleMapsApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
    window.dispatchEvent(new Event('google-api-key-changed'));
  }
}

export function hasCustomApiKey(): boolean {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(API_KEY_STORAGE_KEY);
    return Boolean(saved && saved.trim());
  }
  return false;
}

export function hasEnvApiKey(): boolean {
  return Boolean((import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim());
}
