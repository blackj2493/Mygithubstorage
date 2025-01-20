import { NextResponse } from 'next/server';
import {
  fetchComparables,
  calculateMedianPrice,
  calculateConfidenceScore
} from './utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      CityRegion,
      BedroomsAboveGrade,
      PropertyType,
      CoveredSpaces,
      PostalCode,
      ListingType
    } = body.propertyData;

    // Get comparable properties
    const comparables = await fetchComparables({
      cityRegion: CityRegion,
      propertyType: PropertyType,
      bedrooms: BedroomsAboveGrade,
      coveredSpaces: CoveredSpaces,
      listingType: ListingType,
      postalCode: PostalCode
    });

    // Calculate median price from comparables
    const basePrice = calculateMedianPrice(comparables);
    console.log('Debug - Base Price:', basePrice);
    console.log('Debug - Number of comparables:', comparables.length);
    console.log('Debug - Sample of comparable prices:', comparables.slice(0, 5).map(c => c.ClosePrice || c.ListPrice));

    return NextResponse.json({
      estimatedPrice: Math.max(0, basePrice),
      confidence: calculateConfidenceScore(comparables.length),
      comparablesCount: comparables.length,
      basePrice
    });

  } catch (error) {
    console.error('PricePerfect AI Error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate price estimate' },
      { status: 500 }
    );
  }
} 