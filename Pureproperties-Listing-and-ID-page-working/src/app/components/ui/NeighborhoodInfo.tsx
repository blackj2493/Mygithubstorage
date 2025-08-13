import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';
import { 
  MapPin, 
  School, 
  Bus, 
  ShoppingBag, 
  Trees, // Changed from Tree/PalmTree to Park
  Building2, 
  ChevronRight 
} from 'lucide-react';

const NeighborhoodInfo = ({ location }) => {
  const [neighborhoodData, setNeighborhoodData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeighborhoodData = async () => {
      if (!location?.lat || !location?.lng) return;
      
      try {
        // Fetch schools using Overpass API
        const schoolsQuery = `
          [out:json][timeout:25];
          (
            node["amenity"="school"](around:5000,${location.lat},${location.lng});
          );
          out body;
        `;
        const schoolsResponse = await fetch(`https://overpass-api.de/api/interpreter`, {
          method: 'POST',
          body: schoolsQuery
        });
        const schoolsData = await schoolsResponse.json();

        // Fetch amenities using Overpass API
        const amenitiesQuery = `
          [out:json][timeout:25];
          (
            node["leisure"="park"](around:2000,${location.lat},${location.lng});
            node["shop"](around:2000,${location.lat},${location.lng});
            node["public_transport"](around:2000,${location.lat},${location.lng});
          );
          out body;
        `;
        const amenitiesResponse = await fetch(`https://overpass-api.de/api/interpreter`, {
          method: 'POST',
          body: amenitiesQuery
        });
        const amenitiesData = await amenitiesResponse.json();

        // Process and organize the data
        const nearbySchools = schoolsData.elements.map(school => school.tags.name).filter(Boolean);
        const parks = amenitiesData.elements.filter(item => item.tags.leisure === 'park').map(park => park.tags.name).filter(Boolean);
        const shops = amenitiesData.elements.filter(item => item.tags.shop).map(shop => shop.tags.name).filter(Boolean);
        const transit = amenitiesData.elements.filter(item => item.tags.public_transport).map(transit => transit.tags.name).filter(Boolean);

        setNeighborhoodData({
          schools: nearbySchools.slice(0, 5),
          parks: parks.slice(0, 5),
          shopping: shops.slice(0, 5),
          transit: transit.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching neighborhood data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNeighborhoodData();
  }, [location]);

  if (loading) {
    return <div>Loading neighborhood information...</div>;
  }

  if (!neighborhoodData) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Neighborhood Information</h3>
      
      {/* Schools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Nearby Schools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4">
            {neighborhoodData.schools.map((school, index) => (
              <li key={index}>{school}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Transit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Transit Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4">
            {neighborhoodData.transit.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Shopping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping & Entertainment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4">
            {neighborhoodData.shopping.map((place, index) => (
              <li key={index}>{place}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Parks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trees className="h-5 w-5" />
            Parks & Recreation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4">
            {neighborhoodData.parks.map((park, index) => (
              <li key={index}>{park}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NeighborhoodInfo;