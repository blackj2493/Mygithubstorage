import React from 'react';
import Link from 'next/link';
import { HomeIcon, Scale, Shield, ArrowRight } from 'lucide-react';
import CommissionCalculator from '@/components/CommissionCalculator';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-30 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Perfect Property
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Browse through thousands of carefully selected properties
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/listings/create"
              className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              List Your Property
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
    </main>
  );
}