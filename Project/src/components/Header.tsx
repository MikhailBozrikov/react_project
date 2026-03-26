'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Icon from './ui/Icon';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { searchMovies, clearSearchResults } from '@/lib/slices/moviesSlice';
import { clearRegistrationSuccess } from '@/lib/slices/authSlice';
import styles from '@/styles/modules/Header.module.css';

const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });
const SuccessRegistrationModal = dynamic(() => import('@/components/SuccessRegistrationModal'), { ssr: false });
const SearchDropdown = dynamic(() => import('@/components/SearchDropdown'), { ssr: false });

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export default function Header() {
  const dispatch = useAppDispatch();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, registrationSuccess } = useAppSelector((state) => state.auth);
  const { searchResults } = useAppSelector((state) => state.movies);
  const [isUserIconFocused, setIsUserIconFocused] = useState(false);
  const [isClearButtonFocused, setIsClearButtonFocused] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery('(max-width: 1023px)');

  useEffect(() => {
    if (!isMobile && mobileSearchActive) {
      setMobileSearchActive(false);
    }
  }, [isMobile, mobileSearchActive]);

  useEffect(() => {
    if (registrationSuccess) {
      setShowSuccessModal(true);
      dispatch(clearRegistrationSuccess());
    }
  }, [registrationSuccess, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        dispatch(searchMovies(searchQuery));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const displayResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length === 0) return [];
    let currentPrefix = query;
    while (currentPrefix.length > 0) {
      const matches = searchResults.filter((movie) =>
        movie.title.toLowerCase().startsWith(currentPrefix)
      );
      if (matches.length > 0) return matches;
      currentPrefix = currentPrefix.slice(0, -1);
    }
    return [];
  }, [searchQuery, searchResults]);

  useEffect(() => {
    setSearchModalOpen(displayResults.length > 0);
  }, [displayResults]);

  const handleCloseSearch = useCallback(() => {
    setSearchQuery('');
    setSearchModalOpen(false);
    dispatch(clearSearchResults());
  }, [dispatch]);

  const handleMobileSearchClick = useCallback(() => {
    setMobileSearchActive(true);
  }, []);

  const handleMobileSearchClose = useCallback(() => {
    setMobileSearchActive(false);
    setSearchQuery('');
    dispatch(clearSearchResults());
  }, [dispatch]);

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.wrapper}`}>
          {!mobileSearchActive && (
            <Link href="/" className={styles.logoLink}>
              <img src="/icons/logo.svg" className={styles.logo} alt="ВК Маруся" />
            </Link>
          )}

          <div className={`${styles.headerRight} ${styles.desktopHeader}`}>
            <nav className={styles.nav}>
              <Link href="/" className={styles.navLink}>Главная</Link>
              <Link href="/genres" className={styles.navLink}>Жанры</Link>
              <div
                ref={desktopSearchRef}
                className={`${styles.searchContainer} ${
                  searchModalOpen ? styles.hasResults : ''
                }`}
                style={{ position: 'relative' }}
              >
                <Icon name="search" className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchModalOpen && (
                  <button
                    onClick={handleCloseSearch}
                    className={styles.clearButton}
                    onFocus={() => setIsClearButtonFocused(true)}
                    onBlur={() => setIsClearButtonFocused(false)}
                  >
                    <Icon
                      name={isClearButtonFocused ? 'x-focus' : 'x'}
                      className={styles.clearIcon}
                    />
                  </button>
                )}
                {searchModalOpen && (
                  <SearchDropdown
                    results={displayResults}
                    onClose={handleCloseSearch}
                    searchAreaRef={desktopSearchRef}
                  />
                )}
              </div>
            </nav>

            {isAuthenticated ? (
              <Link
                href="/account"
                className={styles.userLink}
                onFocus={() => setIsUserIconFocused(true)}
                onBlur={() => setIsUserIconFocused(false)}
              >
                <Icon
                  name={isUserIconFocused ? 'user-focus' : 'user'}
                  className={styles.userAvatar}
                />
                <span className={styles.userName}>{user?.name}</span>
              </Link>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className={styles.authButton}>
                <Icon name="user" className={styles.authIcon} />
                <span className={styles.authText}>Войти</span>
              </button>
            )}
          </div>

          <div className={`${styles.headerRight} ${styles.mobileHeader}`}>
            {!mobileSearchActive ? (
              <>
                <Link href="/genres" className={styles.mobileIconButton}>
                  <Icon name="genres" className={styles.mobileIcon} />
                </Link>
                <button onClick={handleMobileSearchClick} className={styles.mobileIconButton}>
                  <Icon name="search" className={styles.mobileIcon} />
                </button>
                {isAuthenticated ? (
                  <Link href="/account" className={styles.mobileIconButton}>
                    <Icon name="user" className={styles.mobileIcon} />
                  </Link>
                ) : (
                  <button onClick={() => setAuthModalOpen(true)} className={styles.mobileIconButton}>
                    <Icon name="user" className={styles.mobileIcon} />
                  </button>
                )}
              </>
            ) : (
              <div
                ref={mobileSearchRef}
                className={styles.mobileSearchContainer}
                style={{ position: 'relative' }}
              >
                <Icon name="search" className={styles.mobileSearchIcon} />
                <input
                  type="text"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.mobileSearchInput}
                  autoFocus
                />
                <button onClick={handleMobileSearchClose} className={styles.mobileClearButton}>
                  <Icon name="x" className={styles.mobileClearIcon} />
                </button>
                {searchModalOpen && (
                  <SearchDropdown
                    results={displayResults}
                    onClose={handleMobileSearchClose}
                    searchAreaRef={mobileSearchRef}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {authModalOpen && <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
      {showSuccessModal && (
        <SuccessRegistrationModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          onLoginClick={() => {
            setShowSuccessModal(false);
            setAuthModalOpen(true);
          }}
        />
      )}
    </>
  );
}