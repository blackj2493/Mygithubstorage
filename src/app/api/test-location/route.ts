import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing location API...');
    
    // Get user's location from IP
    const response = await fetch('https://ipapi.co/json/');
    
    console.log('Location API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Location API response data:', data);
    
    // Check if we got an error response
    if (data.error) {
      throw new Error(`Location API error: ${data.reason || 'Unknown error'}`);
    }
    
    // Extract just the first 3 characters of the postal code
    const userPostal = data.postal?.substring(0, 3);
    console.log('Extracted postal code prefix:', userPostal);

    return NextResponse.json({
      success: true,
      data: data,
      postalPrefix: userPostal,
      message: 'Location detection successful'
    });

  } catch (error) {
    console.error('Error testing location API:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Location detection failed'
    }, { status: 500 });
  }
}
