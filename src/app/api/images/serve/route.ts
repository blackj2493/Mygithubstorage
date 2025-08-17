import { NextRequest, NextResponse } from 'next/server';
import { imageService } from '@/lib/image-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const originalUrl = searchParams.get('url');
    const propertyId = searchParams.get('propertyId');
    const mediaChangeTimestamp = searchParams.get('mediaChangeTimestamp');

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    // Try to get local image URL from our service
    if (propertyId) {
      try {
        const localUrl = await imageService.getImageUrl(
          originalUrl,
          propertyId,
          0, // order - we don't have this info in the URL
          mediaChangeTimestamp || undefined
        );

        // If we got a local URL (not placeholder), redirect to it
        if (localUrl && localUrl !== '/placeholder-property.jpg' && localUrl.startsWith('https://')) {
          return NextResponse.redirect(localUrl);
        }
      } catch (error) {
        console.warn('Failed to get local image URL:', error);
      }
    }

    // Fallback: Proxy the image from PropTx (temporary during transition)
    try {
      // Fetch the image from PropTx
      const response = await fetch(originalUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });

    } catch (error) {
      console.error('Failed to fetch image:', error);

      // Return placeholder image
      return NextResponse.redirect('/placeholder-property.jpg');
    }

  } catch (error) {
    console.error('Error in image serve endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
