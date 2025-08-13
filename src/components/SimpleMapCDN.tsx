'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Head from 'next/head';

interface MarkerData {
  position: [number, number];
  popup?: string;
  price?: number;
  listingKey?: string;
  address?: string;
  onClick?: () => void;
}

interface SimpleMapCDNProps {
  center: [number, number];
  zoom?: number;
  height?: string;
  markers?: MarkerData[];
  className?: string;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

export default function SimpleMapCDN({
  center,
  zoom = 10,
  height = '600px',
  markers = [],
  className = '',
  onBoundsChange
}: SimpleMapCDNProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapId = useRef(`map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Debug effect to check if component is mounting
  useEffect(() => {
    console.log('SimpleMapCDN component mounted');
    console.log('Map ref current:', mapRef.current);
    console.log('Center:', center, 'Zoom:', zoom);
    return () => {
      console.log('SimpleMapCDN component unmounting');
    };
  }, []);

  // Load Leaflet from CDN
  useLayoutEffect(() => {
    const loadLeafletCDN = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if Leaflet is already loaded
        if (typeof window !== 'undefined' && (window as any).L) {
          resolve();
          return;
        }

        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        cssLink.crossOrigin = '';
        document.head.appendChild(cssLink);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => {
          console.log('Leaflet CDN loaded successfully');
          resolve();
        };
        script.onerror = () => {
          console.error('Failed to load Leaflet CDN');
          reject(new Error('Failed to load Leaflet CDN'));
        };
        document.head.appendChild(script);
      });
    };

    let isMounted = true;
    
    const initializeMap = async () => {
      try {
        console.log('Starting CDN map initialization...');

        // Wait for the DOM element to be available
        let attempts = 0;
        while (!mapRef.current && attempts < 10 && isMounted) {
          console.log(`Waiting for map container... attempt ${attempts + 1}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!isMounted) {
          console.log('Component unmounted during initialization');
          return;
        }

        if (!mapRef.current) {
          console.error('Map container not found after waiting');
          throw new Error('Map container not available');
        }

        console.log('Map container found, proceeding with initialization');
        
        // Load Leaflet from CDN
        await loadLeafletCDN();
        
        if (!isMounted) return;
        
        const L = (window as any).L;
        if (!L) {
          throw new Error('Leaflet not available after CDN load');
        }
        
        console.log('Leaflet available, creating map...');
        
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
        
        // Create new map instance
        const map = L.map(mapRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: true,
          scrollWheelZoom: true,
        });
        
        console.log('Map instance created, adding tile layer...');
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        mapInstanceRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);
        
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
          console.log('CDN Map initialization completed successfully');
        }
        
      } catch (error) {
        console.error('Error initializing CDN map:', error);
        if (isMounted) {
          setError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };
    
    // Add a delay to ensure DOM is ready and component is mounted
    const timeoutId = setTimeout(initializeMap, 300);
    
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
  const createPriceMarkerIcon = (price: number) => {
    const L = (window as any).L;
    if (!L) return null;
    
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
    
    return L.divIcon({
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
    
    const updateMarkers = () => {
      try {
        const L = (window as any).L;
        if (!L) return;
        
        console.log('Updating markers:', markers.length);
        
        // Clear existing markers
        markersLayerRef.current.clearLayers();
        
        // Add new markers
        for (const markerData of markers) {
          let marker;
          
          if (markerData.price) {
            // Create custom price marker
            const priceIcon = createPriceMarkerIcon(markerData.price);
            if (priceIcon) {
              marker = L.marker(markerData.position, { icon: priceIcon });
            } else {
              marker = L.marker(markerData.position);
            }
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
        }
        
        // Fit map to markers if there are any
        if (markers.length > 0) {
          const group = new L.FeatureGroup(markersLayerRef.current.getLayers());
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }
        
        console.log('Markers updated successfully');
        
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
