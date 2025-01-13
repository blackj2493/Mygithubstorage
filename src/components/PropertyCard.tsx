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
  };
}
const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return '/placeholder-property.jpg';
  return imageUrl.startsWith('https://') ? imageUrl : `https://${imageUrl}`;
};
const getRelativeDate = (closeDate: string) => {
  const days = Math.floor((new Date().getTime() - new Date(closeDate).getTime()) / (1000 * 3600 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};
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
          <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-white/90">
            <span className={`font-semibold ${property.MlsStatus === 'Sold' ? 'text-red-600' : 'text-blue-600'}`}>
              {property.MlsStatus}
            </span>
          </div>
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <FaHeart className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex flex-col mb-2">
            {isSoldOrLeased ? (
              <>
                <div className="text-gray-500 line-through text-sm">
                  CA${property.ListPrice.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-blue-600">
                    CA${property.ClosePrice?.toLocaleString()}
                  </h3>
                  {property.CloseDate && (
                    <span className="text-gray-500 text-sm">
                      {getRelativeDate(property.CloseDate)}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <h3 className="text-xl font-bold text-blue-600">
                CA${property.ListPrice.toLocaleString()}
              </h3>
            )}
          </div>
          
          <p className="text-gray-600 mb-2">{property.UnparsedAddress}</p>
          
          <div className="flex items-center gap-4 text-gray-600">
            {(property.BedroomsAboveGrade != null || property.BedroomsBelowGrade != null) && (
              <div className="flex items-center gap-1">
                <FaBed />
                <span>
                  {property.BedroomsAboveGrade || 0}
                  {property.BedroomsBelowGrade ? ` + ${property.BedroomsBelowGrade}` : ''}
                  {' bed'}
                </span>
              </div>
            )}
            {property.BathroomsTotalInteger != null && (
              <div className="flex items-center gap-1">
                <FaBath />
                <span>{property.BathroomsTotalInteger} bath</span>
              </div>
            )}
          </div>

          {property.ListOfficeName && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-500">{property.ListOfficeName}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
