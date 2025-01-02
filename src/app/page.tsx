'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { HomeIcon, Scale, Shield, ArrowRight } from 'lucide-react';
import CommissionCalculator from '@/components/CommissionCalculator';
import { calculateDistance } from '@/utils/distance';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [nearbyListings, setNearbyListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userPostalCode, setUserPostalCode] = useState<string | null>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserPostalCode(data.postal);
        
        // Now fetch properties using postal code
        const propertiesResponse = await fetch(`/api/properties/listings?postalCode=${data.postal}&limit=8`);
        if (!propertiesResponse.ok) {
          throw new Error('Failed to fetch properties');
        }

        const propertiesData = await propertiesResponse.json();
        setNearbyListings(propertiesData.listings || []);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
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
      {/* Hero Section */}
      <div className="relative min-h-[90vh] -mt-[72px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/Hero Section_Happy Lady.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Content Overlay - Left aligned with black text */}
        <div className="relative z-10 w-full pl-8 sm:pl-16 lg:pl-24 flex items-center min-h-[90vh]">
          <div className="max-w-xl pt-[72px]">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Take Control of Selling Your Home
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-800 mb-8 leading-relaxed">
              Save thousands in fees, connect directly with buyers and access professional support every step of the way.
            </p>
            
            {/* Keep button blue */}
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

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <HomeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Buy Properties</h3>
              <p className="text-gray-600">
                Find your dream home from our extensive listings
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Scale className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sell Properties</h3>
              <p className="text-gray-600">
                List your property and reach thousands of buyers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional Services</h3>
              <p className="text-gray-600">
                Connect with photographers, lawyers, and mortgage brokers
              </p>
            </div>
          </div>
        </div>
      </div>

     {/* How It Works Section */}
     <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Create Account", desc: "Sign up in minutes" },
              { title: "List or Search", desc: "Browse or post properties" },
              { title: "Connect", desc: "Chat with buyers/sellers" },
              { title: "Close Deal", desc: "Secure transaction process" }
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute top-6 -right-4 text-blue-600" />
                )}
              </div>
            ))}
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

      <div className="container mx-auto px-4">
        <div className="flex justify-center mt-8">
          <SearchBar />
        </div>
      </div>
    </main>
  );
}