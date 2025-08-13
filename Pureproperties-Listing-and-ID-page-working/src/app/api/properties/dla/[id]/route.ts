import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching property with ID:', params.id);
    
    const url = new URL(`https://query.ampre.ca/odata/Property('${params.id}')`);
    console.log('Request URL:', url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_DLA_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    // Transform the data to match your frontend expectations
    const transformedData = {
      id: data.ListingKey,
      ListPrice: data.ListPrice,
      MlsNumber: data.ListingKey,
      PublicRemarks: data.PublicRemarks,
      BuildingBedrooms: data.BedroomsTotal,
      BuildingBathrooms: data.BathroomsTotalInteger,
      Address: {
        AddressLine1: [
          data.StreetNumber,
          data.StreetName,
          data.StreetSuffix,
          data.StreetDirSuffix
        ].filter(Boolean).join(' '),
        City: data.City,
        Province: data.StateOrProvince,
        PostalCode: data.PostalCode,
        Latitude: parseFloat(data.Latitude) || 0,
        Longitude: parseFloat(data.Longitude) || 0
      },
      Photos: data.Media?.map((media: any, index: number) => ({
        SequenceId: index,
        Uri: media.MediaURL
      })) || []
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch property' },
      { status: 500 }
    );
  }
} 