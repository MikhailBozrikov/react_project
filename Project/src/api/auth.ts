import { axiosInstance } from './axiosInstance';
import { LoginCredentials, RegisterData, User, ApiResponse } from './types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
    const formData = new URLSearchParams();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    try {
      const { data } = await axiosInstance.post<ApiResponse>('/auth/login', formData);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Ошибка входа';
      throw new Error(errorMessage);
    }
  },

  register: async (userData: RegisterData): Promise<ApiResponse> => {
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('name', userData.name);
    formData.append('surname', userData.surname);

    try {
      const { data } = await axiosInstance.post<ApiResponse>('/user', formData);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Ошибка регистрации';
      throw new Error(errorMessage);
    }
  },

  logout: async (): Promise<ApiResponse> => {
    const { data } = await axiosInstance.get<ApiResponse>('/auth/logout');
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await axiosInstance.get<User>('/profile');
    return data;
  },
};