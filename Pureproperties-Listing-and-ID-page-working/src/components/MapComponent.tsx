'use client';

import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import ClientOnly from '@/components/ClientOnly';
import { useState } from 'react';

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places'];

const containerStyle = {
  width: '100%',
  height: '600px'
};

const MapComponent = ({ properties = [] }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ClientOnly>
      {isLoading && (
        <div className="h-[600px] flex items-center justify-center">
          Loading map...
        </div>
      )}
      <LoadScript 
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}
        libraries={libraries}
        onLoad={() => setIsLoading(false)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 43.653225, lng: -79.383186 }}
          zoom={11}
        >
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={{
                lat: parseFloat(property.latitude),
                lng: parseFloat(property.longitude)
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </ClientOnly>
  );
};

export default MapComponent; 