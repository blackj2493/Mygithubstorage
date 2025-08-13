'use client';

import { useState } from 'react';

interface Listing {
  ListingKey: string;
  ListPrice: number;
  UnparsedAddress?: string;
  City?: string;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  images?: Array<{ MediaURL: string }>;
  MlsStatus?: string;
  StandardStatus?: string;
  PostalCode?: string;
}

interface FallbackMapProps {
  listings: Listing[];
  onVisibleListingsChange?: (listings: Listing[]) => void;
  onMarkerClick?: (listingKey: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function FallbackMap({ 
  listings, 
  onVisibleListingsChange,
  onMarkerClick,
  className,
  style 
}: FallbackMapProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    if (onMarkerClick) {
      onMarkerClick(listing.ListingKey);
    }
  };

  return (
    <div className={`relative ${className}`} style={style}>
      <div className="w-full h-[600px] bg-gradient-to-br from-green-100 to-green-200 rounded-lg border border-green-300 flex flex-col">
        {/* Header */}
        <div className="bg-white bg-opacity-90 p-4 rounded-t-lg border-b border-green-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Property Map View</h3>
              <p className="text-sm text-gray-600">Interactive map temporarily unavailable</p>
            </div>
            <div className="text-sm text-gray-500">
              {listings.length} properties
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full bg-white bg-opacity-50 rounded-lg border-2 border-dashed border-green-400 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🗺️</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">Map Loading Issue</h4>
              <p className="text-gray-600 mb-4">
                Unable to connect to OpenStreetMap tiles.<br />
                This could be due to network restrictions or connectivity issues.
              </p>
            </div>

            {/* Property Grid as Fallback */}
            <div className="w-full max-w-2xl">
              <h5 className="text-lg font-medium text-gray-700 mb-3">Properties in Area:</h5>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {listings.slice(0, 10).map((listing) => (
                  <div
                    key={listing.ListingKey}
                    onClick={() => handleListingClick(listing)}
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          ${listing.ListPrice?.toLocaleString() || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {listing.BedroomsTotal || 0} bed • {listing.BathroomsTotalInteger || 0} bath
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {listing.UnparsedAddress || listing.City || 'Address not available'}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
                {listings.length > 10 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    ... and {listings.length - 10} more properties
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with troubleshooting */}
        <div className="bg-white bg-opacity-90 p-3 rounded-b-lg border-t border-green-300">
          <div className="text-xs text-gray-600">
            <strong>Troubleshooting:</strong> Check internet connection, firewall settings, or try refreshing the page.
            Corporate networks may block external map services.
          </div>
        </div>
      </div>

      {/* Selected Listing Modal */}
      {selectedListing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-green-600">
                ${selectedListing.ListPrice?.toLocaleString() || 'N/A'}
              </div>
              <div className="text-gray-700">
                {selectedListing.BedroomsTotal || 0} bedrooms • {selectedListing.BathroomsTotalInteger || 0} bathrooms
              </div>
              <div className="text-gray-600">
                {selectedListing.UnparsedAddress || selectedListing.City || 'Address not available'}
              </div>
              {selectedListing.MlsStatus && (
                <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {selectedListing.MlsStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
