import React, { ReactNode } from 'react';

interface CardTitleProps {
  children: ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return <h3 className="text-lg font-semibold">{children}</h3>;
};
export default CardTitle;
