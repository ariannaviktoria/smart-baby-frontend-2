import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

export interface Baby {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  userId: string;
  lastMood?: string;
}

interface CreateBabyDto {
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
}

interface UpdateBabyDto {
  name?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female';
  lastMood?: string;
}

interface BabyContextType {
  babies: Baby[];
  currentBaby: Baby | null;
  isLoading: boolean;
  error: string | null;
  getBabies: () => Promise<void>;
  getBaby: (id: number) => Promise<void>;
  createBaby: (baby: CreateBabyDto) => Promise<void>;
  updateBaby: (id: number, baby: UpdateBabyDto) => Promise<void>;
  deleteBaby: (id: number) => Promise<void>;
  setCurrentBaby: (baby: Baby | null) => void;
}

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [currentBaby, setCurrentBaby] = useState<Baby | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBabies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/baby');
      setBabies(response.data);
    } catch (error) {
      setError('Hiba történt a babák lekérése során');
      console.error('Get babies failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBaby = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/baby/${id}`);
      setCurrentBaby(response.data);
    } catch (error) {
      setError('Hiba történt a baba adatainak lekérése során');
      console.error('Get baby failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBaby = async (baby: CreateBabyDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post('/baby', baby);
      setBabies(prev => [...prev, response.data]);
      setCurrentBaby(response.data);
    } catch (error) {
      setError('Hiba történt a baba létrehozása során');
      console.error('Create baby failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBaby = async (id: number, baby: UpdateBabyDto) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.put(`/baby/${id}`, baby);
      
      // Frissítjük a lokális állapotot
      const updatedBaby = await getBaby(id);
      setBabies(prev => prev.map(b => b.id === id ? updatedBaby : b) as Baby[]);
    } catch (error) {
      setError('Hiba történt a baba frissítése során');
      console.error('Update baby failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBaby = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.delete(`/baby/${id}`);
      
      setBabies(prev => prev.filter(b => b.id !== id));
      if (currentBaby?.id === id) {
        setCurrentBaby(null);
      }
    } catch (error) {
      setError('Hiba történt a baba törlése során');
      console.error('Delete baby failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BabyContext.Provider 
      value={{ 
        babies, 
        currentBaby, 
        isLoading, 
        error,
        getBabies,
        getBaby,
        createBaby,
        updateBaby,
        deleteBaby,
        setCurrentBaby
      }}
    >
      {children}
    </BabyContext.Provider>
  );
};

export const useBaby = () => {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
}; 