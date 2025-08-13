import { useState } from 'react';
import Select from 'react-select';

interface LocationDropdownProps {
  locations: Array<{
    name: string;
    municipalities: Array<{
      name: string;
      communities: string[];
    }>;
  }>;
  onChange: (selection: {
    area?: string;
    municipality?: string;
    community?: string;
  }) => void;
}

export const LocationDropdown: React.FC<LocationDropdownProps> = ({ locations, onChange }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

  const [municipalities, setMunicipalities] = useState<Array<{name: string; communities: string[]}>>([]);
  const [communities, setCommunities] = useState<string[]>([]);

  // Convert locations array to options format for react-select
  const areaOptions = locations.map(location => ({
    value: location.name,
    label: location.name
  }));

  // Handle area change
  const handleAreaChange = (option: any) => {
    const newArea = option ? option.value : null;
    setSelectedArea(newArea);
    setSelectedMunicipality(null);
    setSelectedCommunity(null);
    
    if (newArea) {
      const area = locations.find(loc => loc.name === newArea);
      setMunicipalities(area?.municipalities || []);
    } else {
      setMunicipalities([]);
    }

    // Notify parent of changes
    onChange({
      area: newArea || undefined,
      municipality: undefined,
      community: undefined
    });
  };

  // Handle municipality change
  const handleMunicipalityChange = (option: any) => {
    const newMunicipality = option ? option.value : null;
    setSelectedMunicipality(newMunicipality);
    setSelectedCommunity(null);
    
    if (newMunicipality) {
      const municipality = municipalities.find(mun => mun.name === newMunicipality);
      setCommunities(municipality?.communities || []);
    } else {
      setCommunities([]);
    }

    // Notify parent of changes
    onChange({
      area: selectedArea || undefined,
      municipality: newMunicipality || undefined,
      community: undefined
    });
  };

  // Handle community change
  const handleCommunityChange = (option: any) => {
    const newCommunity = option ? option.value : null;
    setSelectedCommunity(newCommunity);

    // Notify parent of changes
    onChange({
      area: selectedArea || undefined,
      municipality: selectedMunicipality || undefined,
      community: newCommunity || undefined
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Area</label>
        <Select
          isClearable
          options={areaOptions}
          value={selectedArea ? { value: selectedArea, label: selectedArea } : null}
          onChange={handleAreaChange}
          placeholder="Select Area"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Municipality</label>
        <Select
          isClearable
          isDisabled={!selectedArea}
          options={municipalities.map(mun => ({
            value: mun.name,
            label: mun.name
          }))}
          value={selectedMunicipality ? { value: selectedMunicipality, label: selectedMunicipality } : null}
          onChange={handleMunicipalityChange}
          placeholder="Select Municipality"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Community</label>
        <Select
          isClearable
          isDisabled={!selectedMunicipality}
          options={communities.map(com => ({
            value: com,
            label: com
          }))}
          value={selectedCommunity ? { value: selectedCommunity, label: selectedCommunity } : null}
          onChange={handleCommunityChange}
          placeholder="Select Community"
        />
      </div>
    </div>
  );
}; 