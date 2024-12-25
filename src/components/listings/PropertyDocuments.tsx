export function PropertyDocuments({ property }: { property: any }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Documents & Certificates</h2>

      <div className="space-y-4">
        {/* Virtual Tour */}
        {property.VirtualTourURLUnbranded && (
          <div>
            <h3 className="font-semibold mb-2">Virtual Tour</h3>
            <a 
              href={property.VirtualTourURLUnbranded}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              View Virtual Tour
            </a>
          </div>
        )}

        {/* Feature Sheet */}
        {property.AlternateFeatureSheet && (
          <div>
            <h3 className="font-semibold mb-2">Feature Sheet</h3>
            <a 
              href={property.AlternateFeatureSheet}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Download Feature Sheet
            </a>
          </div>
        )}

        {/* Certificates & Documents */}
        <div className="grid grid-cols-2 gap-4">
          {property.StatusCertificateYN && (
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Status Certificate Available
            </div>
          )}
          {property.SurveyAvailableYN && (
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Survey Available
            </div>
          )}
          {property.VendorPropertyInfoStatement && (
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Seller Property Info Statement
            </div>
          )}
          {property.EnergyCertificate && (
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Energy Certificate
            </div>
          )}
        </div>

        {/* Additional URLs */}
        {property.AdditionalPicturesUrl && (
          <div>
            <h3 className="font-semibold mb-2">Additional Pictures</h3>
            <a 
              href={property.AdditionalPicturesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              View Additional Pictures
            </a>
          </div>
        )}
      </div>
    </section>
  );
} 