import { createAsyncThunk } from '@reduxjs/toolkit';
import { moviesApi } from '@/api/movies';
import { Movie } from '@/api/types';

export const fetchTopMovies = createAsyncThunk(
  'movies/fetchTopMovies',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await moviesApi.getMovies({ count: 50 });
      const sorted = [...movies].sort((a, b) => (b.tdbRating || 0) - (a.tdbRating || 0));
      return sorted.slice(0, 10);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки топа');
    }
  }
);

export const fetchRandomMovie = createAsyncThunk(
  'movies/fetchRandomMovie',
  async (_, { rejectWithValue }) => {
    try {
      const movie = await moviesApi.getRandomMovie();
      return movie;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки случайного фильма');
    }
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchMoviesByGenre',
  async (
    { genreId, genreName, page = 1, count = 10 }: 
    { genreId: string; genreName: string; page?: number; count?: number },
    { rejectWithValue }
  ) => {
    try {
      const movies = await moviesApi.getMovies({ genre: genreName, page, count });
      return { genreId, movies, page, count };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки фильмов по жанру');
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async (query: string, { rejectWithValue }) => {
    try {
      const movies = await moviesApi.getMovies({ title: query });
      return movies;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка поиска');
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id: number, { rejectWithValue }) => {
    try {
      const movie = await moviesApi.getMovieById(id);
      return movie;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки фильма');
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const genreStrings = await moviesApi.getGenres();
      const colors = [
        'from-blue-500 to-cyan-500',
        'from-yellow-500 to-orange-500',
        'from-gray-700 to-gray-900',
        'from-green-500 to-emerald-500',
        'from-amber-700 to-yellow-700',
        'from-red-600 to-pink-600',
        'from-purple-600 to-indigo-600',
        'from-teal-500 to-cyan-500',
      ];
      return genreStrings.map((name, index) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        count: 0,
        color: colors[index % colors.length],
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки жанров');
    }
  }
);