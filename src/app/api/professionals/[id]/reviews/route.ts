import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: 1,
    professional_id: 1,
    reviewer_name: 'Michael Thompson',
    reviewer_email: 'michael@example.com',
    rating: 5,
    title: 'Outstanding work!',
    review_text: 'Sarah did an amazing job photographing our condo. The photos were stunning and we received multiple offers within days of listing. Highly professional and responsive.',
    service_type: 'Photography',
    project_value: 450,
    would_recommend: true,
    verified: true,
    helpful_votes: 12,
    created_at: '2024-02-15T10:30:00Z',
    updated_at: '2024-02-15T10:30:00Z'
  },
  {
    id: 2,
    professional_id: 1,
    reviewer_name: 'Lisa Chen',
    reviewer_email: 'lisa@example.com',
    rating: 5,
    title: 'Exceeded expectations',
    review_text: 'The drone shots were incredible and really made our property stand out. Sarah was punctual, professional, and delivered the photos quickly.',
    service_type: 'Photography',
    project_value: 600,
    would_recommend: true,
    verified: true,
    helpful_votes: 8,
    created_at: '2024-02-10T14:15:00Z',
    updated_at: '2024-02-10T14:15:00Z'
  }
]

// GET /api/professionals/[id]/reviews - Get reviews for a professional
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const professionalId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    
    if (isNaN(professionalId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid professional ID' },
        { status: 400 }
      )
    }

    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const minRating = parseInt(searchParams.get('min_rating') || '0')
    const verifiedOnly = searchParams.get('verified_only') === 'true'

    // TODO: Replace with actual database query
    let reviews = MOCK_REVIEWS.filter(review => review.professional_id === professionalId)

    // Apply filters
    if (minRating > 0) {
      reviews = reviews.filter(review => review.rating >= minRating)
    }

    if (verifiedOnly) {
      reviews = reviews.filter(review => review.verified)
    }

    // Apply sorting
    reviews.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'helpful_votes':
          aValue = a.helpful_votes
          bValue = b.helpful_votes
          break
        case 'created_at':
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    })

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedReviews = reviews.slice(startIndex, endIndex)

    // Calculate statistics
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0
    
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    }

    const response = {
      success: true,
      data: {
        reviews: paginatedReviews,
        statistics: {
          total_reviews: totalReviews,
          average_rating: Math.round(averageRating * 10) / 10,
          rating_distribution: ratingDistribution,
          verified_reviews: reviews.filter(r => r.verified).length
        },
        pagination: {
          page,
          limit,
          total: totalReviews,
          total_pages: Math.ceil(totalReviews / limit),
          has_next: endIndex < totalReviews,
          has_prev: page > 1
        }
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/professionals/[id]/reviews - Submit a new review
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const professionalId = parseInt(params.id)
    const body = await request.json()
    
    if (isNaN(professionalId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid professional ID' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields = ['rating', 'title', 'review_text', 'service_type', 'reviewer_name', 'reviewer_email']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.reviewer_email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate review text length
    if (body.review_text.length < 20) {
      return NextResponse.json(
        { success: false, error: 'Review text must be at least 20 characters long' },
        { status: 400 }
      )
    }

    // TODO: Check if professional exists
    // TODO: Check for duplicate reviews from same email
    // TODO: Implement rate limiting

    // Create new review
    const newReview = {
      id: Date.now(), // Generate proper ID in real implementation
      professional_id: professionalId,
      reviewer_name: body.reviewer_name,
      reviewer_email: body.reviewer_email,
      reviewer_phone: body.reviewer_phone || null,
      rating: body.rating,
      title: body.title,
      review_text: body.review_text,
      service_type: body.service_type,
      project_value: body.project_value || null,
      would_recommend: body.would_recommend !== false,
      verified: false, // Reviews start as unverified
      helpful_votes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // TODO: Save to database
    // TODO: Send verification email to reviewer
    // TODO: Notify professional of new review
    // TODO: Update professional's average rating

    console.log('New review submitted:', newReview)

    return NextResponse.json({
      success: true,
      data: {
        review: newReview,
        message: 'Review submitted successfully! It will be published after verification.'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
