// components/home/FeaturedListings.tsx
"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const FeaturedListings = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const listings = [
    { title: "Modern Apartment", price: "$450,000", location: "Downtown" },
    { title: "Family House", price: "$650,000", location: "Suburbs" },
    { title: "Beach Villa", price: "$850,000", location: "Waterfront" },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Listings</h2>
        <div className="relative">
          <button 
            onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full"
          >
            <ChevronLeft />
          </button>
          <div className="flex gap-6 overflow-hidden">
            {listings.map((listing, i) => (
              <Card key={i} className="min-w-[300px] transform transition-transform">
                <CardContent className="p-4">
                  <div className="h-48 bg-gray-200 mb-4 rounded-lg">
                    <img 
                      src="/api/placeholder/300/200" 
                      alt={listing.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{listing.title}</h3>
                  <p className="text-blue-600 font-bold">{listing.price}</p>
                  <p className="text-gray-600">{listing.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <button 
            onClick={() => setActiveSlide(Math.min(listings.length - 1, activeSlide + 1))}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};