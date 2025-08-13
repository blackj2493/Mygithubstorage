import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    // Simplified filter for testing
    let filters = ['StandardStatus eq \'Active\''];

    const queryParams = new URLSearchParams({
      '$top': pageSize.toString(),
      '$skip': skip.toString(),
      '$filter': filters.join(' and '),
      '$orderby': 'ListDate desc',
      '$count': 'true',
      '$expand': 'Media'
    });

    // Log the complete URL and token presence
    const url = `${process.env.PROPTX_IDX_URL}/Property?${queryParams}`;
    console.log('Environment check:', {
      hasUrl: !!process.env.PROPTX_IDX_URL,
      hasToken: !!process.env.PROPTX_IDX_TOKEN,
      url: url
    });

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Log the response data structure
    console.log('API Response Structure:', {
      hasValue: !!data.value,
      valueLength: data.value?.length,
      hasCount: '@odata.count' in data,
      count: data['@odata.count']
    });

    return NextResponse.json({
      listings: data.value,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalCount: data['@odata.count'],
        totalPages: Math.ceil(data['@odata.count'] / pageSize)
      }
    });

  } catch (error) {
    console.error('Detailed Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch listings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}