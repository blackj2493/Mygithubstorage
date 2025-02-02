'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBed, FaBath, FaCar } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import MediaGallery from '@/components/MediaGallery';
import ListingHistory from '@/components/ListingHistory';
import ListingContactDialog from '@/components/ListingContactDialog';
import MortgageCalculator from '@/app/components/MortgageCalculator';
import Schools from '@/components/Schools';

interface Room {
  RoomKey?: string;
  RoomType?: string;
  RoomLevel?: string;
  RoomDimensions?: string;
  RoomFeatures?: string;
  RoomLength?: number;
  RoomWidth?: number;
}

interface Property {
  ListingKey: string;
  ListPrice: number;
  City?: string;
  StateOrProvince?: string;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  ListOfficeName?: string;
  UnparsedAddress?: string;
  Utilities?: string;
  Water?: string;
  ExteriorFeatures?: string;
  ParkingTotal?: number;
  ParkingType?: string;
  AnnualTaxes?: number;
  AssociationFee?: number;
  PublicRemarks?: string;
  TransactionType?: string;
  rooms?: Room[];
  media?: Array<{ MediaURL: string }>;
  listingHistory?: {
    dateStart: string;
    dateEnd?: string;
    price: number;
    event: string;
    listingId: string;
  }[];
  TaxAnnualAmount?: number;
  Latitude?: number;
  Longitude?: number;
  PostalCode?: string;
  ArchitecturalStyle?: string;
  Basement?: string[];
  DirectionFaces?: string;
  OriginalEntryTimestamp?: string;
  BedroomsAboveGrade?: number;
  BedroomsBelowGrade?: number;
  CoveredSpaces?: number;
  KitchensTotal?: number;
  KitchensAboveGrade?: number;
  KitchensBelowGrade?: number;
  RoomsAboveGrade?: number;
  RoomsBelowGrade?: number;
  InteriorFeatures?: string[];
  ConstructionMaterials?: string[];
  FoundationDetails?: string[];
  Roof?: string[];
  LotWidth?: number;
  LotDepth?: number;
  LotSizeUnits?: string;
  LotSizeRangeAcres?: string;
  HeatType?: string;
  HeatSource?: string;
  Sewer?: string[];
  Cooling?: string[];
  Heating?: string;
  ParkingFeatures?: string[];
  PropertyFeatures?: string[];
}

