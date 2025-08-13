'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { geocodePostalCodeForMap } from '@/utils/geocoding';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Dynamically import SimpleMap to prevent SSR issues
const SimpleMap = dynamic(() => import('@/components/SimpleMap'), {
  ssr: false, // This prevents server-side rendering
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
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

type Listing = {
  UnparsedAddress: string;
  price?: string;
  status?: string;
  [key: string]: any;
};

export default function MapView({ listings }: { listings: Listing[] }) {
  const [markers, setMarkers] = useState<Array<{
    position: [number, number];
    popup: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Fetch coordinates and create markers
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function fetchCoords() {
      try {
        console.log(`Processing ${listings.length} listings for map markers`);
        setDebugInfo(`Processing ${listings.length} listings...`);

        // Process listings in smaller batches to avoid overwhelming the system
        const batchSize = 10;
        const allMarkers: any[] = [];

        for (let i = 0; i < listings.length; i += batchSize) {
          const batch = listings.slice(i, i + batchSize);
          setDebugInfo(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(listings.length/batchSize)} (${i + 1}-${Math.min(i + batchSize, listings.length)} of ${listings.length})`);

          const batchResults = await Promise.allSettled(
            batch.map(async (listing, batchIndex) => {
              try {
                const globalIndex = i + batchIndex;

                const postalCode = extractPostalCode(listing.UnparsedAddress);
                if (!postalCode) {
                  return null;
                }

                const coords = await geocodePostalCodeForMap(postalCode);
                if (coords) {
                  return {
                    position: [coords.lat, coords.lon] as [number, number],
                    popup: `
                      <div>
                        <strong>${listing.UnparsedAddress}</strong><br />
                        Price: ${listing.ListPrice ? `$${listing.ListPrice.toLocaleString()}` : 'N/A'}<br />
                        Status: ${listing.StandardStatus || 'N/A'}<br />
                        Postal Code: ${postalCode}
                      </div>
                    `
                  };
                }
                return null;
              } catch (error) {
                // Silently handle individual listing errors
                return null;
              }
            })
          );

          // Add successful results from this batch
          const batchMarkers = batchResults
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => (result as PromiseFulfilledResult<any>).value);

          allMarkers.push(...batchMarkers);

          // Update UI with current progress
          if (isMounted) {
            setMarkers([...allMarkers]);
            setDebugInfo(`Created ${allMarkers.length} markers so far (processed ${Math.min(i + batchSize, listings.length)}/${listings.length} listings)`);
          }

          // Small delay between batches to prevent overwhelming the system
          if (i + batchSize < listings.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        console.log(`Successfully created ${allMarkers.length} markers out of ${listings.length} listings`);
        setDebugInfo(`Completed: ${allMarkers.length} markers from ${listings.length} listings`);

        if (isMounted) {
          setMarkers(allMarkers);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (listings.length > 0) {
      console.log('Starting to fetch coordinates for listings...');
      fetchCoords();
    } else {
      console.log('No listings to process');
      setMarkers([]);
      setIsLoading(false);
    }

    return () => { isMounted = false; };
  }, [listings]);

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map data...</p>
          {debugInfo && (
            <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {debugInfo && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          Debug: {debugInfo}
        </div>
      )}
      <SimpleMap
        center={[43.7, -79.4]}
        zoom={10}
        height="600px"
        markers={markers}
        className="w-full"
      />
    </div>
  );
}