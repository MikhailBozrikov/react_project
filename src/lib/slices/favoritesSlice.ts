import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { favoritesApi } from '@/api/favorites';
import { moviesApi } from '@/api/movies';
import { Movie } from '@/api/types';

interface FavoritesState {
  items: Movie[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await favoritesApi.getFavorites();
      return movies;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки избранного');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (movie: Movie, { rejectWithValue }) => {
    try {
      await favoritesApi.addFavorite(movie.id);
      return movie;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка добавления в избранное');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async (movieId: number, { rejectWithValue }) => {
    try {
      await favoritesApi.removeFavorite(movieId);
      return movieId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка удаления из избранного');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        if (!state.items.some(m => m.id === action.payload.id)) {
          state.items.push(action.payload);
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.items = state.items.filter(movie => movie.id !== action.payload);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;