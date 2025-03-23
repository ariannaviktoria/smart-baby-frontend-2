import api from './api';
import { SleepPeriod } from '../types';

// Hiba kezelő segédfüggvény
const handleServiceError = (error: any, operation: string): never => {
  console.error(`Alvási adat ${operation} hiba:`, error);
  throw new Error(error.response?.data?.message || `Hiba történt az alvási adat ${operation} során`);
};

export const sleepService = {
  getAllByBabyId: async (babyId: number): Promise<SleepPeriod[]> => {
    try {
      const response = await api.get(`/sleep/baby/${babyId}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'lekérési');
    }
  },

  getById: async (id: number): Promise<SleepPeriod> => {
    try {
      const response = await api.get(`/sleep/${id}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'lekérési');
    }
  },

  create: async (sleepPeriod: Omit<SleepPeriod, 'id'>): Promise<SleepPeriod> => {
    try {
      const response = await api.post('/sleep', sleepPeriod);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'létrehozási');
    }
  },

  update: async (id: number, sleepPeriod: SleepPeriod): Promise<SleepPeriod> => {
    try {
      const response = await api.put(`/sleep/${id}`, sleepPeriod);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'frissítési');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/sleep/${id}`);
    } catch (error: any) {
      return handleServiceError(error, 'törlési');
    }
  },

  getByDateRange: async (babyId: number, startDate: Date, endDate: Date): Promise<SleepPeriod[]> => {
    try {
      const response = await api.get(`/sleep/baby/${babyId}/range`, {
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

export { SleepPeriod };
