// src/components/ui/FavoriteButton.tsx
'use client';

import React, { memo } from 'react';
import Icon from './Icon';
import { useFavorite } from '@/hooks/useFavorite';
import AuthModal from '@/components/AuthModal';
import { Movie } from '@/api/types';
import styles from '@/styles/modules/FavoriteButton.module.css';

interface FavoriteButtonProps {
  movie: Movie;
  className?: string;
}

function FavoriteButton({ movie, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isAuthModalOpen, setIsAuthModalOpen } = useFavorite(movie);

  return (
    <>
      <button 
        onClick={toggleFavorite} 
        className={`${styles.iconButton} ${styles.notFavorite} ${className}`}
      >
        <Icon 
          name={isFavorite ? 'heart-elite' : 'heart'} 
          className={styles.iconHeart} 
          alt={isFavorite ? 'В избранном' : 'В избранное'} 
        />
      </button>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

export default memo(FavoriteButton);