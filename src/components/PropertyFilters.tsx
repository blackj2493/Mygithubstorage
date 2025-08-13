import { useState, useEffect } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

interface FilterProps {
  onFilterChange: (filterParams: string) => void;
}

// Define the mapping between UI options and actual property types
const PROPERTY_TYPE_MAPPING = {
  'Residential': ['Residential Condo & Other', 'Residential Freehold'],
  'Commercial': ['Commercial']
};

// Add these type definitions and constants
type PropertySubType = {
  Residential: string[];
  Condo: string[];
  Commercial: string[]; // We'll add this when you provide the commercial list
};

const PROPERTY_SUBTYPES: PropertySubType = {
  Residential: [
    'Detached',
    'Semi-Detached',
    'Attached/Row/Street Townhouse',
    'Link',
    'Rural Residence',
    'Duplex',
    'Triplex',
    'Fourplex',
    'Multiplex',
    'Cottage',
    'Vacant Land',
    'Farm',
    'Store with Apt/Office',
    'Detached with Common Elements',
    'Mobile/Trailer',
    'Other'
  ],
  Condo: [
    'Condo Apartment',
    'Condo Townhouse',
    'Parking Space',
    'Locker',
    'Detached Condo',
    'Semi-Detached Condo',
    'Co-Op Apartment',
    'Co-Ownership Apartment',
    'Common Element Condo',
    'Leasehold Condo',
    'Phased Condo',
    'Time Share',
    'Vacant Land Condo',
    'Other'
  ],
  Commercial: [
    'Commercial/Retail',
    'Farm',
    'Industrial',
    'Investment',
    'Land',
    'Office',
    'Sale Of Business',
    'Store with Apt/Office'
  ]
};

// Add this constant for the options
const ROOM_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1' },
  { value: '1+', label: '1+' },
  { value: '2', label: '2' },
  { value: '2+', label: '2+' },
  { value: '3', label: '3' },
  { value: '3+', label: '3+' },
  { value: '4', label: '4' },
  { value: '4+', label: '4+' },
  { value: '5', label: '5' },
  { value: '5+', label: '5+' }
];

// Add this type and constant for basement options
const BASEMENT_OPTIONS = [
  { value: 'Finished', label: 'Finished' },
  { value: 'Separate Entrance', label: 'Separate Entrance' },
  { value: 'Walk-out', label: 'Walk-out' }
];

interface Filters {
  city: string;
  propertyType: string;
  propertySubTypes: string[];
  TransactionType: 'For Sale' | 'For Rent';
  minPrice: string;
  maxPrice: string;
  BedroomsTotal: string;
  BathroomsTotalInteger: string;
  keywords: string;
  basementFeatures: string[];
}

