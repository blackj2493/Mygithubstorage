'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { HomeIcon, Scale, Shield, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import CommissionCalculator from '@/components/CommissionCalculator';
import { calculateDistance } from '@/utils/distance';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';
import Link from 'next/link';
import Image from 'next/image';
import FAQSection from '@/components/FAQSection';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [nearbyListings, setNearbyListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userPostalCode, setUserPostalCode] = useState<string | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<'seller' | 'buyer'>('seller');
  const images = {
    seller: { src: "/How it works-Sellers.svg", alt: "How it works for sellers" },
    buyer: { src: "/How it works-Buyers.svg", alt: "How it works for buyers" }
  };

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // Get user's location from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        // Extract just the first 3 characters of the postal code
        const userPostal = data.postal?.substring(0, 3);
        
        if (!userPostal) {
          throw new Error('Invalid postal code received');
        }
        
        setUserPostalCode(userPostal);
        
        // Log for debugging
        console.log('Using first 3 digits of postal code:', userPostal);
        
        // Fetch properties using postal code
        const propertiesResponse = await fetch(`/api/properties/listings?postalCode=${userPostal}&limit=8`);
        if (!propertiesResponse.ok) {
          throw new Error('Failed to fetch properties');
        }

        const propertiesData = await propertiesResponse.json();
        console.log('Properties response:', propertiesData); // Enhanced debug log
        
        if (propertiesData.listings && propertiesData.listings.length > 0) {
          setNearbyListings(propertiesData.listings);
        } else {
          setLocationError('No properties found in your area');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error getting location or properties:', error);
        setLocationError('Unable to find properties in your area');
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  const handleListPropertyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/listings/create');
    } else {
      router.push('/api/auth/login?returnTo=/listings/create');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section - added pt-20 to account for navbar height */}
      <div className="relative min-h-[90vh]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/Hero Section_Happy Lady.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            marginTop: '72px', // Add margin-top to push content below navbar
          }}
        />
        
        {/* Content Overlay - added pt-20 to push content down */}
        <div className="relative z-10 w-full pl-8 sm:pl-16 lg:pl-24 flex items-center min-h-[90vh] pt-20">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Take Control of Selling Your Home
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-800 mb-8 leading-relaxed">
              Save thousands in fees, connect directly with buyers and access professional support every step of the way.
            </p>
            
            <div className="mt-8">
              <Link
                href="/listings/create"
                onClick={handleListPropertyClick}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Listings Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Properties Near You
          </h2>
          {locationError && (
            <p className="text-center text-gray-600 mb-4">{locationError}</p>
          )}
          {loading ? (
            <p className="text-center text-gray-600">Loading nearby properties...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {nearbyListings.slice(0, 8).map((property) => (
                  <PropertyCard
                    key={property.ListingKey}
                    property={property}
                  />
                ))}
              </div>
              {!locationError && (
                <div className="text-center">
                  <Link
                    href="/listings"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View More Properties
                  </Link>
                </div>
              )}
            </>
          )}
          {!loading && nearbyListings.length === 0 && !locationError && (
            <p className="text-center text-gray-600">
              No properties found nearby
            </p>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* How It Works Section */}
      <div className="relative min-h-[90vh]">
        <h2 className="text-3xl font-bold text-center py-8">How It Works</h2>
        
        <div className="relative">
          {/* User Type Selection - Buttons overlay on the image */}
          <div className="absolute left-12 top-1/3 z-20 flex flex-col gap-5">
            <button
              onClick={() => setSelectedUserType('seller')}
              className={`px-8 py-5 rounded-xl font-semibold text-xl transition-all w-68 text-center shadow-lg ${
                selectedUserType === 'seller'
                  ? 'bg-blue-600 text-white scale-105 transform'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              I want to sell my house
            </button>
            <button
              onClick={() => setSelectedUserType('buyer')}
              className={`px-8 py-5 rounded-xl font-semibold text-xl transition-all w-68 text-center shadow-lg ${
                selectedUserType === 'buyer'
                  ? 'bg-blue-600 text-white scale-105 transform'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              I want to buy a house
            </button>
          </div>

          {/* Image Display - Full width without padding */}
          <div className="relative h-[calc(90vh-8rem)] w-full">
            <div className="transition-opacity duration-500">
              <Image
                src={images[selectedUserType].src}
                alt={images[selectedUserType].alt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Service Marketplace Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Professional Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Photography", icon: "📸" },
              { title: "Legal", icon: "⚖️" },
              { title: "Home Inspection", icon: "🏠" },
              { title: "Mortgage", icon: "💰" }
            ].map((service, i) => (
              <div key={i} className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-semibold">{service.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Calculator Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <CommissionCalculator />
        </div>
      </section>

      {/* Call to Action Section */}
      <div className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who've found their perfect home</p>
          <Link href="/signup" className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Create Your Account
          </Link>
        </div>
      </div>
    </main>
  );
}