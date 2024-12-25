export function PropertyUtilities({ property }: { property: any }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Utilities & Amenities</h2>

      {/* Utilities */}
      {property.Utilities && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Available Utilities</h3>
          <ul className="grid grid-cols-2 gap-2">
            {property.Utilities.map((utility: string) => (
              <li key={utility} className="flex items-center">
                <span className="text-primary mr-2">•</span>
                {utility}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Building Amenities */}
      {property.AssociationAmenities && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Building Amenities</h3>
          <ul className="grid grid-cols-2 gap-2">
            {property.AssociationAmenities.map((amenity: string) => (
              <li key={amenity} className="flex items-center">
                <span className="text-primary mr-2">•</span>
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Features */}
      <div className="grid grid-cols-2 gap-4">
        {/* Utility Availability */}
        {property.ElectricYNA && (
          <div>
            <dt className="text-gray-600">Electricity</dt>
            <dd>{property.ElectricYNA}</dd>
          </div>
        )}
        {property.GasYNA && (
          <div>
            <dt className="text-gray-600">Gas</dt>
            <dd>{property.GasYNA}</dd>
          </div>
        )}
        {property.WaterYNA && (
          <div>
            <dt className="text-gray-600">Water</dt>
            <dd>{property.WaterYNA}</dd>
          </div>
        )}
        {property.SewerYNA && (
          <div>
            <dt className="text-gray-600">Sewer</dt>
            <dd>{property.SewerYNA}</dd>
          </div>
        )}

        {/* Special Features */}
        {property.CentralVacuumYN && (
          <div>
            <dt className="text-gray-600">Central Vacuum</dt>
            <dd>Yes</dd>
          </div>
        )}
        {property.ElevatorYN && (
          <div>
            <dt className="text-gray-600">Elevator</dt>
            <dd>Yes</dd>
          </div>
        )}
        {property.HandicappedEquippedYN && (
          <div>
            <dt className="text-gray-600">Handicapped Equipped</dt>
            <dd>Yes</dd>
          </div>
        )}
      </div>
    </section>
  );
} 