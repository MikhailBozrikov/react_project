'use client';

import Link from 'next/link';
import { useMemo, memo } from 'react';
import Icon from './ui/Icon';
import FavoriteButton from './ui/FavoriteButton';
import styles from '@/styles/modules/HeroMovie.module.css';

interface HeroMovieProps {
  movie: any;
  onRefresh?: () => void;
  isLoading?: boolean;
  onWatchTrailer?: () => void;
  showRefresh?: boolean;
  showMovieLink?: boolean;
  favoriteVariant?: 'icon' | 'full';
  fixedWidthTrailer?: boolean; // новый проп
}

function HeroMovie({
  movie,
  onRefresh,
  isLoading,
  onWatchTrailer,
  showRefresh = true,
  showMovieLink = true,
  favoriteVariant = 'icon',
  fixedWidthTrailer = false,
}: HeroMovieProps) {
  if (!movie) return null;

  const hasTrailer = movie.trailerYouTubeId?.trim() !== '';

  const rating = movie.tmdbRating ?? 0;
  const year = movie.releaseYear;
  const genre = movie.genres?.[0] || 'Драма';
  const duration = movie.runtime ? `${Math.floor(movie.runtime / 60)} ч ${movie.runtime % 60} мин` : '—';

  const ratingColor = useMemo(() => {
    if (rating >= 8) return '#A59400';
    if (rating >= 7) return '#308E21';
    if (rating >= 5) return '#777777';
    return '#C82020';
  }, [rating]);

  return (
    <div className={styles.flexRowReverse}>
      <div className={styles.content}>
        <div className={styles.metadata}>
          <div className={styles.ratingBadge} style={{ backgroundColor: ratingColor }}>
            <Icon name="star" className={styles.ratingStar} />
            <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
          </div>
          <span className={styles.metadataItem}>{year}</span>
          <span className={styles.metadataItemLight}>{genre}</span>
          <span className={styles.metadataItemLight}>{duration}</span>
        </div>

        <h1 className={styles.title}>{movie.title || movie.originalTitle}</h1>

        {movie.plot && (
          <p className={styles.plot}>
            {movie.plot.length > 300 ? `${movie.plot.substring(0, 300)}...` : movie.plot}
          </p>
        )}

        <div className={styles.buttons}>
          <button
            onClick={onWatchTrailer}
            disabled={!hasTrailer}
            className={`${styles.trailerButton} ${fixedWidthTrailer ? styles.trailerButtonFixed : ''}`}
          >
            Трейлер
          </button>

          <div className={styles.actionsGroup}>
            {showMovieLink && (
              <Link href={`/movie/${movie.id}`} className={styles.movieButton}>
                О фильме
              </Link>
            )}
            <FavoriteButton movie={movie} variant={favoriteVariant} />
            {showRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className={styles.refreshButton}
              >
                <Icon name="refresh-cw" className={`${styles.refreshIcon} ${isLoading ? styles.spin : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.posterWrapper}>
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className={styles.posterImage} />
        ) : (
          <div className={styles.posterFallback}>
            <div>
              <div className={styles.posterFallbackIcon}></div>
              <p>Нет постера</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(HeroMovie);