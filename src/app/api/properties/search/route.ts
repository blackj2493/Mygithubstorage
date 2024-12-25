import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const baseUrl = 'https://query.ampre.ca/odata';
    
    // Search for cities
    const cityUrl = `${baseUrl}/Property?$filter=contains(City, '${query}')&$select=City&$orderby=City&$top=5&$count=true`;
    
    // Search for addresses
    const addressUrl = `${baseUrl}/Property?$filter=contains(UnparsedAddress, '${query}')&$select=UnparsedAddress,City&$orderby=UnparsedAddress&$top=5`;
    
    // Search for MLS numbers
    const mlsUrl = `${baseUrl}/Property?$filter=contains(ListingKey, '${query}')&$select=ListingKey,UnparsedAddress&$top=5`;

    const [cityResponse, addressResponse, mlsResponse] = await Promise.all([
      fetch(cityUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
          'Accept': 'application/json',
        },
        cache: 'no-store'
      }),
      fetch(addressUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
          'Accept': 'application/json',
        },
        cache: 'no-store'
      }),
      fetch(mlsUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
          'Accept': 'application/json',
        },
        cache: 'no-store'
      })
    ]);

    const [cityData, addressData, mlsData] = await Promise.all([
      cityResponse.json(),
      addressResponse.json(),
      mlsResponse.json()
    ]);

    const queryLower = query.toLowerCase();

    // Case-insensitive filtering and deduplication
    const cities = [...new Set(cityData.value.map((item: any) => item.City))]
      .filter(Boolean)
      .filter(city => city.toLowerCase().includes(queryLower))
      .map(city => ({
        type: 'city',
        value: city,
        display: `${city} (City)`
      }));

    const addresses = addressData.value
      .filter((item: any) => item.UnparsedAddress)
      .filter(item => item.UnparsedAddress.toLowerCase().includes(queryLower))
      .map((item: any) => ({
        type: 'address',
        value: item.UnparsedAddress,
        display: `${item.UnparsedAddress}${item.City ? `, ${item.City}` : ''}`
      }));

    const mlsNumbers = mlsData.value
      .filter((item: any) => item.ListingKey)
      .filter(item => item.ListingKey.toLowerCase().includes(queryLower))
      .map((item: any) => ({
        type: 'mls',
        value: item.ListingKey,
        display: `MLS® ${item.ListingKey}${item.UnparsedAddress ? ` - ${item.UnparsedAddress}` : ''}`
      }));

    // Sort results with case-insensitive exact matches first
    const sortedSuggestions = [
      ...cities.sort((a, b) => {
        const aStartsWith = a.value.toLowerCase().startsWith(queryLower);
        const bStartsWith = b.value.toLowerCase().startsWith(queryLower);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.value.localeCompare(b.value);
      }),
      ...addresses,
      ...mlsNumbers
    ].slice(0, 10);

    return NextResponse.json({
      suggestions: sortedSuggestions
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
} 