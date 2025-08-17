import { NextRequest, NextResponse } from 'next/server';
import { imageService } from '@/lib/image-service';

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

    // Get all images for the property from database
    const images = await imageService.getPropertyImages(propertyId);

    return NextResponse.json({
      propertyId,
      imageCount: images.length,
      images: images.map(img => ({
        originalUrl: img.originalUrl,
        localUrl: img.localUrl,
        order: img.order,
        status: img.status
      }))
    });

  } catch (error) {
    console.error('Error checking image status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check image status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { propertyId, mediaChangeTimestamp } = await request.json();

    if (!propertyId || !mediaChangeTimestamp) {
      return NextResponse.json(
        { error: 'Missing propertyId or mediaChangeTimestamp' },
        { status: 400 }
      );
    }

    // Check if images need updating
    const needsUpdate = await imageService.checkImageFreshness(propertyId, mediaChangeTimestamp);

    return NextResponse.json({
      propertyId,
      mediaChangeTimestamp,
      needsUpdate,
      message: needsUpdate ? 'Images need updating' : 'Images are fresh'
    });

  } catch (error) {
    console.error('Error checking image freshness:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check image freshness',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
