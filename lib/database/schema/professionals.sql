-- Professional Services Database Schema
-- This schema supports the professional services integration feature

-- Service categories (photographer, lawyer, stager, etc.)
CREATE TABLE professional_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50), -- Icon name for UI
    base_price_range VARCHAR(50), -- e.g., "$200-500"
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Main professionals table
CREATE TABLE professionals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER, -- Link to main users table if exists
    business_name VARCHAR(200),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    license_number VARCHAR(100),
    insurance_info JSONB, -- Store insurance details as JSON
    profile_image VARCHAR(500),
    cover_image VARCHAR(500),
    website_url VARCHAR(500),
    
    -- Performance metrics
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_jobs_completed INTEGER DEFAULT 0,
    response_time_hours INTEGER DEFAULT 24,
    
    -- Status and verification
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, suspended, inactive
    verified_at TIMESTAMP,
    verification_documents JSONB, -- Store document URLs and types
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship between professionals and services
CREATE TABLE professional_service_mappings (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES professional_services(id) ON DELETE CASCADE,
    base_price DECIMAL(10,2),
    price_type VARCHAR(20) DEFAULT 'fixed', -- fixed, hourly, per_sqft, custom
    specializations TEXT[], -- Array of specialization tags
    years_experience INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(professional_id, service_id)
);

-- Geographic service areas (postal codes they serve)
CREATE TABLE professional_service_areas (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    postal_code VARCHAR(10) NOT NULL,
    travel_fee DECIMAL(8,2) DEFAULT 0.00,
    max_distance_km INTEGER DEFAULT 50,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professional portfolios/work samples
CREATE TABLE professional_portfolios (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    title VARCHAR(200),
    description TEXT,
    project_type VARCHAR(100), -- e.g., "residential", "commercial", "luxury"
    images JSONB, -- Array of image URLs with metadata
    before_after BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews and ratings
CREATE TABLE professional_reviews (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(200),
    reviewer_email VARCHAR(255),
    reviewer_phone VARCHAR(20),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    review_text TEXT,
    service_type VARCHAR(100), -- Which service was reviewed
    project_value DECIMAL(10,2), -- Optional: value of the project
    would_recommend BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professional availability/calendar
CREATE TABLE professional_availability (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    available BOOLEAN DEFAULT true,
    booking_type VARCHAR(50) DEFAULT 'consultation', -- consultation, shoot, meeting
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(professional_id, date, start_time)
);

-- Service requests/bookings
CREATE TABLE service_requests (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES professional_services(id),
    
    -- Client information
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    
    -- Request details
    property_address TEXT,
    postal_code VARCHAR(10),
    service_date DATE,
    preferred_time VARCHAR(50),
    budget_range VARCHAR(50),
    project_description TEXT,
    special_requirements TEXT,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, completed, cancelled
    professional_response TEXT,
    estimated_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    
    -- Timestamps
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_professionals_status ON professionals(status);
CREATE INDEX idx_professionals_verified ON professionals(verified_at) WHERE verified_at IS NOT NULL;
CREATE INDEX idx_professionals_rating ON professionals(average_rating DESC);
CREATE INDEX idx_professional_service_areas_postal ON professional_service_areas(postal_code);
CREATE INDEX idx_professional_service_mappings_service ON professional_service_mappings(service_id);
CREATE INDEX idx_professional_reviews_rating ON professional_reviews(rating DESC);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_postal ON service_requests(postal_code);

-- Insert default service categories
INSERT INTO professional_services (name, slug, description, icon, base_price_range, sort_order) VALUES
('Photography', 'photography', 'Professional real estate photography services', 'camera', '$200-800', 1),
('Legal Services', 'legal', 'Real estate lawyers for contracts and closing', 'scale', '$500-2000', 2),
('Home Staging', 'staging', 'Professional home staging and interior design', 'home', '$800-3000', 3),
('Mortgage Broker', 'mortgage', 'Mortgage and financing consultation services', 'calculator', '$0-500', 4),
('Social Media Marketing', 'marketing', 'Social media marketing for property listings', 'megaphone', '$300-1500', 5);
