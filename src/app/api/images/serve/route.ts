import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const originalUrl = searchParams.get('url');
    const propertyId = searchParams.get('propertyId');

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    // For now, we'll implement a simple fallback system
    // TODO: Check database for local image first
    
    // If no local image found, serve the original PropTx URL temporarily
    // This is a temporary measure during the transition period
    
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
