'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ZoloFilterBarProps {
  onFilterChange?: (filters: any) => void;
}

export default function ZoloFilterBar({ onFilterChange }: ZoloFilterBarProps) {
  const [filters, setFilters] = useState({
    priceRange: 'Any Price',
    bedrooms: '0+ Bed',
    homeType: 'Home Type',
    moreFilters: false
  });

  const priceRanges = [
    'Any Price',
    '$0 - $500K',
    '$500K - $750K',
    '$750K - $1M',
    '$1M - $1.5M',
    '$1.5M - $2M',
    '$2M+'
  ];

  const bedroomOptions = [
    '0+ Bed',
    '1+ Bed',
    '2+ Bed',
    '3+ Bed',
    '4+ Bed',
    '5+ Bed'
  ];

  const homeTypes = [
    'Home Type',
    'House',
    'Condo',
    'Townhouse',
    'Duplex',
    'Other'
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Price Range Filter */}
        <div className="relative">
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {priceRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Bedrooms Filter */}
        <div className="relative">
          <select
            value={filters.bedrooms}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {bedroomOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Home Type Filter */}
        <div className="relative">
          <select
            value={filters.homeType}
            onChange={(e) => handleFilterChange('homeType', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {homeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* More Filters Button */}
        <button
          onClick={() => handleFilterChange('moreFilters', (!filters.moreFilters).toString())}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          More
        </button>

        {/* Active Filters Indicator */}
        {(filters.priceRange !== 'Any Price' || 
          filters.bedrooms !== '0+ Bed' || 
          filters.homeType !== 'Home Type') && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">•</span>
            <button
              onClick={() => {
                const resetFilters = {
                  priceRange: 'Any Price',
                  bedrooms: '0+ Bed',
                  homeType: 'Home Type',
                  moreFilters: false
                };
                setFilters(resetFilters);
                if (onFilterChange) {
                  onFilterChange(resetFilters);
                }
              }}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="ml-auto text-sm text-gray-500">
          Showing properties on map
        </div>
      </div>
    </div>
  );
}
