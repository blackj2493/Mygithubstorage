import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { city, limit = 10 } = await request.json();

    if (!city) {
      return NextResponse.json(
        { error: 'Missing city parameter' },
        { status: 400 }
      );
    }

    console.log(`🔄 Starting manual image download for ${city} (limit: ${limit})`);

    // Fetch properties from our listings API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/properties/listings?city=${encodeURIComponent(city)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.status}`);
    }

    const data = await response.json();
    const properties = data.listings || [];

    if (properties.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No properties found for ${city}`
      });
    }

    // Filter properties that have images
    const propertiesWithImages = properties.filter((p: any) => p.images && p.images.length > 0);

    if (propertiesWithImages.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No properties with images found for ${city}`
      });
    }

    // Start batch processing
    const batchResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/images/batch-process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        properties: propertiesWithImages.map((p: any) => ({
          ListingKey: p.ListingKey,
          images: p.images
        }))
      })
    });

    if (!batchResponse.ok) {
      throw new Error(`Failed to start batch processing: ${batchResponse.status}`);
    }

    const batchResult = await batchResponse.json();

    return NextResponse.json({
      success: true,
      message: `Started downloading images for ${propertiesWithImages.length} properties in ${city}`,
      propertiesFound: properties.length,
      propertiesWithImages: propertiesWithImages.length,
      batchResult
    });

  } catch (error) {
    console.error('Error in manual image download:', error);
    return NextResponse.json(
      { 
        error: 'Failed to start image download',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
