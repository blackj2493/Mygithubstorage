'use client';

import { useState, useEffect } from 'react';
import { Star, DollarSign, Home, Calendar, MapPin, Bed, Bath, Square } from 'lucide-react';

interface SponsoredListing {
  id: string;
  title: string;
  price: string;
  address: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  sqft: string;
  listingDate: string;
  isSponsored: true;
  sponsorshipLevel: 'premium' | 'featured' | 'basic';
  agentName?: string;
  agentPhone?: string;
}

interface SponsoredListingsProps {
  className?: string;
}

export default function SponsoredListings({ className = '' }: SponsoredListingsProps) {
  const [sponsoredListings, setSponsoredListings] = useState<SponsoredListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for now - replace with real API call
  useEffect(() => {
    const fetchSponsoredListings = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock sponsored listings - replace with real data
      const mockSponsored: SponsoredListing[] = [
        {
          id: 'sponsored-1',
          title: 'Luxury Downtown Condo',
          price: '$899,000',
          address: '123 Premium St, Ottawa, ON K1A 0A6',
          image: '/api/placeholder/300/200',
          bedrooms: 2,
          bathrooms: 2,
          sqft: '1,200',
          listingDate: '2024-01-15',
          isSponsored: true,
          sponsorshipLevel: 'premium',
          agentName: 'Sarah Johnson',
          agentPhone: '(613) 555-0123'
        },
        {
          id: 'sponsored-2', 
          title: 'Executive Family Home',
          price: '$1,299,000',
          address: '456 Featured Ave, Ottawa, ON K1B 1B1',
          image: '/api/placeholder/300/200',
          bedrooms: 4,
          bathrooms: 3,
          sqft: '2,500',
          listingDate: '2024-01-10',
          isSponsored: true,
          sponsorshipLevel: 'featured',
          agentName: 'Mike Chen',
          agentPhone: '(613) 555-0456'
        }
      ];
      
      setSponsoredListings(mockSponsored);
      setIsLoading(false);
    };

    fetchSponsoredListings();
  }, []);

  const getSponsorshipBadge = (level: string) => {
    switch (level) {
      case 'premium':
        return (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3" />
            PREMIUM
          </div>
        );
      case 'featured':
        return (
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-2 py-1 rounded-full text-xs font-bold">
            FEATURED
          </div>
        );
      default:
        return (
          <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            SPONSORED
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white shadow-lg border border-gray-200 rounded-lg ${className}`}>
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Premium Listings
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Featured properties from our partners
          </p>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading featured listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow-lg border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Featured Listings
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Premium properties from our partners
        </p>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {sponsoredListings.length === 0 ? (
          <div className="p-6 text-center">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Coming Soon!
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Premium and sponsored listings will appear here.
              <br />
              <span className="font-medium">List your property</span> to get featured!
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              List Your Property
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {sponsoredListings.map((listing) => (
              <div 
                key={listing.id} 
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Sponsorship Badge */}
                <div className="p-3 pb-0">
                  {getSponsorshipBadge(listing.sponsorshipLevel)}
                </div>
                
                {/* Property Image */}
                <div className="px-3">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                {/* Property Details */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">{listing.price}</p>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.address}
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {listing.bedrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {listing.bathrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      {listing.sqft} sqft
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Listed {listing.listingDate}
                    </div>
                    {listing.agentName && (
                      <div className="text-blue-600 font-medium">
                        {listing.agentName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Want your listing featured here?
          </p>
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
