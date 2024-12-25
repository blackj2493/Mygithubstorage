import { NextResponse } from 'next/server';

// Add rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // Adjust based on your API provider's limits
const requestCounts = new Map();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Implement rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    if (!process.env.PROPTX_VOW_TOKEN) {
      console.error('VOW token is not configured');
      return NextResponse.json(
        { error: 'VOW API token not configured' },
        { status: 500 }
      );
    }

    console.log('VOW Token exists:', !!process.env.PROPTX_VOW_TOKEN);
    console.log('Property ID:', params.id);
    
    // Let's try the standard property endpoint first
    const url = new URL(`https://query.ampre.ca/odata/Property('${params.id}')`);
    console.log('Attempting VOW API request to:', url.toString());
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_VOW_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('VOW API Response Status:', response.status);
    console.log('VOW API Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('VOW API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Instead of throwing, let's return the error
      return NextResponse.json(
        { 
          error: 'VOW API request failed',
          details: {
            status: response.status,
            message: errorText
          }
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('VOW API Response Data:', JSON.stringify(data, null, 2));

    // Return raw data for now to debug
    return NextResponse.json(data);

  } catch (error) {
    console.error('VOW API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch VOW property data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean up old entries
  for (const [key, timestamp] of requestCounts.entries()) {
    if (timestamp < windowStart) {
      requestCounts.delete(key);
    }
  }
  
  // Count requests for this client
  const clientRequests = Array.from(requestCounts.entries())
    .filter(([key]) => key.startsWith(clientIp))
    .length;

  if (clientRequests >= MAX_REQUESTS) {
    return false;
  }

  requestCounts.set(`${clientIp}-${now}`, now);
  return true;
} 