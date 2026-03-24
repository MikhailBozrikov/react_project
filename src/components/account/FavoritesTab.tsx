// src/components/account/FavoritesTab.tsx
'use client';

import { memo } from 'react';
import { Movie } from '@/api/types';
import FavoriteMovieCard from '@/components/FavoriteMovieCard';
import Icon from '@/components/ui/Icon';
import styles from '@/styles/modules/FavoritesTab.module.css';

interface FavoritesTabProps {
  favorites: Movie[];
  isLoading: boolean;
}

function FavoritesTab({ favorites, isLoading }: FavoritesTabProps) {
  if (isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.skeletonGrid}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Icon name="heart" className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>Нет избранных фильмов</h3>
        <p className={styles.emptyText}>Добавляйте фильмы в избранное, нажимая на сердечко</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {favorites.map((movie) => (
        <FavoriteMovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default memo(FavoritesTab);