import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export function ListingCard({ property }: { property: any }) {
  return (
    <Link 
      href={`/listings/${property.ListingKey}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative h-48">
        <Image
          src={property.Media?.[0]?.MediaURL || '/placeholder-home.jpg'}
          alt={`${property.StreetNumber} ${property.StreetName}`}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {[
            property.StreetNumber,
            property.StreetName,
            property.StreetSuffix,
            property.StreetDirSuffix
          ].filter(Boolean).join(' ')}
        </h3>
        
        <p className="text-gray-600">
          {property.City}, {property.StateOrProvince}
        </p>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xl font-bold text-primary">
            {formatPrice(property.ListPrice)}
          </span>
          <div className="text-sm">
            <span className="mr-2">{property.BedroomsTotal} beds</span>
            <span>{property.BathroomsTotalInteger} baths</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 