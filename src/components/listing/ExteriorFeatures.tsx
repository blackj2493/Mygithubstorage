import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';
import { QuestionMarkCircleIcon, XMarkIcon, CloseIcon, QuestionMarkIcon, MapIcon } from '@heroicons/react/24/outline';
import { LocationDropdown } from '../PropertyLocation';
import { areas } from '../../data/locations.json';

interface ExteriorFeaturesProps {
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
    },
    Area: string;
    City: string;
    CityRegion: string;
    GarageType: string;
    ParkingFeatures: string[];
    ParkingTotal: number;
    ParkingSpaces: number;
    CoveredSpaces: number;
  };
  onFeaturesChange: (features: any) => void;
  onContinue: () => void;
  onBack: () => void;
  selectedAddress: any;
  garage: {
    GarageType: string;
    ParkingFeatures: string[];
    ParkingTotal: number;
    ParkingSpaces: number;
  };
}

type PopupType = 'propertyClass' | 'propertyType' | 'linkProperty' | 'parcelTiedLand' | 'sewerType' | null;

const PropertyClassInfo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-1/4 w-80 bg-white rounded-lg shadow-xl p-6 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Property Class Types</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-600 mb-1">Residential Freehold</h4>
              <p className="text-sm text-gray-600">
                Residential Freehold refers to properties where the owner owns both the land and the building, 
                such as a single-family home or a townhouse. This means the homeowner has full control and 
                ownership over the entire property.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-600 mb-1">Residential Condo & Other</h4>
              <p className="text-sm text-gray-600">
                Residential Condo & Other encompasses properties where the owner owns a unit within a larger 
                building or complex, such as an apartment-style condominium. In these cases, the owner shares 
                common areas and facilities with other unit owners in the building or development.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-600 mb-1">Commercial</h4>
              <p className="text-sm text-gray-600">
                Commercial properties refer to real estate that is used for business purposes, such as office 
                buildings, retail stores, warehouses, or industrial facilities. These types of properties are 
                typically owned or leased by businesses rather than individual homeowners.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PropertyTypeInfo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-1/4 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
        >
          <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Property Types</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-600 mb-1">Cottage</h4>
                <p className="text-sm text-gray-600">
                  A seasonal or vacation home, often located in a rural or natural setting.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Detached</h4>
                <p className="text-sm text-gray-600">
                  A standalone, independently owned and operated residential property.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Duplex</h4>
                <p className="text-sm text-gray-600">
                  A building divided into two separate, self-contained living units.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Farm</h4>
                <p className="text-sm text-gray-600">
                  A property used for commercial agricultural or farming operations.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Fourplex</h4>
                <p className="text-sm text-gray-600">
                  A building divided into four separate, self-contained living units.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Link</h4>
                <p className="text-sm text-gray-600">
                  A residential property that is physically connected to one or more adjacent units.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Lower Level</h4>
                <p className="text-sm text-gray-600">
                  The ground or basement level of a multi-story residential property.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">MobileTrailer</h4>
                <p className="text-sm text-gray-600">
                  A transportable, self-contained residential structure on wheels or a frame.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Multiplex</h4>
                <p className="text-sm text-gray-600">
                  A building divided into multiple separate, self-contained living units.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Other</h4>
                <p className="text-sm text-gray-600">
                  Any type of residential property not specifically listed in the categories.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Room</h4>
                <p className="text-sm text-gray-600">
                  A single room within a larger residential property, often rented individually.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Rural Residential</h4>
                <p className="text-sm text-gray-600">
                  A residential property located in a rural, non-urban area.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Semi-Detached</h4>
                <p className="text-sm text-gray-600">
                  A residential property that is connected to and shares a wall with one adjacent unit.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Shared Room</h4>
                <p className="text-sm text-gray-600">
                  A single room within a residential property that is shared by multiple residents.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Store W Apt/Office</h4>
                <p className="text-sm text-gray-600">
                  A property containing both commercial retail/office space and residential living space.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Triplex</h4>
                <p className="text-sm text-gray-600">
                  A building divided into three separate, self-contained living units.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Upper Level</h4>
                <p className="text-sm text-gray-600">
                  The upper level(s) of a multi-story residential property, above the ground floor.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Vacant Land</h4>
                <p className="text-sm text-gray-600">
                  Undeveloped land without any structures, available for potential future construction.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LinkPropertyInfo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-1/4 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
        >
          <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Link Property</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>A type of residential property that is physically connected to one or more adjacent units</li>
              <li>The units share a common wall or structure, but are individually owned and operated</li>
              <li>This allows for efficient use of space while maintaining some degree of independence</li>
              <li>Common examples include townhouses, row houses, or other attached housing units</li>
              <li>Owners typically have their own entrances, yards, and other private areas despite the shared structure</li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ParcelTiedLandInfo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-1/4 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
        >
          <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Parcel of Tied Land</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>A Parcel of Tied Land is a property with specific conditions or limitations attached to its ownership or use.</li>
              <li>Restrictions may include limited development rights, required maintenance, access rights, and activity limitations.</li>
              <li>Tied land preserves assets, controls land use, or fulfills legal obligations between parties.</li>
              <li>Restrictions are recorded in the deed and must be followed by current and future owners.</li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SewerTypeInfo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-1/4 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
        >
          <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Sewer Types</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-600 mb-1">None</h4>
                <p className="text-sm text-gray-600">
                  No visible sewage system or holding tank, often indicating an off-grid or remote property.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Other</h4>
                <p className="text-sm text-gray-600">
                  Any non-standard sewage system, such as a composting toilet or an incinerating toilet.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Septic</h4>
                <p className="text-sm text-gray-600">
                  An underground tank where waste is decomposed and filtered before draining into a leach field, 
                  often with a visible access lid or cover in the yard.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Sewer</h4>
                <p className="text-sm text-gray-600">
                  Connected to a municipal sewer system, typically with no visible components on the property, 
                  as the waste is transported through underground pipes to a treatment facility.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type WaterType = 'Municipal' | 'Well' | 'Lake' | 'None' | '';
