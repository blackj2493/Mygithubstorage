import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';

interface PricingDetailsProps {
  listingType: 'SALE' | 'RENT' | null;
  leaseDetails: LeaseDetails;
  setLeaseDetails: (details: LeaseDetails) => void;
  saleDetails: SaleDetails;
  setSaleDetails: (details: SaleDetails) => void;
  onContinue: () => void;
  onBack: () => void;
  exteriorDetails: ExteriorDetails;
  interiorDetails: InteriorDetails;
  address: Address;
}

// Add new types
type SimilarProperty = {
  ListPrice: number;
  Address: string;
  City: string;
  PurchaseContractDate: string;
  BedroomsTotal: number;
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
  exteriorDetails,
  interiorDetails,
  address
}) => {
  const [showSimilarProperties, setShowSimilarProperties] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<SimilarProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSimilarProperties = async () => {
    try {
      // Add validation logging
      console.log('Checking details:', {
        propertyType: exteriorDetails?.PropertyType,
        propertyClass: exteriorDetails?.PropertySubType,
        bedrooms: interiorDetails?.rooms?.bedrooms,
        city: address?.city
      });

      // Validate required fields
      if (!exteriorDetails || !exteriorDetails.PropertyType || !exteriorDetails.PropertySubType) {
        alert('Please ensure property type and class are selected in the exterior details section');
        return;
      }

      if (!interiorDetails?.rooms?.bedrooms) {
        alert('Please ensure number of bedrooms is specified in the interior details section');
        return;
      }

      if (!address?.city) {
        alert('Please ensure the property address is complete');
        return;
      }

      setIsLoading(true);
      const response = await fetch('/api/properties/similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          PropertyType: exteriorDetails.PropertyType,
          PropertySubType: exteriorDetails.PropertySubType,
          BedroomsTotal: interiorDetails.rooms.bedrooms,
          City: address.city
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch similar properties');
      }

      const data = await response.json();
      setSimilarProperties(data.properties);
      setShowSimilarProperties(true);
    } catch (error) {
      console.error('Error fetching similar properties:', error);
      alert('Error fetching similar properties. Please try again.');
    } finally {
      setIsLoading(false);
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

            {/* Add similar properties button for sale listings */}
            {listingType === 'SALE' && (
              <div className="mt-6">
                <button
                  onClick={fetchSimilarProperties}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Get Similar Properties'}
                </button>

                {showSimilarProperties && similarProperties.length > 0 && (
                  <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-blue-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Similar Properties
                    </h3>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">
                        Found {similarProperties.length} similar properties:
                      </h4>
                      <div className="max-h-60 overflow-y-auto">
                        {similarProperties.map((prop, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2">
                            <div className="font-medium">
                              ${prop.ListPrice.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {prop.Address}, {prop.City}
                            </div>
                            <div className="text-sm text-gray-500">
                              Sold on {new Date(prop.PurchaseContractDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {prop.BedroomsTotal} Bedrooms • {prop.PropertySubType}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {showSimilarProperties && similarProperties.length === 0 && (
                  <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-blue-100">
                    <p className="text-gray-700">
                      No similar properties found in your area with the specified criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
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