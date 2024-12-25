import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.PROPTX_IDX_TOKEN) {
      throw new Error('API Token not configured');
    }

    const baseUrl = 'https://query.ampre.ca/odata';
    
    // Fetch both property types and cities in parallel
    const [propertyTypesResponse, municipalitiesResponse] = await Promise.all([
      // Property types query
      fetch(`${baseUrl}/Property?$select=PropertyType,PropertySubType&$orderby=PropertyType,PropertySubType`, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
          'Accept': 'application/json',
        },
        cache: 'no-store'
      }),
      // Cities query - optimized to get distinct cities in one request
      fetch(`${baseUrl}/Property?$select=City&$filter=City ne null&$orderby=City&$top=1000`, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
          'Accept': 'application/json',
        },
        cache: 'no-store'
      })
    ]);

    if (!propertyTypesResponse.ok || !municipalitiesResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    // Process responses in parallel
    const [propertyTypesData, municipalitiesData] = await Promise.all([
      propertyTypesResponse.json(),
      municipalitiesResponse.json()
    ]);

    // Process property types
    const propertyTypesMap = new Map<string, Set<string>>();
    if (propertyTypesData?.value) {
      propertyTypesData.value.forEach((item: any) => {
        if (item?.PropertyType) {
          if (!propertyTypesMap.has(item.PropertyType)) {
            propertyTypesMap.set(item.PropertyType, new Set());
          }
          if (item.PropertySubType) {
            propertyTypesMap.get(item.PropertyType)?.add(item.PropertySubType);
          }
        }
      });
    }

    // Process cities
    const citiesSet = new Set<string>(['Any']);
    if (municipalitiesData?.value) {
      municipalitiesData.value.forEach((item: any) => {
        if (item?.City && typeof item.City === 'string' && item.City.trim()) {
          citiesSet.add(item.City.trim());
        }
      });
    }

    // Convert to final format
    const propertyTypes = ['Any', ...Array.from(propertyTypesMap.keys()).sort()];
    const propertySubTypes: Record<string, string[]> = {};
    propertyTypesMap.forEach((subtypes, type) => {
      propertySubTypes[type] = ['Any', ...Array.from(subtypes).sort()];
    });

    const municipalities = Array.from(citiesSet).sort((a, b) => {
      if (a === 'Any') return -1;
      if (b === 'Any') return 1;
      return a.localeCompare(b);
    });

    console.log('Number of municipalities:', municipalities.length);
    console.log('Number of property types:', propertyTypes.length);

    return NextResponse.json({
      propertyTypes,
      propertySubTypes,
      municipalities
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch property data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 