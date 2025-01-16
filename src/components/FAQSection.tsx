'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Wrench, Repeat, Briefcase, FileText } from 'lucide-react';
import Image from 'next/image';

interface FAQItem {
  id: number;
  question: string;
  answer: string | string[] | JSX.Element;
  icon: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How does PureProperty.ca help sellers?",
    answer: (
      <div className="p-6">
        <p className="mb-4">
          <strong className="text-blue-600 text-lg">PureProperty.ca is a game-changer for sellers!</strong> Unlike the traditional real estate model, we help you 
          <span className="text-green-600 font-semibold"> save thousands in commission fees</span> while delivering professional-grade tools and maximum exposure.
        </p>
        
        <p className="mb-4">
          <span className="text-gray-700 font-semibold">🎯 Maximum Reach:</span> List your property directly on 
          <span className="text-blue-600"> MLS, Realtor.ca, Zolo,</span> and other platforms, connecting with both professional Realtors and serious buyers.
        </p>
        
        <p className="mb-4">
          <span className="text-gray-700 font-semibold">🤖 Powerful AI Tools:</span>
          <br />• <span className="font-semibold">PricePerfect AI™</span> - Smart pricing optimization
          <br />• <span className="font-semibold">ListEase AI™</span> - Step-by-step listing guidance
          <br />• <span className="font-semibold">EnhanceAI™</span> - Property improvement recommendations
        </p>
        
        <p className="mb-2">
          <span className="text-gray-700 font-semibold">✅ Complete Peace of Mind:</span> We connect you with trusted lawyers to handle all paperwork and legal formalities, ensuring a 
          <span className="text-green-600 font-semibold"> smooth, confident selling experience</span>.
        </p>
      </div>
    ),
    icon: <Home className="w-6 h-6" />
  },
  {
    id: 2,
    question: "How does PureProperty.ca help buyers?",
    answer: (
      <div className="p-6">
        <p className="mb-4">
          <span className="text-blue-600 text-lg font-semibold">Discover your dream home, your way!</span> 
        </p>

        <p className="mb-4">
          <span className="text-gray-700 font-semibold">🏠 For FSBO Properties:</span>
          <br />• <span className="font-semibold">Direct Connection</span> with sellers
          <br />• <span className="font-semibold">Instant Chat</span> functionality
          <br />• <span className="font-semibold">Easy Scheduling</span> for property viewings
        </p>

        <p className="mb-2">
          <span className="text-gray-700 font-semibold">🔑 For MLS Listings:</span> We pair you with a 
          <span className="text-green-600 font-semibold"> professional realtor</span> who will guide you through every step of your home-buying journey.
        </p>
      </div>
    ),
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 3,
    question: "What are the innovative tools available on PureProperty.ca?",
    answer: (
      <div className="p-4">
        <p className="mb-2">
          <span className="text-blue-600 font-semibold">Discover our powerful AI-powered toolkit!</span>
        </p>

        <div className="space-y-2">
          <div>
            <span className="text-blue-600 font-semibold">🎯 PricePerfect AI™</span>
            <p className="ml-6 text-sm">Make data-driven pricing decisions with smart recommendations backed by comprehensive market data.</p>
          </div>

          <div>
            <span className="text-green-600 font-semibold">📝 ListEase AI™</span>
            <p className="ml-6 text-sm">Experience hassle-free listing creation with our intuitive, step-by-step professional guidance system.</p>
          </div>

          <div>
            <span className="text-purple-600 font-semibold">✨ ListingGenius™</span>
            <p className="ml-6 text-sm">Create compelling, SEO-optimized property descriptions that capture buyers' attention—effortlessly.</p>
          </div>

          <div>
            <span className="text-orange-600 font-semibold">🏠 EnhanceAI™</span>
            <p className="ml-6 text-sm">Receive smart, data-driven suggestions to maximize your property's appeal and market value.</p>
          </div>

          <div>
            <span className="text-red-600 font-semibold">🎯 HomeMatch AI™</span>
            <p className="ml-6 text-sm">Get personalized property recommendations that perfectly align with your unique preferences and needs.</p>
          </div>

          <div>
            <span className="text-indigo-600 font-semibold">💬 Keyton AI™</span>
            <p className="ml-6 text-sm">Access instant, intelligent support with our real-time AI assistant—available 24/7 for all your questions.</p>
          </div>
        </div>
      </div>
    ),
    icon: <Wrench className="w-6 h-6" />
  },
  {
    id: 4,
    question: "Can I switch to a full-commission realtor if needed?",
    answer: (
      <div className="p-6">
        <p>
          <span className="text-blue-600 font-semibold">✅ Absolutely!</span> You can 
          <span className="text-green-600 font-semibold"> switch to a full-commission realtor model at any time</span>, 
          giving you complete 
          <span className="text-gray-700 font-semibold"> flexibility</span> to adapt your selling strategy as your needs evolve.
        </p>
      </div>
    ),
    icon: <Repeat className="w-6 h-6" />
  },
  {
    id: 5,
    question: "How does PureProperty.ca connect sellers and buyers with local professionals?",
    answer: (
      <div className="p-6">
        <p className="mb-4">
          <span className="text-gray-700 font-semibold">🏡 For Sellers:</span> We connect you with:
          <br />• <span className="text-blue-600 font-semibold">Professional Photographers</span> to capture stunning listing photos
          <br />• <span className="text-blue-600 font-semibold">Expert Lawyers</span> to handle all legal requirements
        </p>

        <p className="mb-2">
          <span className="text-gray-700 font-semibold">🔑 For Buyers:</span> We provide access to:
          <br />• <span className="text-green-600 font-semibold">Mortgage Agents</span>
          <br />• <span className="text-green-600 font-semibold">Home Inspectors</span>
          <br />• <span className="text-green-600 font-semibold">Real Estate Lawyers</span>
          <p className="mt-2 text-gray-700">Ensuring a <span className="font-semibold">smooth and secure transaction</span> from start to finish.</p>
        </p>
      </div>
    ),
    icon: <Briefcase className="w-6 h-6" />
  },
  {
    id: 6,
    question: "How is legal and paperwork managed on PureProperty.ca?",
    answer: (
      <div className="p-6">
        <p className="mb-4">
          <span className="text-blue-600 font-semibold">⚖️ Don't stress about the legalities!</span> We understand that handling real estate paperwork can feel overwhelming.
        </p>

        <p className="mb-4">
          Here's how we make it simple:
          <br />• We <span className="text-green-600 font-semibold">connect you with experienced lawyers</span> who specialize in real estate
          <br />• They handle <span className="font-semibold">all aspects</span> of your transaction:
            <br />&nbsp;&nbsp;📄 Paperwork management
            <br />&nbsp;&nbsp;📋 Contract review
            <br />&nbsp;&nbsp;✔️ Due diligence
        </p>

        <p className="text-gray-700">
          <span className="font-semibold">🔒 Result:</span> Everything is handled <span className="text-green-600 font-semibold">professionally and securely</span>, giving you complete peace of mind.
        </p>
      </div>
    ),
    icon: <FileText className="w-6 h-6" />
  }
];

