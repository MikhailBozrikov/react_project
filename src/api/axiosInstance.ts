import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://cinemaguide.skillbox.cc',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});