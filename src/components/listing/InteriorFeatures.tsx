// src/components/listing/InteriorFeatures.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';
import { InteriorFeatures as InteriorFeaturesType } from '../shared/types';
import { QuestionMarkCircleIcon, XMarkIcon, PlusCircleIcon, XCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import WindowedSelect from 'react-windowed-select';
import Select from 'react-select';
import { roomDescriptionOptions } from '@/data/roomDescriptionOptions';

interface InteriorFeaturesProps {
  interiorFeatures: InteriorFeaturesType;
  onFeaturesChange: (features: InteriorFeaturesType) => void;
  onContinue: () => void;
  onBack: () => void;
}

interface RoomDetail {
  id: string;
  level: string;
  type: string;
  length: string;
  width: string;
  description1: string;
  description2: string;
  description3: string;
}

const roomLevelOptions = [
  'Second',
  'Third',
  'Basement',
  'Flat',
  'Ground',
  'In Between',
  'Lower',
  'Main',
  'Sub-Basement',
  'Upper'
].map(level => ({ value: level, label: level }));

const descriptionOptions = [
  '2 Way Fireplace', '2 Pc bath', '2 Pc Ensuite', '3 Pc Bath',
  // ... (rest of your description options)
  'Wood Stove', 'Wood Trim', 'Zero Clear Fireplace'
].map(desc => ({ value: desc, label: desc }));

const roomTypeOptions = [
  { value: 'Bedroom', label: 'Bedroom' },
  { value: 'Bedroom 2', label: 'Bedroom 2' },
  { value: 'Bedroom 3', label: 'Bedroom 3' },
  { value: 'Bedroom 4', label: 'Bedroom 4' },
  { value: 'Bedroom 5', label: 'Bedroom 5' },
  { value: 'Bathroom', label: 'Bathroom' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Cold Room/Cantina', label: 'Cold Room/Cantina' },
  { value: 'Common Room', label: 'Common Room' },
  { value: 'Den', label: 'Den' },
  { value: 'Dining Room', label: 'Dining Room' },
  { value: 'Exercise Room', label: 'Exercise Room' },
  { value: 'Family Room', label: 'Family Room' },
  { value: 'Foyer', label: 'Foyer' },
  { value: 'Furnace Room', label: 'Furnace Room' },
  { value: 'Game Room', label: 'Game Room' },
  { value: 'Great Room', label: 'Great Room' },
  { value: 'Kitchen', label: 'Kitchen' },
  { value: 'Laundry', label: 'Laundry' },
  { value: 'Library', label: 'Library' },
  { value: 'Living Room', label: 'Living Room' },
  { value: 'Locker', label: 'Locker' },
  { value: 'Loft', label: 'Loft' },
  { value: 'Media Room', label: 'Media Room' },
  { value: 'Mud Room', label: 'Mud Room' },
  { value: 'Nursery', label: 'Nursery' },
  { value: 'Office', label: 'Office' },
  { value: 'Other', label: 'Other' },
  { value: 'Pantry', label: 'Pantry' },
  { value: 'Play', label: 'Play' },
  { value: 'Powder Room', label: 'Powder Room' },
  { value: 'Primary Bedroom', label: 'Primary Bedroom' },
  { value: 'Recreation', label: 'Recreation' },
  { value: 'Sitting', label: 'Sitting' },
  { value: 'Solarium', label: 'Solarium' },
  { value: 'Study', label: 'Study' },
  { value: 'Sunroom', label: 'Sunroom' },
  { value: 'Tandem', label: 'Tandem' },
  { value: 'Utility Room', label: 'Utility Room' },
  { value: 'Workshop', label: 'Workshop' },
];

const RoomDetailsRow = ({ 
    room, 
    index, 
    onUpdate, 
    onDelete 
  }: { 
    room: RoomDetail; 
    index: number; 
    onUpdate: (id: string, field: string, value: string) => void;
    onDelete: (id: string) => void;
  }) => {
  // Filter out selected descriptions from other dropdowns
  const getAvailableOptions = (currentField: 'description1' | 'description2' | 'description3') => {
    const selectedDescriptions = [
      room.description1,
      room.description2,
      room.description3
    ];
    
    return roomDescriptionOptions.filter(option => 
      option.value === room[currentField] || // Always include currently selected option
      !selectedDescriptions.includes(option.value) // Include options not selected in other dropdowns
    );
  };

  // Common select styles
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: 36,
      height: 36
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: 200 // Limit dropdown height for better UX
    })
  };

  return (
    <Draggable draggableId={room.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex flex-col gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          {/* First row */}
          <div className="flex items-center gap-3">
            <Bars3Icon className="h-5 w-5 text-gray-400 shrink-0" />
            
            <div className="grid grid-cols-4 gap-3 flex-1">
              <Select
                value={room.level ? { value: room.level, label: room.level } : null}
                options={roomLevelOptions}
                onChange={(option) => onUpdate(room.id, 'level', option?.value || '')}
                placeholder="Level"
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '36px',
                    height: '36px'
                  })
                }}
              />
              
              <Select
                value={room.type ? { value: room.type, label: room.type } : null}
                options={roomTypeOptions}
                onChange={(option) => onUpdate(room.id, 'type', option?.value || '')}
                placeholder="Room Type"
                isSearchable
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '36px',
                    height: '36px'
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
                className="flex-1"
              />
              
              <input
                type="number"
                value={room.length}
                onChange={(e) => onUpdate(room.id, 'length', e.target.value)}
                className="p-2 border rounded h-9 text-sm"
                placeholder="Length (metres)"
              />
              
              <input
                type="number"
                value={room.width}
                onChange={(e) => onUpdate(room.id, 'width', e.target.value)}
                className="p-2 border rounded h-9 text-sm"
                placeholder="Width (metres)"
              />
            </div>

            <button
              onClick={() => onDelete(room.id)}
              className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Second row - Descriptions */}
          <div className="grid grid-cols-3 gap-3 px-8">
            <WindowedSelect
              value={room.description1 ? { value: room.description1, label: room.description1 } : null}
              options={getAvailableOptions('description1')}
              onChange={(option) => onUpdate(room.id, 'description1', option?.value || '')}
              placeholder="Description 1"
              isSearchable
              styles={selectStyles}
              isClearable
              windowThreshold={100}
            />
            
            <WindowedSelect
              value={room.description2 ? { value: room.description2, label: room.description2 } : null}
              options={getAvailableOptions('description2')}
              onChange={(option) => onUpdate(room.id, 'description2', option?.value || '')}
              placeholder="Description 2"
              isSearchable
              styles={selectStyles}
              isClearable
              windowThreshold={100}
            />
            
            <WindowedSelect
              value={room.description3 ? { value: room.description3, label: room.description3 } : null}
              options={getAvailableOptions('description3')}
              onChange={(option) => onUpdate(room.id, 'description3', option?.value || '')}
              placeholder="Description 3"
              isSearchable
              styles={selectStyles}
              isClearable
              windowThreshold={100}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

