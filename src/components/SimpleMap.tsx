'use client';

import { useEffect, useRef, useState } from 'react';

interface MarkerData {
  position: [number, number];
  popup?: string;
  price?: number;
  listingKey?: string;
  address?: string;
  onClick?: () => void;
}

interface SimpleMapProps {
  center: [number, number];
  zoom?: number;
  height?: string;
  markers?: MarkerData[];
  className?: string;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

export default function SimpleMap({
  center,
  zoom = 10,
  height = '600px',
  markers = [],
  className = '',
  onBoundsChange
}: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapId = useRef(`map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Initialize map
  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        console.log('Starting map initialization...');

        // Wait for container to be available
        let attempts = 0;
        const maxAttempts = 50;
        while (!mapRef.current && attempts < maxAttempts && isMounted) {
          console.log(`Waiting for map container... attempt ${attempts + 1}/${maxAttempts}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!mapRef.current) {
          console.error('Map container not found after waiting');
          setError('Map container not available');
          setIsLoading(false);
          return;
        }

        if (!isMounted) {
          console.log('Component unmounted during container wait');
          return;
        }

        // Clean up existing map
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) {
            console.warn('Error removing existing map:', e);
          }
          mapInstanceRef.current = null;
        }

        // Clear the container
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }

        // Dynamically import Leaflet
        console.log('Loading Leaflet...');
        const leaflet = await import('leaflet');
        console.log('Leaflet loaded successfully');

        // Fix for default markers
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create new map instance
        console.log('Creating map instance with center:', center, 'zoom:', zoom);
        const map = leaflet.map(mapRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        console.log('Map instance created, adding tile layer...');

        // Add tile layer
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        console.log('Tile layer added successfully');
        
        mapInstanceRef.current = map;
        markersLayerRef.current = leaflet.layerGroup().addTo(map);

        // Add bounds change listener
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

        // Force map to resize after a short delay
        setTimeout(() => {
          if (map && isMounted) {
            map.invalidateSize();
            console.log('Map size invalidated');
          }
        }, 100);

        if (isMounted) {
          setError(null);
          setIsLoading(false);
          console.log('Map initialization completed');
        }

      } catch (error) {
        console.error('Error initializing map:', error);
        if (isMounted) {
          setError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };
    
    // Add a delay to ensure DOM is ready, with timeout
    const timeoutId = setTimeout(() => {
      Promise.race([
        initializeMap(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Map initialization timeout')), 15000)
        )
      ]).catch((error) => {
        console.error('Map initialization failed or timed out:', error);
        if (isMounted) {
          setError(`Map initialization failed: ${error.message}`);
          setIsLoading(false);
        }
      });
    }, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // Create custom price marker icon
  const createPriceMarkerIcon = async (price: number) => {
    const leaflet = await import('leaflet');

    const priceText = price >= 1000000
      ? `$${(price / 1000000).toFixed(1)}M`
      : price >= 1000
        ? `$${Math.round(price / 1000)}K`
        : `$${price.toLocaleString()}`;

    const html = `
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
    `;

    return leaflet.divIcon({
      html: html,
      className: 'custom-price-marker',
      iconSize: [60, 30],
      iconAnchor: [30, 36],
      popupAnchor: [0, -36]
    });
  };

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const updateMarkers = async () => {
      try {
        const leaflet = await import('leaflet');

        // Clear existing markers
        markersLayerRef.current.clearLayers();

        // Add new markers
        for (const markerData of markers) {
          let marker;

          if (markerData.price) {
            // Create custom price marker
            const priceIcon = await createPriceMarkerIcon(markerData.price);
            marker = leaflet.marker(markerData.position, { icon: priceIcon });
          } else {
            // Use default marker
            marker = leaflet.marker(markerData.position);
          }

          if (markerData.popup) {
            marker.bindPopup(markerData.popup);
          }

          if (markerData.onClick) {
            marker.on('click', markerData.onClick);
          }

          markersLayerRef.current.addLayer(marker);
        }

        // Fit map to markers if there are any
        if (markers.length > 0) {
          const group = new leaflet.FeatureGroup(markersLayerRef.current.getLayers());
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }

      } catch (error) {
        console.error('Error updating markers:', error);
      }
    };

    updateMarkers();
  }, [markers]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setIsLoading(true);
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`map-container ${className}`}>
      <div
        ref={mapRef}
        id={mapId.current}
        className="w-full rounded-lg overflow-hidden shadow-lg"
        style={{
          height,
          minHeight: height,
          position: 'relative',
          zIndex: 0
        }}
      />
    </div>
  );
}
