'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimes, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

interface Listing {
  ListingKey: string;
  ListPrice: number;
  UnparsedAddress?: string;
  City?: string;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  images?: Array<{ MediaURL: string }>;
  MlsStatus?: string;
  StandardStatus?: string;
}

interface PropertyOverlayProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyOverlay({ listing, isOpen, onClose }: PropertyOverlayProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !listing) return null;

  const images = listing.images || [];
  const hasImages = images.length > 0;

  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder-property.jpg';
    return `/api/images/serve?url=${encodeURIComponent(url)}&propertyId=${listing?.ListingKey || ''}`;
  };

  const formattedPrice = listing.ListPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Image Gallery */}
        {hasImages && (
          <div className="relative">
            <div className="aspect-[4/3] relative">
              <Image
                src={getImageUrl(images[currentImageIndex]?.MediaURL)}
                alt={`Property at ${listing.UnparsedAddress}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Property Details */}
        <div className="p-6">
          {/* Price and Status */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{formattedPrice}</h3>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-1 text-sm" />
                <span className="text-sm">{listing.UnparsedAddress || 'Address not available'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                listing.MlsStatus === 'Sold' || listing.StandardStatus === 'Sold'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {listing.MlsStatus || listing.StandardStatus || 'Active'}
              </span>
            </div>
          </div>

          {/* Property Features */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaBed className="mx-auto mb-2 text-gray-600" />
              <div className="text-lg font-semibold">{listing.BedroomsTotal || 0}</div>
              <div className="text-sm text-gray-600">Bedrooms</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaBath className="mx-auto mb-2 text-gray-600" />
              <div className="text-lg font-semibold">{listing.BathroomsTotalInteger || 0}</div>
              <div className="text-sm text-gray-600">Bathrooms</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaRulerCombined className="mx-auto mb-2 text-gray-600" />
              <div className="text-lg font-semibold">
                {listing.LivingArea ? `${listing.LivingArea.toLocaleString()}` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Sq Ft</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/listings/${listing.ListingKey}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              View Full Details
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
