import React, { useState, useEffect } from 'react';
import { SearchCriteria, LodgingPlace } from '../types';
import { getTrailheadLocation } from '../data/trailheads';
import { getNearbyAccommodations } from '../data/lodgings';
import { MapPreview } from './MapPreview';

interface SearchResultsProps {
  criteria: SearchCriteria;
  hasSearched: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ criteria, hasSearched }) => {
  const currentTrailheadName = criteria.trailhead.trim() || '屯原登山口';
  const location = getTrailheadLocation(currentTrailheadName);

  const [lodgings, setLodgings] = useState<LodgingPlace[]>([]);
  const [isLoadingLodgings, setIsLoadingLodgings] = useState<boolean>(false);

  useEffect(() => {
    if (!hasSearched) return;

    let isMounted = true;
    setIsLoadingLodgings(true);

    const maxMinutes =
      criteria.driveTime === '30m'
        ? 30
        : criteria.driveTime === '60m'
        ? 60
        : criteria.driveTime === '90m'
        ? 90
        : criteria.driveTime === '120m'
        ? 120
        : 999;

    getNearbyAccommodations(
      location.latitude,
      location.longitude,
      maxMinutes,
      criteria.lodgingType,
      criteria.priceRange,
      criteria.minRating
    )
      .then((results) => {
        if (isMounted) {
          setLodgings(results);
          setIsLoadingLodgings(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingLodgings(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    hasSearched,
    criteria.trailhead,
    criteria.driveTime,
    criteria.priceRange,
    criteria.minRating,
    criteria.lodgingType,
    location.latitude,
    location.longitude,
  ]);

  if (!hasSearched) {
    return null;
  }

  return (
    <section id="search-results-section" className="bg-white rounded-2xl border border-stone-200 shadow-xs p-3 sm:p-4">
      <MapPreview
        trailheadName={currentTrailheadName}
        latitude={location.latitude}
        longitude={location.longitude}
        driveTime={criteria.driveTime}
        lodgings={lodgings}
        isLoadingLodgings={isLoadingLodgings}
      />
    </section>
  );
};
