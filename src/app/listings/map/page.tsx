'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactLeafletMap from '@/components/listings/ReactLeafletMap';
import { Property } from '@/types/property';
import { MapPin, Star, DollarSign, Home, Calendar, LayoutGrid } from 'lucide-react';

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
}

export default function MapViewPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [sponsoredListings, setSponsoredListings] = useState<SponsoredListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapBounds, setMapBounds] = useState<any>(null);

  // Fetch properties based on search params
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        
        // Get search parameters
        const postalCode = searchParams.get('postalCode') || 'K1A0A6';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const propertyType = searchParams.get('propertyType');
        const bedrooms = searchParams.get('bedrooms');
        const bathrooms = searchParams.get('bathrooms');

        params.append('postalCode', postalCode);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (propertyType) params.append('propertyType', propertyType);
        if (bedrooms) params.append('bedrooms', bedrooms);
        if (bathrooms) params.append('bathrooms', bathrooms);

        const response = await fetch(`/api/properties/listings?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProperties(data.properties || []);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  // Mock sponsored listings for now - you'll replace this with real data
  useEffect(() => {
    // This is where you'll fetch your sponsored/premium listings
    const mockSponsored: SponsoredListing[] = [
      {
        id: 'sponsored-1',
        title: 'Premium Downtown Condo',
        price: '$899,000',
        address: '123 Premium St, Ottawa, ON',
        image: '/api/placeholder/300/200',
        bedrooms: 2,
        bathrooms: 2,
        sqft: '1,200',
        listingDate: '2024-01-15',
        isSponsored: true,
        sponsorshipLevel: 'premium'
      },
      {
        id: 'sponsored-2', 
        title: 'Featured Family Home',
        price: '$1,299,000',
        address: '456 Featured Ave, Ottawa, ON',
        image: '/api/placeholder/300/200',
        bedrooms: 4,
        bathrooms: 3,
        sqft: '2,500',
        listingDate: '2024-01-10',
        isSponsored: true,
        sponsorshipLevel: 'featured'
      }
    ];
    setSponsoredListings(mockSponsored);
  }, []);

  const handleMarkerClick = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const handleMapBoundsChange = useCallback((bounds: any) => {
    setMapBounds(bounds);
  }, []);

  const getSponsorshipBadge = (level: string) => {
    switch (level) {
      case 'premium':
        return <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star className="w-3 h-3" />
          PREMIUM
        </div>;
      case 'featured':
        return <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-2 py-1 rounded-full text-xs font-bold">
          FEATURED
        </div>;
      default:
        return <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
          SPONSORED
        </div>;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading map view...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Left Panel - Sponsored Listings */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Premium Listings
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Featured properties from our partners
          </p>
        </div>

        {/* Sponsored Listings */}
        <div className="flex-1 overflow-y-auto">
          {sponsoredListings.length === 0 ? (
            <div className="p-6 text-center">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Coming Soon!
              </h3>
              <p className="text-gray-500 text-sm">
                Premium and sponsored listings will appear here. 
                <br />
                <span className="font-medium">List your property</span> to get featured!
              </p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                List Your Property
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {sponsoredListings.map((listing) => (
                <div key={listing.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
                      <span>{listing.bedrooms} bed</span>
                      <span>{listing.bathrooms} bath</span>
                      <span>{listing.sqft} sqft</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      Listed {listing.listingDate}
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

      {/* Right Panel - Full Map */}
      <div className="flex-1 relative">
        <ReactLeafletMap
          listings={properties}
          onMarkerClick={handleMarkerClick}
          onBoundsChange={handleMapBoundsChange}
          className="w-full h-full"
          currentFilters={searchParams?.toString()}
        />
        
        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-3">
          <div className="text-sm text-gray-600">
            <div className="font-medium">{properties.length} Properties</div>
            <div className="text-xs text-gray-500">
              {sponsoredListings.length} Premium
            </div>
          </div>
        </div>

        {/* Prominent View Toggle */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-gray-100 p-1 rounded-xl shadow-sm">
            <div className="flex items-center">
              <a
                href="/listings"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
              >
                <LayoutGrid className="w-5 h-5" />
                Gallery View
              </a>
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all bg-white text-blue-600 shadow-sm"
              >
                <MapPin className="w-5 h-5" />
                Map View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
