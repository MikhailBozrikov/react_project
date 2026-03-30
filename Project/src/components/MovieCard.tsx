'use client';

import Link from 'next/link';
import { memo } from 'react';
import styles from '@/styles/modules/MovieCard.module.css';

interface MovieCardProps {
  movie: any;
  showRank?: boolean;
  rank?: number;
  hideDetails?: boolean;
}

function MovieCard({ movie, showRank = false, rank, hideDetails = false }: MovieCardProps) {
  const poster = movie.posterUrl || '';

  const cardClasses = `
    ${styles.card}
    ${hideDetails ? styles.cardBordered : styles.cardShadow}
  `;

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className={cardClasses}>
        {showRank && rank && (
          <div className={styles.rankWrapper}>
            <div className={`${styles.rankCircle} ${rank >= 10 ? styles.doubleDigit : styles.singleDigit}`}>
              <span className={styles.rankNumber}>{rank}</span>
            </div>
          </div>
        )}

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
      </div>
    </Link>
  );
}

export default memo(MovieCard);