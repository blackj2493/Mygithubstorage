'use client';

import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';

interface ComparableProperty {
  ListingKey: string;
  ListPrice: number;
  ClosePrice?: number;
  MlsStatus: string;
  UnparsedAddress?: string;
  BedroomsAboveGrade?: number;
  BedroomsBelowGrade?: number;
  BathroomsTotalInteger?: number;
  images: Array<{ MediaURL: string; Order: number }>;
  CloseDate?: string;
}

interface ComparablePropertiesProps {
  CityRegion: string;
  PropertySubType: string;
  BedroomsAboveGrade?: number;
}

export default function ComparableProperties({ 
  CityRegion, 
  PropertySubType,
  BedroomsAboveGrade 
}: ComparablePropertiesProps) {
  const [activeTab, setActiveTab] = useState('sold');
  const [properties, setProperties] = useState<{
    sold: ComparableProperty[];
    forSale: ComparableProperty[];
    forRent: ComparableProperty[];
  }>({ sold: [], forSale: [], forRent: [] });
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    const fetchComparables = async () => {
      try {
        const response = await fetch('/api/properties/comparables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            propertyData: {
              CityRegion,
              PropertySubType,
              BedroomsAboveGrade
            }
          }),
        });
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching comparables:', error);
      }
    };

    fetchComparables();
  }, [CityRegion, PropertySubType, BedroomsAboveGrade]);

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 2, 10)); // Show 2 more, up to max 10
  };

  return (
    <section className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => {
              setActiveTab('sold');
              setVisibleCount(2); // Reset visible count when changing tabs
            }}
            className={`${
              activeTab === 'sold'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Sold Comparables
          </button>
          <button
            onClick={() => {
              setActiveTab('forSale');
              setVisibleCount(2); // Reset visible count when changing tabs
            }}
            className={`${
              activeTab === 'forSale'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Similar for Sale
          </button>
          <button
            onClick={() => {
              setActiveTab('forRent');
              setVisibleCount(2); // Reset visible count when changing tabs
            }}
            className={`${
              activeTab === 'forRent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Rent Comparables
          </button>
        </nav>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {properties[activeTab]
            .slice(0, visibleCount)
            .map((property) => (
              <PropertyCard key={property.ListingKey} property={property} />
            ))}
        </div>
        
        {properties[activeTab].length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comparable properties found
          </p>
        ) : properties[activeTab].length > visibleCount ? (
          <div className="mt-6 text-center">
            <button
              onClick={handleShowMore}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Show More
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
} 