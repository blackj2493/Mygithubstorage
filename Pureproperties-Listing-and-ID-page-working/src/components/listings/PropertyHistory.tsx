import { formatDate, formatPrice } from '@/lib/utils';

export function PropertyHistory({ property }: { property: any }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Property History</h2>

      {/* Listing History */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Listing History</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">Listed Date</dt>
            <dd>{formatDate(property.ListingContractDate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Original Price</dt>
            <dd>{formatPrice(property.OriginalListPrice)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Days on Market</dt>
            <dd>{property.DaysOnMarket} days</dd>
          </div>
          {property.PriceChangeTimestamp && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Last Price Change</dt>
              <dd>{formatDate(property.PriceChangeTimestamp)}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Status Changes */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Status History</h3>
        <dl className="space-y-2">
          {property.StandardStatus && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Current Status</dt>
              <dd>{property.StandardStatus}</dd>
            </div>
          )}
          {property.ContractStatus && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Contract Status</dt>
              <dd>{property.ContractStatus}</dd>
            </div>
          )}
          {property.PriorMlsStatus && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Prior Status</dt>
              <dd>{property.PriorMlsStatus}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Tax History */}
      {(property.TaxYear || property.AssessmentYear) && (
        <div>
          <h3 className="font-semibold mb-2">Tax History</h3>
          <dl className="space-y-2">
            {property.TaxYear && property.TaxAnnualAmount && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Taxes ({property.TaxYear})</dt>
                <dd>{formatPrice(property.TaxAnnualAmount)}</dd>
              </div>
            )}
            {property.AssessmentYear && property.TaxAssessedValue && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Assessment ({property.AssessmentYear})</dt>
                <dd>{formatPrice(property.TaxAssessedValue)}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </section>
  );
} 