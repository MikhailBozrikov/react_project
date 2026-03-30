'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';
import Icon from './ui/Icon';
import { formatDuration } from '@/utils/formatters';
import { Movie } from '@/api/types';
import styles from '@/styles/modules/SearchResultCard.module.css';

interface SearchResultCardProps {
  movie: Movie;
  onClick?: () => void;
}

function SearchResultCard({ movie, onClick }: SearchResultCardProps) {
  const rating = movie.tmdRating ?? 0;
  const year = movie.releaseYear;
  const genre = movie.genres?.[0] || 'Драма';
  const duration = formatDuration(movie.runtime);

  const ratingColor = useMemo(() => {
    if (rating >= 8) return '#A59400';
    if (rating >= 7) return '#308E21';
    if (rating >= 5) return '#777777';
    return '#C82020';
  }, [rating]);

  return (
    <Link href={`/movie/${movie.id}`} className={styles.card} onClick={onClick}>
      {movie.posterUrl ? (
        <img src={movie.posterUrl} alt={movie.title} className={styles.poster} loading="lazy" />
      ) : (
        <div className={styles.posterFallback}>🎬</div>
      )}
      <div className={styles.info}>
        <div className={styles.metadata}>
          <div className={styles.ratingBadge} style={{ backgroundColor: ratingColor }}>
            <Icon name="star" className={styles.ratingStar} />
            <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
          </div>
          <span className={styles.year}>{year}</span>
          <span className={styles.genre}>{genre}</span>
          <span className={styles.duration}>{duration}</span>
        </div>
        <div className={styles.title}>{movie.title}</div>
      </div>
    </Link>
  );
}

export default memo(SearchResultCard);