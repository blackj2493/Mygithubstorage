import { getDb } from './index';

export async function findNearbySchools(latitude: number, longitude: number, radius: number = 8) {
  try {
    const db = await getDb();
    
    // Debug: Let's see what columns we actually have
    const tableInfo = await db.all("PRAGMA table_info(schools)");
    console.log('Table columns:', tableInfo);

    // Calculate distance using the Haversine formula
    const query = `
      SELECT 
        "School Name",
        "School Type",
        "School Level",
        "School Language",
        "Grade Range",
        "Street",
        "Municipality",
        "City",
        "Province",
        "Postal Code",
        "School Website",
        "Latitude",
        "Longitude",
        (6371 * acos(
          cos(radians(?)) * 
          cos(radians(Latitude)) * 
          cos(radians(Longitude) - radians(?)) + 
          sin(radians(?)) * 
          sin(radians(Latitude))
        )) AS distance
      FROM schools
      WHERE (6371 * acos(
        cos(radians(?)) * 
        cos(radians(Latitude)) * 
        cos(radians(Longitude) - radians(?)) + 
        sin(radians(?)) * 
        sin(radians(Latitude))
      )) <= ?
      ORDER BY distance
      LIMIT 50
    `;

    const schools = await db.all(query, [
      latitude,
      longitude,
      latitude,
      latitude,
      longitude,
      latitude,
      radius
    ]);

    // Add debug logging
    console.log('First school in results:', schools[0]);

    return schools.map(school => ({
      schoolName: school['School Name'],
      schoolType: school['School Type'],
      schoolLevel: school['School Level'],
      schoolLanguage: school['School Language'],
      gradeRange: school['Grade Range'],
      street: school['Street'],
      municipality: school['Municipality'],
      city: school['City'],
      province: school['Province'],
      postalCode: school['Postal Code'],
      schoolWebsite: school['School Website'],
      latitude: school['Latitude'],
      longitude: school['Longitude'],
      distance: school['distance']
    }));
  } catch (error) {
    console.error('Error finding nearby schools:', error);
    throw error;
  }
} 