type SewerType = 'Municipal' | 'Septic' | 'Holding Tank' | 'None' | '';
type PoolType = 'Yes' | 'No' | 'N/A' | '';

interface UtilitiesSection {
  water: WaterType;
  sewers: SewerType;
  pool: PoolType;
}

const ExteriorFeatures: React.FC<ExteriorFeaturesProps> = ({
  exteriorFeatures = {
    PropertyType: '',
    PropertySubType: '',
    LinkYN: false,
    ParcelOfTiedLand: false,
    ConstructionMaterials: [],
    ExteriorFeatures: [],
    Utilities: {
      Water: '',
      Sewers: '',
      Pool: ''
    },
    Area: '',
    City: '',
    CityRegion: '',
    GarageType: '',
    ParkingFeatures: [],
    ParkingTotal: 0,
    ParkingSpaces: 0,
    CoveredSpaces: 0
  },
  onFeaturesChange,
  onContinue,
  onBack,
  selectedAddress
}) => {
  const [activePopup, setActivePopup] = useState<PopupType>(null);

  // Add state tracking for selected values
  const [selectedValues, setSelectedValues] = useState({
    PropertyType: exteriorFeatures.PropertyType || '',
    PropertySubType: exteriorFeatures.PropertySubType || '',
    ConstructionMaterials: exteriorFeatures.ConstructionMaterials || [],
    Utilities: {
      Water: exteriorFeatures.Utilities?.Water || '',
      Sewers: exteriorFeatures.Utilities?.Sewers || '',
      Pool: exteriorFeatures.Utilities?.Pool || ''
    }
  });

  // Helper function for material selection
  const handleMaterialToggle = (material: string) => {
    // Ensure we're working with an array
    const currentMaterials = Array.isArray(exteriorFeatures.ConstructionMaterials) 
      ? exteriorFeatures.ConstructionMaterials 
      : [];
    
    console.log('Current materials before update:', currentMaterials);
    
    const updatedMaterials = currentMaterials.includes(material)
      ? currentMaterials.filter(m => m !== material)
      : [...currentMaterials, material];
    
    console.log('Updated materials:', updatedMaterials);

    const updatedFeatures = {
      ...exteriorFeatures,
      ConstructionMaterials: updatedMaterials
    };

    console.log('Sending updated features:', updatedFeatures);
    
    onFeaturesChange(updatedFeatures);
  };

  // Helper function for feature selection
  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = exteriorFeatures.ExteriorFeatures || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];

    // Create a complete updated features object
    const updatedExteriorFeatures = {
      ...exteriorFeatures,
      ExteriorFeatures: updatedFeatures
    };

    // Log for debugging
    console.log('Updating features:', updatedFeatures);
    console.log('Complete updated features:', updatedExteriorFeatures);

    onFeaturesChange(updatedExteriorFeatures);
  };

  // Helper function to check if form is valid
  const isValid = () => {
    return (
      exteriorFeatures.PropertyType && 
      exteriorFeatures.PropertySubType &&
      typeof exteriorFeatures.LinkYN === 'boolean' &&
      typeof exteriorFeatures.ParcelOfTiedLand === 'boolean' &&
      exteriorFeatures.ConstructionMaterials.length > 0 &&
      exteriorFeatures.Utilities.Water &&
      exteriorFeatures.Utilities.Sewers &&
      exteriorFeatures.Utilities.Pool
    );
  };

  // Check if exteriorFeatures.Utilities.Water is defined before using it
  const waterType = exteriorFeatures?.Utilities?.Water || '';
  const sewerType = exteriorFeatures?.Utilities?.Sewers || '';
  const poolType = exteriorFeatures?.Utilities?.Pool || '';

  const handleUtilitiesChange = (field: keyof typeof exteriorFeatures.Utilities, value: string) => {
    onFeaturesChange({
      ...exteriorFeatures,
      Utilities: {
        ...exteriorFeatures.Utilities,
        [field]: value
      }
    });
  };

  const handlePopupToggle = (popupId: PopupType) => {
    setActivePopup(activePopup === popupId ? null : popupId);
  };

  const handleChange = (field: string, value: any) => {
    const updatedFeatures = {
      ...exteriorFeatures,
      [field]: value
    };
    
    console.log('Sending updated features:', updatedFeatures);
    
    onFeaturesChange(updatedFeatures);
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFeatures = {
      ...exteriorFeatures,
      PropertyType: e.target.value
    };
    console.log('Updating PropertyType:', updatedFeatures);
    onFeaturesChange(updatedFeatures);
  };

  const handlePropertySubTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFeatures = {
      ...exteriorFeatures,
      PropertySubType: e.target.value
    };
    console.log('Updating PropertySubType:', updatedFeatures);
    onFeaturesChange(updatedFeatures);
  };

  const handleExteriorMaterialChange = (material: string) => {
    const currentMaterials = exteriorFeatures.ConstructionMaterials || [];
    const updatedMaterials = currentMaterials.includes(material)
      ? currentMaterials.filter(m => m !== material)
      : [...currentMaterials, material];

    // Create a complete updated features object
    const updatedFeatures = {
      ...exteriorFeatures,
      ConstructionMaterials: updatedMaterials
    };

    // Log for debugging
    console.log('Updating materials:', updatedMaterials);
    console.log('Complete updated features:', updatedFeatures);

    onFeaturesChange(updatedFeatures);
  };

  const handleUtilityChange = (type: 'Water' | 'Sewers' | 'Pool', value: string) => {
    onFeaturesChange({
      ...exteriorFeatures,
      Utilities: {
        ...exteriorFeatures.Utilities,
        [type]: value
      }
    });
  };

  const handleAreaChange = (value: string) => {
    onFeaturesChange({
      ...exteriorFeatures,
      Area: value
    });
  };

  const handleMunicipalityChange = (value: string) => {
    onFeaturesChange({
      ...exteriorFeatures,
      City: value
    });
  };

  const handleCommunityChange = (value: string) => {
    onFeaturesChange({
      ...exteriorFeatures,
      CityRegion: value
    });
  };

  // Location handlers
  const handleLocationChange = (field: string, value: string) => {
    console.log(`Updating ${field} with value:`, value);
    console.log('Current state before update:', exteriorFeatures);

    const updatedFeatures = {
      ...exteriorFeatures,  // Keep all existing values
      [field]: value       // Update only the specific field
    };

    console.log('Updated features:', updatedFeatures);
    onFeaturesChange(updatedFeatures);
  };

  // Add these handlers
  const handleLinkToggle = (value: boolean) => {
    onFeaturesChange({
      ...exteriorFeatures,
      LinkYN: value
    });
  };

  const handleParcelToggle = (value: boolean) => {
    onFeaturesChange({
      ...exteriorFeatures,
      ParcelOfTiedLand: value
    });
  };

  // Add the garage type options
  const garageTypes = [
    'Attached',
    'Built-in',
    'Carport',
    'Detached',
    'Garage',
    'None',
    'Other',
    'Underground'
  ];

  // Add the parking features options
  const parkingFeatures = [
    'Asphalt',
    'Concrete',
    'Garage Door Opener',
    'Gravel',
    'Heated',
    'Inside Entry',
    'Interlocked',
    'Lane',
    'Other',
    'Private',
    'Shared'
  ];

  // Add this near the top of the component
  useEffect(() => {
    console.log('ExteriorFeatures current state:', exteriorFeatures);
  }, [exteriorFeatures]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Property Features - Exterior</h2>

      {selectedAddress && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Property Location</h3>
            <a 
              href="https://www.torontomls.net/Communities/map.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              <MapIcon className="w-4 h-4 mr-1.5" />
              Find Community on Map
            </a>
          </div>
          <div className="space-y-1">
            <p className="text-gray-800">
              {selectedAddress.streetNumber} {selectedAddress.streetName}
              {selectedAddress.unitNumber && `, Unit ${selectedAddress.unitNumber}`}
            </p>
            <p className="text-gray-700">
              {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
              {selectedAddress.community && (
                <span className="ml-2 text-blue-600">
                  • {selectedAddress.community}
                </span>
              )}
            </p>
            
            <div className="mt-4">
              <LocationDropdown
                locations={areas}
                onChange={(selection) => {
                  const updatedFeatures = {
                    ...exteriorFeatures,
                    Area: selection.area || '',
                    City: selection.municipality || '',
                    CityRegion: selection.community || ''
                  };
                  console.log('Updated location features:', updatedFeatures);
                  onFeaturesChange(updatedFeatures);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Property Classification</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Property Type */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Property Type *
                </label>
                <button
                  type="button"
                  onClick={() => handlePopupToggle('propertyType')}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                </button>
              </div>
              <select
                value={exteriorFeatures.PropertyType || ''}
                onChange={handlePropertyTypeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Property Type</option>
                {[
                  'Att/Row/Townhouse',
                  'Cottage',
                  'Detached',
                  'Duplex',
                  'Farm',
                  'Fourplex',
                  'Link',
                  'Lower Level',
                  'MobileTrailer',
                  'Multiplex',
                  'Other',
                  'Room',
                  'Rural Residential',
                  'Semi-Detached',
                  'Shared Room',
                  'Store W Apt/Office',
                  'Triplex',
                  'Upper Level',
                  'Vacant Land'
                ].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

              {/* Property Class */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Property Class *
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePopupToggle('propertyClass')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                  </button>
                </div>
                <select
                  value={exteriorFeatures.PropertySubType || ''}
                  onChange={handlePropertySubTypeChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select Property Class</option>
                  <option value="Residential Freehold">Residential Freehold</option>
                  <option value="Residential Condo & Other">Residential Condo & Other</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            {/* Property Options */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* LINK Property */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    LINK Property *
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePopupToggle('linkProperty')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleLinkToggle(true)}
                    className={`px-4 py-2 rounded ${
                      exteriorFeatures.LinkYN
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkToggle(false)}
                    className={`px-4 py-2 rounded ${
                      !exteriorFeatures.LinkYN
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

            {/* Parcel of Tied Land */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Parcel of Tied Land
                </label>
                <button
                  type="button"
                  onClick={() => handlePopupToggle('parcelTiedLand')}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleParcelToggle(true)}
                  className={`px-4 py-2 rounded ${
                    exteriorFeatures.ParcelOfTiedLand
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleParcelToggle(false)}
                  className={`px-4 py-2 rounded ${
                    !exteriorFeatures.ParcelOfTiedLand
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Materials & Features */}
        <Card>
          <CardHeader>
            <CardTitle>Materials & Features</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Exterior Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exterior Material *
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Aluminum Siding',
                  'Board & Batten',
                  'Brick',
                  'Brick Front',
                  'Concrete',
                  'Insulbrick',
                  'Log',
                  'Metal/Steel Siding',
                  'Other',
                  'Shingle',
                  'Stone',
                  'Stucco (Plaster)',
                  'Vinyl Siding',
                  'Wood'
                ].map((material) => {
                  console.log('Checking material:', material, 'Current materials:', exteriorFeatures.ConstructionMaterials);
                  
                  return (
                    <button
                      key={material}
                      type="button"
                      onClick={() => handleMaterialToggle(material)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        Array.isArray(exteriorFeatures.ConstructionMaterials) && 
                        exteriorFeatures.ConstructionMaterials.includes(material)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {material}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exterior Features */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exterior Features
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Built-in-BBQ',
                  'Canopy',
                  'Controlled Entry',
                  'Deck',
                  'Fishing',
                  'Hot Tub',
                  'Landscape Lighting',
                  'Landscaped',
                  'Lawn Sprinkler System',
                  'Lighting',
                  'Patio',
                  'Paved Yard',
                  'Privacy',
                  'Porch',
                  'Porch Enclosed',
                  'Private Pond',
                  'Recreational Area',
                  'Seasonal Living',
                  'Security Gate',
                  'TV Tower/Antenna',
                  'Year Round Living'
                ].map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => handleFeatureToggle(feature)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      exteriorFeatures.ExteriorFeatures?.includes(feature)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Utilities */}
        <Card>
          <CardHeader>
            <CardTitle>Utilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Utilities</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Type *
                  </label>
                  <select
                    value={exteriorFeatures.Utilities?.Water || ''}
                    onChange={(e) => handleUtilityChange('Water', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Water Type</option>
                    <option value="Municipal">Municipal</option>
                    <option value="Well">Well</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sewer Type *
                  </label>
                  <select
                    value={exteriorFeatures.Utilities?.Sewers || ''}
                    onChange={(e) => handleUtilityChange('Sewers', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Sewer Type</option>
                    <option value="Municipal">Municipal</option>
                    <option value="Septic">Septic</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pool *
                  </label>
                  <select
                    value={exteriorFeatures.Utilities?.Pool || ''}
                    onChange={(e) => handleUtilityChange('Pool', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Garage & Parking Section - with matching style */}
        <div className="mt-8">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">Garage & Parking</h3>
          </div>

          <div className="bg-white p-6 rounded-b-lg shadow-sm">
            {/* Garage Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Garage Type *
              </label>
              <select
                value={exteriorFeatures.GarageType || ''}
                onChange={(e) => onFeaturesChange({
                  ...exteriorFeatures,
                  GarageType: e.target.value
                })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Garage Type</option>
                {garageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Parking Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parking/Drive Features
              </label>
              <div className="flex flex-wrap gap-2">
                {parkingFeatures.map((feature) => (
                  <button
                    key={feature}
                    onClick={() => {
                      const currentFeatures = exteriorFeatures.ParkingFeatures || [];
                      const updatedFeatures = currentFeatures.includes(feature)
                        ? currentFeatures.filter(f => f !== feature)
                        : [...currentFeatures, feature];
                      
                      onFeaturesChange({
                        ...exteriorFeatures,
                        ParkingFeatures: updatedFeatures
                      });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      exteriorFeatures.ParkingFeatures?.includes(feature)
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    type="button"
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Parking Spaces */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drive Parking Spaces *
                </label>
                <input
                  type="number"
                  min="0"
                  value={exteriorFeatures.ParkingSpaces || ''}
                  onChange={(e) => {
                    const driveSpaces = parseInt(e.target.value) || 0;
                    onFeaturesChange({
                      ...exteriorFeatures,
                      ParkingSpaces: driveSpaces,
                      // Ensure ParkingTotal is at least equal to ParkingSpaces + CoveredSpaces
                      ParkingTotal: Math.max(driveSpaces + (exteriorFeatures.CoveredSpaces || 0), exteriorFeatures.ParkingTotal || 0)
                    });
                  }}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garage Parking Spaces *
                </label>
                <input
                  type="number"
                  min="0"
                  value={exteriorFeatures.CoveredSpaces || ''}
                  onChange={(e) => {
                    const garageSpaces = parseInt(e.target.value) || 0;
                    onFeaturesChange({
                      ...exteriorFeatures,
                      CoveredSpaces: garageSpaces,
                      // Update total to be at least the sum of drive and garage spaces
                      ParkingTotal: Math.max(garageSpaces + (exteriorFeatures.ParkingSpaces || 0), exteriorFeatures.ParkingTotal || 0)
                    });
                  }}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Parking Spaces *
                </label>
                <input
                  type="number"
                  min="0"
                  value={exteriorFeatures.ParkingTotal || ''}
                  onChange={(e) => {
                    const total = parseInt(e.target.value) || 0;
                    const currentDrive = exteriorFeatures.ParkingSpaces || 0;
                    const currentGarage = exteriorFeatures.CoveredSpaces || 0;
                    
                    // Ensure total is not less than sum of drive and garage spaces
                    const adjustedTotal = Math.max(total, currentDrive + currentGarage);
                    
                    onFeaturesChange({
                      ...exteriorFeatures,
                      ParkingTotal: adjustedTotal
                    });
                  }}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            {/* Helper text */}
            <div className="mt-2 text-sm text-gray-500">
              Total Parking Spaces should be equal to or greater than the sum of Drive and Garage spaces
            </div>
          </div>
        </div>

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

      <PropertyClassInfo 
        isOpen={activePopup === 'propertyClass'} 
        onClose={() => setActivePopup(null)} 
      />
      <PropertyTypeInfo 
        isOpen={activePopup === 'propertyType'} 
        onClose={() => setActivePopup(null)} 
      />
      <LinkPropertyInfo 
        isOpen={activePopup === 'linkProperty'} 
        onClose={() => setActivePopup(null)} 
      />
      <ParcelTiedLandInfo 
        isOpen={activePopup === 'parcelTiedLand'} 
        onClose={() => setActivePopup(null)} 
      />
      <SewerTypeInfo 
        isOpen={activePopup === 'sewerType'} 
        onClose={() => setActivePopup(null)} 
      />
    </div>
  );
};

export default ExteriorFeatures;