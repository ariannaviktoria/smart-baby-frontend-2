import api from './api';
import { DailyRoutine } from '../types';
import { handleServiceError } from '../utils/errorHandling';

export const dailyRoutineService = {
  getAllByBabyId: async (babyId: number): Promise<DailyRoutine[]> => {
    try {
      const response = await api.get(`/dailyroutine/baby/${babyId}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Napi rutin', 'lekérési');
    }
  },

  getById: async (id: number): Promise<DailyRoutine> => {
    try {
      const response = await api.get(`/dailyroutine/${id}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Napi rutin', 'lekérési');
    }
  },

  create: async (routine: Omit<DailyRoutine, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyRoutine> => {
    try {
      const response = await api.post('/dailyroutine', routine);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Napi rutin', 'létrehozási');
    }
  },

  update: async (id: number, routine: Omit<DailyRoutine, 'createdAt' | 'updatedAt'>): Promise<DailyRoutine> => {
    try {
      const response = await api.put(`/dailyroutine/${id}`, routine);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Napi rutin', 'frissítési');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/dailyroutine/${id}`);
    } catch (error: any) {
      return handleServiceError(error, 'Napi rutin', 'törlési');
    }
  },

  getDefaultRoutine: async (babyId: number): Promise<DailyRoutine> => {
    try {
      const response = await api.get(`/dailyroutine/baby/${babyId}/default`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Alapértelmezett rutin', 'lekérési');
    }
  },

  getRoutineForDate: async (babyId: number, date: Date): Promise<DailyRoutine> => {
    try {
      const response = await api.get(`/dailyroutine/baby/${babyId}/date`, {
        params: {
          date: date.toISOString(),
        },
      });
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Napi rutin', 'dátum szerinti lekérési');
    }
  },

  setDefaultRoutine: async (babyId: number, routine: Omit<DailyRoutine, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyRoutine> => {
    try {
      const response = await api.post(`/dailyroutine/baby/${babyId}/default`, routine);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Alapértelmezett rutin', 'beállítási');
    }
  },
}; 

export { DailyRoutine };
