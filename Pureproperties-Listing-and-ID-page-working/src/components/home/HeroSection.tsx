// components/home/HeroSection.tsx
import Link from 'next/link';

export const HeroSection = () => (
  <div className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 text-white">
    <div className="absolute inset-0 opacity-30 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center" />
    <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Your Dream Home Awaits
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-blue-100">
        Save thousands with our revolutionary real estate platform
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/list" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
          List Your Home
        </Link>
        <Link href="/search" className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
          Find Homes
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold">$15K+</div>
          <div className="text-blue-100">Avg. Savings</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">1000+</div>
          <div className="text-blue-100">Active Listings</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">98%</div>
          <div className="text-blue-100">Happy Customers</div>
        </div>
      </div>
    </div>
  </div>
);