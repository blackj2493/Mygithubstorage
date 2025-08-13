'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { geocodePostalCodeForMap } from '@/utils/geocoding';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Use the new reliable client-side map component
const ReactLeafletMap = dynamic(() => import('../ReactLeafletMap'), {
  ssr: false, // This prevents server-side rendering
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading interactive map...</p>
      </div>
    </div>
  )
});

// Helper to extract Canadian postal code from UnparsedAddress
function extractPostalCode(address: string): string | null {
  // Try multiple patterns for Canadian postal codes
  const patterns = [
    /[A-Z]\d[A-Z][ -]?\d[A-Z]\d/g, // Standard format: A1A 1A1 or A1A-1A1
    /[A-Z]\d[A-Z]\d[A-Z]\d/g,      // No space: A1A1A1
    /[A-Z]\d[A-Z] \d[A-Z]\d/g      // With space: A1A 1A1
  ];

  for (const pattern of patterns) {
    const match = address.match(pattern);
    if (match) {
      // Clean up the postal code - remove spaces and hyphens, then add proper space
      const cleaned = match[0].replace(/[ -]/g, '');
      if (cleaned.length === 6) {
        const formatted = cleaned.substring(0, 3) + ' ' + cleaned.substring(3);
        console.log(`Extracted postal code "${formatted}" from address: ${address}`);
        return formatted;
      }
    }
  }

  console.warn(`Could not extract postal code from address: ${address}`);
  return null;
}

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

interface InteractiveMapViewProps {
  listings: Listing[];
  onVisibleListingsChange?: (visibleListings: Listing[]) => void;
  onMarkerClick?: (listing: Listing) => void;
  className?: string;
  style?: React.CSSProperties;
}

interface MarkerData {
  position: [number, number];
  popup: string;
  price: number;
  listingKey: string;
  address: string;
  onClick: () => void;
}

export default function InteractiveMapView({ 
  listings, 
  onVisibleListingsChange,
  onMarkerClick,
  className,
  style 
}: InteractiveMapViewProps) {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [listingsWithCoords, setListingsWithCoords] = useState<(Listing & { coords?: [number, number] })[]>([]);

  // Fetch coordinates and create markers
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function fetchCoords() {
      try {
        console.log(`Processing ${listings.length} listings for interactive map`);
        setDebugInfo(`Processing ${listings.length} listings...`);

        // Process listings in smaller batches
        const batchSize = 10;
        const allListingsWithCoords: (Listing & { coords?: [number, number] })[] = [];
        const allMarkers: MarkerData[] = [];

        for (let i = 0; i < listings.length; i += batchSize) {
          if (!isMounted) break;
          
          const batch = listings.slice(i, i + batchSize);
          setDebugInfo(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(listings.length/batchSize)}...`);

          const batchPromises = batch.map(async (listing) => {
            try {
              // First try using the PostalCode field directly from PropTx
              if (listing.PostalCode) {
                const coords = await geocodePostalCodeForMap(listing.PostalCode);
                if (coords) {
                  return { ...listing, coords: [coords.lat, coords.lon] as [number, number] };
                }
              }

              // Fallback to extracting from UnparsedAddress
              const address = listing.UnparsedAddress || `${listing.City}`;
              if (!address) return { ...listing, coords: undefined };

              const postalCode = extractPostalCode(address);
              if (!postalCode) {
                console.warn(`Could not extract postal code from: ${address}`);
                return { ...listing, coords: undefined };
              }

              const coords = await geocodePostalCodeForMap(postalCode);
              if (coords) {
                return { ...listing, coords: [coords.lat, coords.lon] as [number, number] };
              }
              return { ...listing, coords: undefined };
            } catch (error) {
              console.warn(`Failed to geocode ${listing.ListingKey}:`, error);
              return { ...listing, coords: undefined };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          
          batchResults.forEach((listingWithCoords) => {
            allListingsWithCoords.push(listingWithCoords);
            
            if (listingWithCoords.coords) {
              const marker: MarkerData = {
                position: listingWithCoords.coords,
                popup: `
                  <div class="p-3 min-w-[200px]">
                    <h3 class="font-semibold text-lg mb-2">${listingWithCoords.ListPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</h3>
                    <p class="text-sm text-gray-600 mb-2">${listingWithCoords.UnparsedAddress || 'Address not available'}</p>
                    <div class="text-sm text-gray-500 mb-3">
                      ${listingWithCoords.BedroomsTotal || 0} beds • ${listingWithCoords.BathroomsTotalInteger || 0} baths
                    </div>
                    <button class="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                `,
                price: listingWithCoords.ListPrice,
                listingKey: listingWithCoords.ListingKey,
                address: listingWithCoords.UnparsedAddress || '',
                onClick: () => {
                  if (onMarkerClick) {
                    onMarkerClick(listingWithCoords);
                  }
                }
              };
              allMarkers.push(marker);
            }
          });

          // Small delay between batches to prevent overwhelming the system
          if (i + batchSize < listings.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        if (isMounted) {
          setListingsWithCoords(allListingsWithCoords);
          setMarkers(allMarkers);
          setDebugInfo(`Completed: ${allMarkers.length} markers from ${listings.length} listings`);
          setIsLoading(false);
        }

      } catch (error) {
        console.error('Error processing listings for map:', error);
        if (isMounted) {
          setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    }

    if (listings.length > 0) {
      fetchCoords();
    } else {
      setMarkers([]);
      setListingsWithCoords([]);
      setDebugInfo('No listings to display');
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [listings, onMarkerClick]);

  // Handle map bounds change to filter visible listings
  const handleBoundsChange = useCallback((bounds: { north: number; south: number; east: number; west: number }) => {
    if (!onVisibleListingsChange) return;

    const visibleListings = listingsWithCoords.filter(listing => {
      if (!listing.coords) return false;
      const [lat, lng] = listing.coords;
      return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
    });

    onVisibleListingsChange(visibleListings);
  }, [listingsWithCoords, onVisibleListingsChange]);

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading interactive map...</p>
          {debugInfo && (
            <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {debugInfo && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          Debug: {debugInfo}
        </div>
      )}
      <ReactLeafletMap
        center={[45.4215, -75.6972]}
        zoom={12}
        height="600px"
        markers={markers}
        onBoundsChange={handleBoundsChange}
        className="w-full"
      />
    </div>
  );
}
