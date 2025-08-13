export type PropertyAddress = {
    streetNumber: string;
    streetName: string;
    streetType: string;
    city: string;
    province: string;
    postalCode: string;
    unitNumber?: string;
  };
  
  export type ExteriorFeatures = {
    propertyType: string;
    propertyClass: PropertyClass | null;
    link: boolean;
    parcelOfTiedLand: boolean;
    exteriorMaterial: ExteriorMaterial[];
    exteriorFeatures: ExteriorFeature[];
    roof: RoofType;
    utilities: {
      water: WaterType;
      sewers: SewerType;
      pool: YesNoNA;
    };
  };
  
  export type InteriorFeatures = {
    rooms: {
      total: number;
      bedrooms: number;
      bathrooms: number;
      kitchens: number;
      additionalInfo: string;
    };
    basement: {
      type: BasementType;
      hasFamily: boolean;
    };
    laundry: {
      level: LaundryLevel;
      features: LaundryFeature[];
    };
    hvac: {
      heatType: HeatType;
      heatSource: HeatSource;
      airConditioning: AirConditioningType;
    };
    furnished: FurnishedType;
  };