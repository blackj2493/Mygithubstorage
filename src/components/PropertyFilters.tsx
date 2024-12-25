import { useState, useEffect } from 'react';

interface FilterProps {
  onFilterChange: (filterParams: string) => void;
}

export default function PropertyFilters({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState({
    TransactionType: 'For Sale',
    propertyType: '',
    propertySubType: '',
    minPrice: '',
    maxPrice: '',
    BedroomsTotal: '',
    bathroomsTotalInteger: '',
    waterfrontYN: false,
    garageYN: false,
    basementYN: false,
    coolingYN: false,
    heatingYN: false,
    poolFeatures: [],
    keywords: ''
  });

  const PROPERTY_TYPES = [
    { display: 'Residential', value: 'Residential Freehold' },
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

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    
    if (filters.TransactionType === 'Lease') {
      params.set('TransactionType', 'Lease');
    }
    
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    if (filters.propertySubType) params.set('propertySubType', filters.propertySubType);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.BedroomsTotal) params.set('BedroomsTotal', filters.BedroomsTotal);
    if (filters.bathroomsTotalInteger) params.set('bathroomsTotalInteger', filters.bathroomsTotalInteger);
    if (filters.waterfrontYN) params.set('waterfrontYN', 'true');
    if (filters.garageYN) params.set('garageYN', 'true');
    if (filters.basementYN) params.set('basementYN', 'true');
    if (filters.coolingYN) params.set('coolingYN', 'true');
    if (filters.heatingYN) params.set('heatingYN', 'true');
    if (filters.keywords) params.set('keywords', filters.keywords);

    onFilterChange(params.toString());
  };

  const TRANSACTION_TYPES = [
    { display: 'For Sale', value: 'For Sale' },
    { display: 'For Rent', value: 'For Rent' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      {loading ? (
        <div className="text-center py-4">Loading filters...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Property Type (Residential/Commercial) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Any Property Type</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.display}
                </option>
              ))}
            </select>
          </div>

          {/* Property Sub Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Sub Type
            </label>
            <select
              name="propertySubType"
              value={filters.propertySubType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              disabled={!filters.propertyType}
            >
              <option value="">Any Sub Type</option>
              {filters.propertyType && 
                propertyTypeMetadata.propertySubTypes[filters.propertyType]
                  ?.filter(subType => subType !== 'Any')
                  .map(subType => (
                    <option key={subType} value={subType}>{subType}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Min Price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Max Price"
            />
          </div>

          {/* Bedrooms & Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Bedrooms
            </label>
            <select
              name="BedroomsTotal"
              value={filters.BedroomsTotal}
              onChange={(e) => setFilters(prev => ({ ...prev, BedroomsTotal: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Bathrooms
            </label>
            <input
              type="number"
              name="bathroomsTotalInteger"
              value={filters.bathroomsTotalInteger}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          {/* Features Checkboxes */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="waterfrontYN"
                  checked={filters.waterfrontYN}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Waterfront
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="garageYN"
                  checked={filters.garageYN}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Garage
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="basementYN"
                  checked={filters.basementYN}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Basement
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="coolingYN"
                  checked={filters.coolingYN}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Cooling
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="heatingYN"
                  checked={filters.heatingYN}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Heating
              </label>
            </div>
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