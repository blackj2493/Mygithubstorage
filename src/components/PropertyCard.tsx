'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaBed, FaBath } from 'react-icons/fa';
interface PropertyCardProps {
  property: {
    ListingKey: string;
    ListPrice: number;
    ClosePrice?: number;
    MlsStatus?: string;
    CloseDate?: string;
    UnparsedAddress?: string;
    City?: string;
    BedroomsAboveGrade?: number;
    BedroomsBelowGrade?: number;
    BathroomsTotalInteger?: number;
    ListOfficeName?: string;
    images: Array<{
      MediaURL: string;
      Order: number;
    }>;
    officeLogo?: string;
    PurchaseContractDate?: string;
    OriginalEntryTimestamp?: string;
  };
}
const getImageUrl = (imageUrl: string, propertyId?: string) => {
  if (!imageUrl) return '/placeholder-property.jpg';

  // Use our image serving endpoint which will handle local/remote fallback
  return `/api/images/serve?url=${encodeURIComponent(imageUrl)}&propertyId=${propertyId || ''}`;
};
const formatDaysAgo = (purchaseDate: string): string => {
  const today = new Date();
  const saleDate = new Date(purchaseDate);
  const timeDiff = today.getTime() - saleDate.getTime();
  const daysDiff = Math.abs(Math.round(timeDiff / (1000 * 60 * 60 * 24)));
  return `${daysDiff} days ago`;
};
function getDaysAgo(timestamp: string | undefined) {
  if (!timestamp) return 'New';
  
  try {
    const entryDate = new Date(timestamp);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - entryDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'New';
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'New';
  }
}
export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images?.[0]?.MediaURL || '/placeholder-property.jpg';
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const isSoldOrLeased = property.MlsStatus === 'Sold' || property.MlsStatus === 'Leased';
  const daysAgo = getDaysAgo(property.PurchaseContractDate);

  return (
    <Link href={`/listings/${property.ListingKey}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={getImageUrl(property.images?.[0]?.MediaURL || '', property.ListingKey)}
            alt={`Property at ${property.UnparsedAddress || 'Unknown location'}`}
            fill
            className="transition-transform duration-300 hover:scale-105"
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            quality={75}
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 shadow-sm">
            <span className={`font-semibold ${property.MlsStatus === 'Sold' ? 'text-red-600' : 'text-blue-600'}`}>
              {property.MlsStatus}
            </span>
          </div>
          <button 
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <FaHeart className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
        <div className="p-5">
          <div className="flex flex-col mb-3">
            {isSoldOrLeased ? (
              <>
                <div className="text-gray-500 line-through text-sm">
                  CA${property.ListPrice.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-blue-600">
                    CA${property.ClosePrice?.toLocaleString()}
                  </h3>
                  {property.CloseDate && (
                    <span className="text-gray-600 text-sm">
                      {formatDaysAgo(property.CloseDate)}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <h3 className="text-2xl font-bold text-blue-600">
                CA${property.ListPrice.toLocaleString()}
              </h3>
            )}
          </div>
          
          <p className="text-gray-600 mb-3 font-medium text-[1.2em]">{property.UnparsedAddress}</p>
          
          <div className="flex items-center gap-6 text-gray-600 mb-3">
            {(property.BedroomsAboveGrade != null || property.BedroomsBelowGrade != null) && (
              <div className="flex items-center gap-2">
                <FaBed className="text-gray-400" />
                <span>
                  {property.BedroomsAboveGrade || 0}
                  {property.BedroomsBelowGrade ? ` + ${property.BedroomsBelowGrade}` : ''}
                  {' bed'}
                </span>
              </div>
            )}
            {property.BathroomsTotalInteger != null && (
              <div className="flex items-center gap-2">
                <FaBath className="text-gray-400" />
                <span>{property.BathroomsTotalInteger} bath</span>
              </div>
            )}
          </div>

          {property.ListOfficeName && (
            <div className="text-sm text-gray-500 space-y-1 border-t pt-3">
              <div className="flex justify-between items-center text-[0.9em]">
                <div className="font-medium">{property.ListOfficeName}</div>
                {property.OriginalEntryTimestamp && (
                  <div className="text-gray-400">{getDaysAgo(property.OriginalEntryTimestamp)}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
