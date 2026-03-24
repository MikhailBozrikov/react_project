'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Movie } from '@/api/types';
import { useAppDispatch } from '@/lib/hooks';
import { removeFavorite } from '@/lib/slices/favoritesSlice';
import Icon from '@/components/ui/Icon';
import styles from '@/styles/modules/FavoriteMovieCard.module.css';

interface FavoriteMovieCardProps {
  movie: Movie;
}

export default function FavoriteMovieCard({ movie }: FavoriteMovieCardProps) {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeFavorite(movie.id));
  };

  const poster = movie.posterUrl || '';

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/movie/${movie.id}`} className={styles.link}>
        {poster ? (
          <img src={poster} alt={movie.title} className={styles.poster} loading="lazy" />
        ) : (
          <div className={styles.fallback}>
            <div>
              <div className={styles.fallbackIcon}></div>
              <p className={styles.fallbackText}>Нет постера</p>
            </div>
          </div>
        )}
      </Link>

      {isHovered && (
        <button
          onClick={handleRemove}
          className={styles.removeButton}
          aria-label="Удалить из избранного"
        >
          <Icon name="x-black" className={styles.removeIcon} />
        </button>
      )}
    </div>
  );
}