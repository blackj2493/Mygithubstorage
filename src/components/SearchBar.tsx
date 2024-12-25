'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

interface Suggestion {
  type: 'city' | 'address' | 'mls';
  value: string;
  display: string;
}

// Add popular cities array
const POPULAR_CITIES = [
  'Toronto',
  'Mississauga',
  'Brampton',
  'Vaughan',
  'Richmond Hill',
  'Markham',
  'Oakville',
  'Milton',
  'Ajax',
  'Pickering'
];

export default function SearchBar() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize search bar with any existing search params
  useEffect(() => {
    const city = searchParams.get('city');
    const address = searchParams.get('address');
    const mls = searchParams.get('mls');
    
    if (city) setQuery(city);
    else if (address) setQuery(address);
    else if (mls) setQuery(`MLS® ${mls}`);
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Capitalize first letter for the API query
        const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
        const response = await fetch(`/api/properties/search?q=${encodeURIComponent(formattedQuery)}`);
        const data = await response.json();
        
        // Transform suggestions to ensure proper capitalization for cities
        const formattedSuggestions = data.suggestions.map((suggestion: Suggestion) => ({
          ...suggestion,
          value: suggestion.type === 'city' 
            ? suggestion.value.charAt(0).toUpperCase() + suggestion.value.slice(1).toLowerCase()
            : suggestion.value,
          display: suggestion.type === 'city'
            ? suggestion.display.charAt(0).toUpperCase() + suggestion.display.slice(1).toLowerCase()
            : suggestion.display
        }));
        
        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (suggestion: Suggestion) => {
    // Ensure proper capitalization when selecting a city
    const formattedValue = suggestion.type === 'city'
      ? suggestion.value.charAt(0).toUpperCase() + suggestion.value.slice(1).toLowerCase()
      : suggestion.value;
    
    setQuery(suggestion.display);
    setShowSuggestions(false);

    switch (suggestion.type) {
      case 'city':
        router.push(`/listings?city=${encodeURIComponent(formattedValue)}`);
        break;
      case 'mls':
        router.push(`/listings/${encodeURIComponent(suggestion.value)}`);
        break;
      case 'address':
        router.push(`/listings?address=${encodeURIComponent(suggestion.value)}`);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      // Default to searching by address if user just hits enter
      router.push(`/listings?q=${encodeURIComponent(query)}`);
    }
  };

  const handlePopularCityClick = (city: string) => {
    router.push(`/listings?city=${encodeURIComponent(city)}`);
    setShowSuggestions(false);
    setQuery(city);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          placeholder="City, Neighbourhood, Address or MLS® number"
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Show either search suggestions or popular cities */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          {suggestions.length > 0 ? (
            // Show search suggestions if there are any
            suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.type}-${index}`}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="text-sm">
                  {suggestion.type === 'mls' && <span className="text-blue-600">MLS® </span>}
                  {suggestion.display}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {suggestion.type}
                </div>
              </div>
            ))
          ) : (
            // Show popular cities if no search suggestions and input is empty
            query.length === 0 && (
              <div>
                <div className="px-4 py-2 text-sm font-semibold text-gray-600 border-b">
                  Popular Searches
                </div>
                {POPULAR_CITIES.map((city) => (
                  <div
                    key={city}
                    onClick={() => handlePopularCityClick(city)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <FaMapMarkerAlt className="text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm">Search for homes in {city}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </form>
  );
} 