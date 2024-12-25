export function PropertyInfo({ property }: { property: any }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Property Information</h2>
      
      {/* Key Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <dt className="text-gray-600">Bedrooms</dt>
          <dd className="text-lg font-semibold">{property.BedroomsTotal}</dd>
        </div>
        <div>
          <dt className="text-gray-600">Bathrooms</dt>
          <dd className="text-lg font-semibold">{property.BathroomsTotalInteger}</dd>
        </div>
        <div>
          <dt className="text-gray-600">Total Area</dt>
          <dd className="text-lg font-semibold">
            {property.BuildingAreaTotal} {property.BuildingAreaUnits}
          </dd>
        </div>
        <div>
          <dt className="text-gray-600">Property Type</dt>
          <dd className="text-lg font-semibold">{property.PropertyType}</dd>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Building Details */}
        <div>
          <h3 className="font-semibold mb-2">Building Details</h3>
          <dl className="space-y-1">
            {property.ApproximateAge && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Age</dt>
                <dd>{property.ApproximateAge}</dd>
              </div>
            )}
            {property.ArchitecturalStyle && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Style</dt>
                <dd>{property.ArchitecturalStyle}</dd>
              </div>
            )}
            {property.BasementYN && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Basement</dt>
                <dd>{property.Basement?.join(', ')}</dd>
              </div>
            )}
            {property.HeatingYN && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Heating</dt>
                <dd>{property.HeatType}</dd>
              </div>
            )}
            {property.CoolingYN && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Cooling</dt>
                <dd>{property.Cooling?.join(', ')}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Parking & Exterior */}
        <div>
          <h3 className="font-semibold mb-2">Parking & Exterior</h3>
          <dl className="space-y-1">
            {property.ParkingTotal && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Parking Spaces</dt>
                <dd>{property.ParkingTotal}</dd>
              </div>
            )}
            {property.GarageType && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Garage Type</dt>
                <dd>{property.GarageType}</dd>
              </div>
            )}
            {property.LotFeatures && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Lot Features</dt>
                <dd>{property.LotFeatures.join(', ')}</dd>
              </div>
            )}
            {(property.LotWidth || property.LotDepth) && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Lot Size</dt>
                <dd>{property.LotWidth} x {property.LotDepth}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
} 