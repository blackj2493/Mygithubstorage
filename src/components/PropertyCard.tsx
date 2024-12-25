'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaBed, FaBath } from 'react-icons/fa';

interface PropertyCardProps {
  property: {
    ListingKey: string;
    ListPrice: number;
    UnparsedAddress?: string;
    City?: string;
    BedroomsTotal?: number;
    BathroomsTotalInteger?: number;
    images?: Array<{ MediaURL: string }>;
    officeLogo?: string;
  };
}

const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return '/placeholder-property.jpg';
  
  // Check if the URL already has https://
  if (imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Add https:// to the URL if it's missing
  return `https://${imageUrl}`;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images?.[0]?.MediaURL || '/placeholder-property.jpg';
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.ListPrice);

  return (
    <Link href={`/listings/${property.ListingKey}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={getImageUrl(property.images?.[0]?.MediaURL || '')}
            alt={`Property at ${property.UnparsedAddress || 'Unknown location'}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation when clicking the heart
              // Add your favorite functionality here
            }}
          >
            <FaHeart className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-blue-600">{formattedPrice}</h3>
          </div>
          <p className="text-gray-600 mb-2">{property.UnparsedAddress}</p>
          
          <div className="flex items-center gap-4 text-gray-600">
            {property.BedroomsTotal != null && (
              <div className="flex items-center gap-1">
                <FaBed />
                <span>{property.BedroomsTotal} bed</span>
              </div>
            )}
            {property.BathroomsTotalInteger != null && (
              <div className="flex items-center gap-1">
                <FaBath />
                <span>{property.BathroomsTotalInteger} bath</span>
              </div>
            )}
          </div>

          {property.officeLogo && (
            <div className="mt-2">
              <Image
                src={property.officeLogo}
                alt="Office Logo"
                width={100}
                height={30}
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}