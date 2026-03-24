'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import MovieCard from '@/components/MovieCard';
import TrailerModal from '@/components/TrailerModal';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchRandomMovie, fetchTopMovies } from '@/lib/slices/moviesSlice';
import styles from '@/styles/modules/Home.module.css';

const HeroMovie = dynamic(() => import('@/components/HeroMovie'), {
  ssr: false,
  loading: () => <div className={styles.heroSkeleton}></div>,
});

export default function Home() {
  const dispatch = useAppDispatch();
  const { randomMovie, topMovies, isLoading, error } = useAppSelector((state) => state.movies);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchRandomMovie());
    dispatch(fetchTopMovies());
  }, [dispatch]);

  const handleRefreshRandomMovie = useCallback(() => dispatch(fetchRandomMovie()), [dispatch]);
  const handleWatchTrailer = useCallback(() => randomMovie?.trailerYoutubeId && setTrailerOpen(true), [randomMovie?.trailerYoutubeId]);

  if (error && !randomMovie && topMovies.length === 0) {
    return (
      <div className={styles.errorPageContainer}>
        <Container>
          <div className={styles.emptyState}>
            <img src="/icons/alert-circle.svg" className={styles.emptyIcon} alt="Ошибка" />
            <h2 className={styles.emptyTitle}>Ошибка загрузки данных</h2>
            <p className={styles.emptyText}>{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Попробовать снова
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      <section className={styles.heroSection}>
        <Container>
          {isLoading && !randomMovie ? (
            <div className={styles.heroSkeleton}></div>
          ) : randomMovie ? (
            <HeroMovie
              movie={randomMovie}
              onRefresh={handleRefreshRandomMovie}
              isLoading={isLoading}
              onWatchTrailer={handleWatchTrailer}
            />
          ) : null}
        </Container>
      </section>

      <section className={styles.topMoviesSection}>
        <Container>
          <h2 className={styles.title}>Топ 10 фильмов</h2>

          {isLoading && topMovies.length === 0 ? (
            <div className={styles.skeletonGrid}>
              {[...Array(10)].map((_, index) => (
                <div key={index} className={styles.skeletonItem}>
                  <div className={styles.skeletonPoster}></div>
                  <div className={styles.skeletonLine}></div>
                  <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}></div>
                </div>
              ))}
            </div>
          ) : topMovies.length > 0 ? (
            <div className={styles.grid}>
              {topMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} showRank rank={index + 1} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <img src="/icons/alert-circle.svg" className={styles.emptyIcon} alt="Нет фильмов" />
              <h3 className={styles.emptyTitle}>Не удалось загрузить фильмы</h3>
              <p className={styles.emptyText}>Попробуйте обновить страницу или зайти позже</p>
              <button onClick={() => dispatch(fetchTopMovies())} className={styles.retryButton}>
                Попробовать снова
              </button>
            </div>
          )}
        </Container>
      </section>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        youtubeId={randomMovie?.trailerYoutubeId || ''}
        title={randomMovie?.title}
      />
    </>
  );
}