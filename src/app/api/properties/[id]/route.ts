import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.PROPTX_IDX_TOKEN) {
      throw new Error('API Token not configured');
    }

    const baseUrl = 'https://query.ampre.ca/odata';

    // Fetch property details
    const propertyUrl = `${baseUrl}/Property?$filter=ListingKey eq '${params.id}'`;
    
    // Fetch rooms data using the correct endpoint
    const roomsUrl = `${baseUrl}/PropertyRooms?$filter=ListingKey eq '${params.id}'`;
    
    // Fetch media
    const mediaUrl = `${baseUrl}/Media?$filter=ResourceRecordKey eq '${params.id}' and ResourceName eq 'Property'`;

    // Fetch all data in parallel
    const [propertyResponse, roomsResponse, mediaResponse] = await Promise.all([
      fetch(propertyUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
          'Accept': 'application/json'
        }
      }),
      fetch(roomsUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
          'Accept': 'application/json'
        }
      }),
      fetch(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
          'Accept': 'application/json'
        }
      })
    ]);

    const [propertyData, roomsData, mediaData] = await Promise.all([
      propertyResponse.json(),
      roomsResponse.json(),
      mediaResponse.json()
    ]);

    const property = propertyData.value?.[0];

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Combine all the data
    const completeProperty = {
      ...property,
      rooms: roomsData.value || [],
      media: mediaData.value || []
    };

    return NextResponse.json(completeProperty);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property details' },
      { status: 500 }
    );
  }
} 