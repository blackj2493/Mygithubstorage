import { useState, useEffect } from 'react';
import Card from '@/components/ui/AllCard/Card';
import CardContent from '@/components/ui/AllCard/CardContent';
import CardHeader from '@/components/ui/AllCard/CardHeader';
import CardTitle from '@/components/ui/AllCard/CardTitle';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface MortgageCalculatorProps {
  propertyPrice?: number;
}

export default function MortgageCalculator({ propertyPrice = 0 }: MortgageCalculatorProps) {
  const [inputs, setInputs] = useState({
    homePrice: propertyPrice,
    downPaymentPercent: 20,
    downPaymentAmount: propertyPrice * 0.2,
    term: 25,
    rate: 6.0,
    propertyTax: 250,
    maintenance: 0,
    rentalIncome: 0,
  });

  const [calculations, setCalculations] = useState({
    mortgagePayment: 0,
    monthlyPayment: 0,
    cashFlow: 0,
    breakEvenPercent: 0,
  });

  useEffect(() => {
    // Calculate mortgage payment using the formula: P * (r(1+r)^n)/((1+r)^n-1)
    const p = inputs.homePrice - inputs.downPaymentAmount;
    const r = inputs.rate / 100 / 12;
    const n = inputs.term * 12;
    
    const mortgagePayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyPayment = mortgagePayment + inputs.propertyTax + inputs.maintenance;
    const cashFlow = inputs.rentalIncome - monthlyPayment;
    const breakEvenPercent = (inputs.downPaymentAmount / inputs.homePrice) * 100;

    setCalculations({
      mortgagePayment,
      monthlyPayment,
      cashFlow,
      breakEvenPercent,
    });
  }, [inputs]);

  const termOptions = [
    { value: 15, label: '15 years' },
    { value: 20, label: '20 years' },
    { value: 25, label: '25 years' },
    { value: 30, label: '30 years' },
  ];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Investment Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Left Column - Inputs */}
            <div>
              <label className="block text-sm font-medium mb-1">Property Price</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={inputs.homePrice}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  homePrice: Number(e.target.value),
                  downPaymentAmount: Number(e.target.value) * (prev.downPaymentPercent / 100)
                }))}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Down Payment</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  className="flex-1 px-3 py-2 border rounded-md"
                  value={inputs.downPaymentAmount}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    downPaymentAmount: Number(e.target.value),
                    downPaymentPercent: (Number(e.target.value) / prev.homePrice) * 100
                  }))}
                />
                <input
                  type="number"
                  className="w-32 px-3 py-2 border rounded-md"
                  value={inputs.downPaymentPercent}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    downPaymentPercent: Number(e.target.value),
                    downPaymentAmount: prev.homePrice * (Number(e.target.value) / 100)
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Term (Years)</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={inputs.term}
                  onChange={(e) => setInputs(prev => ({ ...prev, term: Number(e.target.value) }))}
                >
                  {termOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interest Rate</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={inputs.rate}
                  onChange={(e) => setInputs(prev => ({ ...prev, rate: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Right Column - Results & Additional Inputs */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Monthly Payments</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Mortgage Payment:</span>
                  <span className="font-medium">${calculations.mortgagePayment.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Monthly Payment:</span>
                  <span className="font-medium">${calculations.monthlyPayment.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold mt-2">
                  <span>Monthly Cash Flow:</span>
                  <span className={calculations.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${calculations.cashFlow.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Property Tax (Monthly)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={inputs.propertyTax}
                  onChange={(e) => setInputs(prev => ({ ...prev, propertyTax: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maintenance (Monthly)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={inputs.maintenance}
                  onChange={(e) => setInputs(prev => ({ ...prev, maintenance: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Rental Income</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={inputs.rentalIncome}
                  onChange={(e) => setInputs(prev => ({ ...prev, rentalIncome: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          * This calculator is for educational purposes only. Please consult with financial professionals for accurate mortgage information.
        </div>
      </CardContent>
    </Card>
  );
} 