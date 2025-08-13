import { NextResponse } from 'next/server';

// Fallback coordinates for common Canadian postal code prefixes
const postalCodeFallbacks: Record<string, { lat: number; lon: number }> = {
  'K2P': { lat: 45.4215, lon: -75.6972 }, // Ottawa Centre
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

  // Ontario L-prefixes (Greater Toronto Area, Hamilton, etc.)
  'L0A': { lat: 44.3894, lon: -79.6903 }, // Georgina/York Region
  'L0B': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0C': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0E': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0G': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0H': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0J': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0K': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0L': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0M': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0N': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0P': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0R': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L0S': { lat: 44.3894, lon: -79.6903 }, // York Region
  'L1A': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1B': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1C': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1E': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1G': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1H': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1J': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1K': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1L': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1M': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1N': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1P': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1R': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1S': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1T': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1V': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1W': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1X': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1Y': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L1Z': { lat: 43.8563, lon: -78.9568 }, // Oshawa
  'L2A': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2E': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2G': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2H': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2J': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2M': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2N': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2P': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2R': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2S': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2T': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2V': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L2W': { lat: 43.1594, lon: -79.2469 }, // St. Catharines
  'L3A': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3B': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3C': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3P': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3R': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3S': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3T': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3V': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3W': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3X': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3Y': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L3Z': { lat: 43.5890, lon: -79.6441 }, // Brampton
  'L4A': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4B': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4C': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4E': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4G': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4H': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4J': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4K': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4L': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4M': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4N': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4P': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4R': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4S': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4T': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4V': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4W': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4X': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4Y': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L4Z': { lat: 44.0896, lon: -79.4608 }, // Richmond Hill
  'L5A': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5B': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5C': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5E': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5G': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5H': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5J': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5K': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5L': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5M': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5N': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5P': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5R': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5S': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5T': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5V': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L5W': { lat: 43.5890, lon: -79.6441 }, // Mississauga
  'L6A': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6B': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6G': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6H': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6J': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6K': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6L': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6M': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6R': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6S': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6T': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6V': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6W': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6X': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6Y': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L6Z': { lat: 43.5890, lon: -79.6441 }, // Oakville
  'L7A': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7B': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7C': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7E': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7G': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7H': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7J': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7K': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7L': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7M': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7N': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7P': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7R': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7S': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L7T': { lat: 43.5890, lon: -79.6441 }, // Burlington
  'L8A': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8B': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8C': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8E': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8G': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8H': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8J': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8K': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8L': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8M': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8N': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8P': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8R': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8S': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8T': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8V': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L8W': { lat: 43.2557, lon: -79.8711 }, // Hamilton
  'L9A': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9B': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9C': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9G': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9H': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9J': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9K': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9L': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9M': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9N': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9P': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9R': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9S': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9T': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9V': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9W': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9X': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9Y': { lat: 44.2619, lon: -79.9304 }, // Orangeville
  'L9Z': { lat: 44.2619, lon: -79.9304 }, // Orangeville

  // Ontario N-prefixes (Northern Ontario)
  'N0A': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0B': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0C': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0E': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0G': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0H': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0J': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0K': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0L': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0M': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0N': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0P': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0R': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0S': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0T': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0V': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0W': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0X': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0Y': { lat: 46.4917, lon: -84.3408 }, // Sudbury area
  'N0Z': { lat: 46.4917, lon: -84.3408 }, // Sudbury area

  // Ontario P-prefixes (Northern Ontario)
  'P0A': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0B': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0C': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0E': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0G': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0H': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0J': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0K': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0L': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0M': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0N': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0P': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0R': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0S': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0T': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0V': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0W': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0X': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0Y': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P0Z': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay area
  'P1A': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1B': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1C': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1E': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1G': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1H': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1J': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1K': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1L': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1M': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1N': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1P': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1R': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1S': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1T': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1V': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1W': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1X': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1Y': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P1Z': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2A': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2B': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2C': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2E': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2G': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2H': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2J': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2K': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2L': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2M': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2N': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2P': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2R': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2S': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2T': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2V': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2W': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2X': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2Y': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P2Z': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3A': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3B': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3C': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3E': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3G': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3H': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3J': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3K': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3L': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3M': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3N': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3P': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3R': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3S': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3T': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3V': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3W': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3X': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3Y': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P3Z': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4A': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4B': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4C': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4E': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4G': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4H': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4J': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4K': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4L': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4M': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4N': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4P': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4R': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4S': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4T': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4V': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4W': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4X': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4Y': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P4Z': { lat: 46.4917, lon: -84.3408 }, // Sudbury
  'P5A': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5B': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5C': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5E': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5G': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5H': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5J': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5K': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5L': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5M': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5N': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5P': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5R': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5S': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5T': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5V': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5W': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5X': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5Y': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P5Z': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P6A': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6B': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6C': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6E': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6G': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6H': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6J': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6K': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6L': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6M': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6N': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6P': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6R': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6S': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6T': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6V': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6W': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6X': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6Y': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P6Z': { lat: 46.4917, lon: -84.3408 }, // Sault Ste. Marie
  'P7A': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7B': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7C': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7E': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7G': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7H': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7J': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7K': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7L': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7M': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7N': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7P': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7R': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7S': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7T': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7V': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7W': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7X': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7Y': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P7Z': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8A': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8B': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8C': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8E': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8G': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8H': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8J': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8K': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8L': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8M': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8N': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8P': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8R': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8S': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8T': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8V': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8W': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8X': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8Y': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P8Z': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9A': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9B': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9C': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9E': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9G': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9H': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9J': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9K': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9L': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9M': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9N': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9P': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9R': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9S': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9T': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9V': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9W': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9X': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9Y': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
  'P9Z': { lat: 48.4758, lon: -89.2019 }, // Thunder Bay
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postalCode = searchParams.get('postalCode');

  if (!postalCode) {
    return NextResponse.json(
      { error: 'Postal code is required' },
      { status: 400 }
    );
  }

  try {
    // Use fallback immediately for faster response and to avoid timeout issues
    const prefix = postalCode.substring(0, 3);
    const fallback = postalCodeFallbacks[prefix];

    if (fallback) {
      const coords = {
        ...fallback,
        source: 'fallback',
        prefix: prefix
      };
      console.log(`Using fallback coordinates for ${postalCode}:`, coords);
      return NextResponse.json(coords);
    }

    // Only try Nominatim if no fallback is available (rare case)
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&country=Canada&postalcode=${encodeURIComponent(postalCode)}`;
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'PureProperty.ca/1.0 (contact@pureproperty.ca)'
        },
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const coords = {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            source: 'nominatim'
          };
          console.log(`Successfully geocoded ${postalCode} using Nominatim:`, coords);
          return NextResponse.json(coords);
        }
      }
    } catch (nominatimError) {
      console.warn('Nominatim geocoding failed, no fallback available');
    }

    console.warn(`No coordinates found for postal code: ${postalCode}`);
    return NextResponse.json(
      { error: 'Postal code not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error(`Error geocoding postal code ${postalCode}:`, error);

    // Try fallback on any error
    const prefix = postalCode.substring(0, 3);
    const fallback = postalCodeFallbacks[prefix];

    if (fallback) {
      const coords = {
        ...fallback,
        source: 'fallback_error',
        prefix: prefix
      };
      return NextResponse.json(coords);
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
