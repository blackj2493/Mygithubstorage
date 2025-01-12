import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyData } = body;
    
    console.log('Received property data:', propertyData);

    if (!process.env.PROPTX_VOW_TOKEN) {
      throw new Error('VOW token is not configured');
    }

    // Build the filter string
    let filterParts = [];
    
    if (propertyData.Community) {
      filterParts.push(`CityRegion eq '${propertyData.Community}'`);
    }
    
    if (propertyData.PropertyType) {
      filterParts.push(`PropertyType eq '${propertyData.PropertyType}'`);
    }
    
    if (propertyData.PropertySubType) {
      filterParts.push(`PropertySubType eq '${propertyData.PropertySubType}'`);
    }

    if (propertyData.BedroomsTotal && !isNaN(Number(propertyData.BedroomsTotal))) {
      filterParts.push(`BedroomsTotal eq ${Number(propertyData.BedroomsTotal)}`);
    }

    // Add filter for recently closed/leased properties with correct date format
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const formattedDate = sixtyDaysAgo.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    filterParts.push(`CloseDate gt ${formattedDate}`);
    filterParts.push(`(MlsStatus eq 'Sold' or MlsStatus eq 'Leased')`);

    // Combine all filters with 'and'
    let apiUrl = 'https://query.ampre.ca/odata/Property?$top=100';
    if (filterParts.length > 0) {
      const filter = filterParts.join(' and ');
      apiUrl += `&$filter=${encodeURIComponent(filter)}`;
    }

    console.log('Making request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_VOW_TOKEN}`,
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`API response not OK: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    const properties = data.value || [];
    console.log(`Found ${properties.length} properties matching criteria`);

    return NextResponse.json({ 
      properties: properties,
      totalProperties: properties.length
    });

  } catch (error) {
    console.error('Detailed error in similar properties API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch similar properties',
      details: error.message,
      properties: []
    }, { status: 500 });
  }
} 