'use client';

import { useEffect, useRef, useState } from 'react';

export default function MinimalTestMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    const initMap = async () => {
      try {
        setStatus('Step 1: Checking window...');
        if (typeof window === 'undefined') {
          setStatus('ERROR: No window object');
          return;
        }

        setStatus('Step 2: Checking container...');
        if (!mapRef.current) {
          setStatus('ERROR: No map container');
          return;
        }

        setStatus('Step 3: Loading Leaflet CSS...');
        // Add CSS if not present
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          
          await new Promise(resolve => {
            link.onload = resolve;
            setTimeout(resolve, 2000); // Timeout after 2 seconds
          });
        }

        setStatus('Step 4: Importing Leaflet...');
        const L = await import('leaflet');
        const leaflet = L.default || L;

        setStatus('Step 5: Creating map...');
        // Clear container
        mapRef.current.innerHTML = '';
        
        // Create map
        const map = leaflet.map(mapRef.current).setView([45.4215, -75.6972], 13);

        setStatus('Step 6: Adding tiles...');
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        setStatus('Step 7: Adding marker...');
        leaflet.marker([45.4215, -75.6972])
          .addTo(map)
          .bindPopup('Test marker - Map is working!')
          .openPopup();

        setStatus('SUCCESS: Map loaded!');

      } catch (error) {
        console.error('Map error:', error);
        setStatus(`ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800">Minimal Test Map</h3>
        <p className="text-blue-600">Status: {status}</p>
      </div>
      <div
        ref={mapRef}
        className="w-full h-96 border border-gray-300 rounded bg-gray-100"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}
