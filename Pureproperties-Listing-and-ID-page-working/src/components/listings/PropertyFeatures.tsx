export function PropertyFeatures({ property }: { property: any }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Features</h2>

      {/* Interior Features */}
      {property.InteriorFeatures && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Interior Features</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {property.InteriorFeatures.map((feature: string) => (
              <li key={feature} className="flex items-center">
                <span className="text-primary mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exterior Features */}
      {property.ExteriorFeatures && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Exterior Features</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {property.ExteriorFeatures.map((feature: string) => (
              <li key={feature} className="flex items-center">
                <span className="text-primary mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Community Features */}
      {property.CommunityFeatures && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Community Features</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {property.CommunityFeatures.map((feature: string) => (
              <li key={feature} className="flex items-center">
                <span className="text-primary mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Features */}
      {property.PropertyFeatures && (
        <div>
          <h3 className="font-semibold mb-2">Additional Features</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {property.PropertyFeatures.map((feature: string) => (
              <li key={feature} className="flex items-center">
                <span className="text-primary mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
} 