'use client';

import React from 'react';

interface Listing {
  ListingKey: string;
  ListPrice: number;
  UnparsedAddress?: string;
  Latitude?: number;
  Longitude?: number;
  PostalCode?: string;
}

interface SimpleMapProps {
  listings: Listing[];
  onVisibleListingsChange?: (listings: Listing[]) => void;
  onMarkerClick?: (listingKey: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function SimpleMap({ 
  listings, 
  onVisibleListingsChange,
  onMarkerClick,
  className,
  style 
}: SimpleMapProps) {
  
  // Sample properties for Ottawa area
  const sampleProperties = [
    { id: '1', price: 650000, address: "123 Bank St, Ottawa", postal: "K1P 1A1" },
    { id: '2', price: 720000, address: "456 Rideau St, Ottawa", postal: "K1N 5Y4" },
    { id: '3', price: 580000, address: "789 Somerset St, Ottawa", postal: "K1R 6P1" },
    { id: '4', price: 695000, address: "321 Elgin St, Ottawa", postal: "K2P 1M3" },
    { id: '5', price: 750000, address: "654 Bank St, Ottawa", postal: "K1S 3T4" }
  ];

  const handlePropertyClick = (property: any) => {
    console.log('Property clicked:', property);
    onMarkerClick?.(property.id);
  };

  return (
    <div className={`relative ${className}`} style={style}>
      <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
        ✅ Simple Map Fallback | Properties: {listings.length} | Sample: {sampleProperties.length}
      </div>
      
      <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-gradient-to-br from-green-100 to-blue-100" style={{ height: '600px' }}>
        {/* Map Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">Ottawa Properties Map</h3>
          <p className="text-sm text-gray-600">Interactive property listings</p>
        </div>
        
        {/* Map Content Area */}
        <div className="p-6 h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleProperties.map((property) => (
              <div 
                key={property.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
                onClick={() => handlePropertyClick(property)}
              >
                {/* Price Badge */}
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ${property.price.toLocaleString()}
                  </div>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                
                {/* Address */}
                <div className="text-gray-800 font-medium mb-2">
                  {property.address}
                </div>
                
                {/* Postal Code */}
                <div className="text-gray-500 text-sm mb-3">
                  📍 {property.postal}
                </div>
                
                {/* Action Button */}
                <button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropertyClick(property);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
          
          {/* Map Legend */}
          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Legend</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Available Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Price Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Interactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
