export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseYear: number;
  releaseDate?: string;
  runtime: number;
  plot: string;
  genres: string[];
  director: string;
  cast: string[];
  language: string;
  languages: string[];
  countriesOfOrigin: string[];
  budget: string;
  revenue: string;
  posterUrl: string;
  trailerUrl?: string;
  trailerYoutubeId?: string;
  tmdRating?: number;
  tdbRating?: number;
  awardsSummary?: string;
  keywords?: string[];
  backdropUrl?: string;
  production?: string;
  searchId?: string;
  homepage?: string;
  status?: string;
}

export interface User {
  email: string;
  name: string;
  surname: string;
  favorites: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface ApiResponse<T = any> {
  result?: boolean;
  success?: boolean; 
  error?: string;
  data?: T;
}