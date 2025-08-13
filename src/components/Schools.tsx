import { useState, useEffect } from 'react';
import { FaSchool } from 'react-icons/fa';
import Card from '@/components/ui/AllCard/Card';
import CardContent from '@/components/ui/AllCard/CardContent';
import CardHeader from '@/components/ui/AllCard/CardHeader';
import CardTitle from '@/components/ui/AllCard/CardTitle';
import { getCoordinatesFromPostalCode } from '@/utils/geocoding';

interface School {
  schoolName: string;
  schoolType: string;
  schoolLevel: string;
  schoolLanguage: string;
  gradeRange: string;
  street: string;
  distance: number;
  schoolWebsite: string;
}

interface SchoolsProps {
  postalCode: string;
}

export default function Schools({ postalCode }: SchoolsProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`/api/schools?postalCode=${encodeURIComponent(postalCode)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch schools');
        }

        setSchools(data.schools.slice(0, 10));
      } catch (err) {
        console.error('Error fetching schools:', err);
        setError(err instanceof Error ? err.message : 'Unable to load nearby schools');
      } finally {
        setLoading(false);
      }
    };

    if (postalCode) {
      fetchSchools();
    }
  }, [postalCode]);

  const displayedSchools = showAll ? schools : schools.slice(0, 3);

  return (
    <Card>
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-xl">Schools Nearby</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        <div className="divide-y divide-gray-200">
          {displayedSchools.map((school, index) => (
            <div 
              key={`${school.schoolName}-${school.street}-${index}`} 
              className="py-5"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <FaSchool className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">{school.schoolName}</h3>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 text-base text-gray-500">
                      <span>{school.schoolType || '•'}</span>
                      <span>•</span>
                      <span>{school.schoolLevel || '•'}</span>
                      <span>•</span>
                      <span>{school.gradeRange || 'Grades'}</span>
                    </div>
                    <p className="text-base text-gray-600 mt-2">{school.street}</p>
                    <p className="text-base text-gray-500 mt-1">
                      {Math.round(school.distance * 10) / 10} km away
                    </p>
                  </div>
                </div>
                {school.schoolWebsite && (
                  <a 
                    href={school.schoolWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-base font-medium"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
          {!loading && schools.length === 0 && (
            <p className="text-base text-gray-500">No schools found within 8km radius.</p>
          )}
          {!loading && schools.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 w-full py-3 text-blue-600 hover:text-blue-800 text-base font-medium"
            >
              {showAll ? 'Show Less' : `Show ${Math.min(schools.length - 3, 7)} More Schools`}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 