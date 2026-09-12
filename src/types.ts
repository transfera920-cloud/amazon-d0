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
}

export interface LodgingPlace {
  id: string;
  name: string;
  type: string;
  typeCategory: 'homestay' | 'hostel' | 'hotel' | 'camp';
  latitude: number;
  longitude: number;
  driveMinutes: number;
  area: string;
  price: number;
  rating: number;
}
