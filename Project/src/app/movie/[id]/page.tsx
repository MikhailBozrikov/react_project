'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchMovieById } from '@/lib/slices/moviesSlice';
import Button from '@/components/ui/Button';
import HeroMovie from '@/components/HeroMovie';
import Icon from '@/components/ui/Icon';
import Container from '@/components/ui/Container';
import styles from '@/styles/modules/MoviePage.module.css';

const TrailerModal = dynamic(() => import('@/components/TrailerModal'), { ssr: false });

export default function MoviePage() {
  const params = useParams();
  const movieId = Number(params.id);
  const dispatch = useAppDispatch();
  const { currentMovie, isLoading, error } = useAppSelector((state) => state.movies);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const infoGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (movieId && !isNaN(movieId)) {
      dispatch(fetchMovieById(movieId));
    }
  }, [dispatch, movieId]);

  const updateDashWidths = useCallback(() => {
    if (!currentMovie || !infoGridRef.current) return;
    const rows = infoGridRef.current.querySelectorAll(`.${styles.infoRow}`);
    rows.forEach((row) => {
      const label = row.querySelector(`.${styles.infoLabel}`);
      const dash = row.querySelector(`.${styles.infoDash}`);
      const value = row.querySelector(`.${styles.infoValue}`);
      if (label && dash && value) {
        const labelWidth = label.getBoundingClientRect().width;
        const leftStr = getComputedStyle(value).left;
        const leftPos = parseFloat(leftStr) || 238;
        const dashWidth = leftPos - labelWidth - 8;
        (dash as HTMLElement).style.width = dashWidth > 0 ? `${dashWidth}px` : '0px';
      }
    });
  }, [currentMovie]);

  useEffect(() => {
    updateDashWidths();
    window.addEventListener('resize', updateDashWidths);
    return () => window.removeEventListener('resize', updateDashWidths);
  }, [updateDashWidths]);

  const handleWatchTrailer = useCallback(() => {
    if (currentMovie?.trailerYouTubeId?.trim()) setIsTrailerOpen(true);
  }, [currentMovie?.trailerYouTubeId]);

  const formatCurrency = useCallback((value?: string | number | null): string => {
    if (!value) return 'нет данных';
    const strValue = String(value).replace(/[^\d.-]/g, '');
    const num = parseFloat(strValue);
    if (isNaN(num)) return String(value);
    const parts = num.toFixed(0).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.') + ' руб.';
  }, []);

  const renderInfoRow = useCallback((label: string, value?: string | number | null) => {
    let displayValue = value?.toString() || 'нет данных';
    if (label === 'Бюджет' || label === 'Выручка') {
      displayValue = formatCurrency(value);
    }
    return (
      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>{label}</span>
        <span className={styles.infoDash} />
        <span className={styles.infoValue}>{displayValue}</span>
      </div>
    );
  }, [formatCurrency]);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Container>
          <div className={styles.loader}>
            <div className={styles.loaderTitle}></div>
            <div className={styles.loaderFlex}>
              <div className={styles.loaderPoster}></div>
              <div className={styles.loaderContent}>
                <div className={styles.loaderLineLarge}></div>
                <div className={styles.loaderLine}></div>
                <div className={`${styles.loaderLine} ${styles.loaderLineMedium}`}></div>
                <div className={`${styles.loaderLine} ${styles.loaderLineSmall}`}></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !currentMovie) {
    return (
      <div className={styles.errorContainer}>
        <Container>
          <div className={styles.errorCard}>
            <Icon name="alert-circle" className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>Ошибка загрузки фильма</h2>
            <p className={styles.errorMessage}>{error || 'Фильм не найден'}</p>
            <Button onClick={() => window.history.back()} variant="primary">
              Вернуться назад
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const movie = currentMovie;

  return (
    <>
      <section className={styles.movieHeroSection}>
        <Container>
          <HeroMovie
            movie={movie}
            onWatchTrailer={handleWatchTrailer}
            showRefresh={false}
            showMovieLink={false}
            favoriteVariant="full"
            fixedWidthTrailer={true}
          />
        </Container>
      </section>

      <section className={styles.aboutSection}>
        <Container>
          <h2 className={styles.aboutTitle}>О фильме</h2>
          <div className={styles.infoGrid} ref={infoGridRef}>
            {renderInfoRow('Язык оригинала', movie.languages?.[0] || movie.language)}
            {renderInfoRow('Бюджет', movie.budget)}
            {renderInfoRow('Выручка', movie.revenue)}
            {renderInfoRow('Режиссёр', movie.director)}
            {renderInfoRow('Продакшен', movie.production)}
            {renderInfoRow('Награды', movie.awardsSummary)}
          </div>
        </Container>
      </section>

      {movie.trailerYouTubeId && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          youtubeId={movie.trailerYouTubeId}
          title={movie.title}
        />
      )}
    </>
  );
}