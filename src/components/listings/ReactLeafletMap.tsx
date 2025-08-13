'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { geocodePostalCodeForMap, batchGeocodePostalCodes, GEOCODING_CONFIG } from '@/utils/geocoding';

interface Listing {
  ListingKey: string;
  ListPrice: number;
  UnparsedAddress?: string;
  Latitude?: number;
  Longitude?: number;
  PostalCode?: string;
}

interface ReactLeafletMapProps {
  listings: Listing[];
  onVisibleListingsChange?: (listings: Listing[]) => void;
  onMarkerClick?: (listingKey: string) => void;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  className?: string;
  style?: React.CSSProperties;
}

interface MarkerData {
  lat: number;
  lng: number;
  price: number;
  address: string;
  listingKey: string;
}

// Create a wrapper component that handles the map initialization properly
const MapWrapper = dynamic(() => import('./MapWrapper'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg border border-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading React-Leaflet Map...</p>
      </div>
    </div>
  )
});

// Helper function to extract postal code from address
const extractPostalCode = (address?: string): string | null => {
  if (!address) return null;

  // Canadian postal code pattern: A1A 1A1
  const postalCodeMatch = address.match(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/i);
  return postalCodeMatch ? postalCodeMatch[0].replace(/\s/g, '').toUpperCase() : null;
};

