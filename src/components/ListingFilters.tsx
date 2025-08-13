'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filter values
  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    beds: searchParams.get('beds') || '',
    baths: searchParams.get('baths') || '',
    propertyType: searchParams.get('propertyType') || '',
    city: searchParams.get('city') || '',
    minSquareFeet: searchParams.get('minSquareFeet') || '',
    maxSquareFeet: searchParams.get('maxSquareFeet') || '',
    propertySubType: searchParams.get('propertySubType') || '',
    transactionType: searchParams.get('transactionType') || '',
    status: searchParams.get('status') || '',
    maxMaintenanceFee: searchParams.get('maxMaintenanceFee') || '',
    parkingSpaces: searchParams.get('parkingSpaces') || '',
  });

  // Predefined options for dropdowns
  const propertyTypes = [
    'Residential',
    'Commercial',
    'Industrial',
    'Land',
    'Multi-Family'
  ];

  const propertySubTypes = [
    'Detached',
    'Semi-Detached',
    'Townhouse',
    'Condo',
    'Apartment'
  ];

  const cities = [
    'Toronto',
    'Mississauga',
    'Brampton',
    'Vaughan',
    'Richmond Hill',
    'Markham'
  ];

  const statusOptions = [
    'Active',
    'Sold',
    'Pending'
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Only add non-empty filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    router.push(`/listings?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
      propertyType: '',
      city: '',
      minSquareFeet: '',
      maxSquareFeet: '',
      propertySubType: '',
      transactionType: '',
      status: '',
      maxMaintenanceFee: '',
      parkingSpaces: '',
    });
    router.push('/listings');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Price Range */}
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Beds & Baths */}
        <select
          name="beds"
          value={filters.beds}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Any Beds</option>
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}+ Beds</option>
          ))}
        </select>

        <select
          name="baths"
          value={filters.baths}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Any Baths</option>
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}+ Baths</option>
          ))}
        </select>

        {/* Property Type & SubType */}
        <select
          name="propertyType"
          value={filters.propertyType}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Any Property Type</option>
          {propertyTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          name="propertySubType"
          value={filters.propertySubType}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Any Property SubType</option>
          {propertySubTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* City */}
        <select
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Any City</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* Square Footage */}
        <div className="flex gap-2">
          <input
            type="number"
            name="minSquareFeet"
            placeholder="Min Sq.Ft"
            value={filters.minSquareFeet}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="number"
            name="maxSquareFeet"
            placeholder="Max Sq.Ft"
            value={filters.maxSquareFeet}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Transaction Type */}
        <select
          name="transactionType"
          value={filters.transactionType}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Any Transaction</option>
          <option value="Sale">Sale</option>
          <option value="Lease">Lease</option>
        </select>

        {/* Status */}
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Any Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        {/* Maintenance Fee */}
        <input
          type="number"
          name="maxMaintenanceFee"
          placeholder="Max Maintenance Fee"
          value={filters.maxMaintenanceFee}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        />

        {/* Parking Spaces */}
        <select
          name="parkingSpaces"
          value={filters.parkingSpaces}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Any Parking</option>
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}+ Spaces</option>
          ))}
        </select>
      </div>

      {/* Filter Actions */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
} 