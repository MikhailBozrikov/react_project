// src/components/SearchDropdown.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Movie } from '@/api/types';
import SearchResultCard from './SearchResultCard';
import Icon from './ui/Icon';
import { useAppSelector } from '@/lib/hooks';
import styles from '@/styles/modules/SearchDropdown.module.css';

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

interface SearchDropdownProps {
  results: Movie[];
  onClose: () => void;
  searchAreaRef: React.RefObject<HTMLElement>;
}

export default function SearchDropdown({ results, onClose, searchAreaRef }: SearchDropdownProps) {
  const { isLoading } = useAppSelector((state) => state.movies);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const limitedResults = results.slice(0, 5);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchAreaRef.current &&
        !searchAreaRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, searchAreaRef, isMobile]);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      {isLoading && (
        <div className={styles.loader}>
          <Icon name="loader-2" className={styles.spinner} />
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <div className={styles.emptyMessage}>
          Ничего не найдено. Попробуйте изменить запрос.
        </div>
      )}

      {limitedResults.length > 0 && (
        <div className={styles.resultsList}>
          {limitedResults.map((movie) => (
            <SearchResultCard key={movie.id} movie={movie} onClick={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}