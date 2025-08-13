/**
 * Reverse geocoding and distance calculation utilities
 */

export interface ReverseGeocodeResult {
  postalCode?: string;
  city?: string;
  province?: string;
  country?: string;
  displayName?: string;
}

export interface GeographicCoordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate the distance between two geographic points using the Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in meters
 */
export function calculateDistance(point1: GeographicCoordinates, point2: GeographicCoordinates): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Reverse geocode coordinates to get postal code and location information
 * Uses OpenStreetMap Nominatim API
 * @param lat Latitude
 * @param lng Longitude
 * @returns Promise with location information including postal code
 */
export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PureProperties/1.0 (Real Estate App)'
      }
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.address) {
      throw new Error('No address data found');
    }

    const address = data.address;

    // Extract postal code - try different possible fields
    const postalCode = address.postcode || address.postal_code || address['ISO3166-2-lvl6'];

    // Extract other location information
    const city = address.city || address.town || address.village || address.municipality;
    const province = address.state || address.province || address.region;
    const country = address.country;
    const displayName = data.display_name;

    console.log('🌍 Reverse geocoding result:', {
      lat,
      lng,
      postalCode,
      city,
      province,
      country,
      displayName
    });

    return {
      postalCode,
      city,
      province,
      country,
      displayName
    };
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error);
    return {};
  }
}

/**
 * Extract postal code prefix (first 3 characters) for Canadian postal codes
 * @param postalCode Full postal code (e.g., "K2P 0A5")
 * @returns Postal code prefix (e.g., "K2P")
 */
export function getPostalCodePrefix(postalCode?: string): string | undefined {
  if (!postalCode) return undefined;

  // Remove spaces and get first 3 characters for Canadian postal codes
  const cleaned = postalCode.replace(/\s+/g, '').toUpperCase();
  if (cleaned.length >= 3) {
    return cleaned.substring(0, 3);
  }

  return undefined;
}

/**
 * Check if two postal codes represent the same general area
 * For Canadian postal codes, compares the first 3 characters (Forward Sortation Area)
 * @param postalCode1 First postal code
 * @param postalCode2 Second postal code
 * @returns True if they represent the same area
 */
export function isSamePostalArea(postalCode1?: string, postalCode2?: string): boolean {
  const prefix1 = getPostalCodePrefix(postalCode1);
  const prefix2 = getPostalCodePrefix(postalCode2);

  if (!prefix1 || !prefix2) return false;

  return prefix1 === prefix2;
}

/**
 * Configuration for map update behavior
 */
export const MAP_UPDATE_CONFIG = {
  distanceThreshold: 2000, // 2km in meters - minimum distance to trigger update
  debounceDelay: 1500,     // 1.5 seconds - delay before processing bounds change
  enableAreaUpdates: false, // Enable/disable dynamic area updates - DISABLED to allow free zoom/pan
  showLoadingFeedback: true // Show loading indicators during updates
};

/**
 * Configuration for geocoding rate limiting
 */
export const GEOCODING_CONFIG = {
  batchSize: 10,           // Process 10 properties at a time
  batchDelay: 1200,        // 1.2 seconds between batches (respects Nominatim 1req/sec limit)
  maxConcurrent: 3,        // Maximum concurrent geocoding requests
  retryAttempts: 2,        // Number of retry attempts for failed requests
  useProgressiveLoading: true // Show properties as they get geocoded
};

