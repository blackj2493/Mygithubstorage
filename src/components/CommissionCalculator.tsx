'use client';

import { useState } from 'react';

export default function CommissionCalculator() {
  const [price, setPrice] = useState(1050000);
  const maxPrice = 2000000;

  const calculateSavings = (price: number) => {
    // 5% of total sale price
    return Math.round(price * 0.05);
  };

  const savings = calculateSavings(price);

  // Calculate the left position percentage for the price bubble
  const sliderPosition = (price / maxPrice) * 100;

  return (
    <div className="max-w-[1920px] mx-auto">
      <h2 className="text-5xl font-bold text-center mb-16">
        How Much Will You Save On Your Sale?
      </h2>
      
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Price Marker */}
        <div className="relative mb-8">
          <div 
            className="absolute transform -translate-y-full"
            style={{ left: `${sliderPosition}%`, transform: `translateX(-50%) translateY(-100%)` }}
          >
            <div className="bg-white shadow-md rounded-lg p-4 text-center whitespace-nowrap">
              <p className="text-gray-800 text-lg font-medium">Price of your property</p>
              <p className="text-blue-600 text-4xl font-bold">${price.toLocaleString()}</p>
            </div>
            <div className="w-4 h-4 bg-white transform rotate-45 absolute left-1/2 -bottom-2 -translate-x-1/2 shadow-md"></div>
          </div>
        </div>

        {/* Slider Track */}
        <div className="mb-20 mt-24 relative">
          {/* Blue Track (Left Side) */}
          <div 
            className="absolute h-3 bg-blue-600 rounded-l-full"
            style={{ width: `${sliderPosition}%`, left: 0, top: '50%', transform: 'translateY(-50%)' }}
          ></div>
          
          {/* Gray Track (Right Side) */}
          <div 
            className="absolute h-3 bg-gray-200 rounded-r-full"
            style={{ width: `${100 - sliderPosition}%`, right: 0, top: '50%', transform: 'translateY(-50%)' }}
          ></div>

          {/* Slider Thumb */}
          <div 
            className="absolute w-8 h-8 bg-blue-600 rounded-full shadow-md"
            style={{ left: `${sliderPosition}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
          ></div>

          <input
            type="range"
            min="0"
            max={maxPrice}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-3 appearance-none bg-transparent cursor-pointer relative z-10 opacity-0"
          />
        </div>

        {/* Savings Display */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-semibold text-gray-800 mb-3">You could save*</h3>
          <p className="text-blue-600 text-6xl font-bold mb-3">${savings.toLocaleString()}</p>
          <p className="text-base text-gray-500">*Compared to an average commission of 5%, including applicable taxes.</p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-4 px-10 rounded-lg transition-colors">
            Start saving!
          </button>
        </div>
      </div>
    </div>
  );
}