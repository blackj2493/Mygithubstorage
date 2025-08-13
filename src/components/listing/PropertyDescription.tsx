// src/components/listing/PropertyDescription.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';
import NeighborhoodInfo from '@/app/components/ui/NeighborhoodInfo';

interface PropertyDescriptionProps {
  description: PropertyDescription;
  onDescriptionChange: (description: PropertyDescription) => void;
  location: google.maps.LatLngLiteral | null;
  onContinue: () => void;
  onBack: () => void;
  propertyData?: PropertyData;
}

interface NeighborhoodData {
  schools: string[];
  parks: string[];
  shopping: string[];
  transit: string[];
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description,
  onDescriptionChange,
  location,
  onContinue,
  onBack,
  propertyData,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodData>({
    schools: [],
    parks: [],
    shopping: [],
    transit: []
  });

  // Debug logs to track data
  useEffect(() => {
    console.log('PropertyData:', propertyData);
    console.log('Location:', location);
    console.log('NeighborhoodData:', neighborhoodData);
  }, [propertyData, location, neighborhoodData]);

  const handleNeighborhoodData = (data: NeighborhoodData) => {
    console.log('Received neighborhood data:', data);
    setNeighborhoodData(data);
  };

  const generateAIDescription = async () => {
    console.log('Generating description with:', { propertyData, neighborhoodData });
    
    if (!propertyData) {
      console.error('PropertyData is missing');
      return;
    }
    
    setIsGenerating(true);
    try {
      const dataToSend = {
        ...propertyData,
        neighborhoodData: {
          schools: neighborhoodData.schools || [],
          transit: neighborhoodData.transit || [],
          shopping: neighborhoodData.shopping || [],
          parks: neighborhoodData.parks || []
        }
      };

      console.log('Sending to API:', dataToSend);

      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      onDescriptionChange({
        ...description,
        remarksForClients: data.description,
      });
    } catch (error) {
      console.error('Failed to generate description:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto p-4"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Public Description Card */}
        <Card>
          <CardHeader>
            <CardTitle>Property Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Public Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description.remarksForClients}
                  onChange={(e) =>
                    onDescriptionChange({
                      ...description,
                      remarksForClients: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={6}
                  placeholder="Write a compelling description for potential buyers/renters..."
                />
                {/* AI Description Generator */}
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={generateAIDescription}
                    disabled={isGenerating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                  >
                    {isGenerating ? 'Generating...' : 'Generate AI Description'}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Private Remarks Card */}
        <Card>
          <CardHeader>
            <CardTitle>Private Remarks (Agent Only)</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <textarea
                value={description.remarksForAgents}
                onChange={(e) =>
                  onDescriptionChange({
                    ...description,
                    remarksForAgents: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                placeholder="Add private notes for other agents (showing instructions, offers, etc.)..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <textarea
                value={description.additionalDetails}
                onChange={(e) =>
                  onDescriptionChange({
                    ...description,
                    additionalDetails: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                placeholder="Any additional property details or features..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Neighborhood Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Neighborhood Information</CardTitle>
          </CardHeader>
          <CardContent>
            {location ? (
              <NeighborhoodInfo 
                location={location} 
                onDataFetched={handleNeighborhoodData}
              />
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
          <button
            onClick={onContinue}
            disabled={!description.remarksForClients.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDescription;