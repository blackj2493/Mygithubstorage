// app/api/properties/dla/route.ts
import { NextResponse } from 'next/server';

const CREA_API_URL = 'https://query.ampre.ca/odata/Property';

export async function GET(request: Request) {  // Removed params parameter
  try {
    if (!process.env.PROPTX_DLA_TOKEN) {
      return NextResponse.json({
        error: 'DLA Token not configured'
      }, { status: 500 });
    }

    // Parse search params from request URL
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const skip = (page - 1) * pageSize;

    const query = new URLSearchParams({
      '$top': pageSize.toString(),
      '$skip': skip.toString(),
      '$select': [
        // Basic Information
        'ListingKey',
        'ListPrice',
        'OriginalListPrice',
        'TransactionType',
        'PropertyType',
        'PropertySubType',

        // Location Details
        'UnparsedAddress',
        'StreetNumber',
        'StreetName',
        'StreetSuffix',
        'City',
        'StateOrProvince',
        'PostalCode',
        'CityRegion',
        'CrossStreet',
        'Latitude',
        'Longitude',

        // Property Details
        'BedroomsTotal',
        'BedroomsAboveGrade',
        'BathroomsTotalInteger',
        'RoomsTotal',
        'ApproximateAge',
        'Basement',
        'BuildingAreaTotal',
        'LotDepth',
        'LotWidth',

        // Features
        'ArchitecturalStyle',
        'Cooling',
        'HeatType',
        'HeatSource',
        'FireplacesTotal',
        'FireplaceFeatures',
        'GarageType',
        'ParkingTotal',
        'ParkingFeatures',
        'Furnished',
        'LaundryFeatures',
        'InteriorFeatures',
        'ExteriorFeatures',
        
        // Additional Information
        'PossessionDate',
        'PetsAllowed',
        'RentIncludes',
        'Inclusions',
        'PublicRemarks',
        'DaysOnMarket',
        'ConstructionMaterials',

        // For Rentals
        'PaymentFrequency',
        'CreditCheckYN',
        'DepositRequired',
        'ReferencesRequiredYN',
        
        // Virtual Tours
        'VirtualTourURLUnbranded'
      ].join(',')
    }).toString();

    const response = await fetch(`${CREA_API_URL}?${query}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PROPTX_DLA_TOKEN}`,
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        text: errorText
      });
      return NextResponse.json(
        { error: `Failed to fetch properties: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    const transformedData = {
      value: data.value.map((property: any) => ({
        id: property.ListingKey,
        basicInfo: {
          listPrice: property.ListPrice,
          originalListPrice: property.OriginalListPrice,
          transactionType: property.TransactionType,
          propertyType: property.PropertyType,
          propertySubType: property.PropertySubType,
          daysOnMarket: property.DaysOnMarket
        },
        location: {
          fullAddress: property.UnparsedAddress,
          streetNumber: property.StreetNumber,
          streetName: property.StreetName,
          streetSuffix: property.StreetSuffix,
          city: property.City,
          province: property.StateOrProvince,
          postalCode: property.PostalCode,
          neighborhood: property.CityRegion,
          crossStreet: property.CrossStreet,
          coordinates: {
            latitude: property.Latitude,
            longitude: property.Longitude
          }
        },
        details: {
          bedrooms: {
            total: property.BedroomsTotal,
            aboveGrade: property.BedroomsAboveGrade
          },
          bathrooms: property.BathroomsTotalInteger,
          totalRooms: property.RoomsTotal,
          approximateAge: property.ApproximateAge,
          basement: property.Basement,
          buildingArea: property.BuildingAreaTotal,
          lotDimensions: {
            depth: property.LotDepth,
            width: property.LotWidth
          }
        },
        features: {
          style: property.ArchitecturalStyle,
          cooling: property.Cooling,
          heating: {
            type: property.HeatType,
            source: property.HeatSource
          },
          fireplaces: {
            count: property.FireplacesTotal,
            features: property.FireplaceFeatures
          },
          parking: {
            garageType: property.GarageType,
            totalSpaces: property.ParkingTotal,
            features: property.ParkingFeatures
          },
          furnished: property.Furnished,
          laundry: property.LaundryFeatures,
          interior: property.InteriorFeatures,
          exterior: property.ExteriorFeatures,
          construction: property.ConstructionMaterials
        },
        leaseDetails: {
          possession: property.PossessionDate,
          petsAllowed: property.PetsAllowed,
          included: {
            rentIncludes: property.RentIncludes,
            inclusions: property.Inclusions
          },
          requirements: {
            creditCheck: property.CreditCheckYN,
            deposit: property.DepositRequired,
            references: property.ReferencesRequiredYN,
            paymentFrequency: property.PaymentFrequency
          }
        },
        virtualTour: property.VirtualTourURLUnbranded,
        description: property.PublicRemarks
      }))
    };

    return NextResponse.json(transformedData);

  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}