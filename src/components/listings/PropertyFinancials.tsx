import { formatPrice } from '@/lib/utils';

export function PropertyFinancials({ property }: { property: any }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Financial Details</h2>

      <dl className="space-y-4">
        {/* List Price */}
        <div>
          <dt className="text-gray-600">List Price</dt>
          <dd className="text-2xl font-bold text-primary">
            {formatPrice(property.ListPrice)}
          </dd>
        </div>

        {/* Taxes */}
        {property.TaxAnnualAmount && (
          <div>
            <dt className="text-gray-600">Annual Property Taxes</dt>
            <dd className="font-semibold">
              {formatPrice(property.TaxAnnualAmount)}
              {property.TaxYear && <span className="text-sm text-gray-500 ml-1">({property.TaxYear})</span>}
            </dd>
          </div>
        )}

        {/* Association Fees */}
        {property.AssociationFee && (
          <div>
            <dt className="text-gray-600">
              Association Fee
              {property.AssociationFeeFrequency && ` (${property.AssociationFeeFrequency})`}
            </dt>
            <dd className="font-semibold">
              {formatPrice(property.AssociationFee)}
            </dd>
            {property.AssociationFeeIncludes && (
              <dd className="text-sm text-gray-600 mt-1">
                Includes: {property.AssociationFeeIncludes.join(', ')}
              </dd>
            )}
          </div>
        )}

        {/* Additional Monthly Fees */}
        {property.AdditionalMonthlyFee > 0 && (
          <div>
            <dt className="text-gray-600">
              Additional Monthly Fee
              {property.AdditionalMonthlyFeeFrequency && ` (${property.AdditionalMonthlyFeeFrequency})`}
            </dt>
            <dd className="font-semibold">
              {formatPrice(property.AdditionalMonthlyFee)}
            </dd>
          </div>
        )}

        {/* Assessment Information */}
        {property.TaxAssessedValue && (
          <div>
            <dt className="text-gray-600">Assessment Value</dt>
            <dd className="font-semibold">
              {formatPrice(property.TaxAssessedValue)}
              {property.AssessmentYear && (
                <span className="text-sm text-gray-500 ml-1">({property.AssessmentYear})</span>
              )}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
} 