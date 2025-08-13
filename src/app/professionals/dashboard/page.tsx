'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, TrendingUp, Users, Calendar, MessageSquare, 
  Settings, Edit, Eye, Phone, Mail, MapPin,
  DollarSign, Clock, Award, AlertCircle, CheckCircle,
  BarChart3, PieChart, Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Mock data for demonstration
const MOCK_DASHBOARD_DATA = {
  professional: {
    id: 1,
    first_name: 'Sarah',
    last_name: 'Johnson',
    business_name: 'Elite Property Photos',
    profile_image: '/api/placeholder/150/150',
    average_rating: 4.9,
    total_reviews: 127,
    total_jobs_completed: 340,
    response_time_hours: 2,
    verified_at: '2024-01-15',
    status: 'active'
  },
  stats: {
    total_leads: 45,
    leads_this_month: 12,
    conversion_rate: 68,
    total_earnings: 28500,
    earnings_this_month: 4200,
    profile_views: 1250,
    profile_views_this_month: 180
  },
  recent_leads: [
    {
      id: 1,
      client_name: 'Michael Thompson',
      service_type: 'Photography',
      property_address: '123 King St W, Toronto',
      budget_range: '$300-500',
      status: 'pending',
      requested_at: '2024-02-20T10:30:00Z',
      project_description: 'Need professional photos for luxury condo listing'
    },
    {
      id: 2,
      client_name: 'Lisa Chen',
      service_type: 'Photography',
      property_address: '456 Queen St E, Toronto',
      budget_range: '$400-600',
      status: 'accepted',
      requested_at: '2024-02-19T14:15:00Z',
      project_description: 'Heritage home photography with drone shots'
    }
  ],
  recent_reviews: [
    {
      id: 1,
      reviewer_name: 'John Smith',
      rating: 5,
      title: 'Outstanding work!',
      review_text: 'Sarah did an amazing job photographing our condo. The photos were stunning and we received multiple offers within days.',
      created_at: '2024-02-18T09:00:00Z'
    }
  ]
}

export default function ProfessionalDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { professional, stats, recent_leads, recent_reviews } = MOCK_DASHBOARD_DATA

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={professional.profile_image} />
                <AvatarFallback>
                  {professional.first_name[0]}{professional.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {professional.first_name}!
                </h1>
                <p className="text-gray-600">{professional.business_name}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(professional.average_rating)}
                    <span className="text-sm font-medium ml-1">{professional.average_rating}</span>
                  </div>
                  <Badge variant={professional.verified_at ? 'default' : 'secondary'}>
                    {professional.verified_at ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href={`/professionals/${professional.id}`}>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Leads</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total_leads}</p>
                      <p className="text-sm text-green-600">+{stats.leads_this_month} this month</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.conversion_rate}%</p>
                      <p className="text-sm text-green-600">Above average</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-3xl font-bold text-gray-900">${stats.total_earnings.toLocaleString()}</p>
                      <p className="text-sm text-green-600">${stats.earnings_this_month.toLocaleString()} this month</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profile Views</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.profile_views.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+{stats.profile_views_this_month} this month</p>
                    </div>
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Leads */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Leads</span>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('leads')}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recent_leads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{lead.client_name}</h4>
                          <p className="text-sm text-gray-600">{lead.service_type}</p>
                        </div>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{lead.property_address}</p>
                      <p className="text-sm text-gray-700 mb-2">{lead.project_description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-medium">{lead.budget_range}</span>
                        <span className="text-gray-500">
                          {new Date(lead.requested_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Reviews</span>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('reviews')}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recent_reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="font-semibold text-sm">{review.title}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{review.review_text}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">- {review.reviewer_name}</span>
                        <span className="text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Leads</CardTitle>
                <CardDescription>Manage your service requests and bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recent_leads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{lead.client_name}</h3>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{lead.property_address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4" />
                              <span>{lead.budget_range}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{lead.project_description}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {lead.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                              <Button size="sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                            </>
                          )}
                          {lead.status === 'accepted' && (
                            <Button size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Requested on {new Date(lead.requested_at).toLocaleDateString()} at {new Date(lead.requested_at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>See what your clients are saying about your services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recent_reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="font-semibold">{review.title}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.review_text}</p>
                          <div className="text-sm text-gray-500">
                            By {review.reviewer_name} on {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your professional profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile Information
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Service Areas & Pricing
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Upload Certifications
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>Your verification and account status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Profile Verification</span>
                    <Badge variant={professional.verified_at ? 'default' : 'secondary'}>
                      {professional.verified_at ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Account Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Response Time</span>
                    <span className="text-sm text-gray-600">{professional.response_time_hours} hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
