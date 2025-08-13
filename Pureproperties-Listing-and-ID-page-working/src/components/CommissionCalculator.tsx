'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type Province = {
  name: string;
  calculateCommission: (price: number) => number;
};

const provinces: Province[] = [
  {
    name: 'Ontario',
    calculateCommission: (price) => price * 0.05
  },
  {
    name: 'British Columbia',
    calculateCommission: (price) => {
      const firstTier = Math.min(price, 100000) * 0.07;
      const remainder = Math.max(0, price - 100000) * 0.025;
      return firstTier + remainder;
    }
  },
  {
    name: 'Alberta',
    calculateCommission: (price) => {
      const firstTier = Math.min(price, 100000) * 0.07;
      const remainder = Math.max(0, price - 100000) * 0.03;
      return firstTier + remainder;
    }
  },
  {
    name: 'Saskatchewan',
    calculateCommission: (price) => price * 0.08
  },
  {
    name: 'Manitoba',
    calculateCommission: (price) => price * 0.05
  },
  {
    name: 'Quebec',
    calculateCommission: (price) => price * 0.05
  },
  {
    name: 'Nova Scotia',
    calculateCommission: (price) => price * 0.06
  },
  {
    name: 'New Brunswick',
    calculateCommission: (price) => price * 0.05
  },
  {
    name: 'Newfoundland and Labrador',
    calculateCommission: (price) => price * 0.05
  },
  {
    name: 'Prince Edward Island',
    calculateCommission: (price) => price * 0.05
  }
];

export default function CommissionCalculator() {
  const [price, setPrice] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<Province>(provinces[0]);
  const [isCalculated, setIsCalculated] = useState(false);

  const handlePriceChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setPrice(numericValue);
    setIsCalculated(false);
  };

  const calculateSavings = () => {
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice)) {
      setIsCalculated(true);
    }
  };

  const commission = isCalculated ? selectedProvince.calculateCommission(parseFloat(price)) : 0;
  const formattedPrice = new Intl.NumberFormat('en-CA', { 
    style: 'currency', 
    currency: 'CAD',
    maximumFractionDigits: 0
  }).format(parseFloat(price) || 0);

  const formattedCommission = new Intl.NumberFormat('en-CA', { 
    style: 'currency', 
    currency: 'CAD',
    maximumFractionDigits: 0
  }).format(commission);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
        How Much Will You Save On Your Sale?
      </h2>

      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Savings Calculator</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              value={selectedProvince.name}
              onChange={(e) => setSelectedProvince(provinces.find(p => p.name === e.target.value) || provinces[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {provinces.map((province) => (
                <option key={province.name} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <motion.div 
          className="text-center"
          animate={{ scale: isCalculated ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={calculateSavings}
            className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Calculate Savings
          </button>
          {isCalculated && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Potential Commission Saved</p>
              <p className="text-2xl font-bold text-blue-600">{formattedCommission}</p>
            </div>
          )}
        </motion.div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Calculations are based on standard commission rates for each province
      </p>
    </div>
  );
}