function calculateDaysOnMarket(originalEntryTimestamp: string | undefined): number {
  if (!originalEntryTimestamp) return 0;
  
  const listingDate = new Date(originalEntryTimestamp);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - listingDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
  
  return diffDays;
}

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/listings/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch property');
        const data = await response.json();
        
        console.log('API Response - Full property data:', data);
        console.log('API Response - Media array:', data.property.media);
        if (data.property.media) {
          console.log('Media URLs:', data.property.media.map(m => m.MediaURL));
          console.log('Unique URLs count:', new Set(data.property.media.map(m => m.MediaURL)).size);
          console.log('Total URLs count:', data.property.media.length);
        }
        
        setProperty(data.property);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [resolvedParams.id]);

  if (loading) return <LoadingSpinner />;
  if (!property) return <div>Property not found</div>;

  console.log('Property Media Data:', property.media);
  console.log('Property postal code:', property?.PostalCode);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/listings" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Listings
      </Link>

      {/* Media Gallery - Full Width */}
      <MediaGallery 
        media={property.media
          ?.filter(item => item.MediaCategory === 'Photo')
          ?.filter((item, index, self) => 
            index === self.findIndex(t => t.MediaObjectID === item.MediaObjectID)
          ) || []} 
      />

      {/* Property Header - Full Width */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold">{property.UnparsedAddress}</h1>
        <div className="text-2xl font-bold text-blue-600 mt-2">
          ${property.ListPrice?.toLocaleString()}
        </div>
        <div className="flex gap-4 mt-4 text-lg">
          <div className="flex items-center gap-2">
            <FaBed className="text-xl" />
            <span>{property.BedroomsAboveGrade || 0}+{property.BedroomsBelowGrade || 0} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBath className="text-xl" />
            <span>{property.BathroomsTotalInteger} baths</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCar className="text-xl" />
            <span>{property.CoveredSpaces || 0} Garage</span>
          </div>
          <div className="text-gray-600 font-bold">
            Listed {calculateDaysOnMarket(property.OriginalEntryTimestamp)} days ago
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column - Description and Details */}
        <div className="lg:col-span-2">
          {/* Property Description */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {property.PublicRemarks}
            </p>
          </section>

          {/* Property Summary */}
          <section className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Property Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-600">Property Type</p>
                <p>Single Family</p>
              </div>
              <div>
                <p className="text-gray-600">Building Type</p>
                <p>Semi-detached</p>
              </div>
              <div>
                <p className="text-gray-600">Building Style</p>
                <p>{property.ArchitecturalStyle || 'Not Available'}</p>
              </div>
              <div>
                <p className="text-gray-600">Days on Market</p>
                <p>{calculateDaysOnMarket(property.OriginalEntryTimestamp)} days</p>
              </div>
              <div>
                <p className="text-gray-600">Land Size</p>
                <p>30 x 100 FT</p>
              </div>
              <div>
                <p className="text-gray-600">Annual Property Taxes</p>
                <p>{property.TaxAnnualAmount ? `$${property.TaxAnnualAmount.toLocaleString()}` : 'Not Available'}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Parking Spaces</p>
                <p>{property.ParkingTotal}</p>
              </div>
              <div>
                <p className="text-gray-600">Basement</p>
                <p>{property.Basement ? property.Basement.join(', ') : 'Not Available'}</p>
              </div>
              <div>
                <p className="text-gray-600">Facing</p>
                <p>{property.DirectionFaces || 'Not Available'}</p>
              </div>
            </div>
          </section>

          {/* Listing History */}
          {property.listingHistory && property.listingHistory.length > 0 && (
            <ListingHistory 
              history={property.listingHistory}
              address={property.UnparsedAddress || ''}
              propertyType={property.PropertyType || 'Unknown'}
            />
          )}

          {/* Details Card */}
          <section className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            
            {/* Interior */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Interior Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600">Kitchens</p>
                  <p>{property.KitchensTotal} ({property.KitchensAboveGrade} above, {property.KitchensBelowGrade} below)</p>
                </div>
                <div>
                  <p className="text-gray-600">Rooms</p>
                  <p>{property.RoomsAboveGrade} above, {property.RoomsBelowGrade} below</p>
                </div>
                {property.InteriorFeatures && (
                  <div>
                    <p className="text-gray-600">Features</p>
                    <p>{property.InteriorFeatures.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Construction */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Construction & Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.ConstructionMaterials && (
                  <div>
                    <p className="text-gray-600">Materials</p>
                    <p>{property.ConstructionMaterials.join(', ')}</p>
                  </div>
                )}
                {property.FoundationDetails && (
                  <div>
                    <p className="text-gray-600">Foundation</p>
                    <p>{property.FoundationDetails.join(', ')}</p>
                  </div>
                )}
                {property.Roof && (
                  <div>
                    <p className="text-gray-600">Roof</p>
                    <p>{property.Roof.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lot Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Lot Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600">Lot Dimensions</p>
                  <p>{property.LotWidth} x {property.LotDepth} {property.LotSizeUnits}</p>
                </div>
                <div>
                  <p className="text-gray-600">Lot Size Range</p>
                  <p>{property.LotSizeRangeAcres}</p>
                </div>
                <div>
                  <p className="text-gray-600">Direction Faces</p>
                  <p>{property.DirectionFaces}</p>
                </div>
              </div>
            </div>

            {/* Systems & Utilities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Systems & Utilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.Cooling && (
                  <div>
                    <p className="text-gray-600">Cooling</p>
                    <p>{property.Cooling.join(', ')}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Heating</p>
                  <p>{property.HeatType} ({property.HeatSource})</p>
                </div>
                {property.Sewer && (
                  <div>
                    <p className="text-gray-600">Sewer</p>
                    <p>{property.Sewer.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Parking & Exterior */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Parking & Exterior</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.ParkingFeatures && (
                  <div>
                    <p className="text-gray-600">Parking Features</p>
                    <p>{property.ParkingFeatures.join(', ')}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Total Parking Spaces</p>
                  <p>{property.ParkingTotal}</p>
                </div>
                {property.ExteriorFeatures && (
                  <div>
                    <p className="text-gray-600">Exterior Features</p>
                    <p>{property.ExteriorFeatures.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Property Features */}
            {property.PropertyFeatures && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Property Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600">Nearby</p>
                    <p>{property.PropertyFeatures.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Contact Dialog */}
        <div className="lg:col-span-1">
          <div className="sticky top-24"> {/* Sticky positioning */}
            <ListingContactDialog property={property} />
          </div>
        </div>
      </div>

      <MortgageCalculator 
        propertyPrice={property.ListPrice} 
        annualPropertyTax={property.TaxAnnualAmount}
      />

      <div className="mt-6">
        {property?.PostalCode && (
          <Schools 
            postalCode={property.PostalCode.replace(/\s+/g, '')} 
          />
        )}
      </div>
    </div>
  );
}