export default function ReactLeafletMap({
  listings,
  onVisibleListingsChange,
  onMarkerClick,
  onBoundsChange,
  className = '',
  style = {}
}: ReactLeafletMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingsWithCoords, setListingsWithCoords] = useState<(Listing & { coords?: [number, number] })[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch coordinates and create markers from actual listings using batch geocoding
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchCoords = async () => {
      if (!listings.length) {
        setMarkers([]);
        setListingsWithCoords([]);
        setIsLoading(false);
        return;
      }

      console.log(`🗺️ ReactLeafletMap: Processing ${listings.length} listings for markers`);

      const markersData: MarkerData[] = [];
      const listingsWithCoordsData: (Listing & { coords?: [number, number] })[] = [];

      // Separate listings with existing coordinates from those needing geocoding
      const listingsWithCoords: Listing[] = [];
      const listingsNeedingGeocode: Listing[] = [];

      listings.forEach(listing => {
        if (listing.Latitude && listing.Longitude) {
          listingsWithCoords.push(listing);
        } else {
          listingsNeedingGeocode.push(listing);
        }
      });

      console.log(`📊 ${listingsWithCoords.length} listings have coordinates, ${listingsNeedingGeocode.length} need geocoding`);

      // Process listings with existing coordinates immediately
      listingsWithCoords.forEach(listing => {
        const coords: [number, number] = [listing.Latitude!, listing.Longitude!];

        markersData.push({
          lat: coords[0],
          lng: coords[1],
          price: listing.ListPrice,
          address: listing.UnparsedAddress || 'Address not available',
          listingKey: listing.ListingKey
        });

        listingsWithCoordsData.push({ ...listing, coords });
      });

      // Update state with immediate results
      if (isMounted) {
        setMarkers([...markersData]);
        setListingsWithCoords([...listingsWithCoordsData]);

        // If we have some results, show them immediately
        if (markersData.length > 0) {
          setIsLoading(false);
        }
      }

      // Batch geocode remaining listings if needed
      if (listingsNeedingGeocode.length > 0 && GEOCODING_CONFIG.useProgressiveLoading) {
        console.log(`🔄 Starting batch geocoding for ${listingsNeedingGeocode.length} listings`);

        // Extract postal codes for batch geocoding
        const postalCodes = listingsNeedingGeocode
          .map(listing => {
            const postalCode = listing.PostalCode || extractPostalCode(listing.UnparsedAddress);
            return postalCode?.replace(/\s/g, '').toUpperCase();
          })
          .filter(Boolean) as string[];

        console.log(`📮 Extracted postal codes:`, postalCodes);

        if (postalCodes.length > 0) {
          try {
            const geocodeResults = await batchGeocodePostalCodes(
              postalCodes,
              (completed, total, currentBatch) => {
                console.log(`📍 Geocoding progress: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
                console.log(`🔄 Current batch: ${currentBatch.join(', ')}`);
              }
            );

            console.log(`🗺️ Geocoding completed. Results:`, geocodeResults.size, 'postal codes found');

            // Process geocoded results
            console.log(`🔄 Processing ${listingsNeedingGeocode.length} listings against ${geocodeResults.size} geocoded results`);
            listingsNeedingGeocode.forEach((listing, index) => {
              if (!isMounted) return;

              const postalCode = listing.PostalCode || extractPostalCode(listing.UnparsedAddress);
              const cleanedPostalCode = postalCode?.replace(/\s/g, '').toUpperCase();
              console.log(`📍 Processing listing ${index + 1}: postal code "${postalCode}" -> cleaned "${cleanedPostalCode}", has result: ${geocodeResults.has(cleanedPostalCode || '')}`);
              if (cleanedPostalCode && geocodeResults.has(cleanedPostalCode)) {
                const coords = geocodeResults.get(cleanedPostalCode)!;
                const coordsArray: [number, number] = [coords.lat, coords.lon];

                markersData.push({
                  lat: coords.lat,
                  lng: coords.lon,
                  price: listing.ListPrice,
                  address: listing.UnparsedAddress || 'Address not available',
                  listingKey: listing.ListingKey
                });

                listingsWithCoordsData.push({ ...listing, coords: coordsArray });
              }
            });

            // Final update with all results
            if (isMounted) {
              console.log(`🎯 About to set ${markersData.length} markers:`, markersData.slice(0, 2));
              setMarkers([...markersData]);
              setListingsWithCoords([...listingsWithCoordsData]);
              console.log(`✅ Final results: ${markersData.length} markers, ${listingsWithCoordsData.length} listings with coords`);
            }
          } catch (error) {
            console.error('❌ Batch geocoding failed:', error);
          }
        }
      }

      // Set final loading state
      if (isMounted) {
        setIsLoading(false);
      }
    };

    if (listings.length > 0) {
      fetchCoords();
    } else {
      setMarkers([]);
      setListingsWithCoords([]);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [listings]);

  // Handle map bounds change to filter visible listings and fetch new properties
  const handleBoundsChange = useCallback((bounds: { north: number; south: number; east: number; west: number }) => {
    // Filter visible listings from current data
    if (onVisibleListingsChange) {
      const visibleListings = listingsWithCoords.filter(listing => {
        if (!listing.coords) return false;
        const [lat, lng] = listing.coords;
        return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
      });
      console.log(`🗺️ Map bounds changed: ${visibleListings.length}/${listingsWithCoords.length} listings visible`);
      onVisibleListingsChange(visibleListings);
    }

    // Fetch new properties for the bounds (like HouseSigma)
    if (onBoundsChange) {
      onBoundsChange(bounds);
    }
  }, [listingsWithCoords, onVisibleListingsChange, onBoundsChange]);

  const handleMarkerClick = useCallback((listingKey: string) => {
    console.log('🖱️ Marker clicked:', listingKey);
    if (onMarkerClick) {
      onMarkerClick(listingKey);
    }
  }, [onMarkerClick]);

  if (!isClient || isLoading) {
    return (
      <div className={`relative flex flex-col ${className}`} style={style}>
        <div className="flex-shrink-0 mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          🔄 Loading map and geocoding properties...
        </div>
        <div className="flex-1 w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Processing {listings.length} properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col ${className}`} style={style}>
      <div className="flex-shrink-0 mb-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
        ✅ React-Leaflet Map | Properties: {listings.length} | Markers: {markers.length} | With Coords: {listingsWithCoords.length}
      </div>

      <div className="flex-1 w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <MapWrapper
          markers={markers}
          onMarkerClick={handleMarkerClick}
          onBoundsChange={handleBoundsChange}
        />
      </div>
    </div>
  );
}
