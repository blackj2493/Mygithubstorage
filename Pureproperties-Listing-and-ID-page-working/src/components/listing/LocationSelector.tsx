// src/components/listing/LocationSelector.tsx
import React, { useCallback } from 'react';
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

  const handlePlaceSelect = useCallback(() => {
    if (!isLoaded) return;

    const autocompleteInput = document.querySelector(
      'input[placeholder="Enter property address"]'
    ) as HTMLInputElement;
    if (!autocompleteInput) return;

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput, {
      componentRestrictions: { country: 'CA' }, // Restrict to Canada
      fields: ['address_components', 'geometry', 'formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry?.location) {
        console.error('No place details available');
        return;
      }

      // Set the location
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      onLocationChange(newLocation);

      // Process address components
      if (place.address_components) {
        const addressComponents = place.address_components;

        const newAddress: PropertyAddress = {
          streetNumber: addressComponents.find((component) =>
            component.types.includes('street_number')
          )?.long_name || '',
          streetName: addressComponents.find((component) =>
            component.types.includes('route')
          )?.long_name || '',
          streetType: '',
          city: addressComponents.find((component) =>
            component.types.includes('locality')
          )?.long_name || '',
          province: addressComponents.find((component) =>
            component.types.includes('administrative_area_level_1')
          )?.long_name || '',
          postalCode: addressComponents.find((component) =>
            component.types.includes('postal_code')
          )?.long_name || '',
          unitNumber: '',
        };

        onAddressChange(newAddress);
        onSearchValueChange(place.formatted_address || '');
      }
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