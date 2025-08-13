// src/components/listing/LocationSelector.tsx
import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import { PropertyAddress } from '../shared/types';

const libraries = ['places'] as const;

interface LocationSelectorProps {
  address: PropertyAddress | null;
  searchValue: string;
  selectedLocation: google.maps.LatLngLiteral | null;
  onAddressChange: (address: PropertyAddress) => void;
  onSearchValueChange: (value: string) => void;
  onLocationChange: (location: google.maps.LatLngLiteral) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  address,
  searchValue,
  selectedLocation,
  onAddressChange,
  onSearchValueChange,
  onLocationChange,
  onContinue,
  onBack,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const autocompleteRef = useRef<HTMLInputElement>(null);

  const handlePlaceSelect = useCallback(() => {
    if (!isLoaded) return;

    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    // Extract address components
    let streetNumber = '';
    let streetName = '';
    let city = '';
    let province = '';
    let postalCode = '';

    place.address_components?.forEach((component) => {
      const types = component.types;

      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      }
      if (types.includes('route')) {
        streetName = component.long_name;
      }
      if (types.includes('locality')) {
        city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        province = component.short_name;
      }
      if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    });

    // First create the basic address object
    const addressData = {
      streetNumber,
      streetName,
      city,
      province,
      postalCode,
      location: {
        lat,
        lng
      }
    };

    // Fetch community data from IDX API using postal code
    fetch(`/api/properties/listings?postalCode=${postalCode}&city=${city}&limit=1`)
      .then(response => response.json())
      .then(data => {
        // Log the full response to see available community data
        console.log('IDX API Response:', data);

        // Extract community/city region from the first property in response
        const communityInfo = data.listings?.[0]?.CityRegion || data.listings?.[0]?.Community;
        
        // Update address with community info
        const enrichedAddress = {
          ...addressData,
          community: communityInfo
        };

        console.log('Enriched Address Data:', enrichedAddress);
        onAddressChange(enrichedAddress);
      })
      .catch(error => {
        console.error('Error fetching community data:', error);
        // Still update address even if community fetch fails
        onAddressChange(addressData);
      });
  }, [isLoaded, onAddressChange, onLocationChange, onSearchValueChange]);

  if (loadError) {
    return (
      <div className="text-center text-red-600">
        Error loading maps. Please try again later.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        Loading maps...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Where is your property located?
      </h2>

      <div className="space-y-6">
        {/* Address Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Enter property address"
            className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            onFocus={handlePlaceSelect}
            ref={autocompleteRef}
          />
        </div>

        {/* Map Display */}
        <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
          <GoogleMap
            zoom={selectedLocation ? 18 : 12}
            center={selectedLocation || { lat: 45.4215, lng: -75.6972 }} // Default to Ottawa
            mapContainerClassName="w-full h-full"
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            {selectedLocation && <MarkerF position={selectedLocation} />}
          </GoogleMap>
        </div>

        {/* Address Preview */}
        {address && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Selected Address:</h3>
            <p className="text-blue-800">
              {address.streetNumber} {address.streetName}
              {address.unitNumber && `, Unit ${address.unitNumber}`}
              <br />
              {address.city}, {address.province} {address.postalCode}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          <button
            onClick={onBack}
            className="px-8 py-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            Back
          </button>
          <button
            onClick={onContinue}
            disabled={!address?.streetNumber || !address?.streetName || !selectedLocation}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
              !address?.streetNumber || !address?.streetName || !selectedLocation
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
};