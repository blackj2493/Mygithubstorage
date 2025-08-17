'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface HorizontalFilterBarProps {
  onFilterChange?: (filterParams: string) => void;
  className?: string;
  resultsCount?: number;
}

interface Filters {
  propertyCategory: 'Residential' | 'Commercial';
  transactionType: 'For Sale' | 'For Lease';
  propertySubType: string;
  bedrooms: string;
  bathrooms: string;
  minPrice: string;
  maxPrice: string;
  keywords: string;
}

export default function HorizontalFilterBar({ onFilterChange, className = '', resultsCount }: HorizontalFilterBarProps) {
  const [filters, setFilters] = useState<Filters>({
    propertyCategory: 'Residential',
    transactionType: 'For Sale',
    propertySubType: 'All Property Types',
    bedrooms: 'Any',
    bathrooms: 'Any',
    minPrice: '',
    maxPrice: '',
    keywords: ''
  });

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Initialize filters from URL parameters and sync with URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      const params = new URLSearchParams(currentUrl.search);

      const urlFilters: Filters = {
        propertyCategory: 'Residential', // Default
        transactionType: (params.get('TransactionType') as 'For Sale' | 'For Lease') || 'For Sale',
        propertySubType: params.get('PropertySubType') || 'All Property Types',
        bedrooms: params.get('BedroomsTotal') || 'Any',
        bathrooms: params.get('BathroomsTotalInteger') || 'Any',
        minPrice: params.get('minPrice') || '',
        maxPrice: params.get('maxPrice') || '',
        keywords: params.get('keywords') || ''
      };

      // Determine property category from PropertyType parameter
      const propertyType = params.get('PropertyType');
      if (propertyType === 'Commercial') {
        urlFilters.propertyCategory = 'Commercial';
      } else if (propertyType && propertyType.includes('Residential')) {
        urlFilters.propertyCategory = 'Residential';
      }

      // Only update if filters have actually changed to prevent infinite loops
      const filtersChanged = JSON.stringify(filters) !== JSON.stringify(urlFilters);
      if (filtersChanged) {
        setFilters(urlFilters);
      }
    }
  }); // No dependency array - runs on every render but with change detection

  // Property sub-types based on category (using exact PropTx API values)
  const PROPERTY_SUBTYPES = {
    Residential: [
      'All Property Types',
      'Condo Apartment',
      'Att/Row/Townhouse',
      'Detached',
      'Semi-Detached',
      'Duplex',
      'Triplex',
      'Fourplex',
      'Cottage',
      'Farm',
      'Link',
      'Mobile/Trailer',
      'Multiplex',
      'Rural Residential',
      'Store W Apt/Office',
      'Vacant Land',
      'Other'
    ],
    Commercial: [
      'All Property Types',
      'Office Building',
      'Retail',
      'Industrial',
      'Multi-Family',
      'Investment',
      'Hospitality',
      'Vacant Land',
      'Other'
    ]
  };

  // Bedroom options
  const BEDROOM_OPTIONS = [
    { value: 'Any', label: 'Any' },
    { value: '0', label: 'Studio' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  // Bathroom options
  const BATHROOM_OPTIONS = [
    { value: 'Any', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '1.5', label: '1.5+' },
    { value: '2', label: '2+' },
    { value: '2.5', label: '2.5+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' }
  ];

  // Price ranges based on transaction type
  const PRICE_RANGES = {
    'For Sale': [
      { min: '', max: '', label: '$0 - Max' },
      { min: '0', max: '500000', label: '$0 - $500K' },
      { min: '500000', max: '750000', label: '$500K - $750K' },
      { min: '750000', max: '1000000', label: '$750K - $1M' },
      { min: '1000000', max: '1500000', label: '$1M - $1.5M' },
      { min: '1500000', max: '2000000', label: '$1.5M - $2M' },
      { min: '2000000', max: '', label: '$2M+' }
    ],
    'For Lease': [
      { min: '', max: '', label: '$0 - Max' },
      { min: '0', max: '1500', label: '$0 - $1,500' },
      { min: '1500', max: '2500', label: '$1,500 - $2,500' },
      { min: '2500', max: '3500', label: '$2,500 - $3,500' },
      { min: '3500', max: '5000', label: '$3,500 - $5,000' },
      { min: '5000', max: '', label: '$5,000+' }
    ]
  };

  // Reset property sub-type when category changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      propertySubType: 'All Property Types'
    }));
  }, [filters.propertyCategory]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handlePriceRangeChange = (range: { min: string; max: string; label: string }) => {
    const newFilters = { 
      ...filters, 
      minPrice: range.min, 
      maxPrice: range.max 
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: Filters) => {
    // Start with existing URL parameters to preserve search context
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    // Map UI values to API values
    if (currentFilters.propertyCategory === 'Residential') {
      params.set('PropertyType', 'Residential Condo & Other,Residential Freehold');
    } else {
      params.set('PropertyType', 'Commercial');
    }

    // Transaction type
    params.set('TransactionType', currentFilters.transactionType);

    // Property sub-type
    if (currentFilters.propertySubType !== 'All Property Types') {
      params.set('PropertySubType', currentFilters.propertySubType);
    } else {
      params.delete('PropertySubType'); // Remove if set to default
    }

    // Bedrooms
    if (currentFilters.bedrooms !== 'Any') {
      params.set('BedroomsTotal', currentFilters.bedrooms);
    } else {
      params.delete('BedroomsTotal'); // Remove if set to default
    }

    // Bathrooms
    if (currentFilters.bathrooms !== 'Any') {
      params.set('BathroomsTotalInteger', currentFilters.bathrooms);
    } else {
      params.delete('BathroomsTotalInteger'); // Remove if set to default
    }

    // Price range
    if (currentFilters.minPrice) {
      params.set('minPrice', currentFilters.minPrice);
    } else {
      params.delete('minPrice'); // Remove if empty
    }
    if (currentFilters.maxPrice) {
      params.set('maxPrice', currentFilters.maxPrice);
    } else {
      params.delete('maxPrice'); // Remove if empty
    }

    // Keywords
    if (currentFilters.keywords.trim()) {
      params.set('keywords', currentFilters.keywords.trim());
    } else {
      params.delete('keywords'); // Remove if empty
    }

    // Reset pagination when filters change
    params.set('page', '1');
    params.set('limit', '50');

    if (onFilterChange) {
      onFilterChange(params.toString());
    }
  };

  const clearAllFilters = () => {
    const resetFilters: Filters = {
      propertyCategory: 'Residential',
      transactionType: 'For Sale',
      propertySubType: 'All Property Types',
      bedrooms: 'Any',
      bathrooms: 'Any',
      minPrice: '',
      maxPrice: '',
      keywords: ''
    };
    setFilters(resetFilters);

    // Preserve search context (city, address, etc.) but clear filter-specific params
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    // Remove filter-specific parameters but keep search context
    params.delete('PropertyType');
    params.delete('TransactionType');
    params.delete('PropertySubType');
    params.delete('BedroomsTotal');
    params.delete('BathroomsTotalInteger');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('keywords');

    // Reset pagination
    params.set('page', '1');

    if (onFilterChange) {
      onFilterChange(params.toString());
    }
  };

  const hasActiveFilters = () => {
    return filters.propertySubType !== 'All Property Types' ||
           filters.bedrooms !== 'Any' ||
           filters.bathrooms !== 'Any' ||
           filters.minPrice !== '' ||
           filters.maxPrice !== '' ||
           filters.keywords.trim() !== '';
  };

  const currentPriceLabel = () => {
    const ranges = PRICE_RANGES[filters.transactionType];
    const currentRange = ranges.find(r => r.min === filters.minPrice && r.max === filters.maxPrice);
    return currentRange ? currentRange.label : '$0 - Max';
  };

  return (
    <div className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Property Category Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleFilterChange('propertyCategory', 'Residential')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filters.propertyCategory === 'Residential'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🏠 Residential
            </button>
            <button
              onClick={() => handleFilterChange('propertyCategory', 'Commercial')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filters.propertyCategory === 'Commercial'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🏢 Commercial
            </button>
          </div>

          {/* Transaction Type */}
          <div className="relative">
            <select
              value={filters.transactionType}
              onChange={(e) => handleFilterChange('transactionType', e.target.value as 'For Sale' | 'For Lease')}
              className={`appearance-none bg-white border rounded-lg px-3 py-2 pr-8 text-sm font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                filters.transactionType === 'For Sale'
                  ? 'border-green-400 text-green-700 bg-green-50'
                  : 'border-blue-400 text-blue-700 bg-blue-50'
              }`}
            >
              <option value="For Sale">For Sale</option>
              <option value="For Lease">For Rent</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Property Sub-Type */}
          <div className="relative">
            <select
              value={filters.propertySubType}
              onChange={(e) => handleFilterChange('propertySubType', e.target.value)}
              className={`appearance-none bg-white border rounded-lg px-3 py-2 pr-8 text-sm font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                filters.propertySubType !== 'All Property Types'
                  ? 'border-blue-400 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              {PROPERTY_SUBTYPES[filters.propertyCategory].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            {filters.propertySubType !== 'All Property Types' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className={`relative flex items-center gap-1 rounded-lg px-2 py-1 ${
            filters.bedrooms !== 'Any' || filters.bathrooms !== 'Any'
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className={`appearance-none bg-transparent border-none text-sm font-medium focus:outline-none pr-5 ${
                filters.bedrooms !== 'Any' ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              {BEDROOM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} bed
                </option>
              ))}
            </select>
            <span className="text-gray-400">•</span>
            <select
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className={`appearance-none bg-transparent border-none text-sm font-medium focus:outline-none pr-5 ${
                filters.bathrooms !== 'Any' ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              {BATHROOM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} bath
                </option>
              ))}
            </select>
            {(filters.bedrooms !== 'Any' || filters.bathrooms !== 'Any') && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>

          {/* Price Range */}
          <div className="relative">
            <select
              value={currentPriceLabel()}
              onChange={(e) => {
                const selectedRange = PRICE_RANGES[filters.transactionType].find(r => r.label === e.target.value);
                if (selectedRange) {
                  handlePriceRangeChange(selectedRange);
                }
              }}
              className={`appearance-none bg-white border rounded-lg px-3 py-2 pr-8 text-sm font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                filters.minPrice || filters.maxPrice
                  ? 'border-blue-400 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              {PRICE_RANGES[filters.transactionType].map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            {(filters.minPrice || filters.maxPrice) && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>

          {/* More Filters Button */}
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            More filters
          </button>

          {/* Clear All */}
          {hasActiveFilters() && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
            >
              Clear all
            </button>
          )}

          {/* Results Counter */}
          {resultsCount !== undefined && (
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{resultsCount.toLocaleString()}</span>
              <span>properties found</span>
            </div>
          )}
        </div>

        {/* More Filters Dropdown */}
        {showMoreFilters && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  value={filters.keywords}
                  onChange={(e) => handleFilterChange('keywords', e.target.value)}
                  placeholder="Search in property descriptions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowMoreFilters(false)}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
