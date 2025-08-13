'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface MarkerData {
  position: [number, number];
  popup?: string;
  price?: number;
  listingKey?: string;
  address?: string;
  onClick?: () => void;
  className?: string;
  isHighlighted?: boolean;
}

interface ReactLeafletMapProps {
  center: [number, number];
  zoom?: number;
  height?: string;
  markers?: MarkerData[];
  className?: string;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

// Create a completely client-side map component
const ClientSideMap = dynamic(
  () => import('./ClientSideMapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function ReactLeafletMap(props: ReactLeafletMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`h-[600px] flex items-center justify-center bg-gray-100 rounded-lg ${props.className || ''}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Initializing map...</p>
        </div>
      </div>
    );
  }

  return <ClientSideMap {...props} />;
}
