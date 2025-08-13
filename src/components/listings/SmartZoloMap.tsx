'use client';

import { useState, useEffect } from 'react';
import SimpleZoloMap from './SimpleZoloMap';
import FallbackMap from './FallbackMap';

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

interface SmartZoloMapProps {
  listings: Listing[];
  onVisibleListingsChange?: (listings: Listing[]) => void;
  onMarkerClick?: (listingKey: string) => void;
  onMarkerHover?: (listingKey: string | null) => void;
  hoveredProperty?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export default function SmartZoloMap(props: SmartZoloMapProps) {
  const [mapStatus, setMapStatus] = useState<'loading' | 'success' | 'fallback'>('loading');
  const [networkTest, setNetworkTest] = useState<'testing' | 'success' | 'failed'>('testing');

  useEffect(() => {
    // Test network connectivity to OpenStreetMap
    const testNetwork = async () => {
      try {
        // Test if we can reach OpenStreetMap
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch('https://tile.openstreetmap.org/0/0/0.png', {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        setNetworkTest('success');
        
        // Give the real map a chance to load
        setTimeout(() => {
          if (mapStatus === 'loading') {
            setMapStatus('success');
          }
        }, 2000);

      } catch (error) {
        console.warn('Network test failed:', error);
        setNetworkTest('failed');
        
        // Wait a bit more, then fallback
        setTimeout(() => {
          if (mapStatus === 'loading') {
            setMapStatus('fallback');
          }
        }, 3000);
      }
    };

    testNetwork();

    // Fallback timer - if map doesn't load in 10 seconds, use fallback
    const fallbackTimer = setTimeout(() => {
      if (mapStatus === 'loading') {
        setMapStatus('fallback');
      }
    }, 10000);

    return () => clearTimeout(fallbackTimer);
  }, [mapStatus]);

  if (mapStatus === 'loading') {
    return (
      <div className={`flex flex-col items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-8 ${props.className}`} style={props.style}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Loading Zolo-Style Map</h3>
          <p className="text-blue-600 mb-2">
            {networkTest === 'testing' && 'Testing network connectivity...'}
            {networkTest === 'success' && 'Network OK - Loading map components...'}
            {networkTest === 'failed' && 'Network issues detected - Preparing fallback...'}
          </p>
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p>• {networkTest === 'success' ? '✅' : '🔄'} Checking OpenStreetMap access</p>
            <p>• 🔄 Loading Leaflet library</p>
            <p>• 🔄 Initializing map controls</p>
            <p>• 🔄 Setting up property markers</p>
          </div>
          <div className="mt-4 text-xs text-blue-500">
            If this takes too long, we'll show a fallback view...
          </div>
        </div>
      </div>
    );
  }

  if (mapStatus === 'fallback') {
    return <FallbackMap {...props} />;
  }

  // Try to render the real map
  return <SimpleZoloMap {...props} />;
}
