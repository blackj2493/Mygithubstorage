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

interface DirectZoloMapProps {
  listings: Listing[];
  onVisibleListingsChange?: (listings: Listing[]) => void;
  onMarkerClick?: (listingKey: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function DirectZoloMap({ 
  listings, 
  onVisibleListingsChange,
  onMarkerClick,
  className,
  style 
}: DirectZoloMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Starting...');

  useEffect(() => {
    console.log('DirectZoloMap useEffect called');
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 50; // Maximum 5 seconds of retries

    const initMap = async () => {
      try {
        console.log('DirectZoloMap initMap called, mounted:', mounted, 'mapRef.current:', !!mapRef.current, 'retry:', retryCount);
        setDebugInfo(`Checking environment... (attempt ${retryCount + 1})`);

        if (typeof window === 'undefined') {
          setDebugInfo('Window not available (SSR)');
          return;
        }

        // Check if map is already initialized
        if (mapInstanceRef.current) {
          console.log('Map already initialized, skipping...');
          setDebugInfo('Map already initialized');
          setIsLoading(false);
          return;
        }

        const container = mapRef.current || mapContainer;
        if (!container) {
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error('DirectZoloMap: Failed to find map container after maximum retries');
            setDebugInfo('❌ Failed to find map container after maximum retries');
            return;
          }

          console.log(`Map container not found, retrying in 100ms... (${retryCount}/${maxRetries})`);
          setDebugInfo(`Map container not found, retrying... (${retryCount}/${maxRetries})`);
          if (mounted) {
            setTimeout(initMap, 100);
          }
          return;
        }

        console.log('Container found, loading CSS...');
        setDebugInfo('Container found, loading CSS...');

        setDebugInfo('Loading Leaflet CSS...');
        
        // Ensure Leaflet CSS is loaded
        const existingLink = document.querySelector('link[href*="leaflet.css"]');
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          
          // Wait for CSS to load
          await new Promise((resolve) => {
            link.onload = resolve;
            link.onerror = resolve; // Continue even if CSS fails
            setTimeout(resolve, 1000); // Timeout after 1 second
          });
        }

        setDebugInfo('Importing Leaflet...');
        
        // Dynamic import of Leaflet
        const leafletModule = await import('leaflet');
        const L = leafletModule.default || leafletModule;

        if (!mounted || !mapRef.current) return;

        setDebugInfo('Initializing map...');

        // Clear container
        container.innerHTML = '';
        container.style.height = '600px';

        // Create map with explicit options
        const mapInstance = L.map(container, {
          center: [45.4215, -75.6972],
          zoom: 11,
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true,
          tap: true,
          trackResize: true
        });

        // Store map instance
        mapInstanceRef.current = mapInstance;

        setDebugInfo('Adding tiles...');

        // Add tile layer
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
          minZoom: 3,
          tileSize: 256,
          zoomOffset: 0,
          crossOrigin: true
        });

        tileLayer.addTo(mapInstance);

        setDebugInfo('Adding test marker...');

        // Add a test marker to confirm map is working
        const testMarker = L.marker([45.4215, -75.6972]).addTo(mapInstance);
        testMarker.bindPopup('<b>Test Marker</b><br>Map is working!');

        // Add some sample green dot markers
        const greenIcon = L.divIcon({
          html: '<div style="width: 12px; height: 12px; background: #16a34a; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          className: 'custom-green-dot',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        // Add some sample markers around Ottawa
        const sampleLocations = [
          [45.4215, -75.6972],
          [45.4315, -75.6872],
          [45.4115, -75.7072],
          [45.4415, -75.6772]
        ];

        sampleLocations.forEach((coords, index) => {
          const marker = L.marker(coords as [number, number], { icon: greenIcon }).addTo(mapInstance);
          marker.bindPopup(`<b>Sample Property ${index + 1}</b><br>Green dot marker test`);
        });

        if (mounted) {
          setDebugInfo('Map loaded successfully!');
          setIsLoading(false);
          setError(null);
        }

      } catch (err) {
        console.error('Direct map error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setDebugInfo(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };

    // Start initialization with a small delay to ensure DOM is ready
    setTimeout(initMap, 50);

    return () => {
      mounted = false;
      // Clean up map instance
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
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-8 ${className}`} style={style}>
        <div className="text-center">
          <div className="text-red-600 mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Map Error</h3>
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-red-500">Debug: {debugInfo}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-8 ${className}`} style={style}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Direct Map Loading</h3>
          <p className="text-blue-600">Status: {debugInfo}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
        ✅ {debugInfo} | Properties: {listings.length}
      </div>
      <div
        ref={(el) => {
          mapRef.current = el;
          setMapContainer(el);
        }}
        className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-gray-100"
        style={{ height: '600px' }}
      />
    </div>
  );
}