export default function PropertyFilters({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState({
    bedrooms: '',
    bathrooms: '',
    minPrice: '',
    maxPrice: '',
    propertyType: 'Residential',
    TransactionType: 'For Sale',
    waterfrontYN: false,
    garageYN: false,
    coolingYN: false,
    heatingYN: false,
    poolFeatures: [],
    keywords: '',
    propertySubTypes: [] as string[],
    basementFeatures: [] as string[],
  });

  const PROPERTY_TYPES = [
    { display: 'Residential Condo & Other', value: 'Residential Condo & Other' },
    { display: 'Residential Freehold', value: 'Residential Freehold' },
    { display: 'Commercial', value: 'Commercial' }
  ];

  const BEDROOM_OPTIONS = [
    { value: '0', label: '0+' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/properties/types');
        const data = await response.json();
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handlePropertyTypeChange = (selectedValue: string) => {
    // Only update the local state, don't modify URL
    setFilters(prev => ({
      ...prev,
      propertyType: selectedValue
    }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    
    // Add city if it exists
    if (filters.city) {
      params.set('city', filters.city);
    }
    
    // Handle property type and subtypes
    if (filters.propertyType) {
      if (filters.propertyType === 'Residential') {
        // Set PropertyTypes for Residential (both Condo & Freehold)
        params.set('PropertyTypes', JSON.stringify(PROPERTY_TYPE_MAPPING['Residential']));
        
        // Add PropertySubType if there are selected subtypes
        if (filters.propertySubTypes.length > 0) {
          // Ensure proper encoding of special characters
          const encodedSubTypes = filters.propertySubTypes.map(type => 
            type.replace('/', '%2F').replace('&', '%26')
          );
          params.set('PropertySubType', JSON.stringify(encodedSubTypes));
        }
      } else if (filters.propertyType === 'Commercial') {
        // Set PropertyType for Commercial
        params.set('PropertyType', 'Commercial');
        
        // Add PropertySubType if there are selected subtypes
        if (filters.propertySubTypes.length > 0) {
          const encodedSubTypes = filters.propertySubTypes.map(type => 
            type.replace('/', '%2F').replace('&', '%26')
          );
          params.set('PropertySubType', JSON.stringify(encodedSubTypes));
        }
      }
    }
    
    // Add transaction type
    if (filters.TransactionType === 'For Rent') {
      params.set('TransactionType', 'Lease');
    } else {
      params.set('TransactionType', 'Sale');
    }
    
    // Add pagination parameters
    params.set('page', '1');
    params.set('limit', '50');
    
    // Add other filters
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms);
    if (filters.keywords) params.set('keywords', filters.keywords);

    // Add bedroom filter
    if (filters.BedroomsTotal) {
      params.set('BedroomsTotal', filters.BedroomsTotal);
    }

    // Add bathroom filter
    if (filters.BathroomsTotalInteger) {
      params.set('BathroomsTotalInteger', filters.BathroomsTotalInteger);
    }

    // Add basement filter
    if (filters.basementFeatures.length > 0) {
      params.set('basementFeatures', JSON.stringify(filters.basementFeatures));
    }

    // Debug logging
    console.log('Final URL params:', params.toString());

    // Log the URL for debugging
    console.log('API URL:', `${window.location.pathname}?${params.toString()}`);
    
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params.toString()}`
    );

    onFilterChange(params.toString());
  };

  const TRANSACTION_TYPES = [
    { display: 'For Sale', value: 'For Sale' },
    { display: 'For Rent', value: 'For Rent' }
  ];

  // Define price ranges for Sale and Rent
  const PRICE_RANGES = {
    'For Sale': {
      min: 0,
      max: 5000000,
      step: 10000,
      marks: [
        { value: 0, label: '$0' },
        { value: 450000, label: '$450K' },
        { value: 850000, label: '$850K' },
        { value: 1800000, label: '$1.8M' },
        { value: 3800000, label: '$3.8M' },
        { value: 5000000, label: 'Max' }
      ]
    },
    'For Rent': {
      min: 0,
      max: 10000, // Adjust this based on your needs
      step: 100,
      marks: [
        { value: 0, label: '$0' },
        { value: 1400, label: '$1.4K' },
        { value: 2800, label: '$2.8K' },
        { value: 4200, label: '$4.2K' },
        { value: 6500, label: '$6.5K' },
        { value: 10000, label: 'Max' }
      ]
    }
  };

  // Get current price range based on transaction type
  const getCurrentPriceRange = () => {
    return PRICE_RANGES[filters.TransactionType || 'For Sale'];
  };

  // Reset price range when transaction type changes
  const handleTransactionTypeChange = (value: 'For Sale' | 'For Rent') => {
    const newRange = PRICE_RANGES[value];
    setFilters(prev => ({
      ...prev,
      TransactionType: value,
      minPrice: newRange.min.toString(),
      maxPrice: newRange.max.toString()
    }));
  };

  const formatPrice = (price: number) => {
    if (filters.TransactionType === 'For Rent') {
      return price >= 1000 ? `$${(price / 1000).toFixed(1)}K` : `$${price}`;
    }
    // Original price formatting for sale
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  const currentRange = getCurrentPriceRange();

  // Add this state to handle dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !event.target.closest('.property-type-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Add this helper function
  const handleRoomFilter = (value: string) => {
    if (!value || value === 'Any') return null;
    
    // Remove the '+' and convert to number
    const number = parseInt(value.replace('+', ''));
    
    // If original value had '+', use 'ge', otherwise use 'eq'
    const operator = value.includes('+') ? 'ge' : 'eq';
    return `${operator} ${number}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      {loading ? (
        <div className="text-center py-4">Loading filters...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* Residential/Commercial Toggle Buttons */}
          <div className="col-span-full flex gap-2 mb-4">
            <button
              onClick={() => handlePropertyTypeChange('Residential')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                filters.propertyType === 'Residential'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Residential
            </button>
            <button
              onClick={() => handlePropertyTypeChange('Commercial')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                filters.propertyType === 'Commercial'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Commercial
            </button>
          </div>

          {/* Transaction Type */}
          <div className="col-span-full flex gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="TransactionType"
                value="For Sale"
                checked={filters.TransactionType === 'For Sale'}
                onChange={handleInputChange}
                className="mr-2"
              />
              For Sale
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="TransactionType"
                value="For Rent"
                checked={filters.TransactionType === 'For Rent'}
                onChange={handleInputChange}
                className="mr-2"
              />
              For Rent
            </label>
          </div>

          {/* Property Sub Type Filter */}
          {filters.propertyType && (
            <div className="col-span-full relative property-type-dropdown">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-2 border rounded text-sm text-left bg-white flex justify-between items-center"
              >
                <span>
                  {filters.propertySubTypes.length 
                    ? `${filters.propertySubTypes.length} selected` 
                    : 'Select Property Types'}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                  {filters.propertyType === 'Residential' ? (
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Residential Column */}
                        <div>
                          <h3 className="font-medium mb-2 text-sm">Residential</h3>
                          <div className="space-y-2">
                            {PROPERTY_SUBTYPES.Residential.map((type) => (
                              <label key={type} className="flex items-start gap-2 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={filters.propertySubTypes.includes(type)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const newTypes = e.target.checked
                                      ? [...filters.propertySubTypes, type]
                                      : filters.propertySubTypes.filter(t => t !== type);
                                    setFilters(prev => ({
                                      ...prev,
                                      propertySubTypes: newTypes
                                    }));
                                  }}
                                  className="mt-1"
                                />
                                <span>{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Condo Column */}
                        <div>
                          <h3 className="font-medium mb-2 text-sm">Condo</h3>
                          <div className="space-y-2">
                            {PROPERTY_SUBTYPES.Condo.map((type) => (
                              <label key={type} className="flex items-start gap-2 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={filters.propertySubTypes.includes(type)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const newTypes = e.target.checked
                                      ? [...filters.propertySubTypes, type]
                                      : filters.propertySubTypes.filter(t => t !== type);
                                    setFilters(prev => ({
                                      ...prev,
                                      propertySubTypes: newTypes
                                    }));
                                  }}
                                  className="mt-1"
                                />
                                <span>{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {PROPERTY_SUBTYPES.Commercial.map((type) => (
                          <label key={type} className="flex items-start gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.propertySubTypes.includes(type)}
                              onChange={(e) => {
                                e.stopPropagation();
                                const newTypes = e.target.checked
                                  ? [...filters.propertySubTypes, type]
                                  : filters.propertySubTypes.filter(t => t !== type);
                                setFilters(prev => ({
                                  ...prev,
                                  propertySubTypes: newTypes
                                }));
                              }}
                              className="mt-1"
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Price Range */}
          <div className="col-span-full mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Price Range: {formatPrice(Number(filters.minPrice) || currentRange.min)} - {formatPrice(Number(filters.maxPrice) || currentRange.max)}
            </label>
            <div className="px-2">
              <RangeSlider
                min={currentRange.min}
                max={currentRange.max}
                step={currentRange.step}
                value={[
                  Number(filters.minPrice) || currentRange.min,
                  Number(filters.maxPrice) || currentRange.max
                ]}
                onInput={(values: [number, number]) => {
                  setFilters(prev => ({
                    ...prev,
                    minPrice: values[0].toString(),
                    maxPrice: values[1].toString()
                  }));
                }}
                className="price-range-slider"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                {currentRange.marks.map((mark, index) => (
                  <span key={index}>{mark.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedroom
            </label>
            <select
              name="BedroomsTotal"
              value={filters.BedroomsTotal}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              {ROOM_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathroom
            </label>
            <select
              name="BathroomsTotalInteger"
              value={filters.BathroomsTotalInteger}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              {ROOM_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Keywords */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <input
              type="text"
              name="keywords"
              value={filters.keywords}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Search in property description"
            />
          </div>

          {/* Basement */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basement
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {BASEMENT_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.basementFeatures.includes(option.value)}
                    onChange={(e) => {
                      const newFeatures = e.target.checked
                        ? [...filters.basementFeatures, option.value]
                        : filters.basementFeatures.filter(f => f !== option.value);
                      setFilters(prev => ({
                        ...prev,
                        basementFeatures: newFeatures
                      }));
                    }}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Apply Filters Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
} 