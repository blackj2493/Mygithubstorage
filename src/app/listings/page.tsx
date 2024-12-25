'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SearchBar from '@/components/SearchBar';
import PropertyFilters from '@/components/PropertyFilters';
import { Property } from '@/types/property';

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Check if a search has been performed
  const isSearchActive = Boolean(
    searchParams.get('city') || 
    searchParams.get('address') || 
    searchParams.get('mls')
  );

  const handleFilterChange = (filterParams: string) => {
    // Clear properties immediately
    setProperties([]);
    setPage(1);
    setLoading(true);
    
    // Combine existing search params with filter params
    const currentParams = new URLSearchParams(searchParams.toString());
    const newParams = new URLSearchParams(filterParams);
    
    // Merge the params
    newParams.forEach((value, key) => {
      currentParams.set(key, value);
    });
    
    // Update URL with new params
    window.history.pushState({}, '', `/listings?${currentParams.toString()}`);
    
    // Fetch will happen automatically due to searchParams change
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      params.set('limit', '50');

      console.log('Fetching with params:', params.toString()); // Debug log

      const response = await fetch(`/api/properties/listings?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      console.log('Received properties:', data.listings); // Debug log
      
      if (page === 1) {
        // Replace all properties when it's the first page
        setProperties(data.listings);
      } else {
        // Append properties for subsequent pages
        setProperties(prev => [...prev, ...data.listings]);
      }
      
      setHasMore(data.pagination.hasMore);
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

  // Fetch properties when page or searchParams change
  useEffect(() => {
    fetchProperties();
  }, [page, searchParams]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      {isSearchActive && (
        <PropertyFilters onFilterChange={handleFilterChange} />
      )}

      {error ? (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.ListingKey} property={property} />
            ))}
          </div>

          {hasMore && (
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

          {loading && (
            <div className="mt-8 text-center">
              <LoadingSpinner />
            </div>
          )}
        </>
      )}
    </div>
  );
}

