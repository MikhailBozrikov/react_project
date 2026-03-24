'use client';

import { useState, useCallback, useRef } from 'react';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import Icon from './ui/Icon';
import styles from '@/styles/modules/TrailerModal.module.css';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
  title?: string;
}

export default function TrailerModal({ isOpen, onClose, youtubeId, title }: TrailerModalProps) {
  const [showControls, setShowControls] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const { containerId, apiStatus, playerStatus, isPlaying, toggle } = useYouTubePlayer({
    videoId: youtubeId,
    isActive: isOpen,
    onError: useCallback(() => {}, []),
  });

  const handleMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowControls(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 300);
  }, []);

  const handleFocus = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowControls(true);
  }, []);

  const handleBlur = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 300);
  }, []);

  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    if (e.detail === 1) toggle();
  }, [toggle]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  if (!isOpen) return null;

  const isReady = playerStatus === 'ready';
  const hasError = apiStatus === 'error' || playerStatus === 'error';
  const isLoading = !isReady && !hasError;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={-1}
      >
        {/* Кнопка закрытия */}
        {(showControls || isLoading) && (
          <button onClick={onClose} className={styles.closeButton} aria-label="Закрыть">
            <Icon name="x" className={styles.closeIcon} />
          </button>
        )}

        <div className={styles.trailerScreen}>
          <div
            className={`${styles.videoWrapper} ${isLoading ? styles.loading : ''}`}
            onClick={handleVideoClick}
            onContextMenu={handleContextMenu}
            tabIndex={-1}
          >
            {!hasError && <div id={containerId} className={styles.playerContainer} />}
            {isLoading && (
              <div className={styles.loader}>
                <Icon name="loader-2" className={styles.spinner} />
              </div>
            )}
            {isReady && showControls && (
              <button
                className={styles.playButton}
                onClick={(e) => { e.stopPropagation(); toggle(); }}
                aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
              >
                <Icon name={isPlaying ? 'pause' : 'play'} className={styles.playIcon} />
              </button>
            )}
            {hasError && (
              <div className={styles.errorMessage}>
                <Icon name="alert-circle" className={styles.errorIcon} />
                <p>Не удалось загрузить видео</p>
              </div>
            )}
          </div>

          {title && (
            <div className={styles.titleBar}>
              <span className={styles.titleText}>{title}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}