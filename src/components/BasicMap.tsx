'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface MarkerData {
  position: [number, number];
  popup?: string;
  price?: number;
  listingKey?: string;
  address?: string;
  onClick?: () => void;
}

interface BasicMapProps {
  center: [number, number];
  zoom?: number;
  height?: string;
  markers?: MarkerData[];
  className?: string;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

export default function BasicMap({
  center,
  zoom = 10,
  height = '600px',
  markers = [],
  className = '',
  onBoundsChange
}: BasicMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const initializationRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Load Leaflet resources once
  const loadLeafletResources = useCallback(async () => {
    // Load CSS if not already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
      console.log('Leaflet CSS loaded');
    }

    // Load JS if not already loaded
    if (!(window as any).L) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => {
          console.log('Leaflet JS loaded');
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Leaflet'));
        document.head.appendChild(script);
      });
    }
  }, []);

  // Initialize map once when container is ready
  useEffect(() => {
    mountedRef.current = true;

    const initializeMap = async () => {
      // Prevent multiple initializations
      if (initializationRef.current) {
        console.log('Map already initializing, skipping...');
        return;
      }

      // Wait for container to be available in DOM
      let attempts = 0;
      const maxAttempts = 50;
      while (!mapRef.current && attempts < maxAttempts && mountedRef.current) {
        console.log(`Waiting for map container... attempt ${attempts + 1}/${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!mapRef.current) {
        console.error('Map container not found after waiting');
        if (mountedRef.current) {
          setError('Map container not found');
          setIsLoading(false);
        }
        return;
      }

      if (!mountedRef.current) {
        console.log('Component unmounted during container wait');
        return;
      }

      initializationRef.current = true;
      console.log('Starting map initialization with container ready...');
      setIsLoading(true);
      setError(null);

      try {
        // Load Leaflet resources
        await loadLeafletResources();

        console.log('Creating Leaflet map...');
        const L = (window as any).L;

        // Clean up existing map if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Clear container
        mapRef.current.innerHTML = '';

        // Create map
        const map = L.map(mapRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        });

        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Create markers layer group
        markersLayerRef.current = L.layerGroup().addTo(map);

        // Set up bounds change handler
        if (onBoundsChange) {
          map.on('moveend', () => {
            const bounds = map.getBounds();
            onBoundsChange({
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest()
            });
          });
        }

        if (mountedRef.current) {
          setMapReady(true);
          setIsLoading(false);
          console.log('Map initialization completed successfully');
        }

      } catch (err) {
        console.error('Map initialization error:', err);
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to initialize map');
          setIsLoading(false);
        }
        initializationRef.current = false;
      }
    };

    // Start initialization after a longer delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 500);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      console.log('Map component cleanup');
    };
  }, []); // Empty dependency array - initialize only once
  // Update markers when they change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !mapReady) {
      return;
    }

    console.log(`Updating ${markers.length} markers on existing map`);
    const L = (window as any).L;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add new markers
    markers.forEach((markerData, index) => {
      try {
        let marker;

        if (markerData.price) {
          // Create custom price marker
          const priceText = markerData.price >= 1000000
            ? `$${(markerData.price / 1000000).toFixed(1)}M`
            : markerData.price >= 1000
              ? `$${Math.round(markerData.price / 1000)}K`
              : `$${markerData.price.toLocaleString()}`;

          const priceIcon = L.divIcon({
            html: `
              <div style="
                background: #2563eb;
                color: white;
                padding: 4px 8px;
                border-radius: 16px;
                font-size: 12px;
                font-weight: 600;
                white-space: nowrap;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                border: 2px solid white;
                position: relative;
                font-family: system-ui, -apple-system, sans-serif;
              ">
                ${priceText}
                <div style="
                  position: absolute;
                  bottom: -6px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 0;
                  height: 0;
                  border-left: 6px solid transparent;
                  border-right: 6px solid transparent;
                  border-top: 6px solid #2563eb;
                "></div>
              </div>
            `,
            className: 'custom-price-marker',
            iconSize: [60, 30],
            iconAnchor: [30, 36],
            popupAnchor: [0, -36]
          });

          marker = L.marker(markerData.position, { icon: priceIcon });
        } else {
          // Use default marker
          marker = L.marker(markerData.position);
        }

        if (markerData.popup) {
          marker.bindPopup(markerData.popup);
        }

        if (markerData.onClick) {
          marker.on('click', markerData.onClick);
        }

        markersLayerRef.current.addLayer(marker);
      } catch (markerError) {
        console.error(`Error adding marker ${index}:`, markerError);
      }
    });

    console.log(`Updated ${markers.length} markers successfully`);
  }, [markers, mapReady]);

  console.log('BasicMap render - isLoading:', isLoading, 'error:', error, 'mapReady:', mapReady);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">Map Error: {error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              initializationRef.current = false;
              // Trigger re-initialization
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-blue-600">Loading map...</p>
          <p className="text-xs text-gray-500 mt-1">Center: {center.join(', ')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`map-container ${className}`}>
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200"
        style={{
          height,
          minHeight: height,
          backgroundColor: '#f0f0f0'
        }}
      />
      {mapReady && (
        <div className="mt-2 text-xs text-gray-500">
          Map ready • Center: {center.join(', ')} • Markers: {markers.length}
        </div>
      )}
    </div>
  );
}
