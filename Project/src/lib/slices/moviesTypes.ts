import { Movie } from '@/api/types';

export interface GenreItem {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface MoviesState {
  topMovies: Movie[];
  randomMovie: Movie | null;
  moviesByGenre: Record<string, { movies: Movie[]; page: number; hasMore: boolean }>;
  searchResults: Movie[];
  currentMovie: Movie | null;
  genres: GenreItem[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: MoviesState = {
  topMovies: [],
  randomMovie: null,
  moviesByGenre: {},
  searchResults: [],
  currentMovie: null,
  genres: [],
  isLoading: false,
  error: null,
};