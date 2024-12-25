'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface PropertyLocationProps {
  property: any;
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!property.Latitude || !property.Longitude) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
    });

    loader.load().then((google) => {
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: property.Latitude, lng: property.Longitude },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
      });

      new google.maps.Marker({
        position: { lat: property.Latitude, lng: property.Longitude },
        map,
        title: [
          property.StreetNumber,
          property.StreetName,
          property.StreetSuffix,
          property.StreetDirSuffix
        ].filter(Boolean).join(' '),
      });
    });
  }, [property]);

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Location</h2>
      
      {/* Address Details */}
      <div className="mb-4">
        <p className="font-semibold">
          {[
            property.StreetNumber,
            property.StreetName,
            property.StreetSuffix,
            property.StreetDirSuffix
          ].filter(Boolean).join(' ')}
        </p>
        <p className="text-gray-600">
          {property.City}, {property.StateOrProvince} {property.PostalCode}
        </p>
      </div>

      {/* Neighborhood Info */}
      {property.CityRegion && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Neighborhood</h3>
          <p className="text-gray-600">{property.CityRegion}</p>
        </div>
      )}

      {/* Map */}
      {(property.Latitude && property.Longitude) ? (
        <div 
          ref={mapRef} 
          className="w-full h-[300px] rounded-lg overflow-hidden"
        />
      ) : (
        <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Map location not available</p>
        </div>
      )}

      {/* Additional Location Details */}
      {property.DirectionFaces && (
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Property Faces</h3>
          <p className="text-gray-600">{property.DirectionFaces}</p>
        </div>
      )}

      {property.CrossStreet && (
        <div className="mt-2">
          <h3 className="font-semibold mb-1">Cross Street</h3>
          <p className="text-gray-600">{property.CrossStreet}</p>
        </div>
      )}
    </section>
  );
} 