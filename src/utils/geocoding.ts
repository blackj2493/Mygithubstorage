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