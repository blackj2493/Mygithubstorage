'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SearchBar from '@/components/SearchBar';
import PropertyFilters from '@/components/PropertyFilters';
import { Property } from '@/types/property';
import InteractiveMapView from '@/components/listings/InteractiveMapView';
import ZoloStyleMap from '@/components/listings/ZoloStyleMap';
import ReactLeafletMap from '@/components/listings/ReactLeafletMap';

import MinimalTestMap from '@/components/listings/MinimalTestMap';
import SmartZoloMap from '@/components/listings/SmartZoloMap';
import TestGeocoding from '@/components/listings/TestGeocoding';

import ZoloFilterBar from '@/components/listings/ZoloFilterBar';
import PropertyOverlay from '@/components/listings/PropertyOverlay';
import {
  calculateDistance,
  reverseGeocode,
  getPostalCodePrefix,
  isSamePostalArea,
  MAP_UPDATE_CONFIG,
  GeographicCoordinates
} from '@/utils/geocoding';

// Add this type if your import fails
type Property = {
  ListingKey: string;
  UnparsedAddress: string;
  price?: string;
  status?: string;
  // ...other fields
};

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [visibleProperties, setVisibleProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userPostalCode, setUserPostalCode] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Map update tracking state
  const [currentMapCenter, setCurrentMapCenter] = useState<GeographicCoordinates | null>(null);
  const [currentPostalCode, setCurrentPostalCode] = useState<string | null>(null);
  const [isUpdatingProperties, setIsUpdatingProperties] = useState(false);
  const [updateNotification, setUpdateNotification] = useState<string | null>(null);

  // Refs for debouncing and tracking
  const boundsUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdatePositionRef = useRef<GeographicCoordinates | null>(null);
  
  // Check if a search has been performed
  const isSearchActive = searchParams && (
    searchParams.get('city') ||
    searchParams.get('address') ||
    searchParams.get('mls')
  );

  // Get user location on component mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        console.log('Attempting to get user location...');

        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        // Get user's location from IP
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });

        clearTimeout(timeoutId);
        console.log('Location API response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Location API response data:', data);

        // Check if we got an error response
        if (data.error) {
          throw new Error(`Location API error: ${data.reason || 'Unknown error'}`);
        }

        // Extract just the first 3 characters of the postal code
        const userPostal = data.postal?.substring(0, 3);
        console.log('Extracted postal code prefix:', userPostal);

        if (!userPostal) {
          throw new Error('No postal code received from location service');
        }

        setUserPostalCode(userPostal);
        console.log('✅ User location detected - postal code prefix:', userPostal);
        setLocationError(null);

      } catch (error) {
        console.error('❌ Error getting user location:', error);
        if (error.name === 'AbortError') {
          setLocationError('Location detection timed out');
        } else {
          setLocationError('Unable to detect your location');
        }
        // Don't set a default postal code - let it remain null to show all properties
        setUserPostalCode(null);
      }
    };

    // Only get location if no search is active
    if (!isSearchActive) {
      console.log('🔍 Starting location detection...');
      getUserLocation();
    } else {
      console.log('⏭️ Skipping location detection - search is active');
    }
  }, [isSearchActive]);

  const handleFilterChange = (filterParams: string) => {
    setProperties([]);
    setPage(1);
    setLoading(true);
    
    // Parse the new filter params
    const newParams = new URLSearchParams(filterParams);
    
    // Start fresh with current search params
    const currentParams = new URLSearchParams(searchParams.toString());
    
    // Map of frontend param names to API param names
    const paramMapping: Record<string, string> = {
      'bedrooms': 'BedroomsTotal',
      'bathrooms': 'BathroomsTotalInteger',
      'maxPrice': 'maxPrice',
      'minPrice': 'minPrice',
      'propertyType': 'PropertyType',
      'propertySubType': 'PropertySubType'
    };
    
    // Remove any existing filter params that might conflict
    Object.values(paramMapping).forEach(param => {
      currentParams.delete(param);
    });
    
    // Add new filter params with correct API naming
    newParams.forEach((value, key) => {
      if (value && value !== 'Any' && value !== '0') {
        const apiKey = paramMapping[key] || key;
        currentParams.set(apiKey, value);
      }
    });
    
    // Update URL with new params
    window.history.pushState({}, '', `/listings?${currentParams.toString()}`);
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Copy all existing params except city
      searchParams.forEach((value, key) => {
        if (key !== 'city') {
          params.set(key, value);
        }
      });

      // Handle city parameter separately
      const city = searchParams.get('city');
      if (city) {
        // First decode the city name in case it's already encoded
        const decodedCity = decodeURIComponent(city);
        // Then format it exactly as expected: "Richmond Hill"
        const formattedCity = decodedCity
          .replace(/\+/g, ' ') // Replace any + with spaces
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        console.log('Formatted city:', formattedCity); // Debug log
        params.set('city', formattedCity);
      }

      // If no search is active and we have user location, add postal code filter
      if (!isSearchActive && userPostalCode) {
        params.set('postalCode', userPostalCode);
        console.log('Filtering properties by user postal code:', userPostalCode);
      }
      // If no search and no location, don't add postal code filter - show all properties

      params.set('page', page.toString());
      // Remove limit to show all properties - add cache buster
      params.set('_t', Date.now().toString());

      const queryString = params.toString();
      console.log('🔍 Frontend query params:', Object.fromEntries(params.entries()));
      console.log('Final query string:', queryString); // Debug log

      const response = await fetch(`/api/properties/listings?${queryString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      console.log('Received properties:', data.listings); // Debug log
      
      // Add debug log to check the total number of properties
      console.log('Total properties:', data.pagination?.total || 'N/A');
      
      if (page === 1) {
        setProperties(data.listings || []);

        // Initialize tracking state for smart map updates
        const currentPostal = params.get('postalCode') || userPostalCode;
        if (currentPostal && !currentPostalCode) {
          setCurrentPostalCode(getPostalCodePrefix(currentPostal) || currentPostal);
          console.log('🎯 Initialized current postal code:', getPostalCodePrefix(currentPostal) || currentPostal);
        }
      } else {
        setProperties(prev => [...prev, ...(data.listings || [])]);
      }

      setHasMore(data.pagination?.hasMore ?? false);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  // Reset page when searchParams change
  useEffect(() => {
    setPage(1);
    setProperties([]); // Clear existing properties
  }, [searchParams]);

  // Fetch properties when page, searchParams, or userPostalCode change
  useEffect(() => {
    // Fetch properties if:
    // 1. Search is active (has search parameters), OR
    // 2. No search is active AND we have a postal code (including default), OR
    // 3. No search is active AND we've attempted location detection (even if failed)
    const shouldFetch = isSearchActive ||
                       (!isSearchActive && userPostalCode) ||
                       (!isSearchActive && locationError);

    if (shouldFetch) {
      fetchProperties();
    }
  }, [page, searchParams, userPostalCode, isSearchActive, locationError]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Handle visible listings change from map viewport
  const handleVisibleListingsChange = (listings: Property[]) => {
    setVisibleProperties(listings);
  };

  // Smart map bounds change handler with area detection
  const handleMapBoundsChange = useCallback(async (bounds: { north: number; south: number; east: number; west: number }) => {
    if (!MAP_UPDATE_CONFIG.enableAreaUpdates) {
      console.log('🚫 Area updates disabled, ignoring bounds change');
      return;
    }

    try {
      // Calculate the center of the new bounds
      const newCenter: GeographicCoordinates = {
        lat: (bounds.north + bounds.south) / 2,
        lng: (bounds.east + bounds.west) / 2
      };

      console.log('🗺️ Map bounds changed, new center:', newCenter);

      // Clear any existing timeout
      if (boundsUpdateTimeoutRef.current) {
        clearTimeout(boundsUpdateTimeoutRef.current);
      }

      // Set up debounced update
      boundsUpdateTimeoutRef.current = setTimeout(async () => {
        try {
          // Check if this is a significant movement
          if (lastUpdatePositionRef.current) {
            const distance = calculateDistance(lastUpdatePositionRef.current, newCenter);
            console.log(`📏 Distance from last update: ${Math.round(distance)}m (threshold: ${MAP_UPDATE_CONFIG.distanceThreshold}m)`);

            if (distance < MAP_UPDATE_CONFIG.distanceThreshold) {
              console.log('📍 Movement too small, skipping update');
              return;
            }
          }

          // Show loading feedback
          if (MAP_UPDATE_CONFIG.showLoadingFeedback) {
            setIsUpdatingProperties(true);
            setUpdateNotification('Checking area for properties...');
          }

          // Reverse geocode the new center to get postal code
          console.log('🔍 Reverse geocoding new center...');
          const geocodeResult = await reverseGeocode(newCenter.lat, newCenter.lng);

          if (!geocodeResult.postalCode) {
            console.log('❌ No postal code found for new location');
            setUpdateNotification(null);
            setIsUpdatingProperties(false);
            return;
          }

          const newPostalCodePrefix = getPostalCodePrefix(geocodeResult.postalCode);
          const currentPrefix = getPostalCodePrefix(currentPostalCode || userPostalCode || '');

          console.log('📮 Postal code comparison:', {
            current: currentPrefix,
            new: newPostalCodePrefix,
            fullNew: geocodeResult.postalCode,
            city: geocodeResult.city
          });

          // Check if we've moved to a different postal area
          if (!isSamePostalArea(currentPrefix, newPostalCodePrefix)) {
            console.log('🏃‍♂️ Moved to new area, fetching properties...');

            if (MAP_UPDATE_CONFIG.showLoadingFeedback) {
              setUpdateNotification(`Loading properties for ${geocodeResult.city || newPostalCodePrefix}...`);
            }

            // Fetch properties for the new area
            await fetchPropertiesForArea(newPostalCodePrefix!, geocodeResult);

            // Update tracking state
            setCurrentPostalCode(newPostalCodePrefix!);
            lastUpdatePositionRef.current = newCenter;
            setCurrentMapCenter(newCenter);
          } else {
            console.log('📍 Still in same postal area, no update needed');
          }

        } catch (error) {
          console.error('❌ Error in smart bounds change handler:', error);
        } finally {
          setIsUpdatingProperties(false);
          // Clear notification after a delay
          setTimeout(() => setUpdateNotification(null), 2000);
        }
      }, MAP_UPDATE_CONFIG.debounceDelay);

    } catch (err) {
      console.error('❌ Error in bounds change handler:', err);
      setIsUpdatingProperties(false);
      setUpdateNotification(null);
    }
  }, [currentPostalCode, userPostalCode]);

  // Fetch properties for a specific area (used by smart bounds change)
  const fetchPropertiesForArea = async (postalCodePrefix: string, geocodeResult: any) => {
    try {
      console.log(`🔄 Fetching properties for area: ${postalCodePrefix}`);

      setLoading(true);
      setError(null);

      // Build API URL for the new area
      const apiUrl = new URL('/api/properties/listings', window.location.origin);
      apiUrl.searchParams.set('postalCode', postalCodePrefix);
      apiUrl.searchParams.set('page', '1');
      // Remove limit to show all properties

      console.log('🌐 Fetching from:', apiUrl.toString());

      const response = await fetch(apiUrl.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Received ${data.listings?.length || 0} properties for ${postalCodePrefix}`);

      // Update properties state
      setProperties(data.listings || []);
      setPage(1); // Reset to first page
      setHasMore(data.pagination?.hasMore ?? false);

      // Show success notification
      const areaName = geocodeResult.city || postalCodePrefix;
      setUpdateNotification(`Found ${data.listings?.length || 0} properties in ${areaName}`);

    } catch (error) {
      console.error('❌ Error fetching properties for area:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch properties for new area');
      setUpdateNotification('Failed to load properties for this area');
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties for specific map bounds (new approach)
  const fetchPropertiesForBounds = async (bounds: { north: number; south: number; east: number; west: number }) => {
    try {
      console.log(`🔄 Fetching properties for bounds:`, bounds);

      setLoading(true);
      setError(null);

      // Build API URL for bounds-based query
      const apiUrl = new URL('/api/properties/listings', window.location.origin);
      apiUrl.searchParams.set('north', bounds.north.toString());
      apiUrl.searchParams.set('south', bounds.south.toString());
      apiUrl.searchParams.set('east', bounds.east.toString());
      apiUrl.searchParams.set('west', bounds.west.toString());
      apiUrl.searchParams.set('page', '1');

      console.log('🌐 Fetching from:', apiUrl.toString());

      const response = await fetch(apiUrl.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Received ${data.listings?.length || 0} properties for map bounds`);

      // Update properties state
      setProperties(data.listings || []);
      setPage(1); // Reset to first page
      setHasMore(data.pagination?.hasMore ?? false);

      // Show success notification
      setUpdateNotification(`Found ${data.listings?.length || 0} properties in this area`);

    } catch (error) {
      console.error('❌ Error fetching properties for bounds:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch properties for map area');
      setUpdateNotification('Failed to load properties for this area');
    } finally {
      setLoading(false);
    }
  };

  // Handle marker click to show property overlay
  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  // Handle marker click by listing key (for ZoloStyleMap)
  const handleMarkerClickByKey = (listingKey: string) => {
    const property = properties.find(p => p.ListingKey === listingKey);
    if (property) {
      setSelectedProperty(property);
      // Scroll to property card
      scrollToPropertyCard(listingKey);
    }
  };

  // Handle marker hover
  const handleMarkerHover = (listingKey: string | null) => {
    setHoveredProperty(listingKey);
  };

  // Handle property card hover
  const handlePropertyCardHover = (listingKey: string | null) => {
    setHoveredProperty(listingKey);
  };

  // Scroll to property card
  const scrollToPropertyCard = (listingKey: string) => {
    const element = document.getElementById(`property-card-${listingKey}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Close property overlay
  const closePropertyOverlay = () => {
    setSelectedProperty(null);
  };

  // Determine which properties to show in the list
  const displayProperties = visibleProperties.length > 0 ? visibleProperties : properties;

  return (
    <div className="flex flex-col">
      {/* Header Section - Dynamic height */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="container mx-auto">
          <div className="mb-4">
            <SearchBar />
          </div>

          {/* Location-based header */}
          {!isSearchActive && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-base font-semibold text-blue-900 mb-1">
                {userPostalCode ? 'Properties Near You' : 'Browse All Properties'}
              </h2>
              <p className="text-xs text-blue-700">
                {userPostalCode
                  ? `Showing properties in your area (postal code: ${userPostalCode}). Use the search above to explore other locations.`
                  : locationError
                    ? 'Unable to detect your location. Showing all available properties. Use the search above to explore specific locations.'
                    : 'Detecting your location... Showing all available properties. Use the search above to explore specific locations.'
                }
              </p>
            </div>
          )}

          {/* Zolo-style Filter Bar */}
          <ZoloFilterBar onFilterChange={(filters) => console.log('Zolo filters:', filters)} />

          {isSearchActive && (
            <PropertyFilters onFilterChange={handleFilterChange} />
          )}
        </div>
      </div>

      {/* Main Content - Uses viewport height minus navbar and footer */}
      {error ? (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 300px)' }}>
          {/* Properties Panel on the left - scrollable content */}
          <div className="w-full lg:w-1/2 flex flex-col bg-white border-r border-gray-200">
            <div className="flex-shrink-0 p-4 border-b border-gray-200">
              <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                Debug: Total={properties.length}, Visible={visibleProperties.length}, Loading={loading.toString()}, Location={userPostalCode || (locationError ? 'failed' : 'detecting...')}
              </div>
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {visibleProperties.length > 0
                    ? `${visibleProperties.length} Properties in View`
                    : `${properties.length} Properties`
                  }
                </h2>
                {visibleProperties.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Showing properties visible on the map. Pan or zoom to see different areas.
                  </p>
                )}
              </div>
            </div>

            {/* Scrollable properties container that takes remaining height */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {displayProperties.map((property) => (
                  <div
                    key={property.ListingKey}
                    id={`property-card-${property.ListingKey}`}
                    className={`transition-all duration-200 ${
                      hoveredProperty === property.ListingKey
                        ? 'ring-2 ring-green-500 ring-opacity-50 shadow-lg'
                        : ''
                    }`}
                    onMouseEnter={() => handlePropertyCardHover(property.ListingKey)}
                    onMouseLeave={() => handlePropertyCardHover(null)}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>

              {hasMore && visibleProperties.length === 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}

              {visibleProperties.length === 0 && displayProperties.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No properties found in this area. Try zooming out or panning the map.</p>
                </div>
              )}

              {loading && (
                <div className="mt-8 text-center">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </div>

          {/* Map on the right - sticky and fixed */}
          <div className="w-full lg:w-1/2 flex flex-col lg:sticky lg:top-0" style={{ height: 'calc(100vh - 140px)' }}>
            {/* Interactive React-Leaflet Map - stretches to bottom */}
            <div className="relative w-full h-full">
              <ReactLeafletMap
                listings={properties}
                onVisibleListingsChange={handleVisibleListingsChange}
                onMarkerClick={handleMarkerClickByKey}
                onBoundsChange={handleMapBoundsChange}
                className="w-full h-full"
              />

              {/* Loading notification overlay */}
              {(isUpdatingProperties || updateNotification) && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 max-w-sm">
                    {isUpdatingProperties && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 flex-shrink-0"></div>
                    )}
                    <span className="text-sm text-gray-700 truncate">
                      {updateNotification || 'Updating properties...'}
                    </span>
                  </div>
                </div>
              )}

              {/* Map update settings toggle (optional) */}
              {MAP_UPDATE_CONFIG.enableAreaUpdates && (
                <div className="absolute top-4 right-4 z-[1000]">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-1">
                    <span className="text-xs text-gray-500">Auto-update: ON</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Property Overlay */}
      <PropertyOverlay
        listing={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={closePropertyOverlay}
      />
    </div>
  );
}

