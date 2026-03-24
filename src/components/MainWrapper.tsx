'use client';

import { usePathname } from 'next/navigation';
import styles from '@/styles/modules/MainWrapper.module.css';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAccountPage = pathname?.startsWith('/account');
  
  return (
    <main 
      className={`
        ${styles.main}
        /* больше не добавляем overflowHidden для accountPage */
      `}
    >
      {children}
    </main>
  );
}