const BasementTypeInfo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
              <h3 className="text-lg font-semibold">Basement Types</h3>
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
                <h4 className="font-medium text-blue-600 mb-1">Apartment</h4>
                <p className="text-sm text-gray-600">
                  A separate living unit within the basement, with its own entrance, kitchen, and bathroom facilities.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Crawl Space</h4>
                <p className="text-sm text-gray-600">
                  A shallow, unfinished area beneath the house, typically used for storage or housing utilities, with limited headroom.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Finished</h4>
                <p className="text-sm text-gray-600">
                  A fully completed basement with finishes similar to the main living areas, including walls, flooring, and ceiling.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Finished with Walk-Out</h4>
                <p className="text-sm text-gray-600">
                  A finished basement with direct access to the outside through a door at ground level.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Full</h4>
                <p className="text-sm text-gray-600">
                  A basement that spans the entire footprint of the house, with enough headroom to stand comfortably.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Half</h4>
                <p className="text-sm text-gray-600">
                  A basement that covers only a portion of the house's footprint, often with limited space and headroom.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">None</h4>
                <p className="text-sm text-gray-600">
                  No basement or crawl space beneath the house; the main floor sits directly on the foundation.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Other</h4>
                <p className="text-sm text-gray-600">
                  Any non-standard basement configuration or a combination of different types.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Partial Basement</h4>
                <p className="text-sm text-gray-600">
                  A basement that covers only a portion of the house's footprint, similar to a half basement.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Partially Finished</h4>
                <p className="text-sm text-gray-600">
                  A basement with some finished areas, such as drywall and flooring, while other areas remain unfinished.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Separate Entrance</h4>
                <p className="text-sm text-gray-600">
                  A basement with its own entrance from the outside, independent of the main house entrance.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Unfinished</h4>
                <p className="text-sm text-gray-600">
                  A basement with exposed concrete walls, floors, and ceilings, often used for storage or utilities.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Walk-Out</h4>
                <p className="text-sm text-gray-600">
                  A basement with direct access to the outside through a door, typically at ground level on a sloped lot.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Walk-Up</h4>
                <p className="text-sm text-gray-600">
                  A basement accessed by a separate staircase leading directly outside, usually from a below-grade entrance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FamilyRoomInfo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
              <h3 className="text-lg font-semibold">Family Room</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-600">
              In Canadian homes, a family room is often an open concept space connected to the kitchen 
              and dining area, featuring a cozy fireplace, comfortable seating arranged for conversation 
              and TV viewing, an entertainment system, natural light from large windows or patio doors, 
              and a casual, relaxed décor.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HeatTypeInfo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
              <h3 className="text-lg font-semibold">Heat Types</h3>
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
                <h4 className="font-medium text-blue-600 mb-1">Baseboard</h4>
                <p className="text-sm text-gray-600">
                  Electric heating units mounted along the base of walls, providing even heat distribution across the room.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Fan Coil</h4>
                <p className="text-sm text-gray-600">
                  A unit that uses a fan to blow air over a heating or cooling coil, often found in apartment buildings or hotels.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Forced Air</h4>
                <p className="text-sm text-gray-600">
                  A system that uses a furnace to heat air and distribute it through ducts and vents in the floors, walls, or ceilings.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Heat Pump</h4>
                <p className="text-sm text-gray-600">
                  An electrically-powered device that transfers heat from one place to another, providing both heating and cooling.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Other</h4>
                <p className="text-sm text-gray-600">
                  Any non-standard or less common heating system, such as geothermal, solar, or a combination of different types.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Radiant</h4>
                <p className="text-sm text-gray-600">
                  A system that heats surfaces (floors, walls, or ceilings) which then radiate heat into the room, providing even, comfortable warmth.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HeatSourceInfo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
              <h3 className="text-lg font-semibold">Heat Sources</h3>
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
                <h4 className="font-medium text-blue-600 mb-1">Electric</h4>
                <p className="text-sm text-gray-600">
                  Heating systems powered by electricity, such as baseboard heaters, wall heaters, 
                  or electric furnaces, often with visible heating elements or vents.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Gas</h4>
                <p className="text-sm text-gray-600">
                  Natural gas or propane-powered heating systems, typically furnaces or boilers, 
                  with gas lines connecting to the unit and exhaust vents to the exterior.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Ground Source</h4>
                <p className="text-sm text-gray-600">
                  A geothermal heat pump system that uses the stable temperature of the earth to 
                  provide heating and cooling, with underground piping and a heat exchanger.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Oil</h4>
                <p className="text-sm text-gray-600">
                  Heating systems that burn oil to generate heat, typically furnaces or boilers, 
                  with an oil storage tank and delivery lines to the unit.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Other</h4>
                <p className="text-sm text-gray-600">
                  Any non-standard or less common heat source, such as wood-burning stoves, 
                  pellet stoves, or solar-powered systems.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-1">Propane</h4>
                <p className="text-sm text-gray-600">
                  Similar to natural gas systems but using propane as the fuel source, often with 
                  a visible outdoor storage tank and gas lines running to the heating unit.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Replace the individual popup states with a single state
