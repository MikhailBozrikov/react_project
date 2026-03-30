// src/app/account/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logoutUser } from '@/lib/slices/authSlice';
import { fetchFavorites } from '@/lib/slices/favoritesSlice';
import { persistor } from '@/lib/store';
import AccountTabs from '@/components/account/AccountTabs';
import FavoritesTab from '@/components/account/FavoritesTab';
import ProfileTab from '@/components/account/ProfileTab';
import Container from '@/components/ui/Container';
import styles from '@/styles/modules/Account.module.css';

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { items: favoriteMovies, isLoading: favLoading } = useAppSelector((state) => state.favorites);

  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    document.body.classList.add('account-page');
    return () => {
      document.body.classList.remove('account-page');
    };
  }, []);

  useEffect(() => {
    setRehydrated(persistor.getState().bootstrapped);
    const unsubscribe = persistor.subscribe(() => {
      setRehydrated(persistor.getState().bootstrapped);
    });
    return unsubscribe;
  }, []);

  const tab = searchParams.get('tab') || 'favorites';

  useEffect(() => {
    if (rehydrated && !isAuthenticated && !authLoading) {
      router.push('/');
    }
  }, [rehydrated, isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    router.push('/');
  }, [dispatch, router]);

  if (!rehydrated || authLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Container>
          <div className={styles.loader}>Загрузка...</div>
        </Container>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <section className={styles.accountSection}>
        <Container className={styles.accountContainer}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>Мой аккаунт</h1>
            <AccountTabs currentTab={tab} />
          </div>
        </Container>
      </section>

      <section className={styles.tabSection}>
        <Container className={styles.contentContainer}>
          <div className={styles.tabContent}>
            {tab === 'favorites' ? (
              <FavoritesTab favorites={favoriteMovies} isLoading={favLoading} />
            ) : (
              <ProfileTab user={user} onLogout={handleLogout} />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}