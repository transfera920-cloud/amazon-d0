export interface SearchCriteria {
  trailhead: string;
  driveTime: string;
  priceRange: string;
  minRating: string;
  lodgingType: string;
}

export interface TrailheadLocation {
  name: string;
  latitude: number;
  longitude: number;
  formattedAddress?: string;
  isFromGoogle?: boolean;
  isOfflineFallback?: boolean;
  sourceDescription?: string;
}

export interface LodgingPlace {
  id: string;
  name: string;
  type: string;
  typeCategory: 'homestay' | 'hostel' | 'hotel' | 'camp';
  latitude: number;
  longitude: number;
  driveMinutes: number;
  driveDistanceKm?: number;
  area: string;
  price: number;
  priceText: string;
  priceLevel?: string;
  rating: number;
  userRatingCount?: number;
  googleMapsUri?: string;
}

export type SearchDataSource = 'google' | 'offline_fallback';

export type SearchErrorType =
  | 'NONE'
  | 'ZERO_RESULTS'
  | 'AUTH_403'
  | 'QUOTA_429'
  | 'NETWORK_ERROR'
  | 'NO_API_KEY';

export interface SearchResultData {
  lodgings: LodgingPlace[];
  dataSource: SearchDataSource;
  errorType?: SearchErrorType;
  errorMessage?: string;
}

/**
 * 在地口碑住宿（由後台手動收錄，針對 Google Places 未收錄或非標準商家）
 */
export interface ManualLodgingEntry {
  id: string;
  name: string;
  trailheadName: string;
  contact: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  driveDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

