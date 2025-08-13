'use client';
import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [hasLogged, setHasLogged] = useState(false);

  useEffect(() => {
    // Only log the error once to prevent spam in development mode
    if (!hasLogged) {
      console.error('App Error:', error);
      setHasLogged(true);
    }
  }, [error, hasLogged]);

  // Check if this is a map-related error
  const isMapError = error.message?.includes('Map container is already initialized') ||
                     error.message?.includes('map');

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        {isMapError ? 'Map Loading Error' : 'Something went wrong!'}
      </h2>
      {isMapError && (
        <p className="text-gray-600 mb-4 text-center max-w-md">
          There was an issue loading the map. This is usually temporary and can be fixed by refreshing the page.
        </p>
      )}
      <div className="space-x-2">
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}