export async function getCoordinatesFromPostalCode(postalCode: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    console.log('Searching coordinates for postal code:', postalCode);

    const response = await fetch(`/api/schools?postalCode=${encodeURIComponent(postalCode)}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data.error);
      return null;
    }

    return data.coordinates || null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

// Add this at the bottom of the file for testing
export async function testGeocoding(postalCode: string) {
  console.log('Testing geocoding for postal code:', postalCode);
  const result = await getCoordinatesFromPostalCode(postalCode);
  console.log('Geocoding result:', result);
  return result;
}

// In-memory cache for geocoding results
const postalCodeMapCache: Record<string, { lat: number; lon: number }> = {};

// Fallback coordinates for common Canadian postal code prefixes
const postalCodeFallbacks: Record<string, { lat: number; lon: number }> = {
  // More specific K2P coordinates for Ottawa Centre area
  'K2P 0A': { lat: 45.4215, lon: -75.6972 }, // Kent/Nepean area
  'K2P 0B': { lat: 45.4205, lon: -75.6962 }, // Slightly east
  'K2P 0C': { lat: 45.4225, lon: -75.6982 }, // Slightly west
  'K2P 0D': { lat: 45.4235, lon: -75.6952 }, // Slightly north-east
  'K2P 0E': { lat: 45.4195, lon: -75.6992 }, // Slightly south-west
  'K2P 0F': { lat: 45.4245, lon: -75.6942 }, // Further north-east
  'K2P 0G': { lat: 45.4185, lon: -75.7002 }, // Further south-west
  'K2P 0H': { lat: 45.4255, lon: -75.6932 }, // Even further north-east
  'K2P 0J': { lat: 45.4175, lon: -75.7012 }, // Even further south-west
  'K2P 0K': { lat: 45.4265, lon: -75.6922 }, // Northernmost
  'K2P 0L': { lat: 45.4165, lon: -75.7022 }, // Southernmost
  'K2P 1A': { lat: 45.4220, lon: -75.6960 }, // Lisgar area
  'K2P 1B': { lat: 45.4210, lon: -75.6950 }, // Slightly different
  'K2P 1C': { lat: 45.4230, lon: -75.6970 }, // Slightly different
  'K2P 1D': { lat: 45.4240, lon: -75.6940 }, // Slightly different
  'K2P 1E': { lat: 45.4200, lon: -75.6980 }, // Slightly different
  'K2P 1F': { lat: 45.4250, lon: -75.6930 }, // Slightly different
  'K2P 1G': { lat: 45.4190, lon: -75.6990 }, // Slightly different
  'K2P 1H': { lat: 45.4260, lon: -75.6920 }, // Slightly different
  'K2P 1J': { lat: 45.4180, lon: -75.7000 }, // Slightly different
  'K2P 1K': { lat: 45.4270, lon: -75.6910 }, // Slightly different
  'K2P 1L': { lat: 45.4170, lon: -75.7010 }, // Slightly different
  // Also add versions without spaces for compatibility
  'K2P0A': { lat: 45.4215, lon: -75.6972 }, // Kent/Nepean area
  'K2P0B': { lat: 45.4205, lon: -75.6962 }, // Slightly east
  'K2P0C': { lat: 45.4225, lon: -75.6982 }, // Slightly west
  'K2P0D': { lat: 45.4235, lon: -75.6952 }, // Slightly north-east
  'K2P0E': { lat: 45.4195, lon: -75.6992 }, // Slightly south-west
  'K2P0F': { lat: 45.4245, lon: -75.6942 }, // Further north-east
  'K2P0G': { lat: 45.4185, lon: -75.7002 }, // Further south-west
  'K2P0H': { lat: 45.4255, lon: -75.6932 }, // Even further north-east
  'K2P0J': { lat: 45.4175, lon: -75.7012 }, // Even further south-west
  'K2P0K': { lat: 45.4265, lon: -75.6922 }, // Northernmost
  'K2P0L': { lat: 45.4165, lon: -75.7022 }, // Southernmost
  'K2P1A': { lat: 45.4220, lon: -75.6960 }, // Lisgar area
  'K2P1B': { lat: 45.4210, lon: -75.6950 }, // Slightly different
  'K2P1C': { lat: 45.4230, lon: -75.6970 }, // Slightly different
  'K2P1D': { lat: 45.4240, lon: -75.6940 }, // Slightly different
  'K2P1E': { lat: 45.4200, lon: -75.6980 }, // Slightly different
  'K2P1F': { lat: 45.4250, lon: -75.6930 }, // Slightly different
  'K2P1G': { lat: 45.4190, lon: -75.6990 }, // Slightly different
  'K2P1H': { lat: 45.4260, lon: -75.6920 }, // Slightly different
  'K2P1J': { lat: 45.4180, lon: -75.7000 }, // Slightly different
  'K2P1K': { lat: 45.4270, lon: -75.6910 }, // Slightly different
  'K2P1L': { lat: 45.4170, lon: -75.7010 }, // Slightly different
  'K2P': { lat: 45.4215, lon: -75.6972 }, // General K2P fallback
  'K0E': { lat: 45.0845, lon: -75.4663 }, // North Dundas area
  'K1A': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1B': { lat: 45.3311, lon: -75.6981 }, // Ottawa South
  'K1C': { lat: 45.3311, lon: -75.6981 }, // Ottawa South
  'K1G': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1H': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1J': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1K': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1L': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1M': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1N': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1P': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1R': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1S': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1T': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1V': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1W': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1X': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1Y': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K1Z': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2A': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2B': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2C': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2E': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2G': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2H': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2J': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2K': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2L': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2M': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2R': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2S': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2T': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2V': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  'K2W': { lat: 45.4215, lon: -75.6972 }, // Ottawa
  // Toronto area
  'M1A': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1B': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1C': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1E': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1G': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1H': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1J': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1K': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1L': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1M': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1N': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1P': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1R': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1S': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1T': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1V': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1W': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M1X': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M2H': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M2J': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M2K': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M2L': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M2M': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M2N': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M2P': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M2R': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M3A': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M3B': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M3C': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M3H': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M3J': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M3K': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M3L': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M3M': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M3N': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4A': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4B': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4C': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4E': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4G': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4H': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4J': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4K': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4L': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4M': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4N': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4P': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4R': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4S': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4T': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4V': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4W': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4X': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M4Y': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5A': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5B': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5C': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5E': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5G': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5H': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5J': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5K': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5L': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5M': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5N': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5P': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5R': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5S': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5T': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5V': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5W': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M5X': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6A': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6B': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6C': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6E': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6G': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6H': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6J': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6K': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6L': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6M': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6N': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6P': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6R': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M6S': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M8V': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M8W': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M8X': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M8Y': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M8Z': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9A': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9B': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9C': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9L': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9M': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9N': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9P': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9R': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9V': { lat: 43.7532, lon: -79.3832 }, // Toronto
  'M9W': { lat: 43.7532, lon: -79.3832 }, // Toronto
};

export async function geocodePostalCodeForMap(postalCode: string): Promise<{ lat: number; lon: number } | null> {
  try {
    // Check cache first
    if (postalCodeMapCache[postalCode]) {
      console.log(`📦 Using cached coordinates for ${postalCode}:`, postalCodeMapCache[postalCode]);
      return postalCodeMapCache[postalCode];
    }

    // Clean up postal code (remove extra spaces, convert to uppercase)
    const cleanPostalCode = postalCode.replace(/\s+/g, ' ').trim().toUpperCase();
    console.log(`🔍 Geocoding postal code: "${postalCode}" -> cleaned: "${cleanPostalCode}"`);

    // Try exact match first (e.g., "K2P 0A5" -> "K2P 0A")
    const firstSixChars = cleanPostalCode.substring(0, 6); // "K2P 0A"
    console.log(`🎯 Trying first 6 chars: "${firstSixChars}"`);
    if (postalCodeFallbacks[firstSixChars]) {
      const coords = postalCodeFallbacks[firstSixChars];
      postalCodeMapCache[postalCode] = coords;
      console.log(`✅ Using specific fallback coordinates for ${postalCode} (${firstSixChars}):`, coords);
      return coords;
    }

    // Try first 4 characters without space (e.g., "K2P0A")
    const firstFourNoSpace = cleanPostalCode.replace(' ', '').substring(0, 4);
    console.log(`🎯 Trying first 4 chars no space: "${firstFourNoSpace}"`);
    if (postalCodeFallbacks[firstFourNoSpace]) {
      const coords = postalCodeFallbacks[firstFourNoSpace];
      postalCodeMapCache[postalCode] = coords;
      console.log(`✅ Using specific fallback coordinates for ${postalCode} (${firstFourNoSpace}):`, coords);
      return coords;
    }

    // Use general prefix fallback (e.g., "K2P")
    const prefix = cleanPostalCode.substring(0, 3);
    const fallback = postalCodeFallbacks[prefix];
    if (fallback) {
      postalCodeMapCache[postalCode] = fallback;
      console.log(`⚠️ Using general fallback coordinates for ${postalCode} (${prefix}):`, fallback);
      return fallback;
    }

    // If no fallback available, try API with short timeout
    try {
      const response = await fetch(`/api/geocode?postalCode=${encodeURIComponent(postalCode)}`, {
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.lat && data.lon) {
          const coords = { lat: data.lat, lon: data.lon };
          postalCodeMapCache[postalCode] = coords;
          console.log(`Geocoded ${postalCode} using API:`, coords);
          return coords;
        }
      }
    } catch (apiError) {
      // Silently fail API calls and use fallback
      console.warn(`API geocoding failed for ${postalCode}, using fallback if available`);
    }

    console.warn(`No coordinates found for postal code: ${postalCode}`);
    return null;

  } catch (error) {
    // Always try fallback on any error
    const prefix = postalCode.substring(0, 3);
    const fallback = postalCodeFallbacks[prefix];
    if (fallback) {
      postalCodeMapCache[postalCode] = fallback;
      console.log(`Using fallback coordinates after error for ${postalCode}:`, fallback);
      return fallback;
    }

    console.warn(`Complete geocoding failure for ${postalCode}`);
    return null;
  }
}

/**
 * Fast batch geocoding using local postal code database
 * Replaces slow API calls with instant database lookups
 */
export async function batchGeocodePostalCodes(
  postalCodes: string[],
  onProgress?: (completed: number, total: number, currentBatch: string[]) => void
): Promise<Map<string, { lat: number; lon: number }>> {
  const startTime = Date.now();
  console.log(`🚀 Fast batch geocoding ${postalCodes.length} postal codes using database`);

  // Remove duplicates and clean postal codes
  const uniquePostalCodes = [...new Set(postalCodes.map(code =>
    code.replace(/\s/g, '').toUpperCase()
  ))];

  console.log(`📦 Processing ${uniquePostalCodes.length} unique postal codes`);

  try {
    // Call our fast database API
    const response = await fetch('/api/geocode/batch-postal-codes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postalCodes: uniquePostalCodes
      })
    });

    if (!response.ok) {
      throw new Error(`Database API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const { results, metadata } = data;

    // Convert to Map format expected by existing code
    const resultMap = new Map<string, { lat: number; lon: number }>();

    Object.entries(results).forEach(([postalCode, coords]: [string, any]) => {
      resultMap.set(postalCode, {
        lat: coords.lat,
        lon: coords.lng
      });
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ Database geocoding complete in ${duration}ms:`);
    console.log(`   📍 Found: ${metadata.found}/${metadata.requested} postal codes`);
    console.log(`   ⚡ Speed: ${Math.round(metadata.found / (duration / 1000))} lookups/second`);

    if (metadata.missing > 0) {
      console.log(`   ⚠️ Missing: ${metadata.missing} postal codes not found in database`);
    }

    // Report progress (instant completion)
    if (onProgress) {
      onProgress(uniquePostalCodes.length, uniquePostalCodes.length, uniquePostalCodes);
    }

    return resultMap;

  } catch (error) {
    console.error('❌ Database geocoding failed, falling back to API:', error);

    // Fallback to original API-based geocoding if database fails
    return await batchGeocodePostalCodesAPI(postalCodes, onProgress);
  }
}

/**
 * Fallback: Original API-based batch geocoding (kept for backup)
 */
async function batchGeocodePostalCodesAPI(
  postalCodes: string[],
  onProgress?: (completed: number, total: number, currentBatch: string[]) => void
): Promise<Map<string, { lat: number; lon: number }>> {
  const results = new Map<string, { lat: number; lon: number }>();
  const { batchSize, batchDelay } = GEOCODING_CONFIG;

  console.log(`🔄 Fallback: API batch geocoding of ${postalCodes.length} postal codes`);

  // Remove duplicates
  const uniquePostalCodes = [...new Set(postalCodes)];
  console.log(`📦 Processing ${uniquePostalCodes.length} unique postal codes in batches of ${batchSize}`);

  for (let i = 0; i < uniquePostalCodes.length; i += batchSize) {
    const batch = uniquePostalCodes.slice(i, i + batchSize);
    console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(uniquePostalCodes.length / batchSize)}: ${batch.join(', ')}`);

    // Process batch with limited concurrency
    const batchPromises = batch.map(async (postalCode) => {
      try {
        const coords = await getCoordinatesFromPostalCode(postalCode);
        if (coords) {
          results.set(postalCode, { lat: coords.latitude, lon: coords.longitude });
          console.log(`✅ Geocoded ${postalCode}: ${coords.latitude}, ${coords.longitude}`);
        } else {
          console.warn(`⚠️ Failed to geocode ${postalCode}`);
        }
      } catch (error) {
        console.error(`❌ Error geocoding ${postalCode}:`, error);
      }
    });

    // Wait for current batch to complete
    await Promise.allSettled(batchPromises);

    // Report progress
    const completed = Math.min(i + batchSize, uniquePostalCodes.length);
    if (onProgress) {
      onProgress(completed, uniquePostalCodes.length, batch);
    }

    // Rate limiting delay between batches (except for the last batch)
    if (i + batchSize < uniquePostalCodes.length) {
      console.log(`⏳ Waiting ${batchDelay}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, batchDelay));
    }
  }

  console.log(`✅ API batch geocoding complete: ${results.size}/${uniquePostalCodes.length} successful`);
  return results;
}