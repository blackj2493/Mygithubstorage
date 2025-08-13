import { headers } from 'next/headers';

interface Comparable {
  ListPrice: number;
  ClosePrice: number;
  PostalCode: string;
}

interface FetchComparablesParams {
  cityRegion: string;
  propertyType: string;
  bedrooms?: number;
  CoveredSpaces?: number;
  listingType: 'SALE' | 'RENT';
  postalCode: string;
}

export async function fetchComparables({
  cityRegion,
  propertyType,
  bedrooms,
  CoveredSpaces,
  listingType,
  postalCode
}: FetchComparablesParams): Promise<Comparable[]> {
  try {
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    // Build property data filters to match similar properties endpoint
    let propertyData: Record<string, any> = {
      PropertyType: propertyType
    };

    // Add city region filter if provided
    if (cityRegion) {
      propertyData.Community = cityRegion;
    }

    // Add bedrooms filter if provided
    if (bedrooms && !isNaN(Number(bedrooms))) {
      propertyData.BedroomsAboveGrade = Number(bedrooms);
    }

    // Add covered spaces filter if provided
    if (CoveredSpaces && !isNaN(Number(CoveredSpaces))) {
      propertyData.CoveredSpaces = Number(CoveredSpaces);
    }

    // Add postal code filter if provided
    if (postalCode) {
      propertyData.PostalCode = postalCode;
    }

    // Add date range filter for sold/leased properties
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const formattedDate = sixtyDaysAgo.toISOString().split('T')[0];
    propertyData.PurchaseContractDate = formattedDate;

    console.log('Fetching comparables with filters:', propertyData);

    const response = await fetch(`${protocol}://${host}/api/properties/similar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        propertyData,
        listingType 
      })
    });

    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error('Error fetching comparables:', error);
    return [];
  }
}

export function calculateMedianPrice(comparables: any[]): number {
  if (comparables.length === 0) {
    throw new Error('No comparable properties found');
  }

  // Get valid prices (ClosePrice only)
  const validPrices = comparables
    .map(c => c.ClosePrice)
    .filter(price => price > 0)
    .sort((a, b) => a - b);

  if (validPrices.length === 0) {
    throw new Error('No valid prices found in comparable properties');
  }

  // Calculate median
  const mid = Math.floor(validPrices.length / 2);
  const medianPrice = validPrices.length % 2 === 0
    ? (validPrices[mid - 1] + validPrices[mid]) / 2
    : validPrices[mid];

  return medianPrice;
}

export function calculateConfidenceScore(comparablesCount: number): number {
  // Base confidence on number of comparables
  if (comparablesCount >= 5) return 90;
  if (comparablesCount >= 3) return 75;
  if (comparablesCount >= 1) return 50;
  return 25;
} 