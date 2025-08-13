interface Room {
  RoomType: string;
  RoomLevel: string;
  RoomDimensions?: string;
  RoomFeatures?: string[];
  RoomDescription?: string;
}

export function PropertyRooms({ property }: { property: any }) {
  const rooms = property.PropertyRooms || [];

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Room Details</h2>

      {/* Room Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <dt className="text-gray-600">Total Rooms</dt>
          <dd className="font-semibold">{property.RoomsTotal || 'N/A'}</dd>
        </div>
        <div>
          <dt className="text-gray-600">Above Grade</dt>
          <dd className="font-semibold">{property.RoomsAboveGrade || 'N/A'}</dd>
        </div>
        <div>
          <dt className="text-gray-600">Below Grade</dt>
          <dd className="font-semibold">{property.RoomsBelowGrade || 'N/A'}</dd>
        </div>
      </div>

      {/* Room List */}
      <div className="space-y-6">
        {rooms.map((room: Room, index: number) => (
          <div key={index} className="border-b pb-4 last:border-0">
            <h3 className="font-semibold mb-2">
              {room.RoomType} - {room.RoomLevel}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {room.RoomDimensions && (
                <div>
                  <dt className="text-gray-600">Dimensions</dt>
                  <dd>{room.RoomDimensions}</dd>
                </div>
              )}
              {room.RoomFeatures && room.RoomFeatures.length > 0 && (
                <div>
                  <dt className="text-gray-600">Features</dt>
                  <dd>{room.RoomFeatures.join(', ')}</dd>
                </div>
              )}
              {room.RoomDescription && (
                <div className="col-span-2">
                  <dt className="text-gray-600">Description</dt>
                  <dd>{room.RoomDescription}</dd>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 