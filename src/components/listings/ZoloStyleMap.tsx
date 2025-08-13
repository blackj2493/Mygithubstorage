'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { geocodePostalCodeForMap } from '@/utils/geocoding';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
// Import Zolo-style CSS
import '@/styles/zolo-map.css';

// Use the enhanced client-side map component
const ReactLeafletMap = dynamic(() => import('../ReactLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading Zolo-style map...</p>
      </div>
    </div>
  )
});

interface Listing {
  ListingKey: string;
  ListPrice: number;
  UnparsedAddress?: string;
  City?: string;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  images?: Array<{ MediaURL: string }>;
  MlsStatus?: string;
  StandardStatus?: string;
  PostalCode?: string; // Direct from PropTx API
}

interface MarkerData {
  position: [number, number];
  popup?: string;
  price?: number;
  listingKey?: string;
  address?: string;
  onClick?: () => void;
}

interface ZoloStyleMapProps {
  listings: Listing[];
  onVisibleListingsChange?: (listings: Listing[]) => void;
  onMarkerClick?: (listingKey: string) => void;
  onMarkerHover?: (listingKey: string | null) => void;
  hoveredProperty?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export default function ZoloStyleMap({ 
  listings, 
  onVisibleListingsChange,
  onMarkerClick,
  onMarkerHover,
  hoveredProperty,
  className,
  style 
}: ZoloStyleMapProps) {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [listingsWithCoords, setListingsWithCoords] = useState<(Listing & { coords?: [number, number] })[]>([]);

  // Enhanced geocoding using PostalCode field directly
  const geocodeListing = useCallback(async (listing: Listing): Promise<[number, number] | null> => {
    try {
      // First try using the PostalCode field directly from PropTx
      if (listing.PostalCode) {
        const coords = await geocodePostalCodeForMap(listing.PostalCode);
        if (coords) {
          return [coords.lat, coords.lon];
        }
      }

      // Fallback to extracting from UnparsedAddress
      if (listing.UnparsedAddress) {
        const postalCodeMatch = listing.UnparsedAddress.match(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/i);
        if (postalCodeMatch) {
          const postalCode = postalCodeMatch[0].replace(/\s/g, '').toUpperCase();
          const formatted = postalCode.substring(0, 3) + ' ' + postalCode.substring(3);
          const coords = await geocodePostalCodeForMap(formatted);
          if (coords) {
            return [coords.lat, coords.lon];
          }
        }
      }

      return null;
    } catch (error) {
      console.warn(`Failed to geocode listing ${listing.ListingKey}:`, error);
      return null;
    }
  }, []);

  // Fetch coordinates and create markers
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const processListings = async () => {
      if (!listings || listings.length === 0) {
        setMarkers([]);
        setListingsWithCoords([]);
        setIsLoading(false);
        setDebugInfo('No listings to display');
        return;
      }

      setDebugInfo(`Processing ${listings.length} listings...`);

      try {
        const batchSize = 10;
        const processedListings: (Listing & { coords?: [number, number] })[] = [];
        const newMarkers: MarkerData[] = [];

        for (let i = 0; i < listings.length; i += batchSize) {
          if (!isMounted) break;

          const batch = listings.slice(i, i + batchSize);
          setDebugInfo(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(listings.length / batchSize)}...`);

          const batchPromises = batch.map(async (listing) => {
            const coords = await geocodeListing(listing);
            return { ...listing, coords };
          });

          const batchResults = await Promise.all(batchPromises);
          
          batchResults.forEach((listing) => {
            processedListings.push(listing);
            
            if (listing.coords) {
              const marker: MarkerData = {
                position: listing.coords,
                price: listing.ListPrice,
                listingKey: listing.ListingKey,
                address: listing.UnparsedAddress || listing.City || '',
                isHighlighted: hoveredProperty === listing.ListingKey,
                popup: `
                  <div class="zolo-popup" style="min-width: 200px;">
                    ${listing.images?.[0]?.MediaURL ?
                      `<img src="${listing.images[0].MediaURL}" alt="Property" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />`
                      : ''
                    }
                    <div style="padding: 4px 0;">
                      <div style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 4px;">
                        $${listing.ListPrice?.toLocaleString() || 'N/A'}
                      </div>
                      <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">
                        ${listing.BedroomsTotal || 0} bed • ${listing.BathroomsTotalInteger || 0} bath
                      </div>
                      <div style="font-size: 12px; color: #9ca3af;">
                        ${listing.UnparsedAddress || listing.City || 'Address not available'}
                      </div>
                      ${listing.MlsStatus ?
                        `<div style="margin-top: 6px; padding: 2px 6px; background: #16a34a; color: white; border-radius: 12px; font-size: 11px; display: inline-block;">
                          ${listing.MlsStatus}
                        </div>`
                        : ''
                      }
                    </div>
                  </div>
                `,
                onClick: () => {
                  if (onMarkerClick) {
                    onMarkerClick(listing.ListingKey);
                  }
                },
                className: hoveredProperty === listing.ListingKey ? 'marker-highlighted' : ''
              };
              newMarkers.push(marker);
            }
          });

          // Small delay between batches to prevent overwhelming the geocoding service
          if (i + batchSize < listings.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        if (isMounted) {
          setListingsWithCoords(processedListings);
          setMarkers(newMarkers);
          setDebugInfo(`Loaded ${newMarkers.length}/${listings.length} properties on map`);
          setIsLoading(false);
        }

      } catch (error) {
        console.error('Error processing listings:', error);
        if (isMounted) {
          setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };

    processListings();

    return () => {
      isMounted = false;
    };
  }, [listings, geocodeListing, onMarkerClick, hoveredProperty]);

  // Handle map bounds changes for filtering (Zolo-style)
  const handleBoundsChange = useCallback((bounds: { north: number; south: number; east: number; west: number }) => {
    if (!onVisibleListingsChange || !listingsWithCoords) return;

    // Filter properties within the visible map bounds
    const visibleListings = listingsWithCoords.filter(listing => {
      if (!listing.coords) return false;
      const [lat, lon] = listing.coords;
      return lat >= bounds.south && lat <= bounds.north && lon >= bounds.west && lon <= bounds.east;
    });

    // Add a small delay to prevent too frequent updates during map panning
    const timeoutId = setTimeout(() => {
      onVisibleListingsChange(visibleListings);
      console.log(`Map bounds changed: showing ${visibleListings.length}/${listingsWithCoords.length} properties`);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [listingsWithCoords, onVisibleListingsChange]);

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Zolo-style map...</p>
          {debugInfo && (
            <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {debugInfo && (
        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          Debug: {debugInfo}
        </div>
      )}
      <ReactLeafletMap
        center={[45.4215, -75.6972]} // Ottawa center
        zoom={12}
        height="600px"
        markers={markers}
        onBoundsChange={handleBoundsChange}
        className="w-full zolo-style-map"
      />

      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2">
        <div className="text-xs text-gray-600">
          {markers.length} properties
        </div>
      </div>
    </div>
  );
}
