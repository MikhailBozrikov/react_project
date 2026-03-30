import { axiosInstance } from './axiosInstance';
import { Movie } from './types';

export const moviesApi = {
  getMovies: async (params?: {
    count?: number;
    page?: number;
    title?: string;
    genre?: string;
  }): Promise<Movie[]> => {
    const { data } = await axiosInstance.get<Movie[]>('/movie', { params });
    return data;
  },

  getMovieById: async (movieId: number): Promise<Movie> => {
    const { data } = await axiosInstance.get<Movie>(`/movie/${movieId}`);
    return data;
  },

  getRandomMovie: async (): Promise<Movie> => {
    const { data } = await axiosInstance.get<Movie>('/movie/random');
    return data;
  },

  getGenres: async (): Promise<string[]> => {
    const { data } = await axiosInstance.get<string[]>('/movie/genres');
    return data;
  },
};