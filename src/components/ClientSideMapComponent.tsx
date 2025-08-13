'use client';

import { useEffect, useRef, useState } from 'react';

interface MarkerData {
  position: [number, number];
  popup?: string;
  price?: number;
  listingKey?: string;
  address?: string;
  onClick?: () => void;
  className?: string;
  isHighlighted?: boolean;
}

interface ClientSideMapProps {
  center: [number, number];
  zoom?: number;
  height?: string;
  markers?: MarkerData[];
  className?: string;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

export default function ClientSideMapComponent({
  center,
  zoom = 10,
  height = '600px',
  markers = [],
  className = '',
  onBoundsChange
}: ClientSideMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      try {
        console.log('Starting client-side map initialization...');
        
        // Ensure we're in the browser
        if (typeof window === 'undefined') {
          console.log('Not in browser environment, skipping...');
          return;
        }

        // Wait for container to be ready
        if (!mapRef.current) {
          console.log('Map container not ready, waiting...');
          setTimeout(initializeMap, 100);
          return;
        }

        // Load Leaflet dynamically
        const L = await import('leaflet');
        
        // Load CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          console.log('Leaflet CSS loaded');
        }

        // Add Zolo-style marker CSS
        if (!document.querySelector('#zolo-marker-styles')) {
          const style = document.createElement('style');
          style.id = 'zolo-marker-styles';
          style.textContent = `
            .zolo-price-marker {
              z-index: 1000 !important;
            }
            .zolo-price-marker:hover {
              z-index: 1001 !important;
            }
            .zolo-green-dot {
              z-index: 999 !important;
            }
            .zolo-green-dot:hover {
              z-index: 1001 !important;
            }
            .zolo-popup .leaflet-popup-content-wrapper {
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .zolo-popup .leaflet-popup-content {
              margin: 0;
              padding: 0;
            }
            .zolo-popup .leaflet-popup-tip {
              background: white;
            }
            .marker-highlighted .zolo-price-marker > div,
            .marker-highlighted .zolo-green-dot > div {
              transform: scale(1.2) !important;
              box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4) !important;
              z-index: 1002 !important;
            }
          `;
          document.head.appendChild(style);
          console.log('Zolo marker styles loaded');
        }

        // Fix default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        if (!mounted) return;

        console.log('Creating Leaflet map...');
        
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

        if (mounted) {
          setMapReady(true);
          setIsLoading(false);
          console.log('Client-side map initialization completed successfully');
        }

      } catch (err) {
        console.error('Client-side map initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize map');
          setIsLoading(false);
        }
      }
    };

    // Start initialization after a delay
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
  }, [center, zoom, onBoundsChange]);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !mapReady) {
      return;
    }

    const updateMarkers = async () => {
      try {
        const L = await import('leaflet');
        
        console.log(`Updating ${markers.length} markers on client-side map`);

        // Clear existing markers
        markersLayerRef.current.clearLayers();

        // Add new markers
        markers.forEach((markerData, index) => {
          try {
            let marker;

            if (markerData.price) {
              // Create custom price marker (Zolo-style)
              const priceText = markerData.price >= 1000000
                ? `$${(markerData.price / 1000000).toFixed(1)}M`
                : markerData.price >= 1000
                  ? `$${Math.round(markerData.price / 1000)}K`
                  : `$${markerData.price.toLocaleString()}`;

              const isHighlighted = markerData.isHighlighted || markerData.className?.includes('marker-highlighted');
              const highlightStyle = isHighlighted ? 'transform: scale(1.2); box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);' : '';

              const priceIcon = L.divIcon({
                html: `
                  <div style="
                    background: #16a34a;
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
                    cursor: pointer;
                    transition: all 0.2s ease;
                    ${highlightStyle}
                  "
                  onmouseover="this.style.transform='scale(1.1)'; this.style.background='#15803d';"
                  onmouseout="this.style.transform='${isHighlighted ? 'scale(1.2)' : 'scale(1)'}'; this.style.background='#16a34a';">
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
                      border-top: 6px solid #16a34a;
                    "></div>
                  </div>
                `,
                className: `zolo-price-marker ${markerData.className || ''}`,
                iconSize: [60, 30],
                iconAnchor: [30, 36],
                popupAnchor: [0, -36]
              });

              marker = L.marker(markerData.position, { icon: priceIcon });
            } else {
              // Create green dot marker (Zolo-style)
              const dotHighlightStyle = isHighlighted ? 'transform: scale(1.5); box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);' : '';

              const greenDotIcon = L.divIcon({
                html: `
                  <div style="
                    width: 12px;
                    height: 12px;
                    background: #16a34a;
                    border: 2px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    ${dotHighlightStyle}
                  "
                  onmouseover="this.style.transform='scale(1.3)'; this.style.background='#15803d';"
                  onmouseout="this.style.transform='${isHighlighted ? 'scale(1.5)' : 'scale(1)'}'; this.style.background='#16a34a';"></div>
                `,
                className: `zolo-green-dot ${markerData.className || ''}`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
                popupAnchor: [0, -8]
              });

              marker = L.marker(markerData.position, { icon: greenDotIcon });
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

        console.log(`Updated ${markers.length} markers successfully on client-side map`);
      } catch (err) {
        console.error('Error updating markers:', err);
      }
    };

    updateMarkers();
  }, [markers, mapReady]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">Map Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
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
          <p className="text-blue-600">Loading client-side map...</p>
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
          Client-side map ready • Center: {center.join(', ')} • Markers: {markers.length}
        </div>
      )}
    </div>
  );
}
