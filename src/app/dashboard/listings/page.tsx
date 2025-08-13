'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import MapView from '@/components/listings/MapView';

interface Property {
  ListingId: string;
  ListPrice: number;
  BedroomsTotal: number;
  BathroomsTotal: number;
  Address: {
    StreetAddress: string;
    City: string;
    StateOrProvince: string;
    PostalCode: string;
  };
  // Add other property fields as needed
}

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/listings?page=${page}&pageSize=20`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data.value || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property.ListingId} className="border rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold">{property.Address.StreetAddress}</h2>
            <p>{property.Address.City}, {property.Address.StateOrProvince}</p>
            <p className="text-lg font-bold">${property.ListPrice.toLocaleString()}</p>
            <p>{property.BedroomsTotal} beds • {property.BathroomsTotal} baths</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center gap-2">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <button 
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
      <MapView listings={properties} />
    </div>
  );
}