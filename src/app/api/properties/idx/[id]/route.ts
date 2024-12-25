import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.PROPTX_IDX_TOKEN) {
      throw new Error('PROPTX_IDX_TOKEN is not configured');
    }

    const baseUrl = 'https://query.ampre.ca/odata';

    // Debug log
    console.log('Received ID:', params.id);

    // If id is 'all', fetch all properties
    if (params.id === 'all') {
      const response = await fetch(
        `${baseUrl}/Property?$top=50&$expand=Media`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
            'Accept': 'application/json',
          },
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error (all properties):', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    // Validate that we have an ID
    if (!params.id) {
      console.error('No ID provided');
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Log the URL we're about to fetch
    const url = `${baseUrl}/Property('${params.id}')?$expand=Media`;
    console.log('Fetching URL:', url);

    // Single property fetch
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error (single property):', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        error: errorText
      });
      throw new Error(`Failed to fetch property: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched property data:', data);
    
    return NextResponse.json({
      property: {
        ...data,
        BedroomsTotal: data.BedroomsTotal || null,
        BathroomsTotalInteger: data.BathroomsTotalInteger || null,
        BuildingAreaTotal: data.BuildingAreaTotal || null,
        PropertyType: data.PropertyType || null,
        Media: data.Media || [],
        PropertyFeatures: data.PropertyFeatures || [],
        InteriorFeatures: data.InteriorFeatures || [],
        ExteriorFeatures: data.ExteriorFeatures || [],
        CommunityFeatures: data.CommunityFeatures || [],
        ConstructionMaterials: data.ConstructionMaterials || [],
        HeatType: data.HeatType || [],
        Cooling: data.Cooling || [],
      }
    });

  } catch (error) {
    console.error('Detailed Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 