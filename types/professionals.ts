// Professional Services Types

export interface ProfessionalService {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  base_price_range?: string
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Professional {
  id: number
  user_id?: number
  business_name?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  bio?: string
  experience_years: number
  license_number?: string
  insurance_info?: InsuranceInfo
  profile_image?: string
  cover_image?: string
  website_url?: string
  
  // Performance metrics
  average_rating: number
  total_reviews: number
  total_jobs_completed: number
  response_time_hours: number
  
  // Status and verification
  status: ProfessionalStatus
  verified_at?: string
  verification_documents?: VerificationDocument[]
  
  // Timestamps
  created_at: string
  updated_at: string
  
  // Related data (populated via joins)
  services?: ProfessionalServiceMapping[]
  service_areas?: ProfessionalServiceArea[]
  portfolio?: ProfessionalPortfolio[]
  reviews?: ProfessionalReview[]
}

export interface ProfessionalServiceMapping {
  id: number
  professional_id: number
  service_id: number
  base_price?: number
  price_type: PriceType
  specializations?: string[]
  years_experience: number
  active: boolean
  created_at: string
  
  // Populated via join
  service?: ProfessionalService
}

export interface ProfessionalServiceArea {
  id: number
  professional_id: number
  postal_code: string
  travel_fee: number
  max_distance_km: number
  active: boolean
  created_at: string
}

export interface ProfessionalPortfolio {
  id: number
  professional_id: number
  title?: string
  description?: string
  project_type?: string
  images?: PortfolioImage[]
  before_after: boolean
  featured: boolean
  sort_order: number
  created_at: string
}

export interface ProfessionalReview {
  id: number
  professional_id: number
  reviewer_name?: string
  reviewer_email?: string
  reviewer_phone?: string
  rating: number
  title?: string
  review_text?: string
  service_type?: string
  project_value?: number
  would_recommend: boolean
  verified: boolean
  helpful_votes: number
  created_at: string
  updated_at: string
}

export interface ProfessionalAvailability {
  id: number
  professional_id: number
  date: string
  start_time?: string
  end_time?: string
  available: boolean
  booking_type: BookingType
  notes?: string
  created_at: string
}

export interface ServiceRequest {
  id: number
  professional_id: number
  service_id: number
  
  // Client information
  client_name: string
  client_email: string
  client_phone?: string
  
  // Request details
  property_address?: string
  postal_code?: string
  service_date?: string
  preferred_time?: string
  budget_range?: string
  project_description?: string
  special_requirements?: string
  
  // Status tracking
  status: ServiceRequestStatus
  professional_response?: string
  estimated_price?: number
  final_price?: number
  
  // Timestamps
  requested_at: string
  responded_at?: string
  completed_at?: string
  updated_at: string
  
  // Populated via joins
  professional?: Professional
  service?: ProfessionalService
}

// Supporting types
export interface InsuranceInfo {
  provider?: string
  policy_number?: string
  coverage_amount?: number
  expiry_date?: string
  certificate_url?: string
}

export interface VerificationDocument {
  type: 'license' | 'insurance' | 'certification' | 'portfolio'
  name: string
  url: string
  verified: boolean
  uploaded_at: string
}

export interface PortfolioImage {
  url: string
  caption?: string
  is_before?: boolean
  is_after?: boolean
  sort_order: number
}

// Enums
export type ProfessionalStatus = 'pending' | 'active' | 'suspended' | 'inactive'
export type PriceType = 'fixed' | 'hourly' | 'per_sqft' | 'custom'
export type BookingType = 'consultation' | 'shoot' | 'meeting' | 'service'
export type ServiceRequestStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'

// Search and filter types
export interface ProfessionalSearchFilters {
  service_ids?: number[]
  postal_codes?: string[]
  radius_km?: number
  min_rating?: number
  max_price?: number
  min_price?: number
  specializations?: string[]
  verified_only?: boolean
  available_date?: string
  sort_by?: 'rating' | 'price' | 'distance' | 'reviews' | 'experience'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ProfessionalSearchResult {
  professionals: Professional[]
  total_count: number
  page: number
  limit: number
  has_more: boolean
}

// Registration and profile update types
export interface ProfessionalRegistrationData {
  // Basic info
  business_name?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  bio?: string
  experience_years: number
  license_number?: string
  website_url?: string
  
  // Services
  services: {
    service_id: number
    base_price?: number
    price_type: PriceType
    specializations?: string[]
    years_experience: number
  }[]
  
  // Service areas
  service_areas: {
    postal_code: string
    travel_fee?: number
    max_distance_km?: number
  }[]
  
  // Insurance info
  insurance_info?: InsuranceInfo
}

export interface ProfessionalProfileUpdate {
  business_name?: string
  first_name?: string
  last_name?: string
  phone?: string
  bio?: string
  experience_years?: number
  license_number?: string
  website_url?: string
  profile_image?: string
  cover_image?: string
  insurance_info?: InsuranceInfo
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}
