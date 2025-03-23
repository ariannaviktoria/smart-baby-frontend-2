import api from './api';
import { CryingPeriod } from '../types';

// Hiba kezelő segédfüggvény
const handleServiceError = (error: any, operation: string): never => {
  console.error(`Sírási adat ${operation} hiba:`, error);
  throw new Error(error.response?.data?.message || `Hiba történt a sírási adat ${operation} során`);
};

export const cryingService = {
  getAllByBabyId: async (babyId: number): Promise<CryingPeriod[]> => {
    try {
      const response = await api.get(`/crying/baby/${babyId}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'lekérési');
    }
  },

  getById: async (id: number): Promise<CryingPeriod> => {
    try {
      const response = await api.get(`/crying/${id}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'lekérési');
    }
  },

  create: async (cryingPeriod: Omit<CryingPeriod, 'id'>): Promise<CryingPeriod> => {
    try {
      const response = await api.post('/crying', cryingPeriod);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'létrehozási');
    }
  },

  update: async (id: number, cryingPeriod: CryingPeriod): Promise<CryingPeriod> => {
    try {
      const response = await api.put(`/crying/${id}`, cryingPeriod);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'frissítési');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/crying/${id}`);
    } catch (error: any) {
      return handleServiceError(error, 'törlési');
    }
  },

  getByDateRange: async (babyId: number, startDate: Date, endDate: Date): Promise<CryingPeriod[]> => {
    try {
      const response = await api.get(`/crying/baby/${babyId}/range`, {
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