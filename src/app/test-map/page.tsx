'use client';

import MapView from '@/components/listings/MapView';

const testListings = [
  {
    UnparsedAddress: '245 Kent Street 504, Ottawa Centre, ON K2P 0A5',
    ListPrice: 435000,
    StandardStatus: 'Active',
    ListingKey: 'test1'
  },
  {
    UnparsedAddress: '1696 Christina Crescent, North Dundas, ON K0E 1S0',
    ListPrice: 559900,
    StandardStatus: 'Active',
    ListingKey: 'test2'
  },
  {
    UnparsedAddress: '123 Main Street, Toronto, ON M5V 3A8',
    ListPrice: 750000,
    StandardStatus: 'Active',
    ListingKey: 'test3'
  }
];

export default function TestMapPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Map Test with Sample Data</h1>
      
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Test Listings:</h3>
        <ul className="text-sm space-y-1">
          {testListings.map((listing, index) => (
            <li key={index}>
              {index + 1}. {listing.UnparsedAddress} - ${listing.ListPrice?.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <MapView listings={testListings} />
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded text-sm">
        <p><strong>Expected behavior:</strong></p>
        <ul className="mt-2 space-y-1">
          <li>• Map should load with markers for each listing</li>
          <li>• Check browser console for geocoding logs</li>
          <li>• Check server terminal for API calls</li>
          <li>• Markers should show property details in popups</li>
        </ul>
      </div>
    </div>
  );
}
