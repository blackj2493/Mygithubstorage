import { NextResponse } from 'next/server';

async function fetchProperties(filterParts: string[]) {
  let apiUrl = 'https://query.ampre.ca/odata/Property?$top=10';
  if (filterParts.length > 0) {
    const filter = filterParts.join(' and ');
    apiUrl += `&$filter=${encodeURIComponent(filter)}`;
  }

  console.log('Fetching properties with URL:', apiUrl);

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
  return data.value || [];
}

async function fetchPropertiesWithFallback(baseFilters: string[], additionalFilters: string[]) {
  // First try with all filters including BedroomsAboveGrade
  const allFilters = [...baseFilters, ...additionalFilters];
  let properties = await fetchProperties(allFilters);

  // If no results, try again without BedroomsAboveGrade filter
  if (properties.length === 0) {
    console.log('No results with BedroomsAboveGrade filter, trying without it...');
    const filtersWithoutBedrooms = allFilters.filter(f => !f.includes('BedroomsAboveGrade'));
    properties = await fetchProperties(filtersWithoutBedrooms);
  }

  return properties;
}

async function fetchImagesForProperties(properties: any[]) {
  return Promise.all(
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

        if (!mediaResponse.ok) return [];
        
        const mediaData = await mediaResponse.json();
        return mediaData.value || [];
      } catch (error) {
        console.error('Error fetching media for property:', property.ListingKey, error);
        return [];
      }
    })
  );
}

export async function POST(request: Request) {
  try {
    const { propertyData } = await request.json();
    console.log('Received property data:', propertyData);

    if (!propertyData.CityRegion || !propertyData.PropertySubType) {
      throw new Error('Missing required property data: CityRegion or PropertySubType');
    }

    // Base filters that apply to all queries
    const baseFilters = [
      `CityRegion eq '${propertyData.CityRegion}'`,
      `PropertySubType eq '${propertyData.PropertySubType}'`
    ];

    // Add BedroomsAboveGrade filter if available
    if (propertyData.BedroomsAboveGrade !== undefined) {
      baseFilters.push(`BedroomsAboveGrade eq ${propertyData.BedroomsAboveGrade}`);
    }

    console.log('Using base filters:', baseFilters);

    // Fetch sold properties
    const soldFilters = [
      "MlsStatus eq 'Sold'",
      `PurchaseContractDate ge ${new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
      `PurchaseContractDate le ${new Date().toISOString().split('T')[0]}`
    ];
    console.log('Fetching sold properties with filters:', soldFilters);
    const soldProperties = await fetchPropertiesWithFallback(baseFilters, soldFilters);

    // Fetch active listings with TransactionType = For Sale
    const activeFilters = [
      "MlsStatus ne 'Sold'",
      "TransactionType eq 'For Sale'"
    ];
    console.log('Fetching active properties with filters:', activeFilters);
    const forSaleProperties = await fetchPropertiesWithFallback(baseFilters, activeFilters);

    // Fetch rental properties with TransactionType = For Lease
    const rentalFilters = [
      "MlsStatus ne 'Sold'",
      "TransactionType eq 'For Lease'"
    ];
    console.log('Fetching rental properties with filters:', rentalFilters);
    const forRentProperties = await fetchPropertiesWithFallback(baseFilters, rentalFilters);

    // Fetch images for all properties
    const allProperties = [...soldProperties, ...forSaleProperties, ...forRentProperties];
    const propertyImages = await fetchImagesForProperties(allProperties);

    // Add images to properties
    const addImagesToProperties = (properties: any[], startIndex: number) => {
      return properties.map((property, index) => ({
        ...property,
        images: propertyImages[startIndex + index]?.map((image: any) => ({
          MediaURL: image.MediaURL,
          Order: image.Order
        })) || []
      }));
    };

    const soldWithImages = addImagesToProperties(soldProperties, 0);
    const forSaleWithImages = addImagesToProperties(forSaleProperties, soldProperties.length);
    const forRentWithImages = addImagesToProperties(forRentProperties, soldProperties.length + forSaleProperties.length);

    return NextResponse.json({
      sold: soldWithImages,
      forSale: forSaleWithImages,
      forRent: forRentWithImages,
      searchCriteria: {
        cityRegion: propertyData.CityRegion,
        propertySubType: propertyData.PropertySubType,
        bedroomsAboveGrade: propertyData.BedroomsAboveGrade,
        soldFilters,
        activeFilters,
        rentalFilters
      }
    });

  } catch (error) {
    console.error('Error fetching comparables:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch comparable properties',
      details: error instanceof Error ? error.message : 'Unknown error',
      sold: [],
      forSale: [],
      forRent: []
    }, { status: 500 });
  }
} 