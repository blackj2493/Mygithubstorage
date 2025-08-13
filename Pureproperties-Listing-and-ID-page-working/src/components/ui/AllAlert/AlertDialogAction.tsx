import React, { ReactNode } from 'react';

interface AlertDialogActionProps {
  children: ReactNode;
}

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ children }) => {
  return <div className="mt-5 sm:mt-6">{children}</div>;
};
export default AlertDialogAction;