'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import Image from 'next/image';
import FAQSection from '@/components/FAQSection';
import CommissionCalculator from '@/components/CommissionCalculator';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';

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
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        // Get user's location from IP
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if we got an error response
        if (data.error) {
          throw new Error(`Location API error: ${data.reason || 'Unknown error'}`);
        }

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
        if (error.name === 'AbortError') {
          setLocationError('Location detection timed out');
        } else {
          setLocationError('Unable to find properties in your area');
        }
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
      <div className="relative min-h-[90vh]">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/Hero Section_Happy Lady.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            marginTop: '72px',
          }}
        />
        
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
          <h2 className="text-5xl font-bold text-center mb-16">
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
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

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