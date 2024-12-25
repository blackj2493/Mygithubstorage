import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';
import { QuestionMarkCircleIcon, XMarkIcon, CloseIcon, QuestionMarkIcon } from '@heroicons/react/24/outline';

interface ExteriorFeaturesProps {
  exteriorFeatures: {
    propertyType: string;
    propertyClass: string;
    link: boolean;
    parcelOfTiedLand: boolean;
    exteriorMaterial: string[];
    exteriorFeatures: string[];
    utilities: {
      water: string;
      sewers: string;
      pool: string;
    };
  };
  onFeaturesChange: (features: any) => void;
  onContinue: () => void;
  onBack: () => void;
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

const ExteriorFeatures: React.FC<ExteriorFeaturesProps> = ({
  exteriorFeatures = {
    propertyType: '',
    propertyClass: '',
    link: false,
    parcelOfTiedLand: false,
    exteriorMaterial: [],
    exteriorFeatures: [],
    utilities: {
      water: '',
      sewers: '',
      pool: ''
    }
  },
  onFeaturesChange,
  onContinue,
  onBack,
}) => {
  const [activePopup, setActivePopup] = useState<PopupType>(null);

  // Helper function for material selection
  const handleMaterialToggle = (material: string) => {
    const currentMaterials = exteriorFeatures.exteriorMaterial || [];
    const newMaterials = currentMaterials.includes(material)
      ? currentMaterials.filter(m => m !== material)
      : [...currentMaterials, material];
    
    onFeaturesChange({
      ...exteriorFeatures,
      exteriorMaterial: newMaterials
    });
  };

  // Helper function for feature selection
  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = exteriorFeatures.exteriorFeatures || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    
    onFeaturesChange({
      ...exteriorFeatures,
      exteriorFeatures: newFeatures
    });
  };

  // Helper function to check if form is valid
  const isValid = () => {
    return (
      exteriorFeatures.propertyType && 
      exteriorFeatures.propertyClass &&
      typeof exteriorFeatures.link === 'boolean' &&
      typeof exteriorFeatures.parcelOfTiedLand === 'boolean' &&
      exteriorFeatures.exteriorMaterial.length > 0 &&
      exteriorFeatures.utilities.water &&
      exteriorFeatures.utilities.sewers &&
      exteriorFeatures.utilities.pool
    );
  };

  // Check if exteriorFeatures.utilities.water is defined before using it
  const waterType = exteriorFeatures?.utilities?.water || '';
  const sewerType = exteriorFeatures?.utilities?.sewers || '';
  const poolType = exteriorFeatures?.utilities?.pool || '';

const handleChange = (field: string, value: any) => {
  onFeaturesChange({
    ...exteriorFeatures,
    [field]: value
  });
};

  const handlePopupToggle = (popupId: PopupType) => {
    setActivePopup(activePopup === popupId ? null : popupId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Property Features - Exterior
      </h2>

      <div className="space-y-6">
        {/* Property Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Property Classification</CardTitle>
          </CardHeader>
          <CardContent>
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
                  value={exteriorFeatures.propertyType || ''}
                  onChange={(e) => handleChange('propertyType', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
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
                  value={exteriorFeatures.propertyClass || ''}
                  onChange={(e) => handleChange('propertyClass', e.target.value as any)}
                  className="w-full p-2 border rounded-md"
                  required
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
                    onClick={() => handleChange('link', true)}
                    className={`px-4 py-2 rounded ${
                      exteriorFeatures.link
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('link', false)}
                    className={`px-4 py-2 rounded ${
                      !exteriorFeatures.link
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
                    onClick={() => handleChange('parcelOfTiedLand', true)}
                    className={`px-4 py-2 rounded ${
                      exteriorFeatures.parcelOfTiedLand
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('parcelOfTiedLand', false)}
                    className={`px-4 py-2 rounded ${
                      !exteriorFeatures.parcelOfTiedLand
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  'Aluminum Siding', 'Board & Batten', 'Brick', 'Brick Front',
                  'Concrete', 'Insulbrick', 'Log', 'Metal/Steel Siding',
                  'Other', 'Shingle', 'Stone', 'Stucco (Plaster)',
                  'Vinyl Siding', 'Wood'
                ].map((material) => (
                  <button
                    key={material}
                    type="button"
                    onClick={() => handleMaterialToggle(material)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      exteriorFeatures.exteriorMaterial?.includes(material)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {/* Exterior Features */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exterior Features
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Built-in-BBQ', 'Canopy', 'Controlled Entry', 'Deck',
                  'Fishing', 'Hot Tub', 'Landscape Lighting', 'Landscaped',
                  'Lawn Sprinkler System', 'Lighting', 'Patio', 'Paved Yard',
                  'Privacy', 'Porch', 'Porch Enclosed', 'Private Pond',
                  'Recreational Area', 'Seasonal Living', 'Security Gate',
                  'TV Tower/Antenna', 'Year Round Living'
                ].map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => handleFeatureToggle(feature)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      exteriorFeatures.exteriorFeatures?.includes(feature)
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
            <div className="grid grid-cols-3 gap-4">
              {/* Water */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Type *
                </label>
                <select
                  value={waterType}
                  onChange={(e) => handleChange('utilities.water', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Water Type</option>
                  {['Both', 'Municipal', 'None', 'Other', 'Well'].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Sewers */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sewer Type *
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePopupToggle('sewerType')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                  </button>
                </div>
                <select
                  value={exteriorFeatures.utilities?.sewers || ''}
                  onChange={(e) => handleChange('utilities.sewers', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Sewer Type</option>
                  <option value="None">None</option>
                  <option value="Other">Other</option>
                  <option value="Septic">Septic</option>
                  <option value="Sewer">Sewer</option>
                </select>
              </div>

              {/* Pool */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pool *
                </label>
                <select
                  value={exteriorFeatures.utilities.pool}
                  onChange={(e) => handleChange('utilities.pool', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="N/A">N/A</option>
                </select>
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
    </motion.div>
  );
};

export default ExteriorFeatures;