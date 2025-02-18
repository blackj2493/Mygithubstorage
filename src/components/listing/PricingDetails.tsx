import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';
import PropertyCard from '@/components/PropertyCard';

interface PricingDetailsProps {
  listingType: 'SALE' | 'RENT' | null;
  leaseDetails: LeaseDetails;
  setLeaseDetails: (details: LeaseDetails) => void;
  saleDetails: SaleDetails;
  setSaleDetails: (details: SaleDetails) => void;
  onContinue: () => void;
  onBack: () => void;
  exteriorFeatures: {
    PropertyType: string;
    PropertySubType: string;
    LinkYN: boolean;
    ParcelOfTiedLand: boolean;
    ConstructionMaterials: string[];
    ExteriorFeatures: string[];
    Utilities: {
      Water: string;
      Sewers: string;
      Pool: string;
    };
    Area: string;
    City: string;
    CityRegion: string;
    GarageType: string;
    ParkingFeatures: string[];
    ParkingTotal: number;
    ParkingSpaces: number;
    CoveredSpaces: number;
  };
  interiorDetails: InteriorDetails;
  address: Address;
}

// Add new types
type SimilarProperty = {
  ListPrice: number;
  Address: string;
  City: string;
  PurchaseContractDate: string;
  BedroomsAboveGrade: number;
  PropertyType: string;
  PropertySubType: string;
};

