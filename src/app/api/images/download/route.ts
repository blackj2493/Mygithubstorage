import { NextRequest, NextResponse } from 'next/server';
import { imageService } from '@/lib/image-service';

export async function POST(request: NextRequest) {
  try {
    const { propertyId, images } = await request.json();

    if (!propertyId || !images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Missing propertyId or images array' },
        { status: 400 }
      );
    }

    console.log(`🔄 Starting image download for property ${propertyId}`);

    // Download all images for the property
    const results = await imageService.downloadPropertyImages(propertyId, images);

    console.log(`✅ Downloaded ${results.length}/${images.length} images for property ${propertyId}`);

    return NextResponse.json({
      success: true,
      propertyId,
      downloaded: results.length,
      total: images.length,
      results
    });

  } catch (error) {
    console.error('Error downloading images:', error);
    return NextResponse.json(
      { 
        error: 'Failed to download images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Missing propertyId parameter' },
        { status: 400 }
      );
    }

    // For now, return a simple status - we'll implement database lookup later
    return NextResponse.json({
      propertyId,
      status: 'not_implemented',
      message: 'Database lookup not yet implemented'
    });

  } catch (error) {
    console.error('Error checking image status:', error);
    return NextResponse.json(
      { error: 'Failed to check image status' },
      { status: 500 }
    );
  }
}
