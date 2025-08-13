"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/AllCard"

interface PricingFeature {
  name: string
  basic: string | boolean
  essential: string | boolean
  pro: string | boolean
  elite: string | boolean
}

interface PricingTierProps {
  name: string
  price: string
  description?: string
  features: { [key: string]: string | boolean }
  popular?: boolean
  buttonText?: string
  onSelect?: () => void
}

const PricingTier = ({
  name,
  price,
  description,
  features,
  popular = false,
  buttonText = "Get Started",
  onSelect
}: PricingTierProps) => {
  return (
    <Card className={cn(
      "relative flex flex-col h-full transition-all duration-300 hover:shadow-xl",
      popular
        ? "border-2 border-blue-500 shadow-2xl transform scale-105 bg-white"
        : "border border-gray-200 hover:border-blue-300 bg-white"
    )}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white whitespace-nowrap">
            ⭐ Most Popular
          </div>
        </div>
      )}

      <CardHeader className="text-center pb-6 pt-8">
        <CardTitle className="text-2xl font-bold mb-2 text-gray-900">
          {name}
        </CardTitle>
        {description && (
          <CardDescription className="text-gray-700 mb-4 font-medium">
            {description}
          </CardDescription>
        )}
        <div className="mb-4">
          <span className="text-5xl font-bold text-gray-900">
            {price}
          </span>
          <div className="text-sm text-gray-800 mt-1 font-semibold">One-time payment</div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6">
        <ul className="space-y-4">
          {Object.entries(features).map(([feature, value]) => (
            <li key={feature} className="flex items-start gap-3">
              {value === true || (typeof value === 'string' && value !== '—') ? (
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "text-sm font-medium",
                  value === true || (typeof value === 'string' && value !== '—')
                    ? "text-gray-900"
                    : "text-gray-400"
                )}>
                  {feature}
                </span>
                {typeof value === 'string' && value !== '—' && value !== 'true' && (
                  <div className="text-xs text-gray-500 mt-1">
                    {value}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-6 pb-6 px-6">
        <Button
          className={cn(
            "w-full py-3 text-base font-semibold transition-all duration-200",
            popular
              ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105"
              : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          )}
          variant={popular ? "default" : "outline"}
          onClick={onSelect}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

interface PricingProps {
  className?: string
}

export const Pricing = ({ className }: PricingProps) => {
  const [activeTab, setActiveTab] = useState<'sale' | 'rental'>('sale')

  const salePricingData = {
    basic: {
      name: "Basic Package",
      price: "$1,199.95",
      description: "Perfect for getting started with FSBO",
      features: {
        "MLS + Realtor.ca listing": true,
        "Step-by-step FSBO Guide": true,
        "For Sale sign": true,
        "Customer Support (7/7)": true,
        "Access to experts": "1 connection",
        "Listing duration": "4 months",
        "Social media campaigns": "—",
        "Featured Homes section": "—",
        "Listing repositioning": "—",
        "AI pricing insights": "—",
        "Viewing management tools": "—",
        "Premium AI tools": "—"
      }
    },
    essential: {
      name: "Essential Package",
      price: "$1,699.95",
      description: "Enhanced exposure and support",
      features: {
        "MLS + Realtor.ca listing": true,
        "Step-by-step FSBO Guide": true,
        "For Sale sign": true,
        "Customer Support (7/7)": true,
        "Access to experts": "multiple",
        "Listing duration": "8 months",
        "Social media campaigns": "2 weeks",
        "Featured Homes section": "2 weeks",
        "Listing repositioning": "—",
        "AI pricing insights": true,
        "Viewing management tools": true,
        "Premium AI tools": "—"
      }
    },
    pro: {
      name: "Pro Package",
      price: "$2,299.95",
      description: "Advanced tools and priority support",
      features: {
        "MLS + Realtor.ca listing": true,
        "Step-by-step FSBO Guide": true,
        "For Sale sign": true,
        "Customer Support (7/7)": true,
        "Access to experts": "priority",
        "Listing duration": "Until sold",
        "Social media campaigns": "6 weeks",
        "Featured Homes section": "6 weeks",
        "Listing repositioning": true,
        "AI pricing insights": true,
        "Viewing management tools": true,
        "Premium AI tools": true
      }
    },
    elite: {
      name: "Elite Package",
      price: "$2,999.95",
      description: "Premium service with dedicated support",
      features: {
        "MLS + Realtor.ca listing": true,
        "Step-by-step FSBO Guide": true,
        "For Sale sign": true,
        "Customer Support (7/7)": true,
        "Access to experts": "priority + dedicated",
        "Listing duration": "Until sold",
        "Social media campaigns": "8 weeks (custom)",
        "Featured Homes section": "8 weeks",
        "Listing repositioning": true,
        "AI pricing insights": true,
        "Viewing management tools": true,
        "Premium AI tools": true
      }
    }
  }

  const rentalPricingData = {
    basic: {
      name: "Basic Rental Package",
      price: "$499.95",
      description: "DIY landlords seeking basic exposure",
      features: {
        "MLS + Realtor.ca listing": true,
        "Rental listing guide": true,
        "For Rent sign": true,
        "Customer Support (7/7)": true,
        "Access to experts": "1 connection",
        "Listing duration": "3 months",
        "Social media campaigns": "—",
        "Featured Rentals section": "—",
        "Tenant screening tools": "—",
        "AI pricing insights": "—",
        "Viewing management tools": "—",
        "Premium AI tools": "—"
      }
    },
    essential: {
      name: "Essential Rental Package",
      price: "$799.95",
      description: "Landlords wanting moderate support",
      features: {
        "MLS + Realtor.ca listing": true,
        "Rental listing guide": true,
        "For Rent sign": true,
        "Customer Support (7/7)": true,
        "Access to experts": "multiple",
        "Listing duration": "6 months",
        "Social media campaigns": "2 weeks",
        "Featured Rentals section": "2 weeks",
        "Tenant screening tools": "basic",
        "AI pricing insights": true,
        "Viewing management tools": true,
        "Premium AI tools": "—"
      }
    },
    pro: {
      name: "Pro Rental Package",
      price: "$1,199.95",
      description: "Enhanced exposure and tools",
      features: {
        "MLS + Realtor.ca listing": true,
        "Rental listing guide": true,
        "For Rent sign": true,
        "Customer Support (7/7)": true,
        "Access to experts": "priority",
        "Listing duration": "Until rented",
        "Social media campaigns": "4 weeks",
        "Featured Rentals section": "4 weeks",
        "Tenant screening tools": "advanced",
        "AI pricing insights": true,
        "Viewing management tools": true,
        "Premium AI tools": true
      }
    },
    elite: {
      name: "Elite Rental Package",
      price: "$1,599.95",
      description: "Premium, all-in-one solutions",
      features: {
        "MLS + Realtor.ca listing": true,
        "Rental listing guide": true,
        "For Rent sign": true,
        "Customer Support (7/7)": true,
        "Access to experts": "priority + dedicated",
        "Listing duration": "Until rented",
        "Social media campaigns": "6 weeks (custom)",
        "Featured Rentals section": "6 weeks",
        "Tenant screening tools": "premium",
        "AI pricing insights": true,
        "Viewing management tools": true,
        "Premium AI tools": true
      }
    }
  }

  const currentPricingData = activeTab === 'sale' ? salePricingData : rentalPricingData

  return (
    <div className={cn("w-full", className)}>
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Choose Your {activeTab === 'sale' ? 'FSBO' : 'Rental'} Package
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          {activeTab === 'sale'
            ? 'Sell your home with confidence. All packages include MLS listing and comprehensive support.'
            : 'Rent your property with ease. All packages include MLS listing and tenant management support.'
          }
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex items-center p-2 bg-gray-100 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab('sale')}
            className={cn(
              "px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 min-w-[140px]",
              activeTab === 'sale'
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Selling Your Home
          </button>
          <button
            onClick={() => setActiveTab('rental')}
            className={cn(
              "px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 min-w-[140px]",
              activeTab === 'rental'
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Renting Your Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <PricingTier
          {...currentPricingData.basic}
          onSelect={() => console.log(`Basic ${activeTab} package selected`)}
        />
        <PricingTier
          {...currentPricingData.essential}
          onSelect={() => console.log(`Essential ${activeTab} package selected`)}
        />
        <PricingTier
          {...currentPricingData.pro}
          popular={true}
          onSelect={() => console.log(`Pro ${activeTab} package selected`)}
        />
        <PricingTier
          {...currentPricingData.elite}
          onSelect={() => console.log(`Elite ${activeTab} package selected`)}
        />
      </div>

      {/* Trust indicators */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>No hidden fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Full MLS exposure</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>{activeTab === 'sale' ? 'Expert support included' : 'Tenant screening support'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
