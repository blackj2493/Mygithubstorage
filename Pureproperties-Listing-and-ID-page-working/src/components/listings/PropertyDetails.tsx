import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { PropertyInfo } from './PropertyInfo';
import { PropertyFeatures } from './PropertyFeatures';
import { PropertyLocation } from './PropertyLocation';
import { PropertyFinancials } from './PropertyFinancials';
import { PropertyUtilities } from './PropertyUtilities';
import { PropertyDocuments } from './PropertyDocuments';
import { PropertyRooms } from './PropertyRooms';
import { PropertyHistory } from './PropertyHistory';
import { AgentInformation } from './AgentInformation';

export function PropertyDetails({ property }: { property: any }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {[
            property.StreetNumber,
            property.StreetName,
            property.StreetSuffix,
            property.StreetDirSuffix
          ].filter(Boolean).join(' ')}
        </h1>
        <p className="text-xl text-gray-600">
          {property.City}, {property.StateOrProvince} {property.PostalCode}
        </p>
        <div className="mt-4 flex items-center">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(property.ListPrice)}
          </span>
          <span className="ml-4 px-3 py-1 rounded-full bg-blue-100 text-blue-800">
            {property.StandardStatus}
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {property.Media?.map((media: any, index: number) => (
            <div key={index} className="relative aspect-[4/3]">
              <Image
                src={media.MediaURL}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {property.PublicRemarks}
            </p>
          </section>

          {/* Core Property Information */}
          <PropertyInfo property={property} />

          {/* Room Details */}
          <PropertyRooms property={property} />

          {/* Features */}
          <PropertyFeatures property={property} />

          {/* Utilities & Amenities */}
          <PropertyUtilities property={property} />

          {/* Documents */}
          <PropertyDocuments property={property} />

          {/* Property History */}
          <PropertyHistory property={property} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Agent Information */}
          <AgentInformation property={property} />

          {/* Location */}
          <PropertyLocation property={property} />

          {/* Financial Details */}
          <PropertyFinancials property={property} />
        </div>
      </div>

      {/* Private Remarks (if user is authorized) */}
      {property.PrivateRemarks && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">Private Remarks</h2>
          <p className="text-gray-700">{property.PrivateRemarks}</p>
        </div>
      )}
    </div>
  );
} 