import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    console.log('API route hit');

    const data = await request.json();
    console.log('Received data:', JSON.stringify(data, null, 2));

    // Basic field validation
    if (!data.listingType) {
      return NextResponse.json({ error: 'Missing listing type' }, { status: 400 });
    }
    
    if (!data.addressStreet || !data.addressCity || !data.addressProvince || !data.addressPostalCode) {
      return NextResponse.json({ error: 'Missing address information' }, { status: 400 });
    }

    if (!data.propertyType) {
      return NextResponse.json({ error: 'Missing property type' }, { status: 400 });
    }

    if (!data.numberOfBedrooms || !data.numberOfBathrooms) {
      return NextResponse.json({ error: 'Missing bedroom/bathroom information' }, { status: 400 });
    }

    if (!data.price) {
      return NextResponse.json({ error: 'Missing price' }, { status: 400 });
    }

    if (!data.description) {
      return NextResponse.json({ error: 'Missing description' }, { status: 400 });
    }

    // Create the listing with proper type casting
    const listing = await prisma.property.create({
      data: {
        status: data.status,
        listingType: data.listingType,
        addressStreet: data.addressStreet,
        addressCity: data.addressCity,
        addressProvince: data.addressProvince,
        addressPostalCode: data.addressPostalCode,
        addressUnit: data.addressUnit || null,
        propertyType: data.propertyType,
        propertyStyle: data.propertyStyle || null,
        numberOfBedrooms: Number(data.numberOfBedrooms),
        numberOfBathrooms: Number(data.numberOfBathrooms),
        price: Number(data.price),
        description: data.description,
        images: data.images,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      },
    });

    console.log('Created listing:', listing);
    return NextResponse.json(listing);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create property listing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}