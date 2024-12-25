'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLoadScript, GoogleMap, Autocomplete, MarkerF, Marker } from '@react-google-maps/api';
import ImageUpload from '@/app/components/ui/ImageUpload';
import StepProgressBar from '@/components/ui/StepProgressBar';
import NeighborhoodInfo from '@/app/components/ui/NeighborhoodInfo';
import { motion } from 'framer-motion';

// Import new components
import ExteriorFeatures from '@/components/listing/ExteriorFeatures';
import InteriorFeatures from '@/components/listing/InteriorFeatures';
import ListingType from '@/components/listing/ListingType';
import LocationSelector from '@/components/listing/LocationSelector';
import PricingDetails from '@/components/listing/PricingDetails';
import PropertyDescription from '@/components/listing/PropertyDescription';
import ReviewListing from '@/components/listing/ReviewListing';

const libraries = ['places'];

const colors = {
  primary: '#2563EB',
  secondary: '#F3F4F6',
  accent: '#8B5CF6',
  success: '#10B981',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
  }
};

const steps = [
  {
    id: 1,
    title: 'Listing Type',
    description: 'Sale or Rent'
  },
  {
    id: 2,
    title: 'Location',
    description: 'Property Address'
  },
  {
    id: 3,   
    title: 'Property Features-Exterior',
    description: 'Exterior Details'
  },
  {
    id: 4,   
    title: 'Property Features-Interior',
    description: 'Interior Details'
  },
  {
    id: 5,
    title: 'Amount & Possession',
    description: 'Terms & Requirements'
  },
  {
    id: 6,
    title: 'Description',
    description: 'Property Description'
  },
  {
    id: 7,
    title: 'Photos',
    description: 'Upload Images'
  },
  {
    id: 8,
    title: 'Review',
    description: 'Review Details'
  }
];

type PropertyAddress = {
  streetNumber: string;
  streetName: string;
  streetType: string;
  city: string;
  province: string;
  postalCode: string;
  unitNumber?: string;
};

