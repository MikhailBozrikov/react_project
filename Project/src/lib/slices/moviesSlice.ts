import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '@/api/types';
import { initialState, MoviesState, GenreItem } from './moviesTypes';
import * as thunks from './moviesThunks';

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.fetchTopMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(thunks.fetchTopMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.topMovies = action.payload;
      })
      .addCase(thunks.fetchTopMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(thunks.fetchRandomMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(thunks.fetchRandomMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        state.randomMovie = action.payload;
      })
      .addCase(thunks.fetchRandomMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(thunks.fetchMoviesByGenre.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(thunks.fetchMoviesByGenre.fulfilled, (state, action) => {
        const { genreId, movies, page, count } = action.payload;
        state.isLoading = false;
        if (!state.moviesByGenre[genreId]) {
          state.moviesByGenre[genreId] = { movies: [], page: 0, hasMore: true };
        }
        if (page === 1) {
          state.moviesByGenre[genreId].movies = movies;
        } else {
          state.moviesByGenre[genreId].movies = [...state.moviesByGenre[genreId].movies, ...movies];
        }
        state.moviesByGenre[genreId].page = page;
        state.moviesByGenre[genreId].hasMore = movies.length === count;
      })
      .addCase(thunks.fetchMoviesByGenre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(thunks.searchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(thunks.searchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(thunks.searchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(thunks.fetchMovieById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(thunks.fetchMovieById.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        state.currentMovie = action.payload;
      })
      .addCase(thunks.fetchMovieById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(thunks.fetchGenres.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(thunks.fetchGenres.fulfilled, (state, action: PayloadAction<GenreItem[]>) => {
        state.isLoading = false;
        state.genres = action.payload;
      })
      .addCase(thunks.fetchGenres.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearchResults, clearError } = moviesSlice.actions;

export * from './moviesThunks';

export default moviesSlice.reducer;