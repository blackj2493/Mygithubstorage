'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBed, FaBath } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import MediaGallery from '@/components/MediaGallery';
import ListingHistory from '@/components/ListingHistory';

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/listings" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Listings
      </Link>

      {/* Media Gallery */}
      <MediaGallery media={property.media || []} />

      {/* Property Header */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold">{property.UnparsedAddress}</h1>
        <div className="text-2xl font-bold text-blue-600 mt-2">
          ${property.ListPrice?.toLocaleString()}
        </div>
        <div className="text-lg text-gray-600 mt-1">
          {property.TransactionType || 'For Sale'}
        </div>
        
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <FaBed />
            <span>{property.BedroomsTotal} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBath />
            <span>{property.BathroomsTotalInteger} baths</span>
          </div>
        </div>
      </div>

      {/* Property Description */}
      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
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
            <p className="text-gray-600">Land Size</p>
            <p>30 x 100 FT</p>
          </div>
          <div>
            <p className="text-gray-600">Annual Property Taxes</p>
            <p>${property.AnnualTaxes?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Parking Spaces</p>
            <p>{property.ParkingTotal}</p>
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

      {/* Building Features */}
      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Building Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Foundation Type</p>
            <p>Brick, Concrete</p>
          </div>
          <div>
            <p className="text-gray-600">Architecture Style</p>
            <p>Bungalow</p>
          </div>
          <div>
            <p className="text-gray-600">Heating Type</p>
            <p>Forced air (Natural gas)</p>
          </div>
          <div>
            <p className="text-gray-600">Cooling</p>
            <p>Central air conditioning</p>
          </div>
        </div>
      </section>

      {/* Interior Features */}
      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Interior Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Appliances Included</p>
            <p>Blinds, Dryer, Refrigerator, Stove, Washer, Window Coverings</p>
          </div>
          <div>
            <p className="text-gray-600">Basement Features</p>
            <p>Separate entrance</p>
          </div>
        </div>
      </section>

      {/* Room Dimensions */}
      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Room Dimensions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {property.rooms?.map((room, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">{room.RoomType}</h3>
              <p className="text-gray-600">
                {room.RoomDimensions || 'Measurements not available'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Utilities */}
      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Utilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Utility Sewer</p>
            <p>Sanitary sewer</p>
          </div>
          <div>
            <p className="text-gray-600">Water</p>
            <p>Municipal water</p>
          </div>
        </div>
      </section>

      {/* Neighbourhood Features */}
      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Neighbourhood Features</h2>
        <div>
          <p className="text-gray-600">Amenities Nearby</p>
          <p>Hospital, Park, Schools</p>
        </div>
      </section>
    </div>
  );
}

