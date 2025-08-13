'use client';

import { useEffect, useRef, useState } from 'react';

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
  PostalCode?: string;
}

interface SimpleZoloMapProps {
  listings: Listing[];
  onVisibleListingsChange?: (listings: Listing[]) => void;
  onMarkerClick?: (listingKey: string) => void;
  onMarkerHover?: (listingKey: string | null) => void;
  hoveredProperty?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export default function SimpleZoloMap({ 
  listings, 
  onVisibleListingsChange,
  onMarkerClick,
  className,
  style 
}: SimpleZoloMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      try {
        setDebugInfo('Starting map initialization...');
        
        // Check if we're in browser
        if (typeof window === 'undefined') {
          setDebugInfo('Not in browser environment');
          return;
        }

        // Check if container exists
        if (!mapRef.current) {
          setDebugInfo('Map container not ready, retrying...');
          // Try a few more times, then give up
          if ((window as any).mapRetryCount === undefined) {
            (window as any).mapRetryCount = 0;
          }
          (window as any).mapRetryCount++;

          if ((window as any).mapRetryCount < 20) {
            setTimeout(initializeMap, 200);
            return;
          } else {
            throw new Error('Map container failed to initialize after multiple attempts');
          }
        }

        setDebugInfo('Loading Leaflet...');

        // Load Leaflet CSS first
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.onload = () => setDebugInfo('Leaflet CSS loaded');
          link.onerror = () => setDebugInfo('Leaflet CSS failed to load');
          document.head.appendChild(link);

          // Wait a bit for CSS to load
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Import Leaflet
        const L = (await import('leaflet')).default;

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
        
        if (!mounted) return;

        setDebugInfo('Creating map instance...');

        // Clear any existing content
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }

        // Create map
        const map = L.map(mapRef.current, {
          center: [45.4215, -75.6972], // Ottawa
          zoom: 12,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        mapInstanceRef.current = map;

        setDebugInfo('Adding tile layer...');

        // Add OpenStreetMap tiles with error handling
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
        });

        tileLayer.on('tileerror', (e: any) => {
          console.warn('Tile loading error:', e);
          setDebugInfo('Some map tiles failed to load - network issue?');
        });

        tileLayer.on('tileload', () => {
          setDebugInfo('Map tiles loading successfully');
        });

        tileLayer.addTo(map);

        setDebugInfo('Map loaded successfully!');

        // Add a test marker
        const testMarker = L.circleMarker([45.4215, -75.6972], {
          radius: 8,
          fillColor: '#16a34a',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);

        testMarker.bindPopup('Test marker - Map is working!');

        if (mounted) {
          setIsLoading(false);
          setError(null);
        }

      } catch (err) {
        console.error('Map initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize map');
          setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };

    // Start initialization with a small delay
    const timer = setTimeout(initializeMap, 200);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
      }
    };
  }, []);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded-lg p-8 ${className}`} style={style}>
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-red-500 mb-4">Debug: {debugInfo}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-green-50 border border-green-200 rounded-lg p-8 ${className}`} style={style}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Loading Zolo-Style Map</h3>
          <p className="text-green-600 mb-2">Connecting to OpenStreetMap...</p>
          <p className="text-sm text-green-500">Debug: {debugInfo}</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>• Checking browser environment</p>
            <p>• Loading Leaflet library</p>
            <p>• Connecting to OpenStreetMap tiles</p>
            <p>• Initializing map controls</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
        Debug: {debugInfo} | Listings: {listings.length}
      </div>
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200"
        style={{
          height: '600px',
          minHeight: '600px',
          backgroundColor: '#f0f0f0'
        }}
      />
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2">
        <div className="text-xs text-gray-600">
          Test Map Ready
        </div>
      </div>
    </div>
  );
}
