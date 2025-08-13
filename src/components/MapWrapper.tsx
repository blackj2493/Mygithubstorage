'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MapErrorBoundary from './MapErrorBoundary';

// Dynamically import the MapView to ensure it only renders on client side
const MapView = dynamic(() => import('./listings/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

interface MapWrapperProps {
  listings: any[];
  className?: string;
  style?: React.CSSProperties;
}

export default function MapWrapper({ listings, className, style }: MapWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
  };

  if (!isClient) {
    return (
      <div className={`h-[600px] flex items-center justify-center bg-gray-100 rounded-lg ${className || ''}`} style={style}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Initializing map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <MapErrorBoundary
        fallback={
          <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center p-6">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Map Loading Error
              </h3>
              <p className="text-gray-600 mb-4 max-w-md">
                The map failed to load. This can happen due to network issues or browser restrictions.
              </p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        }
      >
        <MapView key={`map-wrapper-${retryKey}`} listings={listings} />
      </MapErrorBoundary>
    </div>
  );
}
