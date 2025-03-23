import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginData, RegisterData, AuthResponse, UserProfile, UpdateProfileData } from '../types';
import { handleApiError } from '../utils/errorHandling';

// API Konstansok
const BASE_URL = 'http://192.168.1.5:55363/api';
const TIMEOUT = 15000; // 15 másodperc

// API kliens konfigurálása
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentikációs API szolgáltatások
export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log('Bejelentkezési kísérlet:', { email: data.email });
      const response = await api.post<AuthResponse>('/auth/login', data);
      console.log('Bejelentkezési válasz:', response.data);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Bejelentkezési', 'művelet');
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('Regisztrációs kísérlet:', { email: data.email, fullName: data.fullName });
      const response = await api.post<AuthResponse>('/auth/register', data);
      console.log('Regisztrációs válasz:', response.data);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Regisztrációs', 'művelet');
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Kijelentkezési hiba:', error);
    }
  },
};

// Profil API szolgáltatások
export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<UserProfile>('/user/profile');
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Profil', 'lekérési');
    }
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    try {
      const response = await api.put<UserProfile>('/user/profile', data);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Profil', 'frissítési');
    }
  },

  uploadProfileImage: async (imageUri: string): Promise<{ imageUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any); // Type assertion for React Native FormData

      const response = await api.post<{ imageUrl: string }>('/user/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Profil kép', 'feltöltési');
    }
  },
};

export default api; 