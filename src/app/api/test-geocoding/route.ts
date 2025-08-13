import { NextRequest, NextResponse } from 'next/server';
import { geocodePostalCodeForMap } from '@/utils/geocoding';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postalCode = searchParams.get('postalCode');

  if (!postalCode) {
    return NextResponse.json({ error: 'postalCode parameter is required' }, { status: 400 });
  }

  try {
    console.log(`🧪 Testing geocoding for postal code: ${postalCode}`);
    const result = await geocodePostalCodeForMap(postalCode);
    
    return NextResponse.json({
      postalCode,
      result,
      success: !!result
    });
  } catch (error) {
    console.error('Error testing geocoding:', error);
    return NextResponse.json({ error: 'Failed to geocode postal code' }, { status: 500 });
  }
}
