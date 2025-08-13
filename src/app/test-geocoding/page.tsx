'use client';

import { useState } from 'react';
import { geocodePostalCodeForMap } from '@/utils/geocoding';

export default function TestGeocodingPage() {
  const [postalCode, setPostalCode] = useState('K2P 0A5');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGeocoding = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Testing geocoding for:', postalCode);
      const coords = await geocodePostalCodeForMap(postalCode);
      console.log('Geocoding result:', coords);
      setResult(coords);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testPostalCodes = ['K2P 0A5', 'K0E 1S0', 'M5V 3A8', 'H3A 0G4'];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Geocoding Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Postal Code:
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-48"
            placeholder="Enter postal code"
          />
          <button
            onClick={testGeocoding}
            disabled={loading}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Geocoding'}
          </button>
        </div>

        <div className="space-x-2">
          <span className="text-sm text-gray-600">Quick test:</span>
          {testPostalCodes.map((code) => (
            <button
              key={code}
              onClick={() => {
                setPostalCode(code);
                setTimeout(() => testGeocoding(), 100);
              }}
              className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              {code}
            </button>
          ))}
        </div>

        {loading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Testing geocoding...
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-medium text-red-800">Error:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-medium text-green-800">Success:</h3>
            <pre className="text-green-600 text-sm mt-2">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {result === null && !loading && !error && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-600">No result - postal code not found</p>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Enter a Canadian postal code (e.g., K2P 0A5)</li>
          <li>2. Click "Test Geocoding" to test the geocoding function</li>
          <li>3. Check the browser console for detailed logs</li>
          <li>4. The result will show coordinates if successful</li>
        </ol>
      </div>
    </div>
  );
}
