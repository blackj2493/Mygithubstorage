'use client';

import dynamic from 'next/dynamic';

// Dynamically import BasicMap to prevent SSR issues
const BasicMap = dynamic(() => import('@/components/BasicMap'), {
  ssr: false, // This prevents server-side rendering
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

export default function TestSimpleMapPage() {
  const testMarkers = [
    {
      position: [45.4215, -75.6972] as [number, number],
      popup: 'Test Property 1',
      price: 435000,
      listingKey: 'test1',
      address: '245 Kent Street, Ottawa',
      onClick: () => console.log('Clicked marker 1')
    },
    {
      position: [45.4115, -75.6872] as [number, number],
      popup: 'Test Property 2',
      price: 550000,
      listingKey: 'test2',
      address: '123 Main Street, Ottawa',
      onClick: () => console.log('Clicked marker 2')
    }
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Simple Map Test</h1>
      
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Test Info:</h3>
        <p className="text-sm">Testing SimpleMap component with price markers</p>
        <p className="text-sm">Center: Ottawa (45.4215, -75.6972)</p>
        <p className="text-sm">Markers: {testMarkers.length}</p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <BasicMap
          center={[45.4215, -75.6972]}
          zoom={12}
          height="600px"
          markers={testMarkers}
          className="w-full"
          onBoundsChange={(bounds) => {
            console.log('Bounds changed:', bounds);
          }}
        />
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded text-sm">
        <p><strong>Expected behavior:</strong></p>
        <ul className="mt-2 space-y-1">
          <li>• Map should load and show Ottawa area</li>
          <li>• Two price markers should be visible ($435K and $550K)</li>
          <li>• Check browser console for any errors</li>
          <li>• Click markers to test popup functionality</li>
        </ul>
      </div>
    </div>
  );
}
