import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';
import axios from 'axios';

// Define interface for MLS listing data
interface MLSListing {
  ListingId?: string;
  id?: string;
  StreetAddress?: string;
  ListPrice?: number;
  BedroomsTotal?: number;
  BathroomsTotal?: number;
  LivingArea?: number;
}

export async function GET() {  // Removed unused 'request' parameter
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Get user's listings from the database
    const userListings = await prisma.listing.findMany({
      where: {
        userId: user.sub as string,
      },
      include: {
        images: true,
      },
    });

    // Initialize RESO API configuration for additional MLS listings
    const resoApiKey = process.env.RESO_API_KEY;
    const resoApiUrl = process.env.RESO_API_URL;

    let allListings = [...userListings]; // Start with user's listings

    // If RESO API credentials are configured, fetch additional MLS listings
    if (resoApiKey && resoApiUrl) {
      try {
        const mlsResponse = await axios.get(`${resoApiUrl}/odata/Property`, {
          headers: {
            'Authorization': `Bearer ${resoApiKey}`,
            'Accept': 'application/json',
          },
          params: {
            '$top': 100
          }
        });

        // Transform and add MLS listings to the results
        const mlsListings = mlsResponse.data.value.map((listing: MLSListing) => ({
          id: listing.ListingId || listing.id,
          address: listing.StreetAddress || '',
          price: listing.ListPrice || 0,
          bedrooms: listing.BedroomsTotal || 0,
          bathrooms: listing.BathroomsTotal || 0,
          squareFootage: listing.LivingArea || 0,
          isMLSListing: true // Flag to identify MLS listings
        }));

        allListings = [...userListings, ...mlsListings];
      } catch (mlsError) {
        console.error('Error fetching MLS listings:', mlsError);
        // Continue with just user listings if MLS fetch fails
      }
    }

    return new Response(JSON.stringify(allListings), {
      headers: { "content-type": "application/json" },
    });

  } catch (error) {
    console.error('Error fetching listings:', error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch listings" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}