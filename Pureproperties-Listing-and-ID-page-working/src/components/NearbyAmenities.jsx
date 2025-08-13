import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const NearbyAmenities = ({ address, latitude, longitude }) => {
  const [amenities, setAmenities] = useState({
    schools: [],
    groceries: [],
    libraries: [],
    community: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  const fetchNearbyAmenities = async (type) => {
    try {
      const radius = 2000; // 2km radius
      const query = `[out:json];
        (
          node["amenity"="${type}"](around:${radius},${latitude},${longitude});
          way["amenity"="${type}"](around:${radius},${latitude},${longitude});
        );
        out body;`;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      if (!response.ok) throw new Error('Failed to fetch amenities');
      const data = await response.json();
      return data.elements;
    } catch (err) {
      setError('Failed to load nearby amenities');
      return [];
    }
  };

  useEffect(() => {
    const loadAmenities = async () => {
      setLoading(true);
      const cachedData = localStorage.getItem(`amenities-${address}`);
      
      if (cachedData) {
        setAmenities(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      const results = {
        schools: await fetchNearbyAmenities('school'),
        groceries: await fetchNearbyAmenities('supermarket'),
        libraries: await fetchNearbyAmenities('library'),
        community: await fetchNearbyAmenities('community_centre')
      };

      setAmenities(results);
      localStorage.setItem(`amenities-${address}`, JSON.stringify(results));
      setLoading(false);
    };

    if (latitude && longitude) {
      loadAmenities();
    }
  }, [address, latitude, longitude]);

  return (
    <div className="nearby-amenities">
      {loading ? (
        <div className="loading-spinner">Loading nearby amenities...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="map-container">
            <MapContainer
              center={[latitude, longitude]}
              zoom={14}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Markers implementation here */}
            </MapContainer>
          </div>
          
          <div className="amenities-list">
            {Object.entries(amenities).map(([category, items]) => (
              <div key={category} className="amenity-category">
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <ul>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className={selectedAmenity === item.id ? 'selected' : ''}
                      onClick={() => setSelectedAmenity(item.id)}
                    >
                      <h4>{item.tags.name || 'Unnamed Location'}</h4>
                      <p>{calculateDistance(latitude, longitude, item.lat, item.lon)} km away</p>
                      {item.tags.website && (
                        <a href={item.tags.website} target="_blank" rel="noopener noreferrer">
                          View More Details
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NearbyAmenities; 