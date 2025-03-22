import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fejlesztési környezetben használjuk a gép IP címét és a helyes portot
const API_URL = 'http://192.168.1.3:55363/api';

export const api = axios.create({
  baseURL: API_URL,
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

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log('Login attempt with:', { email: data.email });
      const response = await api.post<AuthResponse>('/auth/login', data);
      console.log('Login response:', response.data);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.response?.data?.message) {
        throw new Error(`Bejelentkezési hiba: ${error.response.data.message}`);
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Időtúllépés történt. Kérjük ellenőrizze az internetkapcsolatát.');
      }
      if (!error.response) {
        throw new Error(`Nem sikerült kapcsolódni a szerverhez. Kérjük ellenőrizze az internetkapcsolatát és az API URL-t ${API_URL}.`);
      }
      throw new Error(`Bejelentkezési hiba: ${error.message}`);
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('Register attempt with:', { email: data.email, fullName: data.fullName });
      const response = await api.post<AuthResponse>('/auth/register', data);
      console.log('Register response:', response.data);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Register error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.response?.data?.message) {
        throw new Error(`Regisztrációs hiba: ${error.response.data.message}`);
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Időtúllépés történt. Kérjük ellenőrizze az internetkapcsolatát.');
      }
      if (!error.response) {
        throw new Error(`Nem sikerült kapcsolódni a szerverhez. Kérjük ellenőrizze az internetkapcsolatát és az API URL-t ${API_URL}.`);
      }
      throw new Error(`Regisztrációs hiba: ${error.message}`);
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

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  profileImage?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<UserProfile>('/user/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || 'Hiba történt a profil lekérése során');
    }
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    try {
      const response = await api.put<UserProfile>('/user/profile', data);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Hiba történt a profil frissítése során');
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
      console.error('Upload profile image error:', error);
      throw new Error(error.response?.data?.message || 'Hiba történt a profil kép feltöltése során');
    }
  },
}; 