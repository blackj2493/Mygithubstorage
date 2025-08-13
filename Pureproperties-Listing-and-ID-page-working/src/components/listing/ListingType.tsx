// src/components/listing/ListingType.tsx
import { motion } from 'framer-motion';

interface ListingTypeProps {
  listingType: 'SALE' | 'RENT' | null;
  onTypeSelect: (type: 'SALE' | 'RENT') => void;
}

export const ListingType: React.FC<ListingTypeProps> = ({ 
  listingType, 
  onTypeSelect 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Let's Get Started: Is this a Sale or a Rental?
      </h2>
      
      <div className="grid grid-cols-2 gap-6">
        <PropertyTypeCard
          type="SALE"
          icon="🏠"
          title="For Sale"
          description="List my property for sale"
          isSelected={listingType === 'SALE'}
          onClick={() => onTypeSelect('SALE')}
        />
        
        <PropertyTypeCard
          type="RENT"
          icon="🔑"
          title="For Rent"
          description="List my property for rent"
          isSelected={listingType === 'RENT'}
          onClick={() => onTypeSelect('RENT')}
        />
      </div>
    </motion.div>
  );
};

interface PropertyTypeCardProps {
  type: 'SALE' | 'RENT';
  icon: string;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const PropertyTypeCard: React.FC<PropertyTypeCardProps> = ({
  icon,
  title,
  description,
  isSelected,
  onClick
}) => (
  <button
    onClick={onClick}
    className={`p-8 rounded-lg border-2 transition-all ${
      isSelected
        ? 'border-blue-600 bg-blue-50'
        : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'
    }`}
  >
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <div className="text-xl font-medium">{title}</div>
      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  </button>
);

export default ListingType;