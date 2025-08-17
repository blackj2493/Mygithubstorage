'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SearchBar from '@/components/SearchBar';
import PropertyOverlay from '@/components/listings/PropertyOverlay';
import SponsoredListings from '@/components/listings/SponsoredListings';
import HorizontalFilterBar from '@/components/listings/HorizontalFilterBar';
import { Map, LayoutGrid } from 'lucide-react';

interface Property {
  ListingKey: string;
  ListPrice: number;
  ClosePrice?: number;
  MlsStatus?: string;
  CloseDate?: string;
  UnparsedAddress?: string;
  City?: string;
  BedroomsAboveGrade?: number;
  BedroomsBelowGrade?: number;
  BathroomsTotalInteger?: number;
  ListOfficeName?: string;
  images: Array<{
    MediaURL: string;
    Order: number;
  }>;
  officeLogo?: string;
  PurchaseContractDate?: string;
  OriginalEntryTimestamp?: string;
  PublicRemarks?: string;
  TransactionType?: string;
  [key: string]: any; // For other PropTx fields
}

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userPostalCode, setUserPostalCode] = useState<string | null>(null);

  // Check if a search has been performed
  const isSearchActive = searchParams && (
    searchParams.get('city') ||
    searchParams.get('address') ||
    searchParams.get('mls')
  );

  // Set default postal code since location is already detected on home page
  useEffect(() => {
    if (!isSearchActive && !userPostalCode) {
      // Use a default postal code - the home page should have already detected location
      setUserPostalCode('K2P'); // Use the detected postal code from home page
      console.log('🏠 Using default postal code: K2P');
    }
  }, [isSearchActive, userPostalCode]);

  // Handle filter changes
  const handleFilterChange = (filterParams: string) => {
    // Navigate with new filter params
    router.push(`/listings?${filterParams}`);
  };

  // Fetch properties based on search params or user location
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        // Copy all existing params except city
        searchParams?.forEach((value, key) => {
          if (key !== 'city') {
            params.set(key, value);
          }
        });

        // Handle city parameter separately
        const city = searchParams?.get('city');
        if (city) {
          // First decode the city name in case it's already encoded
          const decodedCity = decodeURIComponent(city);
          console.log('🏙️ Searching for city:', decodedCity);
          params.set('city', decodedCity);
        } else if (!isSearchActive && userPostalCode) {
          // Use user's postal code if no search is active
          params.set('postalCode', userPostalCode);
          console.log('📍 Using user postal code:', userPostalCode);
        } else if (!isSearchActive) {
          // Default fallback
          params.set('postalCode', 'K1A0A6');
          console.log('🏠 Using default postal code: K1A0A6');
        }

        // Always start with 50 properties for optimal performance
        params.set('limit', '50');
        params.set('page', '1');

        console.log('🔍 Fetching properties with params:', params.toString());

        const response = await fetch(`/api/properties/listings?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Fetched properties:', data.listings?.length || 0);
        console.log('📊 Pagination info:', data.pagination);

        setProperties(data.listings || []);
        setHasMore(data.pagination?.hasMore || false);
        setPage(1); // Reset page counter for new search
        
      } catch (err) {
        console.error('❌ Error fetching properties:', err);
        setError('Failed to load properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have search params or user location
    if (isSearchActive || userPostalCode) {
      fetchProperties();
    }
  }, [searchParams, userPostalCode, isSearchActive]);

  // Load more properties
  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('page', (page + 1).toString());
      params.set('limit', '50'); // Ensure we always request 50 more

      const response = await fetch(`/api/properties/listings?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(prev => [...prev, ...(data.listings || [])]);
        setHasMore(data.pagination?.hasMore || false);
        setPage(prev => prev + 1);
        console.log(`📄 Loaded page ${page + 1}, total properties: ${properties.length + (data.listings?.length || 0)}`);
      }
    } catch (err) {
      console.error('Error loading more properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle property selection
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  // Close property overlay
  const closePropertyOverlay = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="flex flex-col">
      {/* Header Section - Dynamic height */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="container mx-auto">
          <div className="mb-4">
            <SearchBar />
          </div>

          {/* Prominent View Toggle */}
          <div className="mb-6 flex justify-center">
            <div className="bg-gray-100 p-1 rounded-xl shadow-sm">
              <div className="flex items-center">
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all bg-white text-blue-600 shadow-sm"
                >
                  <LayoutGrid className="w-5 h-5" />
                  Gallery View
                </button>
                <button
                  onClick={() => {
                    const currentParams = new URLSearchParams(searchParams?.toString() || '');
                    router.push(`/listings/map?${currentParams.toString()}`);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
                >
                  <Map className="w-5 h-5" />
                  Map View
                </button>
              </div>
            </div>
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
                  : 'Showing all available properties. Use the search above to explore specific locations.'
                }
              </p>
            </div>
          )}

          {/* New Horizontal Filter Bar */}
          <HorizontalFilterBar
            onFilterChange={handleFilterChange}
            resultsCount={properties.length}
          />
        </div>
      </div>

      {/* Main Content */}
      {error ? (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        </div>
      ) : loading && properties.length === 0 ? (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading properties...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a moment for large areas like Mississauga</p>
          </div>
        </div>
      ) : (
        <div className="flex" style={{ minHeight: 'calc(100vh - 300px)' }}>
          {/* Left Sidebar - Featured Listings */}
          <div className="w-80 flex-shrink-0 bg-gray-50 border-r border-gray-200">
            <div className="p-4">
              <SponsoredListings />
            </div>
          </div>

          {/* Right Panel - Properties */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-shrink-0 p-4 border-b border-gray-200">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {properties.length} Properties
                </h2>
              </div>
            </div>

            {/* Scrollable properties container */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property, index) => (
                  <div
                    key={`${property.ListingKey}-${index}`}
                    onClick={() => handlePropertyClick(property)}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">
                      Showing {properties.length} properties
                    </p>
                  </div>
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-medium"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading more...
                      </div>
                    ) : (
                      'Show More Properties'
                    )}
                  </button>
                </div>
              )}

              {properties.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No properties found. Try adjusting your search criteria.</p>
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
        currentFilters={searchParams?.toString()}
      />
    </div>
  );
}
