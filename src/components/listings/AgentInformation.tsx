export function AgentInformation({ property }: { property: any }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Contact Information</h2>

      {/* Listing Agent */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Listing Agent</h3>
        <dl className="space-y-2">
          {property.ListAgentFullName && (
            <div>
              <dt className="text-gray-600">Agent</dt>
              <dd className="font-semibold">{property.ListAgentFullName}</dd>
            </div>
          )}
          {property.ListAgentOfficePhone && (
            <div>
              <dt className="text-gray-600">Phone</dt>
              <dd>
                <a 
                  href={`tel:${property.ListAgentOfficePhone}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {property.ListAgentOfficePhone}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Co-Listing Agent (if exists) */}
      {property.CoListAgentFullName && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Co-Listing Agent</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-gray-600">Agent</dt>
              <dd className="font-semibold">{property.CoListAgentFullName}</dd>
            </div>
            {property.CoListOfficePhone && (
              <div>
                <dt className="text-gray-600">Phone</dt>
                <dd>
                  <a 
                    href={`tel:${property.CoListOfficePhone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {property.CoListOfficePhone}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Office Information */}
      <div>
        <h3 className="font-semibold mb-2">Listing Office</h3>
        <dl className="space-y-2">
          {property.ListOfficeName && (
            <div>
              <dt className="text-gray-600">Office</dt>
              <dd className="font-semibold">{property.ListOfficeName}</dd>
            </div>
          )}
          {property.AssociationName && (
            <div>
              <dt className="text-gray-600">Association</dt>
              <dd>{property.AssociationName}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Showing Instructions */}
      {(property.ShowingRequirements || property.ShowingAppointments) && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Showing Information</h3>
          {property.ShowingRequirements && (
            <div className="mb-2">
              <dt className="text-gray-600">Requirements</dt>
              <dd>{Array.isArray(property.ShowingRequirements) 
                ? property.ShowingRequirements.join(', ') 
                : property.ShowingRequirements}</dd>
            </div>
          )}
          {property.ShowingAppointments && (
            <div>
              <dt className="text-gray-600">Appointments</dt>
              <dd>{property.ShowingAppointments}</dd>
            </div>
          )}
        </div>
      )}
    </section>
  );
} 