'use client';

import { usePathname } from 'next/navigation';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className={`${pathname === '/' ? '' : 'pt-20'}`}>
      {children}
    </div>
  );
} 