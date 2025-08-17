import { NextResponse } from 'next/server';

// Helper function to capitalize first letter of each word
function capitalizeFirstLetter(string: string) {
    if (!string) return string;
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
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
      console.warn('PROPTX_IDX_TOKEN not configured, returning empty results');
      return Response.json({
        properties: [],
        totalCount: 0,
        page: 1,
        limit: 10000,
        message: 'API Token not configured - showing empty results'
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');

    // Support both bounds-based and postal code-based queries
    const north = searchParams.get('north');
    const south = searchParams.get('south');
    const east = searchParams.get('east');
    const west = searchParams.get('west');
    const postalCode = searchParams.get('postalCode') || searchParams.get('PostalCode');

    // Determine query type and set appropriate limit
    const isBoundsQuery = north && south && east && west;
    const limitParam = searchParams.get('limit');
    // Default to 50 properties per page for optimal performance
    const limit = limitParam ? parseInt(limitParam) : 50;
    const skip = (page - 1) * limit;

    console.log('🔢 Limit calculation:', {
      limitParam,
      calculatedLimit: limit,
      isBoundsQuery,
      page,
      skip
    });

    console.log('Query type:', isBoundsQuery ? 'bounds-based' : 'postal-code-based');
    if (isBoundsQuery) {
      console.log('Map bounds:', { north, south, east, west });
    } else {
      console.log('Received postal code:', postalCode);
    }
    
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
    const BathroomsTotalInteger = searchParams.get('BathroomsTotalInteger');
    const basementFeatures = searchParams.get('basementFeatures');

    console.log('📋 Filter parameters received:', {
      city,
      postalCode,
      propertyType,
      transactionType,
      minPrice,
      maxPrice,
      BedroomsTotal,
      BathroomsTotalInteger
    });

    // Build filter string
    let filters = ["StandardStatus eq 'Active'"]; // Keep default active filter

    // Add geographic bounds filter if provided (for map-based queries)
    if (isBoundsQuery) {
      // Note: PropTx API doesn't support direct lat/lng filtering, so we'll fetch more broadly
      // and filter client-side. For now, we'll use a broader postal code approach.
      console.log('Bounds-based query detected - using broader search');

      // For bounds queries, we'll fetch more properties and filter client-side
      // This is a limitation of the PropTx API which doesn't support direct coordinate filtering
    } else if (postalCode) {
      // Add postal code filter if provided, with additional error checking
      try {
        const postalPrefix = postalCode.substring(0, 3).toUpperCase();
        console.log('Using postal prefix:', postalPrefix);

        if (postalPrefix && postalPrefix.length === 3) {
          filters.push(`startswith(PostalCode, '${postalPrefix}')`);
          console.log('Added postal code filter:', `startswith(PostalCode, '${postalPrefix}')`);
        }
      } catch (error) {
        console.error('Error processing postal code:', error);
        // Continue without postal code filter rather than failing completely
      }
    }

    // Handle property type filtering
    const propertyTypes = searchParams.get('PropertyTypes');

    if (propertyTypes) {
      // Handle multiple property types (Residential case)
      const types = JSON.parse(propertyTypes);
      const typeFilters = types.map((type: string) => `PropertyType eq '${type}'`);
      filters.push(`(${typeFilters.join(' or ')})`);
    } else if (propertyType) {
      // Handle property type from horizontal filter bar (comma-separated or single)
      if (propertyType.includes(',')) {
        // Multiple types (e.g., "Residential Condo & Other,Residential Freehold")
        const types = propertyType.split(',').map(t => t.trim());
        const typeFilters = types.map((type: string) => `PropertyType eq '${type}'`);
        filters.push(`(${typeFilters.join(' or ')})`);
      } else {
        // Single property type (Commercial case)
        filters.push(`PropertyType eq '${propertyType}'`);
      }
    }

    // Add PropertySubType filter if provided
    if (propertySubType) {
      try {
        let subTypes: string[];

        // Handle both single string and JSON array formats
        if (propertySubType.startsWith('[')) {
          // JSON array format
          subTypes = JSON.parse(propertySubType);
        } else {
          // Single string format
          subTypes = [propertySubType];
        }

        if (subTypes.length > 0) {
          const subTypeFilters = subTypes.map((type: string) => {
            // First decode the type to handle any URL encoding
            const decodedType = decodeURIComponent(type);
            // Use the mapping if it exists, otherwise use the original type
            const mappedType = PROPERTY_SUBTYPE_MAPPING[decodedType] || decodedType;
            // Add logging to debug the mapping
            console.log('🏠 PropertySubType mapping:', {
              original: type,
              decoded: decodedType,
              mapped: mappedType
            });
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
        filters.push(`contains(City, '${capitalizedCity}')`);
    }

    if (address) filters.push(`contains(UnparsedAddress, '${address}')`);
    if (mls) filters.push(`ListingKey eq '${mls}'`);
    if (minPrice) filters.push(`ListPrice ge ${minPrice}`);
    if (maxPrice) filters.push(`ListPrice le ${maxPrice}`);
    if (transactionType === 'For Lease') {
        console.log('🏠 Adding For Lease filter');
        filters.push("TransactionType eq 'For Lease'");
    } else if (transactionType === 'For Sale') {
        console.log('🏠 Adding For Sale filter');
        filters.push("TransactionType eq 'For Sale'");
    } else {
        console.log('🏠 No transaction type specified, defaulting to For Sale');
        filters.push("TransactionType eq 'For Sale'");
    }

    // Add bedrooms filter
    if (BedroomsTotal) {
      try {
        // Remove any '+' suffix if present
        const bedroomValue = BedroomsTotal.replace('+', '');
        
        // Convert to number for comparison
        const numBedrooms = parseInt(bedroomValue, 10);
        
        if (!isNaN(numBedrooms)) {
          // If it had a '+', use greater than or equal to
          if (BedroomsTotal.includes('+')) {
            filters.push(`BedroomsTotal ge ${numBedrooms}`);
          } else {
            // Exact match if no '+'
            filters.push(`BedroomsTotal eq ${numBedrooms}`);
          }
        }
        
        console.log('Added bedroom filter:', filters[filters.length - 1]);
      } catch (error) {
        console.error('Error parsing bedrooms:', error);
      }
    }

    // Add bathrooms filter
    if (BathroomsTotalInteger) {
      try {
        // Remove any '+' suffix if present
        const bathroomValue = BathroomsTotalInteger.replace('+', '');
        
        // Convert to number for comparison
        const numBathrooms = parseInt(bathroomValue, 10);
        
        if (!isNaN(numBathrooms)) {
          // If it had a '+', use greater than or equal to
          if (BathroomsTotalInteger.includes('+')) {
            filters.push(`BathroomsTotalInteger ge ${numBathrooms}`);
          } else {
            // Exact match if no '+'
            filters.push(`BathroomsTotalInteger eq ${numBathrooms}`);
          }
        }
        
        console.log('Added bathroom filter:', filters[filters.length - 1]);
      } catch (error) {
        console.error('Error parsing bathrooms:', error);
      }
    }

    // Add basement filter
    if (basementFeatures) {
      try {
        const features = JSON.parse(basementFeatures);
        if (features.length > 0) {
          // Add debug logging
          console.log('Parsed basement features:', features);
          
          // For multiple features, use OR without extra parentheses for single conditions
          const basementFilters = features.map((feature: string) => 
            `Basement eq '${feature}'`
          );
          
          // Only use parentheses if we have multiple conditions to group
          const basementFilter = basementFilters.length > 1 
            ? `(${basementFilters.join(' or ')})`
            : basementFilters[0];
            
          console.log('Basement filter:', basementFilter);
          filters.push(basementFilter);
        }
      } catch (error) {
        console.error('Error parsing basement features:', error);
        console.error('Raw basementFeatures value:', basementFeatures);
      }
    }

    // Add debug logging
    console.log('All filters before joining:', filters);
    console.log('Complete filter string:', filters.join(' and '));

    const filterString = filters.length > 0 
        ? `&$filter=${encodeURIComponent(filters.join(' and '))}`
        : '';

    // Log the final URL
    console.log('Final URL:', `${baseUrl}/Property?$skip=${skip}&$top=${limit}&$orderby=${sortBy}${filterString}`);

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
      // Get the error details from the response
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      console.error('API Status:', response.status);
      console.error('Request URL:', propertiesUrl);
      throw new Error(`Failed to fetch properties: ${response.status}\nDetails: ${errorText}`);
    }

    const data = await response.json();
    const properties = data.value;

    // Add this debug logging
    console.log('Raw API Response for first item:', data.value[0]);
    console.log('Query Params:', filterString);

    // Fetch images for properties with better error handling and concurrency control
    const propertyImages = await Promise.allSettled(
      properties.map(async (property: any) => {
        const mediaUrl = `${baseUrl}/Media?$filter=ResourceRecordKey eq '${property.ListingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Large'&$orderby=Order&$top=3`;

        try {
          const mediaResponse = await fetch(mediaUrl, {
            headers: {
              'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
              'Accept': 'application/json',
            },
            cache: 'no-store',
            signal: AbortSignal.timeout(5000) // 5 second timeout per request
          });

          if (!mediaResponse.ok) return [];

          const mediaData = await mediaResponse.json();
          return mediaData.value || [];
        } catch (error) {
          console.warn(`Failed to fetch media for property ${property.ListingKey}:`, error instanceof Error ? error.message : 'Unknown error');
          return [];
        }
      })
    ).then(results =>
      results.map(result => result.status === 'fulfilled' ? result.value : [])
    );

    // Skip office logo fetching for large datasets to improve performance
    const shouldFetchLogos = properties.length <= 100; // Only fetch logos for smaller datasets
    let officeLogos: Array<{ officeKey: string; logo: any } | null> = [];

    if (shouldFetchLogos) {
      const uniqueOfficeKeys = [...new Set(properties.map((p: any) => p.ListOfficeKey).filter(Boolean))] as string[];
      officeLogos = await Promise.allSettled(
        uniqueOfficeKeys.map(async (officeKey: string) => {
          const logoUrl = `${baseUrl}/Media?$filter=ResourceRecordKey eq '${officeKey}' and ResourceName eq 'Office' and ImageSizeDescription eq 'Large'&$top=1`;

          try {
            const logoResponse = await fetch(logoUrl, {
              headers: {
                'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
                'Accept': 'application/json',
              },
              cache: 'no-store',
              signal: AbortSignal.timeout(1500) // Reduced to 1.5 second timeout
            });

            if (!logoResponse.ok) return null;

            const logoData = await logoResponse.json();
            const logo = logoData.value?.[0];
            return logo ? { officeKey, logo } : null;
          } catch (error) {
            // Silently fail for timeouts to avoid console spam
            return null;
          }
        })
      ).then(results =>
        results.map(result => result.status === 'fulfilled' ? result.value : null).filter(Boolean)
      );
    }

    // Create a map of office keys to logos
    const officeLogoMap = Object.fromEntries(
      officeLogos.filter((item): item is NonNullable<typeof item> => item !== null).map(item => [item.officeKey, item.logo])
    );

    // Combine properties with their images and office logos
    const propertiesWithImages = properties.map((property: any, index: number) => {
      const images = propertyImages[index]?.map((image: any) => ({
        MediaURL: image.MediaURL,
        Order: image.Order
      })) || [];

      return {
        ...property,
        images,
        officeLogo: officeLogoMap[property.ListOfficeKey] || null,
        address: property.UnparsedAddress
      };
    });

    // Deduplicate properties by ListingKey to prevent React key conflicts
    const uniqueProperties = propertiesWithImages.reduce((acc: any[], current: any) => {
      const existingIndex = acc.findIndex(item => item.ListingKey === current.ListingKey);
      if (existingIndex === -1) {
        acc.push(current);
      } else {
        // Keep the most recent one (assuming later in array is more recent)
        acc[existingIndex] = current;
      }
      return acc;
    }, []);

    console.log(`🔍 Original properties: ${propertiesWithImages.length}, After deduplication: ${uniqueProperties.length}`);

    // Start background image downloading with smart freshness checking
    // Process all properties (not just first 20) but with intelligent skipping
    const propertiesToDownload = uniqueProperties.filter((p: any) => p.images && p.images.length > 0);

    if (propertiesToDownload.length > 0) {
      // Start background download (don't wait for completion)
      fetch(`http://localhost:3001/api/images/batch-process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: propertiesToDownload.map((p: any) => ({
            ListingKey: p.ListingKey,
            images: p.images,
            MediaChangeTimestamp: p.MediaChangeTimestamp // Include timestamp for freshness checking
          }))
        })
      }).catch(error => {
        console.warn('Failed to start background image processing:', error);
      });
    }

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
      listings: uniqueProperties,
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
        postalCode
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    // Add more detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: 'Failed to fetch listings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}