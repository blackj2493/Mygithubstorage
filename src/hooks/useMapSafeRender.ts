'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook to safely render maps and prevent "Map container is already initialized" errors
 * This is particularly useful in React development mode with Strict Mode enabled
 */
export function useMapSafeRender() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const initializeMap = () => {
      try {
        if (mountedRef.current) {
          setIsReady(true);
          setError(null);
        }
      } catch (err) {
        console.error('Map initialization error:', err);
        
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          setError(`Retrying map initialization... (${retryCountRef.current}/${maxRetries})`);
          
          // Retry after a short delay
          timeoutId = setTimeout(() => {
            initializeMap();
          }, 1000 * retryCountRef.current); // Exponential backoff
        } else {
          setError('Failed to initialize map after multiple attempts');
        }
      }
    };

    // Mark as mounted
    mountedRef.current = true;
    
    // Small delay to ensure DOM is ready
    timeoutId = setTimeout(() => {
      initializeMap();
    }, 100);

    return () => {
      mountedRef.current = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const retry = () => {
    retryCountRef.current = 0;
    setError(null);
    setIsReady(false);
    
    // Small delay before retry
    setTimeout(() => {
      mountedRef.current = true;
      setIsReady(true);
    }, 100);
  };

  return {
    isReady,
    error,
    retry,
    isMounted: mountedRef.current
  };
}

/**
 * Generate a unique key for map components to force re-render when needed
 */
export function useMapKey(dependencies: any[] = []) {
  const [key, setKey] = useState(() => `map-${Date.now()}-${Math.random()}`);

  useEffect(() => {
    setKey(`map-${Date.now()}-${Math.random()}`);
  }, dependencies);

  return key;
}
