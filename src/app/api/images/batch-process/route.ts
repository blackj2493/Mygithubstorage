import { NextRequest, NextResponse } from 'next/server';
import { imageService } from '@/lib/image-service';

export async function POST(request: NextRequest) {
  try {
    const { properties } = await request.json();

    if (!properties || !Array.isArray(properties)) {
      return NextResponse.json(
        { error: 'Missing properties array' },
        { status: 400 }
      );
    }

    console.log(`🔄 Starting batch processing for ${properties.length} properties`);

    // Process properties in background (don't wait for completion)
    imageService.batchProcessProperties(properties).catch(error => {
      console.error('Background batch processing failed:', error);
    });

    return NextResponse.json({
      success: true,
      message: `Started batch processing for ${properties.length} properties`,
      propertiesQueued: properties.length
    });

  } catch (error) {
    console.error('Error starting batch processing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to start batch processing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
