import { NextResponse } from 'next/server';

// Helper function to capitalize first letter
function capitalizeFirstLetter(string: string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Add this type at the top of your file
type ValidPropertyType = 'Residential Condo & Other' | 'Residential Freehold' | 'Commercial';

// Add this mapping object at the top of the file
const PROPERTY_SUBTYPE_MAPPING: { [key: string]: string } = {
  'Semi-Detached': 'Semi-Detached ', // with space at the end
  'Attached/Row/Street Townhouse': 'Att/Row/Townhouse'  // exactly as in API response
};

export async function GET(request: Request) {
  try {
    if (!process.env.PROPTX_IDX_TOKEN) {
      throw new Error('API Token not configured');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    
    // Add postal code to existing parameters
    const PostalCode = searchParams.get('PostalCode');
    
    const baseUrl = 'https://query.ampre.ca/odata';
    
    // Get filter parameters
    const city = searchParams.get('city');
    const address = searchParams.get('address');
    const mls = searchParams.get('mls');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const propertyType = searchParams.get('PropertyType');
    const propertySubType = searchParams.get('PropertySubType');
    const transactionType = searchParams.get('TransactionType');
    const sortBy = searchParams.get('sortBy') || 'ModificationTimestamp desc,ListingKey desc';
    const BedroomsTotal = searchParams.get('BedroomsTotal');

    // Build filter string
    let filters = ["StandardStatus eq 'Active'"]; // Keep default active filter

    // Add postal code filter if provided
    if (PostalCode) {
      const PostalPrefix = PostalCode.substring(0, 3);
      filters.push(`startswith(PostalCode, '${PostalPrefix}')`);
    }

    // Handle property type filtering
    const propertyTypes = searchParams.get('PropertyTypes');

    if (propertyTypes) {
      // Handle multiple property types (Residential case)
      const types = JSON.parse(propertyTypes);
      const typeFilters = types.map((type: string) => `PropertyType eq '${type}'`);
      filters.push(`(${typeFilters.join(' or ')})`);
    } else if (propertyType) {
      // Handle single property type (Commercial case)
      filters.push(`PropertyType eq '${propertyType}'`);
    }

    // Add PropertySubType filter if provided
    if (propertySubType) {
      try {
        const subTypes = JSON.parse(propertySubType);
        if (subTypes.length > 0) {
          const subTypeFilters = subTypes.map((type: string) => {
            // First decode the type to handle any URL encoding
            const decodedType = decodeURIComponent(type);
            // Use the mapping if it exists, otherwise use the original type
            const mappedType = PROPERTY_SUBTYPE_MAPPING[decodedType] || decodedType;
            // Add logging to debug the mapping
            console.log('Original type:', type);
            console.log('Decoded type:', decodedType);
            console.log('Mapped type:', mappedType);
            return `PropertySubType eq '${mappedType}'`;
          });
          filters.push(`(${subTypeFilters.join(' or ')})`);
        }
      } catch (error) {
        console.error('Error parsing PropertySubType:', error);
        console.error('Raw PropertySubType value:', propertySubType);
      }
    }

    // Add other filters with capitalized city name
    if (city) {
        const capitalizedCity = capitalizeFirstLetter(city);
        filters.push(`City eq '${capitalizedCity}'`);
    }

    if (address) filters.push(`contains(UnparsedAddress, '${address}')`);
    if (mls) filters.push(`ListingKey eq '${mls}'`);
    if (minPrice) filters.push(`ListPrice ge ${minPrice}`);
    if (maxPrice) filters.push(`ListPrice le ${maxPrice}`);
    if (transactionType === 'Lease') {
        filters.push("TransactionType eq 'For Lease'");
    } else {
        filters.push("TransactionType eq 'For Sale'");
    }

    // Add bedrooms filter with special handling for 5+
    if (BedroomsTotal) {
      // Remove the '+' suffix if present
      const bedroomValue = BedroomsTotal.replace('+', '');
      filters.push(`BedroomsTotal ge ${bedroomValue}`); // Use 'ge' for greater than or equal to
    }

    const filterString = filters.length > 0 
        ? `&$filter=${encodeURIComponent(filters.join(' and '))}`
        : '';
    console.log('Complete filter string:', filterString);
    console.log('Complete URL:', `${baseUrl}/Property?$skip=${skip}&$top=${limit}&$orderby=${sortBy}${filterString}`);

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

    // Add this debug logging
    console.log('Raw API Response for first item:', data.value[0]);
    console.log('Query Params:', filterString);

    // Fetch images for all properties
    const propertyImages = await Promise.all(
      properties.map(async (property: any) => {
        const mediaUrl = `${baseUrl}/Media?$filter=ResourceRecordKey eq '${property.ListingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Large'&$orderby=Order`;
        
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
      officeLogo: officeLogoMap[property.ListOfficeKey] || null,
      address: property.UnparsedAddress
    }));

    // Get total count for pagination
    const countUrl = `${baseUrl}/Property?$count=true&$top=0${filterString}`;
    const countResponse = await fetch(countUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    const countData = await countResponse.json();
    const totalCount = countData['@odata.count'];
    const totalPages = Math.ceil(totalCount / limit);

    // After all filters are added
    console.log('Final filter array:', filters);
    console.log('Final filter string:', filterString);

    // Add this debug logging before making the fetch request
    console.log('Final URL:', propertiesUrl);

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
        sortBy,
        PostalCode
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