// All your existing type definitions
type PropertyClass = 'Residential Freehold' | 'Residential Condo & Other' | 'Commercial';
type PropertyType = 'Att/Row/Townhouse' | 'Cottage' | 'Detached' | 'Duplex' | 'Farm' | 'Fourplex' | 
  'Link' | 'MobileTrailer' | 'Multiplex' | 'Other' | 'Rural Residential' | 'Semi-Detached' | 
  'Store W Apt/Office' | 'Triplex' | 'Vacant Land';
 
  export default function CreateListingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
    // Listing Type State
    const [listingType, setListingType] = useState<'SALE' | 'RENT' | null>(null);
    
    // Location State
    const [address, setAddress] = useState<PropertyAddress | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  
    // Property Details State
    const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
      propertyClass: null,
      propertyType: null,
      lotWidth: '',
      lotDepth: '',
      mainCrossing: ''
    });
  
    // Interior Details State
    const [interiorDetails, setInteriorDetails] = useState({
      rooms: {
        total: 0,
        bedrooms: 0,
        bathrooms: 0,
        kitchens: 0,
        additionalInfo: ''
      },
      basement: {
        type: '',
        hasFamily: false
      },
      laundry: {
        level: '',
        features: []
      },
      hvac: {
        heatType: '',
        heatSource: '',
        airConditioning: ''
      },
      furnished: ''
    });
  
    // Exterior Details State
    const [exteriorDetails, setExteriorDetails] = useState({
      PropertyType: '',
      PropertySubType: '',
      area: '',
      municipality: '',
      community: '',
      link: false,
      parcelOfTiedLand: false,
      portionForLease: [],
      portionComments: '',
      style: null,
      view: '',
      exterior: [],
      exteriorFeatures: [],
      foundationDetail: '',
      roof: '' as RoofType,
      topography: '',
      garageType: null,
      garageParkingSpaces: '',
      parkingDrive: '',
      driveParkingSpaces: '',
      totalParkingSpaces: '',
      parkingCostMonth: '',
      water: '' as WaterType,
      pool: '' as YesNoNA,
      sewers: '' as SewerType,
      retirementCommunity: false,
      physicallyHandicappedEquipped: false,
      specialDesignations: [],
      privateEntrance: false,
      approximateAge: '',
      approximateSquareFootage: '',
      utilities: {
        water: '',
        sewers: '',
        pool: ''
      },
      exteriorMaterial: []
    });
  
    // Property Description State
    const [propertyDescription, setPropertyDescription] = useState<PropertyDescription>({
      remarksForClients: '',
      extras: '',
      inclusions: '',
      exclusions: '',
      rentalItems: ''
    });
  
    // Lease Details State
    const [leaseDetails, setLeaseDetails] = useState<LeaseDetails>({
      leasePrice: '',
      possessionDate: '',
      possessionRemarks: '',
      leaseTerm: '',
      paymentFrequency: '',
      paymentMethod: '',
      includedInLeaseCost: '',
      requirements: {
        rentalApplication: false,
        depositRequired: false,
        creditCheck: false,
        employmentLetter: false,
        leaseAgreement: false,
        referencesRequired: false,
        nonSmokingPolicy: false,
        buyOption: false
      }
    });
  
    // Sale Details State
    const [saleDetails, setSaleDetails] = useState<SaleDetails>({
      listPrice: '',
      hstApplicable: null,
      taxes: '',
      taxYear: '',
      assessment: '',
      assessmentYear: '',
      possessionDate: '',
      possessionRemarks: '',
      mortgageComments: ''
    });
  
    // Image Upload State
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
    // Submission Status State
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({
      isSubmitting: false,
      error: null,
      progress: 0
    });
  
    // Google Maps Setup
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      libraries: libraries as any,
    });
  
    const handlePlaceSelect = useCallback(() => {
      if (!isLoaded) return;
  
      const autocompleteInput = document.querySelector('input[placeholder="Enter property address"]') as HTMLInputElement;
      if (!autocompleteInput) return;
  
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput);
  
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
  
        if (!place.geometry?.location) {
          console.error('No place details available');
          return;
        }
  
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setSelectedLocation(newLocation);
  
        if (place.address_components) {
          const addressComponents = place.address_components;
  
          const newAddress = {
            streetNumber: addressComponents.find(component =>
              component.types.includes('street_number'))?.long_name || '',
            streetName: addressComponents.find(component =>
              component.types.includes('route'))?.long_name || '',
            streetType: '',
            city: addressComponents.find(component =>
              component.types.includes('locality'))?.long_name || '',
            province: addressComponents.find(component =>
              component.types.includes('administrative_area_level_1'))?.long_name || '',
            postalCode: addressComponents.find(component =>
              component.types.includes('postal_code'))?.long_name || '',
            unitNumber: ''
          };
  
          setAddress(newAddress);
          setSearchValue(place.formatted_address || '');
        }
      });
    }, [isLoaded]);
    // Navigation and Step Management
  const handleStepClick = (stepId: number) => {
    if (currentStep >= 3 && stepId >= 3 && stepId <= 6) {
      setCurrentStep(stepId);
    } else if (stepId === currentStep) {
      return;
    } else if (stepId < 3 && currentStep < 3) {
      setCurrentStep(stepId);
    }
  };

  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  // Submission Handlers
  const handleSaveAsDraft = async () => {
    try {
      setSubmissionStatus(prev => ({ ...prev, isSubmitting: true, error: null }));
      
      const listingData = {
        status: 'DRAFT',
        listingType,
        
        // Basic Property Info
        title: `${propertyDetails.propertyType} in ${address?.city || ''}`,
        type: listingType,
        
        // Location
        streetNumber: address?.streetNumber || '',
        streetName: address?.streetName || '',
        unitNumber: address?.unitNumber || '',
        city: address?.city || '',
        province: address?.province || '',
        postalCode: address?.postalCode || '',
        location: selectedLocation,
  
        // Property Details
        propertyType: exteriorDetails.propertyType,
        price: listingType === 'SALE' ? parseFloat(saleDetails.listPrice) : parseFloat(leaseDetails.leasePrice),
        bedrooms: parseInt(interiorDetails.numberOfBedrooms),
        bathrooms: interiorDetails.washrooms.reduce((total, washroom) => 
          total + (parseInt(washroom.number) || 0), 0),
        squareFeet: parseFloat(exteriorDetails.approximateSquareFootage || '0'),
        description: propertyDescription.remarksForClients,
        features: [
          ...exteriorDetails.exteriorFeatures,
          ...interiorDetails.interiorFeatures
        ],
  
        // Additional Details
        exteriorDetails,
        interiorDetails,
        
        // Sale/Lease Specific Details
        ...(listingType === 'SALE' ? {
          listPrice: saleDetails.listPrice,
          hstApplicable: saleDetails.hstApplicable,
          taxes: saleDetails.taxes,
          taxYear: saleDetails.taxYear,
          assessment: saleDetails.assessment,
          assessmentYear: saleDetails.assessmentYear,
          possessionDate: saleDetails.possessionDate,
          possessionRemarks: saleDetails.possessionRemarks,
        } : {
          leasePrice: leaseDetails.leasePrice,
          leaseTerm: leaseDetails.leaseTerm,
          paymentFrequency: leaseDetails.paymentFrequency,
          paymentMethod: leaseDetails.paymentMethod,
          leaseRequirements: leaseDetails.requirements,
          possessionDate: leaseDetails.possessionDate,
          possessionRemarks: leaseDetails.possessionRemarks,
        }),
  
        // Images
        images: selectedImages.map(url => ({ url })),
        
        propertyDescription,
      };
  
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listingData)
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save draft');
      }
  
      router.push('/dashboard/listings');
    } catch (error) {
      setSubmissionStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to save draft'
      }));
    } finally {
      setSubmissionStatus(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handlePublishListing = async () => {
    try {
      const listingData = {
        status: 'PUBLISHED',
        listingType: listingType,
        addressStreet: `${address?.streetNumber} ${address?.streetName}`.trim(),
        addressCity: address?.city || '',
        addressProvince: address?.province || '',
        addressPostalCode: address?.postalCode || '',
        addressUnit: address?.unitNumber || '',
        propertyType: exteriorDetails.PropertyType,
        propertyStyle: exteriorDetails.style || null,
        numberOfBedrooms: Number(interiorDetails.numberOfBedrooms),
        numberOfBathrooms: interiorDetails.washrooms.reduce(
          (total, washroom) => total + (Number(washroom.number) || 0), 
          0
        ),
        price: listingType === 'SALE' 
          ? Number(saleDetails.listPrice)
          : Number(leaseDetails.leasePrice),
        description: propertyDescription.remarksForClients,
        images: selectedImages || []
      };
  
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listingData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish listing');
      }
  
      router.push('/listings');
    } catch (error) {
      setSubmissionStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to publish listing'
      }));
    }
  };

  const handleExteriorFeaturesChange = (features: any) => {
    // First, create a properly merged state
    const updatedFeatures = {
      ...exteriorDetails,           // Start with existing state
      PropertyType: features.PropertyType || exteriorDetails.PropertyType,
      PropertySubType: features.PropertySubType || exteriorDetails.PropertySubType,
      area: features.area || exteriorDetails.area,
      municipality: features.municipality || exteriorDetails.municipality,
      community: features.community || exteriorDetails.community,
      exteriorMaterial: features.exteriorMaterial || exteriorDetails.exteriorMaterial,
      utilities: {
        ...exteriorDetails.utilities,
        ...(features.utilities || {})
      }
    };

    // Update state
    setExteriorDetails(updatedFeatures);

    // Log for debugging
    console.log('Complete updated features:', updatedFeatures);

    // Validation checks
    const validationChecks = {
      propertyType: Boolean(updatedFeatures.PropertyType),
      propertySubType: Boolean(updatedFeatures.PropertySubType),
      area: Boolean(updatedFeatures.area),           // Check specifically for area
      municipality: Boolean(updatedFeatures.municipality),  // Check specifically for municipality
      exteriorMaterial: Array.isArray(updatedFeatures.exteriorMaterial) && 
                       updatedFeatures.exteriorMaterial.length > 0,
      utilities: Boolean(
        updatedFeatures.utilities?.water && 
        updatedFeatures.utilities?.sewers && 
        updatedFeatures.utilities?.pool
      )
    };

    console.log('Validation checks:', validationChecks);

    const isStepComplete = Object.values(validationChecks).every(check => check === true);
    
    if (isStepComplete) {
      markStepComplete(3);
    }

    return isStepComplete;
  };

  // Loading States Check
  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  const getCharacterCount = (text: string, maxLength: number) => {
    return `${text.length}/${maxLength}`;
  };

  // Step Rendering Logic
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ListingType
            listingType={listingType}
            onTypeSelect={(type) => {
              setListingType(type);
              setCurrentStep(2);
              markStepComplete(1);
            }}
          />
        );

        case 2:
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
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter property address"
                    className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={handlePlaceSelect}
                  />
                </div>
  
                <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
                  <GoogleMap
                    zoom={selectedLocation ? 18 : 12}
                    center={selectedLocation || { lat: 45.4215, lng: -75.6972 }}
                    mapContainerClassName="w-full h-full"
                  >
                    {selectedLocation && (
                      <MarkerF position={selectedLocation} />
                    )}
                  </GoogleMap>
                </div>
  
                <div className="flex justify-between items-center pt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-3 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep(3);
                      markStepComplete(2);
                    }}
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
  
          case 3:
            return (
              <ExteriorFeatures
                exteriorFeatures={exteriorDetails}
                onFeaturesChange={handleExteriorFeaturesChange}
                onContinue={() => {
                  setCurrentStep(4);
                  markStepComplete(3);
                }}
                onBack={() => setCurrentStep(2)}
                selectedAddress={address}
              />
            );
        case 4:
          return (
            <InteriorFeatures
              interiorFeatures={{
                ...interiorDetails,
                laundry: {
                  level: interiorDetails.laundry?.level || '',
                  features: interiorDetails.laundry?.features || []
                }
              }}
              onFeaturesChange={(features) => {
                setInteriorDetails({
                  ...interiorDetails,
                  ...features,
                  laundry: {
                    level: features.laundry?.level || '',
                    features: features.laundry?.features || []
                  }
                });
              }}
              onContinue={() => {
                setCurrentStep(5);
                markStepComplete(4);
              }}
              onBack={() => setCurrentStep(3)}
            />
          );
  
        case 5:
          console.log('Case 5 exterior details:', exteriorDetails);
          return (
            <PricingDetails
              listingType={listingType}
              leaseDetails={leaseDetails}
              setLeaseDetails={setLeaseDetails}
              saleDetails={saleDetails}
              setSaleDetails={setSaleDetails}
              exteriorDetails={exteriorDetails}
              interiorDetails={interiorDetails}
              address={address}
              onContinue={() => {
                setCurrentStep(6);
                markStepComplete(5);
              }}
              onBack={() => setCurrentStep(4)}
            />
          );
  
        case 6:
          return (
            <PropertyDescription
              description={propertyDescription}
              onDescriptionChange={setPropertyDescription}
              location={selectedLocation}
              onContinue={() => {
                setCurrentStep(7);
                markStepComplete(6);
              }}
              onBack={() => setCurrentStep(5)}
            />
          );
  
        case 7:
          return (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Upload Property Images
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Add up to 30 high-quality photos of your property. The first image will be your main listing photo.
                  </p>
                </div>
  
                <div className="p-6">
                  <div className="space-y-6">
                    <ImageUpload
                      onImagesSelected={(urls) => {
                        setSelectedImages(urls);
                        setSubmissionStatus(prev => ({ ...prev, error: null }));
                      }}
                      maxImages={30}
                    />
  
                    {submissionStatus.error && (
                      <div className="rounded-lg bg-red-50 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              Upload Error
                            </h3>
                            <p className="mt-1 text-sm text-red-700">
                              {submissionStatus.error}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
  
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setCurrentStep(6)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Back
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setCurrentStep(8);
                          markStepComplete(7);
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
  
        case 8:
          return (
            <ReviewListing
              listingType={listingType}
              address={address}
              exteriorDetails={exteriorDetails}
              interiorDetails={interiorDetails}
              propertyDescription={propertyDescription}
              selectedImages={selectedImages}
              submissionStatus={submissionStatus}
              onBack={() => setCurrentStep(7)}
              onSaveAsDraft={handleSaveAsDraft}
              onPublish={handlePublishListing}
            />
          );
  
        default:
          return null;
      }
    };
  
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <StepProgressBar 
            currentStep={currentStep} 
            steps={steps.map(step => ({
              ...step,
              isComplete: completedSteps.includes(step.id)
            }))}
            onStepClick={handleStepClick}
          />
        </div>
  
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {renderStep()}
        </motion.div>
  
        {/* Loading and Error States */}
        {submissionStatus.isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {submissionStatus.progress > 0 
                  ? `Uploading... ${submissionStatus.progress}%`
                  : 'Processing...'}
              </p>
            </div>
          </div>
        )}
  
        {submissionStatus.error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border-l-4 border-red-400 p-4 rounded shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                        clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {submissionStatus.error}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setSubmissionStatus(prev => ({ ...prev, error: null }))}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" 
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                            clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

    {/*Test */}
     {/*Test2 */}