type PopupType = 'basementType' | 'familyRoom' | 'heatType' | 'heatSource' | null;

export const InteriorFeatures: React.FC<InteriorFeaturesProps> = ({
  interiorFeatures,
  onFeaturesChange,
  onContinue,
  onBack,
}) => {
  // Replace multiple useState calls with a single one
  const [activePopup, setActivePopup] = useState<PopupType>(null);
  const [roomDetails, setRoomDetails] = useState<RoomDetail[]>(() => {
    if (interiorFeatures.rooms.details && interiorFeatures.rooms.details.length > 0) {
      return interiorFeatures.rooms.details;
    }
    return [{
      id: `room-${Date.now()}`,
      level: '',
      type: '',
      length: '',
      width: '',
      description1: '',
      description2: '',
      description3: ''
    }];
  });

  // Add popup toggle handler
  const handlePopupToggle = (popupId: PopupType) => {
    setActivePopup(activePopup === popupId ? null : popupId);
  };

  useEffect(() => {
    onFeaturesChange({
      ...interiorFeatures,
      rooms: {
        ...interiorFeatures.rooms,
        details: roomDetails
      }
    });
  }, [roomDetails]);

  // Helper function for room number validation
  const handleNumberInput = (value: string, field: string) => {
    const number = parseInt(value) || 0;
    onFeaturesChange({
      ...interiorFeatures,
      rooms: {
        ...interiorFeatures.rooms,
        [field]: number
      }
    });
  };

  // Helper for laundry feature toggle
  const handleLaundryFeatureToggle = (feature: string) => {
    const newFeatures = interiorFeatures.laundry.features.includes(feature)
      ? interiorFeatures.laundry.features.filter(f => f !== feature)
      : [...interiorFeatures.laundry.features, feature];
    
    onFeaturesChange({
      ...interiorFeatures,
      laundry: {
        ...interiorFeatures.laundry,
        features: newFeatures
      }
    });
  };

  const handleAddRoom = () => {
    if (roomDetails.length >= 12) return;
    
    const newRoom: RoomDetail = {
      id: `room-${Date.now()}`,
      level: '',
      type: '',
      length: '',
      width: '',
      description1: '',
      description2: '',
      description3: ''
    };
    
    setRoomDetails([...roomDetails, newRoom]);
  };

  const handleUpdateRoom = (id: string, field: string, value: string) => {
    const updatedRooms = roomDetails.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    );
    setRoomDetails(updatedRooms);
  };

  const handleDeleteRoom = (id: string) => {
    setRoomDetails(roomDetails.filter(room => room.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(roomDetails);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRoomDetails(items);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Property Features - Interior
      </h2>

      <div className="space-y-6">
        {/* Room Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Room counts grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Total Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Number of Rooms *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={interiorFeatures.rooms.total || ''}
                    onChange={(e) => handleNumberInput(e.target.value, 'total')}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Bedrooms Above Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bedrooms Above Grade *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={interiorFeatures.rooms.BedroomsAboveGrade || ''}
                    onChange={(e) => handleNumberInput(e.target.value, 'BedroomsAboveGrade')}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Bedrooms Below Grade - New Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bedrooms in Basement *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={interiorFeatures.rooms.BedroomsBelowGrade || ''}
                    onChange={(e) => handleNumberInput(e.target.value, 'BedroomsBelowGrade')}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bathrooms *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={interiorFeatures.rooms.bathrooms || ''}
                    onChange={(e) => handleNumberInput(e.target.value, 'bathrooms')}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Kitchens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Kitchens *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={interiorFeatures.rooms.kitchens || ''}
                    onChange={(e) => handleNumberInput(e.target.value, 'kitchens')}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

            {/* Room Details */}
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <h3 className="text-sm font-medium text-gray-700">Room Details</h3>
    {roomDetails.length < 12 && (
      <button
        onClick={handleAddRoom}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
      >
        <PlusCircleIcon className="h-4 w-4" />
        Add Room
      </button>
    )}
  </div>

  <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable 
      droppableId="room-details" 
      isCombineEnabled={false}
      isDropDisabled={false}
      ignoreContainerClipping={false}
      type="room"
      mode="vertical"
      direction="vertical"
    >
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`space-y-4 ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
          style={{
            minHeight: '100px',
            ...provided.droppableProps.style
          }}
        >
          {roomDetails.map((room, index) => (
            <Draggable 
              key={room.id} 
              draggableId={room.id} 
              index={index}
              isDragDisabled={false}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...provided.draggableProps.style,
                    opacity: snapshot.isDragging ? 0.5 : 1
                  }}
                  className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                >
                  <RoomDetailsRow
                    room={room}
                    index={index}
                    onUpdate={handleUpdateRoom}
                    onDelete={handleDeleteRoom}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
</div>

              {/* Additional Room Information */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Room Information
                </label>
                <textarea
                  value={interiorFeatures.rooms.additionalInfo}
                  onChange={(e) => onFeaturesChange({
                    ...interiorFeatures,
                    rooms: {
                      ...interiorFeatures.rooms,
                      additionalInfo: e.target.value
                    }
                  })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="e.g., Den, Office, Study Room, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basement Section */}
        <Card>
          <CardHeader>
            <CardTitle>Basement Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Basement Type *
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePopupToggle('basementType')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                  </button>
                </div>
                <select
                  value={interiorFeatures.basement.type}
                  onChange={(e) => onFeaturesChange({
                    ...interiorFeatures,
                    basement: {
                      ...interiorFeatures.basement,
                      type: e.target.value as BasementType
                    }
                  })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Type</option>
                  {[
                    'Apartment',
                    'Crawl Space',
                    'Finished',
                    'Finished with Walk-Out',
                    'Full',
                    'Half',
                    'None',
                    'Other',
                    'Partial Basement',
                    'Partially Finished',
                    'Separate Entrance',
                    'Unfinished',
                    'Walk-Out',
                    'Walk-Up'
                  ].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Moving Furnished Status here */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Furnished Status *
                </label>
                <select
                  value={interiorFeatures.furnished}
                  onChange={(e) => onFeaturesChange({
                    ...interiorFeatures,
                    furnished: e.target.value as FurnishedType
                  })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Status</option>
                  {['Furnished', 'Unfurnished', 'Partially'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Room */}
        <Card>
          <CardHeader>
            <CardTitle>Family Room</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Family Room *
              </label>
              <button
                type="button"
                onClick={() => handlePopupToggle('familyRoom')}
                className="text-gray-400 hover:text-gray-500"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => onFeaturesChange({
                  ...interiorFeatures,
                  familyRoom: true
                })}
                className={`px-4 py-2 rounded ${
                  interiorFeatures.familyRoom
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => onFeaturesChange({
                  ...interiorFeatures,
                  familyRoom: false
                })}
                className={`px-4 py-2 rounded ${
                  !interiorFeatures.familyRoom
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                No
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Laundry Section */}
        <Card>
          <CardHeader>
            <CardTitle>Laundry Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Laundry Level
                </label>
                <select
                  value={interiorFeatures.laundry.level}
                  onChange={(e) => onFeaturesChange({
                    ...interiorFeatures,
                    laundry: {
                      ...interiorFeatures.laundry,
                      level: e.target.value as LaundryLevel
                    }
                  })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Level</option>
                  {['Lower Level', 'Main Level', 'Upper Level'].map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Laundry Features *
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Electric Dryer Hookup',
                    'Ensuite',
                    'Gas Dryer Hookup',
                    'In Area',
                    'In Basement',
                    'In Bathroom',
                    'In Building',
                    'In Carport',
                    'In Garage',
                    'In Hall',
                    'In Kitchen',
                    'In-Suite Laundry',
                    'Inside',
                    'Laundry Chute',
                    'Laundry Closet',
                    'Laundry Room',
                    'Multiple Locations',
                    'None',
                    'Other',
                    'Outside',
                    'Set Usage',
                    'Shared',
                    'Sink'
                  ].map((feature) => (
                    <button
                      key={feature}
                      onClick={() => handleLaundryFeatureToggle(feature)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        interiorFeatures.laundry.features.includes(feature)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HVAC Section */}
        <Card>
          <CardHeader>
            <CardTitle>Heating & Cooling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Heat Type */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Heat Type *
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePopupToggle('heatType')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                  </button>
                </div>
                <select
                  value={interiorFeatures.hvac.heatType}
                  onChange={(e) => onFeaturesChange({
                    ...interiorFeatures,
                    hvac: {
                      ...interiorFeatures.hvac,
                      heatType: e.target.value as HeatType
                    }
                  })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Heat Type</option>
                  {[
                    'Baseboard',
                    'Fan Coil',
                    'Forced Air',
                    'Heat Pump',
                    'Other',
                    'Radiant'
                  ].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Heat Source */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Heat Source *
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePopupToggle('heatSource')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                  </button>
                </div>
                <select
                  value={interiorFeatures.hvac.heatSource}
                  onChange={(e) => onFeaturesChange({
                    ...interiorFeatures,
                    hvac: {
                      ...interiorFeatures.hvac,
                      heatSource: e.target.value as HeatSource
                    }
                  })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Heat Source</option>
                  {[
                    'Electric',
                    'Gas',
                    'Ground Source',
                    'Oil',
                    'Other',
                    'Propane'
                  ].map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              {/* Air Conditioning */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Air Conditioning *
                </label>
                <select
                  value={interiorFeatures.hvac.airConditioning}
                  onChange={(e) => onFeaturesChange({
                    ...interiorFeatures,
                    hvac: {
                      ...interiorFeatures.hvac,
                      airConditioning: e.target.value as AirConditioningType
                    }
                  })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Type</option>
                  {[
                    'Central Air',
                    'None',
                    'Other',
                    'Wall Unit(s)',
                    'Window Unit(s)'
                  ].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
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
            disabled={!isValid(interiorFeatures)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>

      <BasementTypeInfo 
        isOpen={activePopup === 'basementType'} 
        onClose={() => setActivePopup(null)} 
      />

      <FamilyRoomInfo 
        isOpen={activePopup === 'familyRoom'} 
        onClose={() => setActivePopup(null)} 
      />

      <HeatTypeInfo 
        isOpen={activePopup === 'heatType'} 
        onClose={() => setActivePopup(null)} 
      />

      <HeatSourceInfo 
        isOpen={activePopup === 'heatSource'} 
        onClose={() => setActivePopup(null)} 
      />
    </motion.div>
  );
};

// Validation helper
function isValid(features: InteriorFeaturesType): boolean {
  return !!(
    features.rooms.total > 0 &&
    features.rooms.BedroomsAboveGrade >= 0 &&
    features.rooms.BedroomsBelowGrade >= 0 &&
    features.rooms.bathrooms > 0 &&
    features.rooms.kitchens > 0 &&
    features.basement.type &&
    features.hvac.heatType &&
    features.hvac.heatSource &&
    features.hvac.airConditioning &&
    features.laundry.features.length > 0 &&
    features.furnished
  );
}

export default InteriorFeatures;   