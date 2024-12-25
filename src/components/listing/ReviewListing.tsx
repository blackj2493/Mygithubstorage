import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';

interface ReviewListingProps {
  listingType: 'SALE' | 'RENT';
  propertyDetails: PropertyDetails;
  address: PropertyAddress;
  interiorDetails: InteriorDetails;
  exteriorDetails: ExteriorDetails;
  saleDetails: SaleDetails | null;
  leaseDetails: LeaseDetails | null;
  propertyDescription: PropertyDescription;
  selectedImages: string[];
  onBack: () => void;
  onPublish: () => void;
  onSaveAsDraft: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export const ReviewListing: React.FC<ReviewListingProps> = ({
  listingType,
  propertyDetails,
  address,
  interiorDetails,
  exteriorDetails,
  saleDetails,
  leaseDetails,
  propertyDescription,
  selectedImages,
  onBack,
  onPublish,
  onSaveAsDraft,
  isSubmitting,
  error,
}) => {
  // Safe render helper function
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      if (value.type) return value.type;
      if (value.value) return value.value;
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Add a safety check function for bathrooms
  const calculateTotalBathrooms = (washrooms?: Array<{ number: string }>) => {
    // First check if washrooms exists and is an array
    if (!washrooms || !Array.isArray(washrooms) || washrooms.length === 0) {
      return 0;
    }
  
    // Safely reduce the array
    return washrooms.reduce((total, washroom) => {
      // Check if washroom and washroom.number exist
      if (!washroom || !washroom.number) return total;
      const number = parseInt(washroom.number);
      return total + (isNaN(number) ? 0 : number);
    }, 0);
  };
  return (
    <div className="max-w-4xl mx-auto fade-in">
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Review Your Property Listing
      </h2>

      <div className="space-y-6">
        {/* Property Type & Location */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Listing Type</h4>
                <p>{safeRender(listingType)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Property Type</h4>
                <p>{safeRender(exteriorDetails.propertyType)}</p>
              </div>
              <div className="col-span-2">
                <h4 className="font-medium text-gray-700">Address</h4>
                <p>
                  {safeRender(address.streetNumber)} {safeRender(address.streetName)}
                  {address.unitNumber && `, Unit ${address.unitNumber}`}
                </p>
                <p>
                  {safeRender(address.city)}, {safeRender(address.province)} {safeRender(address.postalCode)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Interior Features */}
<Card>
  <CardHeader>
    <CardTitle>Interior Features</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <h4 className="font-medium text-gray-700">Bedrooms</h4>
        <p>{safeRender(interiorDetails.numberOfBedrooms)}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Bathrooms</h4>
        <p>{calculateTotalBathrooms(interiorDetails?.washrooms || [])}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Total Rooms</h4>
        <p>{safeRender(interiorDetails.numberOfRooms)}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Kitchens</h4>
        <p>{safeRender(interiorDetails.numberOfKitchens)}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Basement</h4>
        <p>{safeRender(interiorDetails.basement)}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Heating</h4>
        <p>{safeRender(interiorDetails.heatType)}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Air Conditioning</h4>
        <p>{safeRender(interiorDetails.airConditioning)}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Furnished</h4>
        <p>{safeRender(interiorDetails.furnished)}</p>
      </div>
    </div>
  </CardContent>
</Card>

        {/* Exterior Features */}
        <Card>
          <CardHeader>
            <CardTitle>Exterior Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Exterior Material</h4>
                <p>{Array.isArray(exteriorDetails.exterior) 
                    ? exteriorDetails.exterior.map(ext => safeRender(ext)).join(', ')
                    : safeRender(exteriorDetails.exterior)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Roof</h4>
                <p>{safeRender(exteriorDetails.roof)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Water</h4>
                <p>{safeRender(exteriorDetails.water)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Sewers</h4>
                <p>{safeRender(exteriorDetails.sewers)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Pool</h4>
                <p>{safeRender(exteriorDetails.pool)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price & Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Price & Terms</CardTitle>
          </CardHeader>
          <CardContent>
            {listingType === 'SALE' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">List Price</h4>
                  <p>${Number(saleDetails?.listPrice || 0).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">HST Applicable</h4>
                  <p>{safeRender(saleDetails?.hstApplicable)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Property Taxes</h4>
                  <p>${Number(saleDetails?.taxes || 0).toLocaleString()} ({saleDetails?.taxYear || 'N/A'})</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Possession Date</h4>
                  <p>{saleDetails?.possessionDate ? new Date(saleDetails.possessionDate).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Monthly Rent</h4>
                  <p>${Number(leaseDetails?.leasePrice || 0).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Lease Term</h4>
                  <p>{safeRender(leaseDetails?.leaseTerm)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Payment Frequency</h4>
                  <p>{safeRender(leaseDetails?.paymentFrequency)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Possession Date</h4>
                  <p>{leaseDetails?.possessionDate ? new Date(leaseDetails.possessionDate).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Property Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Description</h4>
                <p className="whitespace-pre-line">{safeRender(propertyDescription.remarksForClients)}</p>
              </div>
              {propertyDescription.extras && (
                <div>
                  <h4 className="font-medium text-gray-700">Extras</h4>
                  <p>{safeRender(propertyDescription.extras)}</p>
                </div>
              )}
              {propertyDescription.inclusions && (
                <div>
                  <h4 className="font-medium text-gray-700">Inclusions</h4>
                  <p>{safeRender(propertyDescription.inclusions)}</p>
                </div>
              )}
              {propertyDescription.exclusions && (
                <div>
                  <h4 className="font-medium text-gray-700">Exclusions</h4>
                  <p>{safeRender(propertyDescription.exclusions)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedImages.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white
                                  text-xs px-2 py-1 rounded">
                      Main Photo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Back to Edit
          </button>
          
          <div className="space-x-4">
            <button
              onClick={onSaveAsDraft}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 
                       disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>
            
            <button
              onClick={onPublish}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                       disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewListing;