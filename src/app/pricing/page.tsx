import { Metadata } from 'next'
import Pricing from '@/components/ui/pricing'

export const metadata: Metadata = {
  title: 'Pricing - FSBO Packages | PureProperties',
  description: 'Choose the perfect FSBO package for selling your home. All packages include MLS listing, realtor.ca exposure, and comprehensive support.',
  keywords: 'FSBO pricing, sell home packages, MLS listing, realtor.ca, home selling services',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-8">
              Transparent Pricing for
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent block">
                Home Sellers
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              No hidden fees, no commission surprises. Choose the package that fits your needs
              and sell your home with confidence.
            </p>

            {/* Key benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No Commission Fees</h3>
                <p className="text-sm text-gray-600 text-center">Save 5-6% in traditional agent fees</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Full MLS Exposure</h3>
                <p className="text-sm text-gray-600 text-center">Listed on MLS & Realtor.ca</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Expert Support</h3>
                <p className="text-sm text-gray-600 text-center">7/7 customer support included</p>
              </div>
            </div>
          </div>

          {/* Pricing Component */}
          <Pricing />

          {/* Value Proposition Section */}
          <div className="mt-24 bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Why Choose Our FSBO Packages?</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of homeowners who have successfully sold their homes while saving money
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Save Thousands</h4>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Avoid paying 5-6% commission fees. Our flat-rate packages save you thousands on your home sale.
                </p>
                <div className="mt-4 text-base font-medium text-green-600">
                  Average savings: $15,000 - $30,000
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Full MLS Exposure</h4>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Your listing appears on MLS and Realtor.ca, reaching the same audience as traditional agents.
                </p>
                <div className="mt-4 text-base font-medium text-blue-600">
                  Same exposure, lower cost
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Expert Support</h4>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Get guidance from real estate professionals throughout your selling journey.
                </p>
                <div className="mt-4 text-base font-medium text-purple-600">
                  Available 7 days a week
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h3>
              <p className="text-lg text-gray-600">Everything you need to know about our FSBO packages</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">Q</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-gray-900">What's included in every package?</h4>
                      <p className="text-gray-600 leading-relaxed">
                        All packages include MLS listing, Realtor.ca exposure, a for-sale sign, step-by-step FSBO guide,
                        and 7-day customer support.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">Q</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-gray-900">How long does my listing stay active?</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Listing duration varies by package: Basic (4 months), Essential (8 months),
                        Pro and Elite (until sold).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">Q</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-gray-900">Can I upgrade my package later?</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Yes! You can upgrade to a higher-tier package at any time. You'll only pay the difference
                        in price.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-sm">Q</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-gray-900">Do I need any real estate experience?</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Not at all! Our step-by-step guide and expert support team will walk you through
                        every step of the process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="mt-24 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to Save Thousands on Your Home Sale?</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied homeowners who chose the smarter way to sell
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                  Get Started Today
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200">
                  Speak with an Expert
                </button>
              </div>
              <div className="mt-8 text-sm text-blue-200">
                💡 Free consultation • No obligation • Expert guidance included
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
