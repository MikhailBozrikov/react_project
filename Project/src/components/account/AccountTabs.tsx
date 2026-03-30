'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import styles from '@/styles/modules/AccountTabs.module.css';

interface AccountTabsProps {
  currentTab: string;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export default function AccountTabs({ currentTab }: AccountTabsProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const tabs = [
    {
      id: 'favorites',
      label: isMobile ? 'Избранное' : 'Избранные фильмы',
      icon: 'heart',
    },
    {
      id: 'profile',
      label: isMobile ? 'Настройки' : 'Настройка аккаунта',
      icon: 'user',
    },
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`/account?tab=${tab.id}`}
          className={styles.tabLink}
        >
          <span
            className={`${styles.tab} ${
              currentTab === tab.id ? styles.active : styles.inactive
            }`}
          >
            <Icon name={tab.icon} className={styles.tabIcon} />
            <span>{tab.label}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}