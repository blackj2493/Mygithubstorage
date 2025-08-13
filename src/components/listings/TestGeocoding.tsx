'use client';

import React, { useEffect, useState } from 'react';
import { batchGeocodePostalCodes } from '@/utils/geocoding';

export default function TestGeocoding() {
  const [results, setResults] = useState<string>('');

  useEffect(() => {
    const testGeocoding = async () => {
      console.log('🧪 Starting geocoding test...');
      
      try {
        const testPostalCodes = ['K1P0C8', 'K2C1X7', 'K1A0A1'];
        console.log('🧪 Testing postal codes:', testPostalCodes);
        
        const geocodeResults = await batchGeocodePostalCodes(testPostalCodes);
        console.log('🧪 Geocoding results:', geocodeResults);
        
        const resultText = `Found ${geocodeResults.size} results:\n` + 
          Array.from(geocodeResults.entries())
            .map(([code, coords]) => `${code}: ${coords.lat}, ${coords.lon}`)
            .join('\n');
        
        setResults(resultText);
      } catch (error) {
        console.error('🧪 Geocoding test failed:', error);
        setResults(`Error: ${error}`);
      }
    };

    testGeocoding();
  }, []);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      <h3 className="font-bold text-yellow-800">Geocoding Test</h3>
      <pre className="text-sm text-yellow-700 mt-2">{results || 'Testing...'}</pre>
    </div>
  );
}
