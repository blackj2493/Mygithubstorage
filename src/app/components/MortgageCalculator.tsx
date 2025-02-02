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
  annualPropertyTax?: number;
}

export default function MortgageCalculator({ 
  propertyPrice = 0, 
  annualPropertyTax = 0 
}: MortgageCalculatorProps) {
  const [calculatorType, setCalculatorType] = useState<'mortgage' | 'investment'>('mortgage');
  const [inputs, setInputs] = useState({
    homePrice: Math.round(propertyPrice),
    downPaymentPercent: 20,
    downPaymentAmount: Math.round(propertyPrice * 0.2),
    term: 25,
    rate: 6.0,
    propertyTax: Math.round(annualPropertyTax ? annualPropertyTax / 12 : 0),
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
    const p = Math.round(inputs.homePrice - inputs.downPaymentAmount);
    const r = inputs.rate / 100 / 12;
    const n = inputs.term * 12;
    
    const mortgagePayment = Math.round(p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const monthlyPayment = Math.round(mortgagePayment + inputs.propertyTax + inputs.maintenance);
    const cashFlow = Math.round(inputs.rentalIncome - monthlyPayment);
    const breakEvenPercent = Math.round((inputs.downPaymentAmount / inputs.homePrice) * 100);

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

  const handleDownPaymentAmountChange = (value: number) => {
    const roundedValue = Math.round(value);
    setInputs(prev => ({
      ...prev,
      downPaymentAmount: roundedValue,
      downPaymentPercent: Math.round((roundedValue / prev.homePrice) * 100)
    }));
  };

  const handleDownPaymentPercentChange = (value: number) => {
    const roundedPercent = Math.round(value);
    setInputs(prev => ({
      ...prev,
      downPaymentPercent: roundedPercent,
      downPaymentAmount: Math.round(prev.homePrice * (roundedPercent / 100))
    }));
  };

  return (
    <Card className="mt-8">
      {/* Calculator Type Selection */}
      <div className="bg-blue-600 p-3 rounded-t-lg">
        <div className="bg-blue-700/30 p-1 rounded-md flex">
          <button 
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              calculatorType === 'mortgage' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-white/90 hover:text-white hover:bg-blue-500/30'
            }`}
            onClick={() => setCalculatorType('mortgage')}
          >
            Mortgage Calculator
          </button>
          <button 
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              calculatorType === 'investment' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-white/90 hover:text-white hover:bg-blue-500/30'
            }`}
            onClick={() => setCalculatorType('investment')}
          >
            Investment Calculator
          </button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  className="w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={inputs.homePrice}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    homePrice: Number(e.target.value),
                    downPaymentAmount: Math.round(Number(e.target.value) * (prev.downPaymentPercent / 100))
                  }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-3 py-2 border rounded-md"
                    value={inputs.downPaymentAmount}
                    onChange={(e) => handleDownPaymentAmountChange(Number(e.target.value))}
                  />
                </div>
                <div className="relative w-32">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md pr-8"
                    value={inputs.downPaymentPercent}
                    onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Term (Years)</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md pr-8"
                    value={inputs.rate}
                    onChange={(e) => setInputs(prev => ({ ...prev, rate: Number(e.target.value) }))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Payments</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mortgage Payment:</span>
                <span className="text-lg font-medium text-blue-600">${Math.round(calculations.mortgagePayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Property Tax:</span>
                <span className="text-lg font-medium">${Math.round(inputs.propertyTax)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Monthly Payment:</span>
                  <span className="text-xl font-bold text-blue-600">${Math.round(calculations.monthlyPayment)}</span>
                </div>
                {calculatorType === 'investment' && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-gray-900">Monthly Cash Flow:</span>
                    <span className={`text-xl font-bold ${calculations.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.round(calculations.cashFlow)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {calculatorType === 'investment' && (
              <div className="mt-6 space-y-4">
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
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-6 italic">
          * This calculator is for educational purposes only. Please consult with financial professionals for accurate mortgage information.
        </div>
      </CardContent>
    </Card>
  );
} 