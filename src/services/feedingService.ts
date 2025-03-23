import api from './api';
import { Feeding } from '../types';

// Hiba kezelő segédfüggvény
const handleServiceError = (error: any, operation: string): never => {
  console.error(`Etetési adat ${operation} hiba:`, error);
  throw new Error(error.response?.data?.message || `Hiba történt az etetési adat ${operation} során`);
};

export const feedingService = {
  getAllByBabyId: async (babyId: number): Promise<Feeding[]> => {
    try {
      const response = await api.get(`/feeding/baby/${babyId}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'lekérési');
    }
  },

  getById: async (id: number): Promise<Feeding> => {
    try {
      const response = await api.get(`/feeding/${id}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'lekérési');
    }
  },

  create: async (feeding: Omit<Feeding, 'id'>): Promise<Feeding> => {
    try {
      const response = await api.post('/feeding', feeding);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'létrehozási');
    }
  },

  update: async (id: number, feeding: Feeding): Promise<Feeding> => {
    try {
      const response = await api.put(`/feeding/${id}`, feeding);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'frissítési');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/feeding/${id}`);
    } catch (error: any) {
      return handleServiceError(error, 'törlési');
    }
  },

  getByDateRange: async (babyId: number, startDate: Date, endDate: Date): Promise<Feeding[]> => {
    try {
      const response = await api.get(`/feeding/baby/${babyId}/range`, {
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

export { Feeding };
