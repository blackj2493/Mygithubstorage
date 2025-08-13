import { NextResponse } from 'next/server';
import { findNearbySchools } from '@/lib/db/schools';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postalCode = searchParams.get('postalCode');

  if (!postalCode) {
    return NextResponse.json(
      { error: 'Postal code is required' },
      { status: 400 }
    );
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return NextResponse.json(
      { error: 'Google Maps API key is not configured' },
      { status: 500 }
    );
  }

  try {
    // Format postal code
    const cleanPostalCode = postalCode.replace(/\s+/g, '').toUpperCase();
    const formattedPostalCode = cleanPostalCode.slice(0, 3) + ' ' + cleanPostalCode.slice(3);

    // Get coordinates from Google Geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?` + 
      new URLSearchParams({
        components: `postal_code:${formattedPostalCode}|country:CA`,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
      });

    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status === 'REQUEST_DENIED') {
      console.error('Google API Error:', geocodeData.error_message);
      return NextResponse.json({ error: geocodeData.error_message }, { status: 400 });
    }

    if (!geocodeData.results?.[0]?.geometry?.location) {
      return NextResponse.json(
        { error: 'Could not find coordinates for this postal code' },
        { status: 404 }
      );
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;
    console.log('Found coordinates:', { latitude: lat, longitude: lng });

    // Find nearby schools using the coordinates
    const schools = await findNearbySchools(lat, lng);
    console.log(`Found ${schools.length} schools`);
    
    return NextResponse.json({ 
      schools,
      coordinates: { latitude: lat, longitude: lng }
    });
  } catch (error) {
    console.error('Error in schools API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch schools data' },
      { status: 500 }
    );
  }
} 