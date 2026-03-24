import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addFavorite, removeFavorite } from '@/lib/slices/favoritesSlice';
import { Movie } from '@/api/types';

export const useFavorite = (movie: Movie) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const favoriteMovies = useAppSelector((state) => state.favorites.items);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isFavorite = favoriteMovies.some((fav) => fav.id === movie.id);

  const toggleFavorite = useCallback(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (isFavorite) {
      dispatch(removeFavorite(movie.id));
    } else {
      dispatch(addFavorite(movie));
    }
  }, [isAuthenticated, isFavorite, dispatch, movie]);

  return { isFavorite, toggleFavorite, isAuthModalOpen, setIsAuthModalOpen };
};