import api from './api';
import { Growth } from '../types';

// Hiba kezelő segédfüggvény
const handleServiceError = (error: any, operation: string): never => {
  console.error(`Növekedési adat ${operation} hiba:`, error);
  throw new Error(error.response?.data?.message || `Hiba történt a növekedési adat ${operation} során`);
};

export const growthService = {
  getAllByBabyId: async (babyId: number): Promise<Growth[]> => {
    try {
      const response = await api.get(`/growth/baby/${babyId}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'lekérési');
    }
  },

  getById: async (id: number): Promise<Growth> => {
    try {
      const response = await api.get(`/growth/${id}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'lekérési');
    }
  },

  create: async (growth: Omit<Growth, 'id'>): Promise<Growth> => {
    try {
      const response = await api.post('/growth', growth);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'létrehozási');
    }
  },

  update: async (id: number, growth: Growth): Promise<Growth> => {
    try {
      const response = await api.put(`/growth/${id}`, growth);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'frissítési');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/growth/${id}`);
    } catch (error: any) {
      return handleServiceError(error, 'törlési');
    }
  },

  getByDateRange: async (babyId: number, startDate: Date, endDate: Date): Promise<Growth[]> => {
    try {
      const response = await api.get(`/growth/baby/${babyId}/range`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'dátum szerinti lekérési');
    }
  },
}; 

export { Growth };
