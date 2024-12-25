import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { PropertyType, PropertySubType, BedroomsTotal, City } = body;

    // Calculate date 60 days ago
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const formattedDate = sixtyDaysAgo.toISOString();

    // Construct DLA API query with correct field names
    const query = `PropertyType eq '${PropertyType}' and PropertySubType eq '${PropertySubType}' and BedroomsTotal eq ${BedroomsTotal} and StandardStatus ne 'Active' and PurchaseContractDate gt ${formattedDate}`;
    
    // Make request to DLA API
    const response = await fetch('https://query.ampre.ca/odata/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_DLA_TOKEN}`,
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from DLA API');
    }

    const data = await response.json();

    // Format and filter the properties with correct field names
    const properties = data.value
      .filter((prop: any) => prop.City?.toLowerCase() === City?.toLowerCase())
      .map((prop: any) => ({
        ListPrice: prop.ListPrice,
        Address: `${prop.StreetNumber} ${prop.StreetName}`,
        City: prop.City,
        PurchaseContractDate: prop.PurchaseContractDate,
        BedroomsTotal: prop.BedroomsTotal,
        PropertyType: prop.PropertyType,
        PropertySubType: prop.PropertySubType
      }));

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error in similar properties API:', error);
    return NextResponse.json({ error: 'Failed to fetch similar properties' }, { status: 500 });
  }
} 