'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, MapPin, Clock, Phone, Mail, ExternalLink, 
  Verified, Award, Calendar, MessageSquare, 
  Camera, Scale, Home, Calculator, Megaphone,
  ChevronLeft, Heart, Share2, Flag
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

// Mock data for demonstration
const MOCK_PROFESSIONAL = {
  id: 1,
  first_name: 'Sarah',
  last_name: 'Johnson',
  business_name: 'Elite Property Photos',
  profile_image: '/api/placeholder/200/200',
  cover_image: '/api/placeholder/800/300',
  bio: 'Professional real estate photographer with 8+ years of experience specializing in luxury homes and commercial properties. I use state-of-the-art equipment including drone photography and virtual tour technology to showcase properties in their best light. My goal is to help properties sell faster and for higher prices through stunning visual storytelling.',
  experience_years: 8,
  license_number: 'RPP-2024-001',
  website_url: 'https://elitepropertyphotos.com',
  phone: '(416) 555-0123',
  email: 'sarah@elitepropertyphotos.com',
  average_rating: 4.9,
  total_reviews: 127,
  total_jobs_completed: 340,
  response_time_hours: 2,
  verified_at: '2024-01-15',
  services: [
    { 
      service_id: 1, 
      service_name: 'Photography', 
      base_price: 350, 
      price_type: 'fixed',
      description: 'Professional real estate photography including interior, exterior, and twilight shots'
    }
  ],
  service_areas: ['M5V', 'M6G', 'M4W', 'M5G', 'M4S'],
  specializations: ['Luxury Homes', 'Drone Photography', 'Virtual Tours', 'Twilight Photography'],
  portfolio: [
    {
      id: 1,
      title: 'Luxury Condo - King West',
      images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      project_type: 'Residential',
      description: 'Modern luxury condo with stunning city views'
    },
    {
      id: 2,
      title: 'Heritage Home - The Beaches',
      images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      project_type: 'Residential',
      description: 'Beautiful heritage home with period details'
    }
  ],
  reviews: [
    {
      id: 1,
      reviewer_name: 'Michael Thompson',
      rating: 5,
      title: 'Outstanding work!',
      review_text: 'Sarah did an amazing job photographing our condo. The photos were stunning and we received multiple offers within days of listing. Highly professional and responsive.',
      service_type: 'Photography',
      created_at: '2024-02-15',
      verified: true
    },
    {
      id: 2,
      reviewer_name: 'Lisa Chen',
      rating: 5,
      title: 'Exceeded expectations',
      review_text: 'The drone shots were incredible and really made our property stand out. Sarah was punctual, professional, and delivered the photos quickly.',
      service_type: 'Photography',
      created_at: '2024-02-10',
      verified: true
    }
  ]
}

interface ProfessionalProfilePageProps {
  params: {
    id: string
  }
}

export default function ProfessionalProfilePage({ params }: ProfessionalProfilePageProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const professional = MOCK_PROFESSIONAL // In real app, fetch by params.id

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/professionals" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Professionals</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {professional.cover_image && (
        <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <Image
            src={professional.cover_image}
            alt="Cover"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg -mt-16 relative z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={professional.profile_image} />
              <AvatarFallback className="text-2xl">
                {professional.first_name[0]}{professional.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {professional.first_name} {professional.last_name}
                    </h1>
                    {professional.verified_at && (
                      <div className="flex items-center space-x-1">
                        <Verified className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-blue-600 font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  
                  {professional.business_name && (
                    <p className="text-xl text-gray-600 font-medium mt-1">
                      {professional.business_name}
                    </p>
                  )}

                  <div className="flex items-center space-x-6 mt-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(professional.average_rating)}
                      <span className="text-lg font-semibold ml-2">{professional.average_rating}</span>
                      <span className="text-gray-500">({professional.total_reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{professional.response_time_hours}h response time</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{professional.total_jobs_completed} jobs completed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{professional.experience_years} years experience</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 mt-4 md:mt-0">
                  <Button size="lg" className="w-full md:w-auto">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Professional
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    {professional.website_url && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* About */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{professional.bio}</p>
                    </CardContent>
                  </Card>

                  {/* Services */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Services & Pricing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {professional.services.map((service, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{service.service_name}</h3>
                              <p className="text-gray-600 text-sm">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                ${service.base_price}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {service.price_type} price
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Specializations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Specializations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {professional.specializations.map((spec, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-semibold">{professional.response_time_hours} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jobs Completed</span>
                        <span className="font-semibold">{professional.total_jobs_completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-semibold">{professional.experience_years} years</span>
                      </div>
                      {professional.license_number && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">License</span>
                          <span className="font-semibold">{professional.license_number}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Service Areas */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div className="flex flex-wrap gap-2">
                          {professional.service_areas.map((area, index) => (
                            <Badge key={index} variant="outline">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {professional.reviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm">{review.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-3">{review.review_text}</p>
                          <p className="text-xs text-gray-500 mt-1">- {review.reviewer_name}</p>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('reviews')}>
                        View All Reviews
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professional.portfolio.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {item.project_type}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {professional.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="font-semibold">{review.title}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <p className="text-gray-700">{review.review_text}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{review.reviewer_name} • {review.service_type}</span>
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Get in touch to discuss your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span>{professional.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span>{professional.email}</span>
                      </div>
                      {professional.website_url && (
                        <div className="flex items-center space-x-3">
                          <ExternalLink className="h-5 w-5 text-gray-400" />
                          <a href={professional.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Button className="w-full">
                        Send Message
                      </Button>
                      <Button variant="outline" className="w-full">
                        Request Quote
                      </Button>
                      <Button variant="outline" className="w-full">
                        Schedule Consultation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
