'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Camera, Scale, Home, Calculator, Megaphone, 
  Search, MapPin, Star, Clock, Phone, Mail, 
  ExternalLink, Filter, SortAsc, ChevronDown,
  Verified, Award, Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const PROFESSIONAL_SERVICES = [
  { id: 1, name: 'Photography', slug: 'photography', icon: Camera },
  { id: 2, name: 'Legal Services', slug: 'legal', icon: Scale },
  { id: 3, name: 'Home Staging', slug: 'staging', icon: Home },
  { id: 4, name: 'Mortgage Broker', slug: 'mortgage', icon: Calculator },
  { id: 5, name: 'Social Media Marketing', slug: 'marketing', icon: Megaphone }
]

// Mock data for demonstration
const MOCK_PROFESSIONALS = [
  {
    id: 1,
    first_name: 'Sarah',
    last_name: 'Johnson',
    business_name: 'Elite Property Photos',
    profile_image: '/api/placeholder/150/150',
    bio: 'Professional real estate photographer with 8+ years of experience. Specializing in luxury homes and commercial properties.',
    average_rating: 4.9,
    total_reviews: 127,
    response_time_hours: 2,
    verified_at: '2024-01-15',
    services: [{ service_id: 1, service_name: 'Photography', base_price: 350, price_type: 'fixed' }],
    service_areas: ['M5V', 'M6G', 'M4W'],
    specializations: ['Luxury Homes', 'Drone Photography', 'Virtual Tours']
  },
  {
    id: 2,
    first_name: 'Michael',
    last_name: 'Chen',
    business_name: 'Chen Legal Services',
    profile_image: '/api/placeholder/150/150',
    bio: 'Real estate lawyer with 12 years of experience in residential and commercial transactions. Fast turnaround guaranteed.',
    average_rating: 4.8,
    total_reviews: 89,
    response_time_hours: 4,
    verified_at: '2024-02-01',
    services: [{ service_id: 2, service_name: 'Legal Services', base_price: 1200, price_type: 'fixed' }],
    service_areas: ['M5V', 'M5G', 'M4S'],
    specializations: ['Residential Law', 'Commercial Law', 'Contract Review']
  },
  {
    id: 3,
    first_name: 'Emma',
    last_name: 'Rodriguez',
    business_name: 'Staging Perfection',
    profile_image: '/api/placeholder/150/150',
    bio: 'Award-winning home stager helping properties sell 40% faster. Modern and classic styling expertise.',
    average_rating: 5.0,
    total_reviews: 64,
    response_time_hours: 6,
    verified_at: '2024-01-20',
    services: [{ service_id: 3, service_name: 'Home Staging', base_price: 2500, price_type: 'fixed' }],
    service_areas: ['M6G', 'M4W', 'M5T'],
    specializations: ['Modern Staging', 'Luxury Properties', 'Quick Turnaround']
  }
]

export default function ProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState<string>('all')
  const [postalCode, setPostalCode] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [professionals, setProfessionals] = useState(MOCK_PROFESSIONALS)
  const [filteredProfessionals, setFilteredProfessionals] = useState(MOCK_PROFESSIONALS)

  useEffect(() => {
    let filtered = professionals

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(prof => 
        `${prof.first_name} ${prof.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.bio.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by service
    if (selectedService && selectedService !== 'all') {
      filtered = filtered.filter(prof =>
        prof.services.some(service => service.service_id.toString() === selectedService)
      )
    }

    // Filter by postal code
    if (postalCode) {
      filtered = filtered.filter(prof => 
        prof.service_areas.some(area => 
          area.toLowerCase().includes(postalCode.toLowerCase().substring(0, 3))
        )
      )
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.average_rating - a.average_rating
        case 'reviews':
          return b.total_reviews - a.total_reviews
        case 'response_time':
          return a.response_time_hours - b.response_time_hours
        case 'price':
          const aPrice = a.services[0]?.base_price || 0
          const bPrice = b.services[0]?.base_price || 0
          return aPrice - bPrice
        default:
          return 0
      }
    })

    setFilteredProfessionals(filtered)
  }, [searchQuery, selectedService, postalCode, sortBy, professionals])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Professional Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with verified professionals for photography, legal services, staging, and more
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Professionals</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Name or business..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Type</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="All services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {PROFESSIONAL_SERVICES.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="postal"
                      placeholder="M5V 3A8"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="response_time">Fastest Response</SelectItem>
                      <SelectItem value="price">Lowest Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? 's' : ''} Found
            </h2>
            <Link href="/professionals/register">
              <Button variant="outline">
                Join as Professional
              </Button>
            </Link>
          </div>

          {/* Professional Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card key={professional.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={professional.profile_image} />
                      <AvatarFallback>
                        {professional.first_name[0]}{professional.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg truncate">
                          {professional.first_name} {professional.last_name}
                        </CardTitle>
                        {professional.verified_at && (
                          <Verified className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      {professional.business_name && (
                        <CardDescription className="font-medium">
                          {professional.business_name}
                        </CardDescription>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{professional.average_rating}</span>
                          <span className="text-sm text-gray-500">({professional.total_reviews})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {professional.response_time_hours}h response
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {professional.bio}
                  </p>

                  {/* Services */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {professional.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service.service_name} - ${service.base_price}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  {professional.specializations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Specializations</h4>
                      <div className="flex flex-wrap gap-1">
                        {professional.specializations.slice(0, 3).map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Areas */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Service Areas</h4>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {professional.service_areas.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Link href={`/professionals/${professional.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        View Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProfessionals.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or expanding your search area
              </p>
              <Link href="/professionals/register">
                <Button>
                  Be the first professional in this area
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
