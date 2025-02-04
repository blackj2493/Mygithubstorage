'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Wrench, Repeat, Briefcase, FileText, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';
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
      <div className="p-12">
        <p className="mb-8 text-3xl">
          <strong className="text-blue-600">PureProperty.ca is a game-changer for sellers!</strong>
        </p>
        
        <p className="mb-8 text-2xl">
          Unlike the traditional real estate model, we help you 
          <span className="text-green-600 font-semibold"> save thousands in commission fees</span> while delivering professional-grade tools and maximum exposure.
        </p>
        
        <p className="mb-8 text-2xl">
          <span className="text-gray-700 font-semibold">🎯 Maximum Reach:</span>
          <br />• List your property directly on <span className="text-blue-600">MLS, Realtor.ca, Zolo</span>
          <br />• Connect with both professional Realtors and serious buyers
        </p>
        
        <p className="mb-8 text-2xl">
          <span className="text-gray-700 font-semibold">🤖 Powerful AI Tools:</span>
          <br />• <span className="font-semibold">PricePerfect AI™</span> - Smart pricing optimization
          <br />• <span className="font-semibold">ListEase AI™</span> - Step-by-step listing guidance
          <br />• <span className="font-semibold">EnhanceAI™</span> - Property improvement recommendations
        </p>
      </div>
    ),
    icon: <Home className="w-6 h-6" />
  },
  {
    id: 2,
    question: "How does PureProperty.ca help buyers?",
    answer: (
      <div className="p-12">
        <p className="mb-8 text-3xl">
          <span className="text-blue-600 font-semibold">Discover your dream home, your way!</span> 
        </p>

        <p className="mb-8 text-2xl">
          <span className="text-gray-700 font-semibold">🏠 For FSBO Properties:</span>
          <br />• <span className="font-semibold">Direct Connection</span> with sellers
          <br />• <span className="font-semibold">Instant Chat</span> functionality
          <br />• <span className="font-semibold">Easy Scheduling</span> for property viewings
        </p>

        <p className="mb-8 text-2xl">
          <span className="text-gray-700 font-semibold">🔑 For MLS Listings:</span>
          <br />• Paired with a <span className="text-green-600 font-semibold">professional realtor</span>
          <br />• Full guidance through your home-buying journey
        </p>
      </div>
    ),
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 3,
    question: "What are the innovative tools available on PureProperty.ca?",
    answer: (
      <div className="p-8">
        <p className="mb-6 text-3xl">
          <span className="text-blue-600 font-semibold">Discover our powerful AI-powered toolkit!</span>
        </p>

        <div className="space-y-4 text-2xl">
          <div>
            <span className="text-blue-600 font-semibold">🎯 PricePerfect AI™</span>
            <p className="ml-6">Make data-driven pricing decisions with smart recommendations backed by comprehensive market data.</p>
          </div>

          <div>
            <span className="text-green-600 font-semibold">📝 ListEase AI™</span>
            <p className="ml-6">Experience hassle-free listing creation with our intuitive, step-by-step professional guidance system.</p>
          </div>

          <div>
            <span className="text-purple-600 font-semibold">✨ ListingGenius™</span>
            <p className="ml-6">Create compelling, SEO-optimized property descriptions that capture buyers' attention—effortlessly.</p>
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
      <div className="p-12">
        <p className="mb-8 text-3xl">
          <span className="text-blue-600 font-semibold">✅ Absolutely!</span>
        </p>
        
        <p className="text-2xl">
          You can <span className="text-green-600 font-semibold">switch to a full-commission realtor model at any time</span>, 
          giving you complete <span className="text-gray-700 font-semibold">flexibility</span> to adapt your selling strategy 
          as your needs evolve.
        </p>
      </div>
    ),
    icon: <Repeat className="w-6 h-6" />
  },
  {
    id: 5,
    question: "How does PureProperty.ca connect sellers and buyers with local professionals?",
    answer: (
      <div className="p-8">
        <p className="mb-6 text-2xl">
          <span className="text-gray-700 font-semibold">🏡 For Sellers:</span> We connect you with:
          <br />• <span className="text-blue-600 font-semibold">Professional Photographers</span> to capture stunning listing photos
          <br />• <span className="text-blue-600 font-semibold">Expert Lawyers</span> to handle all legal requirements
        </p>

        <p className="text-2xl">
          <span className="text-gray-700 font-semibold">🔑 For Buyers:</span> We provide access to:
          <br />• <span className="text-green-600 font-semibold">Mortgage Agents</span>
          <br />• <span className="text-green-600 font-semibold">Home Inspectors</span>
          <br />• <span className="text-green-600 font-semibold">Real Estate Lawyers</span>
          <p className="mt-4 text-gray-700">Ensuring a <span className="font-semibold">smooth and secure transaction</span> from start to finish.</p>
        </p>
      </div>
    ),
    icon: <Briefcase className="w-6 h-6" />
  },
  {
    id: 6,
    question: "How is legal and paperwork managed on PureProperty.ca?",
    answer: (
      <div className="p-12">
        <p className="mb-8 text-3xl">
          <span className="text-blue-600 font-semibold">⚖️ Don't stress about the legalities!</span>
        </p>

        <p className="mb-8 text-2xl">
          We understand that handling real estate paperwork can feel overwhelming.
          Here's how we make it simple:
        </p>

        <p className="mb-8 text-2xl">
          <span className="text-gray-700 font-semibold">For Your Peace of Mind:</span>
          <br />• We <span className="text-green-600 font-semibold">connect you with experienced lawyers</span>
          <br />• Handle all paperwork management
          <br />• Manage contract reviews
          <br />• Complete due diligence checks
        </p>

        <p className="text-2xl text-gray-700">
          <span className="font-semibold">🔒 Result:</span> Everything is handled{' '}
          <span className="text-green-600 font-semibold">professionally and securely</span>.
        </p>
      </div>
    ),
    icon: <FileText className="w-6 h-6" />
  }
];

const FAQSection = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
          Frequently<br />asked questions
        </h2>
        
        <div className="flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">
          {/* Left side - FAQ Accordion */}
          <div className="md:w-2/3">
            <div className="space-y-6">
              {faqData.map((faq) => (
                <div 
                  key={faq.id}
                  className="border-b border-gray-200"
                >
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between py-6 text-left hover:text-gray-700"
                  >
                    <span className="text-xl font-medium pr-8 text-gray-800">{faq.question}</span>
                    <Plus 
                      className={`flex-shrink-0 w-7 h-7 transition-transform duration-200
                        ${openId === faq.id ? 'rotate-45' : ''}`}
                    />
                  </button>
                  
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pb-8 text-gray-600 text-lg"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - How it Works Image */}
          <div className="md:w-1/3 relative">
            <div className="sticky top-8">
              <div className="aspect-[3/4] relative">
                <Image
                  src="/How it Works section.jpg"
                  alt="How PureProperty.ca Works"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 