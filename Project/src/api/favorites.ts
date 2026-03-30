import { axiosInstance } from './axiosInstance';
import { Movie, User } from './types';

export const favoritesApi = {
  getFavorites: async (): Promise<Movie[]> => {
    const { data } = await axiosInstance.get<Movie[]>('/favorites');
    return data;
  },

  addFavorite: async (movieId: number | string): Promise<User> => {
    const formData = new URLSearchParams();
    formData.append('id', String(movieId));
    const { data } = await axiosInstance.post<User>('/favorites', formData);
    return data;
  },

  removeFavorite: async (movieId: number | string): Promise<User> => {
    const { data } = await axiosInstance.delete<User>(`/favorites/${movieId}`);
    return data;
  },
};