export const PricingDetails: React.FC<PricingDetailsProps> = ({
  listingType,
  leaseDetails,
  setLeaseDetails,
  saleDetails,
  setSaleDetails,
  onContinue,
  onBack,
  exteriorFeatures,
  interiorDetails,
  address
}) => {
  const [showSimilarProperties, setShowSimilarProperties] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<SimilarProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState<{
    estimatedPrice: number;
    confidence: number;
    comparablesCount: number;
    basePrice: number;
  } | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProperties, setTotalProperties] = useState(0);

  useEffect(() => {
    console.log('PricingDetails - Component mounted');
    console.log('exteriorFeatures received:', exteriorFeatures);
    console.log('interiorDetails received:', interiorDetails);
  }, []);

  const fetchSimilarProperties = async () => {
    try {
      setIsLoading(true);
      setShowSimilarProperties(true);
      
      const propertyData = {
        BedroomsAboveGrade: interiorDetails?.rooms?.BedroomsAboveGrade || 0,
        CityRegion: exteriorFeatures?.CityRegion || '',
        PropertySubType: exteriorFeatures?.PropertyType || '',
        CoveredSpaces: exteriorFeatures?.CoveredSpaces || 0
      };

      console.log('PropertyData to be sent:', propertyData);

      const response = await fetch('/api/properties/similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyData,
          listingType
        })
      });

      const data = await response.json();
      console.log('Similar properties response:', data);

      // Check if we have properties array in the response
      if (Array.isArray(data.properties)) {
        setSimilarProperties(data.properties);
        setTotalProperties(data.totalProperties || data.properties.length);
        setError(null);
        console.log('Set similar properties:', data.properties.length);
      } else {
        // If no properties array, check if the data itself is an array
        if (Array.isArray(data)) {
          setSimilarProperties(data);
          setTotalProperties(data.length);
          setError(null);
          console.log('Set similar properties:', data.length);
        } else {
          throw new Error('Invalid response format');
        }
      }

    } catch (error) {
      console.error('Error in fetchSimilarProperties:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch similar properties');
      setSimilarProperties([]);
      setTotalProperties(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Similar properties state updated:', similarProperties?.length || 0);
  }, [similarProperties]);

  const getPriceEstimate = async () => {
    try {
      setIsEstimating(true);
      console.log('Sending data:', {
        Community: exteriorFeatures.CityRegion,
        BedroomsAboveGrade: interiorDetails.rooms.BedroomsAboveGrade,
        PropertyType: exteriorFeatures.PropertyClass,
        ParkingTotal: exteriorFeatures.ParkingTotal,
        Basement: interiorDetails.basement?.type || 'unfinished',
        KitchensTotal: interiorDetails.rooms.kitchens,
        LotDepth: exteriorFeatures.lot?.depth || 0,
        LotWidth: exteriorFeatures.lot?.width || 0,
        PostalCode: address.postalCode
      });

      const response = await fetch('/api/properties/price-perfect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyData: {
            Community: exteriorFeatures.CityRegion,
            BedroomsAboveGrade: interiorDetails.rooms.BedroomsAboveGrade,
            PropertyType: exteriorFeatures.PropertyClass,
            ParkingTotal: exteriorFeatures.ParkingTotal,
            Basement: interiorDetails.basement?.type || 'unfinished',
            KitchensTotal: interiorDetails.rooms.kitchens,
            LotDepth: exteriorFeatures.lot?.depth || 0,
            LotWidth: exteriorFeatures.lot?.width || 0,
            PostalCode: address.postalCode
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get price estimate');
      }

      const data = await response.json();
      setPriceEstimate(data);
    } catch (error) {
      console.error('Error getting price estimate:', error);
      alert('Unable to calculate price estimate. Please try again later.');
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {listingType === 'RENT' ? 'Lease Details' : 'Sale Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {listingType === 'RENT' ? 'Lease Price *' : 'List Price *'}
                </label>
                <input
                  type="number"
                  value={listingType === 'RENT' ? leaseDetails.leasePrice : saleDetails.listPrice}
                  onChange={(e) => {
                    if (listingType === 'RENT') {
                      setLeaseDetails({
                        ...leaseDetails,
                        leasePrice: e.target.value
                      });
                    } else {
                      setSaleDetails({
                        ...saleDetails,
                        listPrice: e.target.value
                      });
                    }
                  }}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {listingType === 'SALE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HST Applicable *
                  </label>
                  <select
                    value={saleDetails.hstApplicable || ''}
                    onChange={(e) => setSaleDetails({
                      ...saleDetails,
                      hstApplicable: e.target.value as 'Call LBO' | 'Included' | 'No' | 'Yes' | null
                    })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select Option</option>
                    <option value="Call LBO">Call LBO</option>
                    <option value="Included">Included</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              )}
            </div>

            {/* Rental Specific Fields */}
            {listingType === 'RENT' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lease Term *
                    </label>
                    <select
                      value={leaseDetails.leaseTerm}
                      onChange={(e) => setLeaseDetails({
                        ...leaseDetails,
                        leaseTerm: e.target.value
                      })}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select Term</option>
                      <option value="Month-to-Month">Month-to-Month</option>
                      <option value="6 Months">6 Months</option>
                      <option value="1 Year">1 Year</option>
                      <option value="2 Years">2 Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Frequency
                    </label>
                    <select
                      value={leaseDetails.paymentFrequency}
                      onChange={(e) => setLeaseDetails({
                        ...leaseDetails,
                        paymentFrequency: e.target.value
                      })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Frequency</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-weekly">Bi-weekly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Sale Specific Fields */}
            {listingType === 'SALE' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Taxes *
                  </label>
                  <input
                    type="number"
                    value={saleDetails.taxes}
                    onChange={(e) => setSaleDetails({
                      ...saleDetails,
                      taxes: e.target.value
                    })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Year *
                  </label>
                  <input
                    type="number"
                    value={saleDetails.taxYear}
                    onChange={(e) => setSaleDetails({
                      ...saleDetails,
                      taxYear: e.target.value
                    })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
            )}

            {/* Common Possession Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Possession Date *
                </label>
                <input
                  type="date"
                  value={listingType === 'RENT' ? leaseDetails.possessionDate : saleDetails.possessionDate}
                  onChange={(e) => {
                    if (listingType === 'RENT') {
                      setLeaseDetails({
                        ...leaseDetails,
                        possessionDate: e.target.value
                      });
                    } else {
                      setSaleDetails({
                        ...saleDetails,
                        possessionDate: e.target.value
                      });
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Possession Remarks
                </label>
                <input
                  type="text"
                  value={listingType === 'RENT' ? leaseDetails.possessionRemarks : saleDetails.possessionRemarks}
                  onChange={(e) => {
                    if (listingType === 'RENT') {
                      setLeaseDetails({
                        ...leaseDetails,
                        possessionRemarks: e.target.value
                      });
                    } else {
                      setSaleDetails({
                        ...saleDetails,
                        possessionRemarks: e.target.value
                      });
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                  maxLength={14}
                />
              </div>
            </div>

            {/* Similar properties button and container */}
            <div className="mt-6">
              <button
                onClick={fetchSimilarProperties}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Get Similar Properties recently Sold in the Area'}
              </button>

              {showSimilarProperties && (
                <div className="mt-6">
                  {isLoading ? (
                    <div className="text-center py-4">Loading similar properties...</div>
                  ) : error ? (
                    <div className="text-red-500 py-4">{error}</div>
                  ) : similarProperties?.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Similar Properties ({totalProperties})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {similarProperties.map((property) => (
                          <PropertyCard
                            key={property.ListingKey || property.id}
                            property={property}
                            showFavorite={false}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">No similar properties found</div>
                  )}
                </div>
              )}
            </div>

            {/* PricePerfect AI Section */}
            <div className="mt-6">
              <button
                onClick={getPriceEstimate}
                disabled={isEstimating}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isEstimating ? 'Calculating...' : 'Get PricePerfect AI™ Estimate'}
              </button>

              {priceEstimate && (
                <div className="mt-4 p-6 border border-purple-200 rounded-xl bg-purple-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-900">
                      PricePerfect AI™ Estimate
                    </h3>
                    <span className={`px-3 py-1 rounded-full ${
                      priceEstimate.confidence >= 80 ? 'bg-green-100 text-green-800' :
                      priceEstimate.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {priceEstimate.confidence}% Confidence
                    </span>
                  </div>

                  <p className="text-3xl font-bold text-purple-700 mb-4">
                    {new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                      maximumFractionDigits: 0
                    }).format(priceEstimate.estimatedPrice)}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Based on {priceEstimate.comparablesCount} comparable properties</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!isValid()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );

  function isValid() {
    if (listingType === 'RENT') {
      return !!(leaseDetails.leasePrice && leaseDetails.leaseTerm && leaseDetails.possessionDate);
    } else {
      return !!(
        saleDetails.listPrice &&
        saleDetails.hstApplicable &&
        saleDetails.taxes &&
        saleDetails.taxYear &&
        saleDetails.possessionDate
      );
    }
  }
};

export default PricingDetails;