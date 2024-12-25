'use client';

import { useState, useCallback, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PropertyFilters from '@/components/PropertyFilters';

export default function ListingsPage() {
  const [properties, setProperties] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [paginationParams, setPaginationParams] = useState({
    orderBy: 'ModificationTimestamp desc,ListingKey desc',
    filter: "StandardStatus eq 'Active'",
    top: '10'
  });
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        $orderby: paginationParams.orderBy,
        $filter: paginationParams.filter,
      });

      const response = await fetch(`/api/properties/listings?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch properties');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.listings && Array.isArray(data.listings)) {
        setProperties(new Map(
          data.listings.map((property: any) => [property.ListingKey, property])
        ));

        setTotalPages(data.pagination.totalPages);
        setHasMore(data.pagination.hasMore);
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      console.error('Error in fetchProperties:', err);
      setError(err.message || 'An error occurred while fetching properties');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage, paginationParams]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateFilters = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setProperties(new Map());
    setHasMore(true);
    setCurrentPage(1);
    
    const filterParts = [];
    if (newFilters.priceMin) filterParts.push(`ListPrice ge ${parseFloat(newFilters.priceMin)}`);
    if (newFilters.priceMax) filterParts.push(`ListPrice le ${parseFloat(newFilters.priceMax)}`);
    if (newFilters.propertyType) filterParts.push(`PropertyType eq '${newFilters.propertyType}'`);
    
    const filterString = filterParts.length > 0 
      ? `StandardStatus eq 'Active' and ${filterParts.join(' and ')}` 
      : `StandardStatus eq 'Active'`;

    setPaginationParams({
      orderBy: 'ModificationTimestamp desc,ListingKey desc',
      filter: filterString,
      top: '50'
    });
  }, []);

  const propertyArray = Array.from(properties.values());

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyFilters onFilterChange={updateFilters} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {propertyArray.map((property) => (
          <PropertyCard 
            key={property.ListingKey} 
            property={property} 
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && propertyArray.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-600">No properties found</p>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-4 py-2 rounded ${
              currentPage <= 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700 text-white'
            }`}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-4 py-2 rounded ${
              currentPage >= totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700 text-white'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

