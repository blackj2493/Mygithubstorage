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
    const propertyUrl = `${baseUrl}/Property('${params.id}')`;
    const propertyResponse = await fetch(propertyUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!propertyResponse.ok) {
      throw new Error(`Failed to fetch property: ${propertyResponse.status}`);
    }

    const propertyData = await propertyResponse.json();

    // Fetch all media for the property
    const mediaUrl = `${baseUrl}/Media?$filter=ResourceRecordKey eq '${params.id}' and ResourceName eq 'Property'&$orderby=Order`;
    const mediaResponse = await fetch(mediaUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_IDX_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!mediaResponse.ok) {
      throw new Error(`Failed to fetch media: ${mediaResponse.status}`);
    }

    const mediaData = await mediaResponse.json();
    
    // Debug the media data
    console.log('Raw media data:', mediaData);
    
    // Check for duplicates in the API response
    const mediaUrls = mediaData.value.map((m: any) => m.MediaURL);
    const uniqueUrls = new Set(mediaUrls);
    console.log('Total media items:', mediaData.value.length);
    console.log('Unique URLs:', uniqueUrls.size);
    
    // Deduplicate the media array before sending it to the frontend
    const uniqueMedia = Array.from(new Set(mediaData.value.map((m: any) => m.MediaURL)))
      .map(url => mediaData.value.find((m: any) => m.MediaURL === url));

    // Update history fetch to use VOW token
    const historyUrl = `${baseUrl}/historytransactional?$filter=ResourceRecordKey eq '${params.id}' and ResourceName eq 'Property'&$orderby=ModificationTimestamp desc`;
    const historyResponse = await fetch(historyUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_VOW_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!historyResponse.ok) {
      console.warn('Failed to fetch history:', historyResponse.status);
      // Try DLA token as fallback if VOW fails
      const dlaHistoryResponse = await fetch(historyUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.PROPTX_DLA_TOKEN}`,
          'Accept': 'application/json',
        },
        cache: 'no-store'
      });

      if (!dlaHistoryResponse.ok) {
        console.warn('Failed to fetch history with DLA token:', dlaHistoryResponse.status);
      } else {
        const historyData = await dlaHistoryResponse.json();
        return NextResponse.json({
          property: {
            ...propertyData,
            media: uniqueMedia,
            listingHistory: processHistoryData(historyData),
          },
        });
      }
    }

    const historyData = await historyResponse.json();

    return NextResponse.json({
      property: {
        ...propertyData,
        media: uniqueMedia,
        listingHistory: processHistoryData(historyData),
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch property details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to process history data
function processHistoryData(historyData: any) {
  return (historyData?.value || [])
    .map((item: any) => ({
      dateStart: item.OriginalEntryTimestamp,
      dateEnd: item.ModificationTimestamp,
      price: item.PreviousValue?.includes('$') 
        ? parseFloat(item.PreviousValue.replace(/[$,]/g, ''))
        : null,
      event: item.PreviousLabel || 'Status Change',
      listingId: item.ResourceRecordKey,
    }))
    .filter((item: any) => item.price !== null);
}