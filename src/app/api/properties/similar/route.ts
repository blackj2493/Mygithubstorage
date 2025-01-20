import { NextResponse } from 'next/server';

async function fetchIDXImages(listingKey: string) {
  try {
    const mediaUrl = `https://query.ampre.ca/odata/Media?$filter=ResourceRecordKey eq '${listingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Large'&$orderby=Order`;
    
    const response = await fetch(mediaUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) return null;
    
    const mediaData = await response.json();
    return mediaData.value || null;
  } catch (error) {
    console.error('Error fetching IDX images:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyData, listingType } = body;
    
    console.log('Received property data:', propertyData);
    console.log('Listing type:', listingType);

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

    if (propertyData.BedroomsAboveGrade && !isNaN(Number(propertyData.BedroomsAboveGrade))) {
      filterParts.push(`BedroomsAboveGrade eq ${Number(propertyData.BedroomsAboveGrade)}`);
    }

    // Add CoveredSpaces filter
    if (propertyData.CoveredSpaces && !isNaN(Number(propertyData.CoveredSpaces))) {
      filterParts.push(`CoveredSpaces eq ${Number(propertyData.CoveredSpaces)}`);
    }

    // Add filter for recently sold/leased properties with correct date format
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const formattedDate = sixtyDaysAgo.toISOString().split('T')[0];

    filterParts.push(`PurchaseContractDate ge ${formattedDate}`);

    // Filter MlsStatus based on listingType
    if (listingType === 'SALE') {
      filterParts.push(`MlsStatus eq 'Sold'`);
    } else if (listingType === 'RENT') {
      filterParts.push(`MlsStatus eq 'Leased'`);
    }

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

    // Fetch images for each property using the Media endpoint
    const propertiesWithImages = await Promise.all(properties.map(async (property) => {
      const images = await fetchIDXImages(property.ListingKey);
      return {
        ...property,
        images: images || [] // Store as 'images' instead of 'Media'
      };
    }));

    return NextResponse.json({
      properties: propertiesWithImages,
      totalProperties: propertiesWithImages.length
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