export default function FAQSection() {
  const [selectedId, setSelectedId] = useState<number>(1);

  return (
    <section className="h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl h-full flex flex-col">
        <h2 className="text-3xl font-semibold text-center mb-6">Your Real Estate Journey, Your Way</h2>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {faqData.map((faq) => (
            <button
              key={faq.id}
              onClick={() => setSelectedId(faq.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium ${
                selectedId === faq.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className={`${selectedId === faq.id ? 'text-white' : 'text-blue-600'}`}>
                {faq.icon}
              </div>
              <span className="whitespace-nowrap">{faq.question}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(90vh-250px)] max-w-[90%] mx-auto">
          {/* Answer Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-auto">
            {faqData.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: selectedId === faq.id ? 1 : 0,
                  y: selectedId === faq.id ? 0 : 20,
                  display: selectedId === faq.id ? 'block' : 'none'
                }}
                transition={{ duration: 0.3 }}
                className="tracking-tight" // Tighter letter spacing like DuProprio
              >
                {Array.isArray(faq.answer) ? (
                  <ul className="list-disc pl-5 space-y-3 text-gray-600">
                    {faq.answer.map((item, index) => (
                      <li key={index} className="leading-relaxed font-light">{item}</li>
                    ))}
                  </ul>
                ) : typeof faq.answer === 'string' ? (
                  <p className="text-gray-600 leading-relaxed font-light">{faq.answer}</p>
                ) : (
                  <div className="text-lg leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Image Section */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/How it works section.jpg"
              alt="Real Estate Journey"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
} 