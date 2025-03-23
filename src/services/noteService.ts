import api from './api';
import { Note } from '../types';
import { handleServiceError } from '../utils/errorHandling';

export const noteService = {
  getAllByBabyId: async (babyId: number): Promise<Note[]> => {
    try {
      const response = await api.get(`/note/baby/${babyId}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Jegyzet', 'lekérési');
    }
  },

  getById: async (id: number): Promise<Note> => {
    try {
      const response = await api.get(`/note/${id}`);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Jegyzet', 'lekérési');
    }
  },

  create: async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    try {
      const response = await api.post('/note', note);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Jegyzet', 'létrehozási');
    }
  },

  update: async (id: number, note: Omit<Note, 'createdAt' | 'updatedAt'>): Promise<Note> => {
    try {
      const response = await api.put(`/note/${id}`, note);
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Jegyzet', 'frissítési');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/note/${id}`);
    } catch (error: any) {
      return handleServiceError(error, 'Jegyzet', 'törlési');
    }
  },

  getByDateRange: async (babyId: number, startDate: Date, endDate: Date): Promise<Note[]> => {
    try {
      const response = await api.get(`/note/baby/${babyId}/range`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error: any) {
      return handleServiceError(error, 'Jegyzet', 'dátum szerinti lekérési');
    }
  },
}; 