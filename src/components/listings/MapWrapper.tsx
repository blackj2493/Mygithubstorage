'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MarkerData {
  lat: number;
  lng: number;
  price: number;
  address: string;
  listingKey?: string;
  imageUrl?: string;
  bedrooms?: number;
  bathrooms?: number;
}

interface ClusterData {
  lat: number;
  lng: number;
  count: number;
  properties: MarkerData[];
}

interface MapWrapperProps {
  markers: MarkerData[];
  onMarkerClick?: (listingKey: string) => void;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  currentFilters?: string; // Current filter parameters to preserve
}

export default function MapWrapper({ markers, onMarkerClick, onBoundsChange, currentFilters }: MapWrapperProps) {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(11);

  // Store current map view to preserve it across re-renders
  const currentViewRef = useRef<{ center: [number, number]; zoom: number }>({
    center: [45.4215, -75.6972], // Ottawa center as default
    zoom: 11
  });

  // Navigation function for property clicks
  const navigateToListing = (listingKey: string) => {
    if (listingKey) {
      const url = currentFilters
        ? `/listings/${listingKey}?returnTo=${encodeURIComponent(currentFilters)}`
        : `/listings/${listingKey}`;
      router.push(url);
    }
  };

  // Clean up function
  const cleanupMap = () => {
    try {
      // Remove all markers first
      markersRef.current.forEach(marker => {
        try {
          if (marker && marker.remove) {
            marker.remove();
          }
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
      markersRef.current = [];

      // Remove map
      if (mapRef.current) {
        mapRef.current.off(); // Remove all event listeners
        mapRef.current.remove();
        mapRef.current = null;
      }
    } catch (e) {
      console.warn('Error during cleanup:', e);
    }
  };

  useEffect(() => {
    let map: any = null;
    let L: any = null;
    let isMounted = true;

    const initMap = async () => {
      try {
        setError(null);
        setIsMapReady(false);

        // Only import Leaflet on client side
        if (typeof window === 'undefined') return;

        // Dynamic import of Leaflet
        L = (await import('leaflet')).default;

        // Import CSS
        await import('leaflet/dist/leaflet.css');

        if (!isMounted || !containerRef.current) return;

        // Clean up any existing map
        cleanupMap();

        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 200));

        if (!isMounted || !containerRef.current) return;

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create new map with preserved view or default options
        map = L.map(containerRef.current, {
          center: currentViewRef.current.center,
          zoom: currentViewRef.current.zoom,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        });

        if (!isMounted) {
          map.remove();
          return;
        }

        mapRef.current = map;

        // Add tile layer
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        });

        tileLayer.addTo(map);

        // Wait for map to be fully ready
        map.whenReady(() => {
          if (!isMounted) return;

          try {
            setIsMapReady(true);

            // Make navigation function globally available for popup clicks
            (window as any).navigateToListing = navigateToListing;

            // Add bounds change listener for synchronization
            if (onBoundsChange) {
              const handleBoundsChange = () => {
                try {
                  if (!map || !isMounted) return;

                  // Additional safety checks
                  const container = map.getContainer();
                  if (!container || !container.offsetWidth || !container.offsetHeight) {
                    return;
                  }

                  const size = map.getSize();
                  if (!size || size.x === 0 || size.y === 0) {
                    return;
                  }

                  const bounds = map.getBounds();
                  if (bounds && bounds.isValid()) {
                    onBoundsChange({
                      north: bounds.getNorth(),
                      south: bounds.getSouth(),
                      east: bounds.getEast(),
                      west: bounds.getWest()
                    });
                  }
                } catch (error) {
                  console.warn('Error getting map bounds:', error);
                }
              };

              // Listen for map movement events with debouncing
              let boundsTimeout: NodeJS.Timeout;
              const debouncedBoundsChange = () => {
                clearTimeout(boundsTimeout);
                boundsTimeout = setTimeout(handleBoundsChange, 200); // Reduced from 300ms for more responsive updates
              };

              // Save current view on map movement
              const saveCurrentView = () => {
                if (map && isMounted) {
                  const center = map.getCenter();
                  const zoom = map.getZoom();
                  currentViewRef.current = {
                    center: [center.lat, center.lng],
                    zoom: zoom
                  };
                }
              };

              map.on('moveend', () => {
                saveCurrentView();
                debouncedBoundsChange();
              });

              map.on('zoomend', () => {
                saveCurrentView();
                debouncedBoundsChange();
                // Update zoom level to trigger re-clustering
                const newZoom = map.getZoom();
                setZoomLevel(newZoom);
              });

              // Initial bounds update after a delay
              setTimeout(handleBoundsChange, 1000);
            }

          } catch (error) {
            console.error('Error setting up map events:', error);
            setError('Failed to initialize map events');
          }
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to initialize map');
      }
    };

    // Initialize map
    initMap();

    return () => {
      isMounted = false;
      cleanupMap();
    };
  }, []); // Only run once on mount

  // Clustering function to group nearby markers
  const clusterMarkers = (markers: MarkerData[], zoomLevel: number): (MarkerData | ClusterData)[] => {
    if (!markers.length) return [];

    // Distance threshold based on zoom level (smaller threshold = more clustering)
    const threshold = Math.max(0.001, 0.01 / Math.pow(2, zoomLevel - 10));
    const clusters: ClusterData[] = [];
    const processed = new Set<number>();

    markers.forEach((marker, index) => {
      if (processed.has(index)) return;

      const nearby: MarkerData[] = [marker];
      processed.add(index);

      // Find nearby markers
      markers.forEach((otherMarker, otherIndex) => {
        if (processed.has(otherIndex) || index === otherIndex) return;

        const distance = Math.sqrt(
          Math.pow(marker.lat - otherMarker.lat, 2) +
          Math.pow(marker.lng - otherMarker.lng, 2)
        );

        if (distance < threshold) {
          nearby.push(otherMarker);
          processed.add(otherIndex);
        }
      });

      if (nearby.length > 1) {
        // Create cluster
        const avgLat = nearby.reduce((sum, m) => sum + m.lat, 0) / nearby.length;
        const avgLng = nearby.reduce((sum, m) => sum + m.lng, 0) / nearby.length;

        clusters.push({
          lat: avgLat,
          lng: avgLng,
          count: nearby.length,
          properties: nearby
        });
      } else {
        // Single marker
        clusters.push(marker);
      }
    });

    return clusters;
  };

  // Handle markers separately with clustering
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    console.log(`🗺️ MapWrapper: Processing ${markers.length} markers`);

    const map = mapRef.current;
    let L: any = null;

    const addMarkers = async () => {
      try {
        // Import Leaflet again for markers
        L = (await import('leaflet')).default;

        // Clear existing markers
        console.log(`🧹 Clearing ${markersRef.current.length} existing markers`);
        markersRef.current.forEach(marker => {
          try {
            if (marker && marker.remove) {
              marker.remove();
            }
          } catch (e) {
            console.warn('Error removing marker:', e);
          }
        });
        markersRef.current = [];

        // If no markers to add, just return
        if (!markers.length) {
          console.log('📍 No markers to add');
          return;
        }

        // Get current zoom level for clustering
        const zoomLevel = map.getZoom();
        const clusteredMarkers = clusterMarkers(markers, zoomLevel);
        console.log(`🎯 Adding ${clusteredMarkers.length} clustered markers (from ${markers.length} original markers)`);

        // Add clustered markers
        clusteredMarkers.forEach((item) => {
          try {
            if ('count' in item) {
              // This is a cluster
              const cluster = item as ClusterData;

              // Create cluster marker with count
              const clusterIcon = L.divIcon({
                html: `
                  <div style="
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 12px;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    cursor: pointer;
                  ">
                    ${cluster.count}
                  </div>
                `,
                className: 'cluster-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              });

              const marker = L.marker([cluster.lat, cluster.lng], { icon: clusterIcon }).addTo(map);
              markersRef.current.push(marker);

              // Helper function to get image URL
              const getImageUrl = (imageUrl: string) => {
                if (!imageUrl || imageUrl === '/placeholder-property.jpg') return '/placeholder-property.jpg';
                return imageUrl.startsWith('https://') ? imageUrl : `https://${imageUrl}`;
              };

              // Create popup with property cards in cluster (HouseSigma style)
              const popupContent = `
                <div style="max-width: 500px; min-width: 450px;">
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #e5e7eb;
                  ">
                    <div style="font-weight: bold; color: #1f2937; font-size: 18px;">
                      ${cluster.count} Listings in Selected Area
                    </div>
                    <div style="
                      color: #6b7280;
                      font-size: 14px;
                      padding: 4px;
                      cursor: pointer;
                    " onclick="document.querySelector('.leaflet-popup-close-button').click();">
                      ✕
                    </div>
                  </div>
                  <div style="max-height: 400px; overflow-y: auto; padding-right: 6px;">
                    ${cluster.properties.map((prop, idx) => `
                      <div style="
                        background: white;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        margin-bottom: ${idx < cluster.properties.length - 1 ? '8px' : '0'};
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        overflow: hidden;
                      "
                      onmouseover="
                        this.style.backgroundColor='#f9fafb';
                        this.style.borderColor='#16a34a';
                        this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)';
                        this.style.transform='translateY(-1px)';
                      "
                      onmouseout="
                        this.style.backgroundColor='white';
                        this.style.borderColor='#e5e7eb';
                        this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)';
                        this.style.transform='translateY(0)';
                      "
                      onclick="
                        console.log('Property selected:', ${JSON.stringify(prop).replace(/"/g, '&quot;')});
                        window.navigateToListing && window.navigateToListing('${prop.listingKey}');
                      ">
                        <div style="display: flex; gap: 15px;">
                          <!-- Property Image -->
                          <div style="
                            width: 140px;
                            height: 105px;
                            flex-shrink: 0;
                            position: relative;
                            background: #f3f4f6;
                            border-radius: 6px;
                            overflow: hidden;
                            margin: 8px;
                          ">
                            <img
                              src="${getImageUrl(prop.imageUrl || '/placeholder-property.jpg')}"
                              alt="Property image"
                              style="
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                border-radius: 6px;
                              "
                              onerror="this.src='/placeholder-property.jpg'"
                            />
                            <div style="
                              position: absolute;
                              top: 4px;
                              left: 4px;
                              background: #16a34a;
                              color: white;
                              padding: 2px 6px;
                              border-radius: 4px;
                              font-size: 9px;
                              font-weight: 600;
                              text-transform: uppercase;
                            ">
                              FOR SALE
                            </div>
                          </div>

                          <!-- Property Details -->
                          <div style="
                            flex: 1;
                            padding: 8px 8px 8px 0;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                          ">
                            <div>
                              <div style="
                                font-weight: bold;
                                color: #16a34a;
                                font-size: 20px;
                                margin-bottom: 6px;
                              ">
                                $${prop.price.toLocaleString()}
                              </div>
                              <div style="
                                color: #374151;
                                font-size: 14px;
                                line-height: 1.4;
                                margin-bottom: 8px;
                              ">
                                ${prop.address}
                              </div>
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center;">
                              <div style="display: flex; gap: 15px; color: #6b7280; font-size: 13px; align-items: center;">
                                ${prop.bedrooms ? `<span style="display: flex; align-items: center; gap: 4px;"><span>🛏️</span><span>${prop.bedrooms} bed${prop.bedrooms > 1 ? 's' : ''}</span></span>` : ''}
                                ${prop.bathrooms ? `<span style="display: flex; align-items: center; gap: 4px;"><span>🚿</span><span>${prop.bathrooms} bath${prop.bathrooms > 1 ? 's' : ''}</span></span>` : ''}
                              </div>
                              <div style="
                                color: #16a34a;
                                font-size: 13px;
                                font-weight: 500;
                                text-decoration: underline;
                                cursor: pointer;
                              ">
                                View Details
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;

              marker.bindPopup(popupContent);

              marker.on('click', () => {
                console.log('Cluster clicked:', cluster);
                // Set up global function for property selection
                (window as any).selectProperty = (listingKey: string) => {
                  onMarkerClick?.(listingKey);
                  map.closePopup();
                };
              });

            } else {
              // This is a single marker
              const markerData = item as MarkerData;
              const marker = L.marker([markerData.lat, markerData.lng]).addTo(map);
              markersRef.current.push(marker);

              marker.bindPopup(`
                <div style="text-align: center;">
                  <div style="font-weight: bold; font-size: 16px; color: #16a34a;">
                    $${markerData.price.toLocaleString()}
                  </div>
                  <div style="font-size: 12px; color: #666;">
                    ${markerData.address}
                  </div>
                </div>
              `);

              marker.on('click', () => {
                console.log('Single marker clicked:', markerData);
                onMarkerClick?.(markerData.listingKey || markerData.address);
              });
            }
          } catch (error) {
            console.warn('Error adding marker:', error, item);
          }
        });
      } catch (error) {
        console.error('Error adding markers:', error);
      }
    };

    addMarkers();
  }, [markers, onMarkerClick, isMapReady, zoomLevel]);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-red-50 border border-red-200 rounded">
        <div className="text-center text-red-600">
          <p className="font-medium">Map Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        width: '100%',
        minHeight: '400px'
      }}
      className="leaflet-container"
    />
  );
}
