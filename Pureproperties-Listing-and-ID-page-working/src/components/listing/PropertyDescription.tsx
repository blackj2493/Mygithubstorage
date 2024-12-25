// src/components/listing/PropertyDescription.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';
import NeighborhoodInfo from '@/app/components/ui/NeighborhoodInfo';

interface PropertyDescriptionProps {
  description: PropertyDescription;
  onDescriptionChange: (description: PropertyDescription) => void;
  location: google.maps.LatLngLiteral | null;
  onContinue: () => void;
  onBack: () => void;
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description,
  onDescriptionChange,
  location,
  onContinue,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Property Description and Details
      </h2>

      <div className="space-y-6">
        {/* Main Description */}
        <Card>
          <CardHeader>
            <CardTitle>Property Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Description *
                <span className="float-right text-xs text-gray-400">
                  {description.remarksForClients.length}/2000
                </span>
              </label>
              <textarea
                value={description.remarksForClients}
                onChange={(e) => onDescriptionChange({
                  ...description,
                  remarksForClients: e.target.value
                })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                rows={8}
                maxLength={2000}
                placeholder="Provide a comprehensive description of the property, highlighting its key features, recent upgrades, and unique selling points..."
                required
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extras
                <span className="float-right text-xs text-gray-400">
                  {description.extras.length}/240
                </span>
              </label>
              <textarea
                value={description.extras}
                onChange={(e) => onDescriptionChange({
                  ...description,
                  extras: e.target.value
                })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={240}
                placeholder="List any additional features or amenities..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Inclusions & Exclusions */}
        <Card>
          <CardHeader>
            <CardTitle>Inclusions & Exclusions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inclusions
                  <span className="float-right text-xs text-gray-400">
                    {description.inclusions.length}/250
                  </span>
                </label>
                <textarea
                  value={description.inclusions}
                  onChange={(e) => onDescriptionChange({
                    ...description,
                    inclusions: e.target.value
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  maxLength={250}
                  placeholder="List items included in the sale/rental..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exclusions
                  <span className="float-right text-xs text-gray-400">
                    {description.exclusions.length}/250
                  </span>
                </label>
                <textarea
                  value={description.exclusions}
                  onChange={(e) => onDescriptionChange({
                    ...description,
                    exclusions: e.target.value
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  maxLength={250}
                  placeholder="List items excluded from the sale/rental..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental Items */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Items
                <span className="float-right text-xs text-gray-400">
                  {description.rentalItems.length}/250
                </span>
              </label>
              <textarea
                value={description.rentalItems}
                onChange={(e) => onDescriptionChange({
                  ...description,
                  rentalItems: e.target.value
                })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                rows={4}
                maxLength={250}
                placeholder="List any items that are available for rent..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Neighborhood Information */}
        <Card>
          <CardHeader>
            <CardTitle>Neighborhood Information</CardTitle>
          </CardHeader>
          <CardContent>
            {location ? (
              <NeighborhoodInfo location={location} />
            ) : (
              <div className="text-center text-gray-500">
                Location information not available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Back
          </button>

          <div className="space-x-4">
            <button
              onClick={onContinue}
              disabled={!description.remarksForClients.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDescription;