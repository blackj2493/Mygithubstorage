import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Address {
  streetNumber: string;
  streetName: string;
  city: string;
  province: string;
  community?: string;
}

interface PropertyData {
  listingType: 'SALE' | 'RENTAL';
  selectedAddress?: Address;
  exteriorFeatures?: {
    PropertyType?: string;
    PropertySubType?: string;
    ParkingTotal?: number;
    ParkingSpaces?: number;
    CoveredSpaces?: number;
    ExteriorFeatures?: string[];
  };
  interiorFeatures?: {
    rooms?: {
      total?: number;
      BedroomsAboveGrade?: number;
      BedroomsBelowGrade?: number;
      bathrooms?: number;
    };
    basement?: {
      type?: string;
    };
    laundry?: {
      features?: string[];
    };
  };
  neighborhoodData?: {
    schools?: string[];
    transit?: string[];
    shopping?: string[];
    parks?: string[];
  };
}

function createPrompt(propertyData: PropertyData) {
  const sections: string[] = [];

  // Basic Property Information
  sections.push(`Create a compelling real estate property description for a ${propertyData.listingType === 'SALE' ? 'property for sale' : 'rental property'}`);
  
  if (propertyData.selectedAddress) {
    const address = propertyData.selectedAddress;
    sections.push(`Location: ${address.streetNumber} ${address.streetName}, ${address.city}, ${address.province}`);
    if (address.community) {
      sections.push(`Community: ${address.community}`);
    }
  }

  // Property Details Section
  const propertyDetails: string[] = [];
  if (propertyData.exteriorFeatures?.PropertyType) {
    propertyDetails.push(`Property Type: ${propertyData.exteriorFeatures.PropertyType}`);
  }
  if (propertyData.exteriorFeatures?.PropertySubType) {
    propertyDetails.push(`Property Sub-Type: ${propertyData.exteriorFeatures.PropertySubType}`);
  }
  if (propertyData.interiorFeatures?.rooms?.total) {
    propertyDetails.push(`Total Rooms: ${propertyData.interiorFeatures.rooms.total}`);
  }
  if (propertyData.interiorFeatures?.rooms?.BedroomsAboveGrade) {
    propertyDetails.push(`Bedrooms Above Grade: ${propertyData.interiorFeatures.rooms.BedroomsAboveGrade}`);
  }
  if (propertyData.interiorFeatures?.rooms?.BedroomsBelowGrade) {
    propertyDetails.push(`Bedrooms Below Grade: ${propertyData.interiorFeatures.rooms.BedroomsBelowGrade}`);
  }
  if (propertyData.interiorFeatures?.rooms?.bathrooms) {
    propertyDetails.push(`Bathrooms: ${propertyData.interiorFeatures.rooms.bathrooms}`);
  }
  if (propertyData.interiorFeatures?.basement?.type) {
    propertyDetails.push(`Basement Type: ${propertyData.interiorFeatures.basement.type}`);
  }
  
  if (propertyDetails.length > 0) {
    sections.push('Property Details:\n' + propertyDetails.join('\n'));
  }

  // Exterior Features Section
  const exteriorDetails: string[] = [];
  if (propertyData.exteriorFeatures?.ParkingTotal || 
      propertyData.exteriorFeatures?.ParkingSpaces || 
      propertyData.exteriorFeatures?.CoveredSpaces) {
    exteriorDetails.push(`Parking: ${propertyData.exteriorFeatures.ParkingTotal || 0} spaces ` +
      `(${propertyData.exteriorFeatures.ParkingSpaces || 0} drive, ` +
      `${propertyData.exteriorFeatures.CoveredSpaces || 0} garage)`);
  }
  if (propertyData.exteriorFeatures?.ExteriorFeatures?.length > 0) {
    exteriorDetails.push(`Exterior Features: ${propertyData.exteriorFeatures.ExteriorFeatures.join(', ')}`);
  }
  
  if (exteriorDetails.length > 0) {
    sections.push('Exterior Features:\n' + exteriorDetails.join('\n'));
  }

  // Interior Features Section
  if (propertyData.interiorFeatures?.laundry?.features?.length > 0) {
    sections.push(`Interior Features:\nLaundry: ${propertyData.interiorFeatures.laundry.features.join(', ')}`);
  }

  // Neighborhood Highlights Section (limited to 1-2 items per category)
  const neighborhoodHighlights: string[] = [];
  if (propertyData.neighborhoodData?.schools?.length > 0) {
    const schools = propertyData.neighborhoodData.schools.slice(0, 2);
    neighborhoodHighlights.push(`Nearby Schools: ${schools.join(', ')}`);
  }
  if (propertyData.neighborhoodData?.transit?.length > 0) {
    const transit = propertyData.neighborhoodData.transit.slice(0, 1);
    neighborhoodHighlights.push(`Transit: ${transit.join(', ')}`);
  }
  if (propertyData.neighborhoodData?.shopping?.length > 0) {
    const shopping = propertyData.neighborhoodData.shopping.slice(0, 2);
    neighborhoodHighlights.push(`Shopping: ${shopping.join(', ')}`);
  }
  if (propertyData.neighborhoodData?.parks?.length > 0) {
    const parks = propertyData.neighborhoodData.parks.slice(0, 1);
    neighborhoodHighlights.push(`Parks: ${parks.join(', ')}`);
  }
  
  if (neighborhoodHighlights.length > 0) {
    sections.push('Neighborhood Highlights:\n' + neighborhoodHighlights.join('\n'));
  }

  sections.push('Write a professional and engaging description that highlights the property\'s features and selected neighborhood amenities. Mention only 1-2 key amenities from each category when discussing the neighborhood. Keep the tone professional and the total length under 2000 characters.');

  return sections.join('\n\n');
}

export async function POST(request: Request) {
  try {
    const propertyData = await request.json();
    const prompt = createPrompt(propertyData);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate agent writing compelling property descriptions. Keep responses under 2000 characters and maintain proper case sensitivity. When mentioning neighborhood amenities, highlight only 1-2 key features from each category to maintain conciseness and impact. Focus on the most notable or relevant amenities."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return NextResponse.json({ 
      description: completion.choices[0].message.content 
    });
    
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
} 