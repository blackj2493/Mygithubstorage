import React, { ReactNode } from 'react';

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-blue-600 text-white px-6 py-4 rounded-t-lg font-medium ${className}`}
    >
      {children}
    </div>
  );
};
export default CardHeader;