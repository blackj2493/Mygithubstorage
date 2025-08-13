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
    
    console.log('Received property data:', {
      ...propertyData,
      PropertySubType: `"${propertyData.PropertySubType}"`
    });

    if (!process.env.PROPTX_VOW_TOKEN) {
      throw new Error('VOW token is not configured');
    }

    async function fetchProperties(filterParts: string[]) {
      let apiUrl = 'https://query.ampre.ca/odata/Property?$top=100';
      if (filterParts.length > 0) {
        const filter = filterParts.join(' and ');
        apiUrl += `&$filter=${encodeURIComponent(filter)}`;
      }

      console.log('Testing filter URL:', apiUrl);

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
      console.log('API Response data:', {
        count: data.value?.length || 0,
        firstProperty: data.value?.[0]
      });
      return data.value || [];
    }

    // Build filters
    let filterParts = [];

    // Add MlsStatus filter
    filterParts.push("MlsStatus eq 'Sold'");

    // Add date range filter for last 60 days
    const today = new Date();
    const sixtyDaysAgo = new Date(today);
    sixtyDaysAgo.setDate(today.getDate() - 60);
    
    // Format dates to ISO string and take just the date part
    const formattedToday = today.toISOString().split('T')[0];
    const formattedSixtyDaysAgo = sixtyDaysAgo.toISOString().split('T')[0];
    
    console.log('Adding date range filter:', `${formattedSixtyDaysAgo} to ${formattedToday}`);
    filterParts.push(`PurchaseContractDate ge ${formattedSixtyDaysAgo} and PurchaseContractDate le ${formattedToday}`);

    // Add CityRegion filter if available
    if (propertyData.CityRegion) {
      console.log('Adding CityRegion filter for:', propertyData.CityRegion);
      filterParts.push(`CityRegion eq '${propertyData.CityRegion}'`);
    }

    // Add CoveredSpaces filter if available
    if (propertyData.CoveredSpaces !== undefined && propertyData.CoveredSpaces !== null) {
      console.log('Adding CoveredSpaces filter for:', propertyData.CoveredSpaces);
      filterParts.push(`CoveredSpaces eq ${propertyData.CoveredSpaces}`);
    }

    // Add PropertySubType filter if available
    if (propertyData.PropertySubType && propertyData.PropertySubType !== '') {
      console.log('Adding PropertySubType filter for:', propertyData.PropertySubType);
      filterParts.push(`PropertySubType eq '${propertyData.PropertySubType}'`);
    }

    // Add BedroomsAboveGrade filter if available
    if (propertyData.BedroomsAboveGrade !== undefined && propertyData.BedroomsAboveGrade !== null) {
      console.log('Adding BedroomsAboveGrade filter for:', propertyData.BedroomsAboveGrade);
      filterParts.push(`BedroomsAboveGrade eq ${propertyData.BedroomsAboveGrade}`);
    }

    // Log all filters being used
    console.log('Using filters:', filterParts);

    // Fetch properties with filters
    const properties = await fetchProperties(filterParts);
    console.log(`Found ${properties.length} properties with filters:`, filterParts);

    if (!properties.length) {
      // If no results with all filters, try without PropertyType
      if (propertyData.PropertyType) {
        console.log('No results with PropertyType, trying without it...');
        const filtersWithoutPropertyType = filterParts.filter(f => !f.includes('PropertyType'));
        const propertiesWithoutPropertyType = await fetchProperties(filtersWithoutPropertyType);
        
        if (propertiesWithoutPropertyType.length > 0) {
          console.log(`Found ${propertiesWithoutPropertyType.length} properties without PropertyType filter`);
          properties.push(...propertiesWithoutPropertyType);
        }
      }

      if (!properties.length) {
        console.log('No properties found with any filters');
        return NextResponse.json({ 
          properties: [],
          totalProperties: 0,
          isFlexibleSearch: true,
          searchCriteria: {
            filters: filterParts,
            cityRegion: propertyData.CityRegion,
            coveredSpaces: propertyData.CoveredSpaces,
            propertySubType: propertyData.PropertySubType,
            bedroomsAboveGrade: propertyData.BedroomsAboveGrade
          }
        });
      }
    }

    // Fetch images for properties
    console.log('Starting to fetch images for properties...');
    const propertyImages = await Promise.all(
      properties.map(async (property: any) => {
        const mediaUrl = `https://query.ampre.ca/odata/Media?$filter=ResourceRecordKey eq '${property.ListingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Large'&$orderby=Order`;
        
        try {
          const mediaResponse = await fetch(mediaUrl, {
            headers: {
              'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
              'Accept': 'application/json',
            },
            cache: 'no-store'
          });

          if (!mediaResponse.ok) {
            console.error('Media fetch error for property:', property.ListingKey);
            return [];
          }
          
          const mediaData = await mediaResponse.json();
          return mediaData.value || [];
        } catch (error) {
          console.error('Error fetching media for property:', property.ListingKey, error);
          return [];
        }
      })
    );
    console.log('Finished fetching images');

    const propertiesWithImages = properties.map((property: any, index: number) => ({
      ...property,
      images: propertyImages[index]?.map((image: any) => ({
        MediaURL: image.MediaURL,
        Order: image.Order
      })) || []
    }));

    console.log('Preparing response with', propertiesWithImages.length, 'properties');
    const response = { 
      properties: propertiesWithImages,
      totalProperties: propertiesWithImages.length,
      isFlexibleSearch: false,
      searchCriteria: {
        filters: filterParts,
        cityRegion: propertyData.CityRegion,
        coveredSpaces: propertyData.CoveredSpaces,
        propertySubType: propertyData.PropertySubType,
        bedroomsAboveGrade: propertyData.BedroomsAboveGrade
      }
    };

    console.log('Sending response...');
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in similar properties API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error',
      properties: []
    }, { status: 500 });
  }
} 