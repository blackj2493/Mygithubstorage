import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.PROPTX_IDX_TOKEN) {
      throw new Error('API Token not configured');
    }

    // Query to get all available fields for Property resource
    const fieldsUrl = 'https://query.ampre.ca/odata/Field?$filter=ResourceName eq \'Property\'';

    const response = await fetch(fieldsUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch fields: ${response.status}`);
    }

    const data = await response.json();

    // Transform the fields data into a more usable format
    const fields = data.value.map((field: any) => ({
      name: field.FieldName,
      type: field.DataType,
      maxLength: field.MaximumLength,
      precision: field.Precision,
      required: field.Required,
      searchable: field.Searchable,
      description: field.LongName
    }));

    return NextResponse.json({ fields });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch field metadata' },
      { status: 500 }
    );
  }
} 