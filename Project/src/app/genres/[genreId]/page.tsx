// src/app/genres/[genreId]/page.tsx
'use client';

import { useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import Container from '@/components/ui/Container';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchMoviesByGenre } from '@/lib/slices/moviesSlice';
import Icon from '@/components/ui/Icon';
import styles from '@/styles/modules/GenreMovies.module.css';

export default function GenrePage() {
  const params = useParams();
  const genreId = params.genreId as string;

  const dispatch = useAppDispatch();
  const { moviesByGenre, isLoading, error, genres } = useAppSelector((state) => state.movies);

  const genreData = moviesByGenre[genreId] || { movies: [], page: 0, hasMore: true };
  const { movies, page, hasMore } = genreData;

  const genre = genres.find((g) => g.id === genreId);
  const genreName = genre?.name || genreId;

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMoviesByGenre({ genreId, genreName, page: 1, count: 15 }));
    }
  }, [dispatch, genreId, genreName, movies.length]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(fetchMoviesByGenre({ genreId, genreName, page: page + 1, count: 15 }));
    }
  }, [dispatch, isLoading, hasMore, genreId, genreName, page]);

  if (error && movies.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <Container>
          <div className={styles.errorCard}>
            <Icon name="alert-circle" className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>Ошибка загрузки фильмов</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button
              onClick={() => dispatch(fetchMoviesByGenre({ genreId, genreName, page: 1, count: 15 }))}
              className={styles.loadMoreButton}
            >
              Попробовать снова
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <section className={styles.genreMoviesSection}>
      <Container>
        <div className={styles.header}>
          <Link href="/genres" className={styles.backLink}>
            <Icon name="arrow-left" className={styles.backIcon} />
            <h1 className={styles.genreTitle}>{genreName}</h1>
          </Link>
        </div>

        {movies.length > 0 ? (
          <>
            <div className={styles.moviesGrid}>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} hideDetails />
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className={styles.loadMoreButton}
                >
                  {isLoading ? 'Загрузка...' : 'Показать ещё'}
                </button>
              </div>
            )}
          </>
        ) : !isLoading ? (
          <div className={styles.emptyState}>
            <Icon name="alert-circle" className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>В этом жанре пока нет фильмов</h3>
          </div>
        ) : null}

        {isLoading && movies.length === 0 && (
          <div className={styles.skeletonGrid}>
            {[...Array(15)].map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}