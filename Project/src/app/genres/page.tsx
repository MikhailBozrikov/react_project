// src/app/genres/page.tsx
'use client';

import { useEffect, useState } from 'react';
import GenreCard from '@/components/GenreCard';
import Container from '@/components/ui/Container';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchGenres } from '@/lib/slices/moviesSlice';
import { moviesApi } from '@/api/movies';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import styles from '@/styles/modules/Genres.module.css';

export default function GenresPage() {
  const dispatch = useAppDispatch();
  const { genres, isLoading, error } = useAppSelector((state) => state.movies);
  const [posterMap, setPosterMap] = useState<Record<string, string>>({});
  const [loadingPosters, setLoadingPosters] = useState(false);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genres.length === 0) return;

    const fetchPosters = async () => {
      setLoadingPosters(true);
      const promises = genres.map(async (genre) => {
        try {
          const movies = await moviesApi.getMovies({ genre: genre.name, count: 1 });
          if (movies.length > 0 && movies[0].posterUrl) {
            return { genreId: genre.id, posterUrl: movies[0].posterUrl };
          }
        } catch (err) {
          console.error(`Ошибка загрузки постера для жанра ${genre.name}`, err);
        }
        return { genreId: genre.id, posterUrl: '' };
      });

      const results = await Promise.all(promises);
      const newPosterMap: Record<string, string> = {};
      results.forEach(({ genreId, posterUrl }) => {
        if (posterUrl) newPosterMap[genreId] = posterUrl;
      });
      setPosterMap(newPosterMap);
      setLoadingPosters(false);
    };

    fetchPosters();
  }, [genres]);

  if (isLoading && genres.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <Container>
          <div className={styles.loader}>
            <div className={styles.loaderTitle}></div>
            <div className={styles.loaderGrid}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.loaderCard}></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Container>
          <div className={styles.errorBox}>
            <Icon name="alert-circle" className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>Ошибка загрузки жанров</h2>
            <p className={styles.errorMessage}>{error}</p>
            <Button onClick={() => dispatch(fetchGenres())} variant="primary">
              Попробовать снова
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <section className={styles.genresSection}>
      <Container>
        <h1 className={styles.pageTitle}>Жанры фильмов</h1>

        {loadingPosters && (
          <div className={styles.loadingPosters}>
            Загрузка изображений...
          </div>
        )}

        <div className={styles.genresGrid}>
          {genres.map((genre) => (
            <GenreCard
              key={genre.id}
              id={genre.id}
              name={genre.name}
              posterUrl={posterMap[genre.id]}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}