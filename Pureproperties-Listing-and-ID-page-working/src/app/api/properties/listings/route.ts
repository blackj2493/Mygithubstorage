import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    if (!process.env.PROPTX_IDX_TOKEN) {
      throw new Error('API Token not configured');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 50;
    const skip = (page - 1) * limit;
    
    const baseUrl = 'https://query.ampre.ca/odata';
    
    // Get filter parameters
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const propertyType = searchParams.get('propertyType');
    const sortBy = searchParams.get('sortBy') || 'ModificationTimestamp desc,ListingKey desc';

    // Build filter string
    let filters = [];
    if (city) filters.push(`Municipality eq '${city}'`);
    if (minPrice) filters.push(`ListPrice ge ${minPrice}`);
    if (maxPrice) filters.push(`ListPrice le ${maxPrice}`);
    if (propertyType) filters.push(`PropertyType eq '${propertyType}'`);
    
    const filterString = filters.length > 0 ? `&$filter=${filters.join(' and ')}` : '';
    
    // Get total count first
    const countUrl = `${baseUrl}/Property?$count=true&$top=0${filterString}`;
    const countResponse = await fetch(countUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!countResponse.ok) {
      throw new Error(`Failed to fetch count: ${countResponse.status}`);
    }

    const countData = await countResponse.json();
    const totalCount = countData['@odata.count'];
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch properties with pagination
    const propertiesUrl = `${baseUrl}/Property?$skip=${skip}&$top=${limit}&$orderby=${sortBy}${filterString}`;
    
    console.log('Properties URL:', propertiesUrl);

    const response = await fetch(propertiesUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.status}`);
    }

    const data = await response.json();
    const properties = data.value;

    // Fetch images for all properties
    const propertyImages = await Promise.all(
      properties.map(async (property: any) => {
        const mediaUrl = `${baseUrl}/Media?$filter=ResourceRecordKey eq '${property.ListingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Large'&$orderby=Order`;
        console.log('Media URL for property:', mediaUrl);
        
        try {
          const mediaResponse = await fetch(mediaUrl, {
            headers: {
              'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
              'Accept': 'application/json',
            },
            cache: 'no-store'
          });

          if (!mediaResponse.ok) return [];
          
          const mediaData = await mediaResponse.json();
          return mediaData.value || [];
        } catch (error) {
          console.error('Error fetching media for property:', property.ListingKey, error);
          return [];
        }
      })
    );

    // Fetch office logos
    const officeLogos = await Promise.all(
      [...new Set(properties.map((p: any) => p.ListOfficeKey))].map(async (officeKey: string) => {
        const logoUrl = `${baseUrl}/Media?$filter=ResourceRecordKey eq '${officeKey}' and ResourceName eq 'Office'&$orderby=ModificationTimestamp,MediaKey`;
        
        try {
          const logoResponse = await fetch(logoUrl, {
            headers: {
              'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
              'Accept': 'application/json',
            },
            cache: 'no-store'
          });

          if (!logoResponse.ok) return null;
          
          const logoData = await logoResponse.json();
          return {
            officeKey,
            logo: logoData.value?.[0]?.MediaURL || null
          };
        } catch (error) {
          console.error('Error fetching office logo:', officeKey, error);
          return null;
        }
      })
    );

    // Create a map of office keys to logos
    const officeLogoMap = Object.fromEntries(
      officeLogos.filter(Boolean).map(item => [item.officeKey, item.logo])
    );

    // Combine properties with their images and office logos
    const propertiesWithImages = properties.map((property: any, index: number) => ({
      ...property,
      images: propertyImages[index]?.map((image: any) => ({
        MediaURL: image.MediaURL,
        Order: image.Order
      })) || [],
      officeLogo: officeLogoMap[property.ListOfficeKey] || null
    }));

    return NextResponse.json({
      listings: propertiesWithImages,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        itemsPerPage: limit,
        hasMore: page < totalPages
      },
      filters: {
        city,
        minPrice,
        maxPrice,
        propertyType,
        sortBy
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch listings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}