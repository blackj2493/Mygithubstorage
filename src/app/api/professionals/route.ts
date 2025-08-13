import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration - replace with actual database queries
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
    bio: 'Real estate lawyer with 12 years of experience in residential and commercial transactions.',
    average_rating: 4.8,
    total_reviews: 89,
    response_time_hours: 4,
    verified_at: '2024-02-01',
    services: [{ service_id: 2, service_name: 'Legal Services', base_price: 1200, price_type: 'fixed' }],
    service_areas: ['M5V', 'M5G', 'M4S'],
    specializations: ['Residential Law', 'Commercial Law', 'Contract Review']
  }
]

// GET /api/professionals - Search and list professionals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const searchQuery = searchParams.get('search') || ''
    const serviceId = searchParams.get('service_id')
    const postalCode = searchParams.get('postal_code') || ''
    const minRating = parseFloat(searchParams.get('min_rating') || '0')
    const sortBy = searchParams.get('sort_by') || 'rating'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filtered = [...MOCK_PROFESSIONALS]

    // Apply filters
    if (searchQuery) {
      filtered = filtered.filter(prof => 
        `${prof.first_name} ${prof.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.bio.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (serviceId) {
      filtered = filtered.filter(prof => 
        prof.services.some(service => service.service_id.toString() === serviceId)
      )
    }

    if (postalCode) {
      filtered = filtered.filter(prof => 
        prof.service_areas.some(area => 
          area.toLowerCase().includes(postalCode.toLowerCase().substring(0, 3))
        )
      )
    }

    if (minRating > 0) {
      filtered = filtered.filter(prof => prof.average_rating >= minRating)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number, bValue: number
      
      switch (sortBy) {
        case 'rating':
          aValue = a.average_rating
          bValue = b.average_rating
          break
        case 'reviews':
          aValue = a.total_reviews
          bValue = b.total_reviews
          break
        case 'response_time':
          aValue = a.response_time_hours
          bValue = b.response_time_hours
          break
        case 'price':
          aValue = a.services[0]?.base_price || 0
          bValue = b.services[0]?.base_price || 0
          break
        default:
          return 0
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    })

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = filtered.slice(startIndex, endIndex)

    const response = {
      success: true,
      data: {
        professionals: paginatedResults,
        pagination: {
          page,
          limit,
          total: filtered.length,
          total_pages: Math.ceil(filtered.length / limit),
          has_next: endIndex < filtered.length,
          has_prev: page > 1
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching professionals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch professionals' },
      { status: 500 }
    )
  }
}

// POST /api/professionals - Register new professional
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'services', 'service_areas']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate services array
    if (!Array.isArray(body.services) || body.services.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one service must be selected' },
        { status: 400 }
      )
    }

    // Validate service areas array
    if (!Array.isArray(body.service_areas) || body.service_areas.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one service area must be specified' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database insertion
    const newProfessional = {
      id: Date.now(), // Generate proper ID in real implementation
      ...body,
      average_rating: 0,
      total_reviews: 0,
      total_jobs_completed: 0,
      response_time_hours: 24,
      status: 'pending',
      verified_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('New professional registered:', newProfessional)

    // TODO: Send verification email
    // TODO: Create professional service mappings
    // TODO: Create professional service areas

    return NextResponse.json({
      success: true,
      data: {
        professional: newProfessional,
        message: 'Registration successful! Please check your email for verification instructions.'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error registering professional:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register professional' },
      { status: 500 }
    )
  }
}
