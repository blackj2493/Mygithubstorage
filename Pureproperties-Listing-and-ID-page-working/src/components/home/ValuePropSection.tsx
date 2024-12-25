// components/home/ValuePropSection.tsx
import { Home, Scale, Shield } from 'lucide-react';

export const ValuePropSection = () => (
  <div className="py-20 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Home className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Save Money</h3>
          <p className="text-gray-600">Lower fees and commission rates compared to traditional agents</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Scale className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Easy Process</h3>
          <p className="text-gray-600">Streamlined digital experience from listing to closing</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Safe & Secure</h3>
          <p className="text-gray-600">Protected transactions with verified buyers and sellers</p>
        </div>
      </div>
    </div>
  </div>
);