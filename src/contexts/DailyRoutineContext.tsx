import React, { createContext, useContext, useState, useCallback } from 'react';
import { DailyRoutine, dailyRoutineService } from '../services/dailyRoutineService';
import { useBaby } from './BabyContext';

interface DailyRoutineContextData {
  dailyRoutine: DailyRoutine | null;
  defaultRoutine: DailyRoutine | null;
  isLoading: boolean;
  error: string | null;
  loadDailyRoutine: (date: Date) => Promise<void>;
  loadDefaultRoutine: () => Promise<void>;
  saveDailyRoutine: (routine: Omit<DailyRoutine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  saveDefaultRoutine: (routine: Omit<DailyRoutine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const DailyRoutineContext = createContext<DailyRoutineContextData>({} as DailyRoutineContextData);

export const DailyRoutineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyRoutine, setDailyRoutine] = useState<DailyRoutine | null>(null);
  const [defaultRoutine, setDefaultRoutine] = useState<DailyRoutine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentBaby } = useBaby();

  const loadDailyRoutine = useCallback(async (date: Date) => {
    if (!currentBaby) return;

    setIsLoading(true);
    setError(null);
    try {
      const routine = await dailyRoutineService.getRoutineForDate(currentBaby.id, date);
      setDailyRoutine(routine);
    } catch (err) {
      setError('Nem sikerült betölteni a napi rutint');
      console.error('Hiba a napi rutin betöltésekor:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentBaby]);

  const loadDefaultRoutine = useCallback(async () => {
    if (!currentBaby) return;

    setIsLoading(true);
    setError(null);
    try {
      const routine = await dailyRoutineService.getDefaultRoutine(currentBaby.id);
      setDefaultRoutine(routine);
    } catch (err) {
      setError('Nem sikerült betölteni az alapértelmezett rutint');
      console.error('Hiba az alapértelmezett rutin betöltésekor:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentBaby]);

  const saveDailyRoutine = useCallback(async (routine: Omit<DailyRoutine, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentBaby) return;

    setIsLoading(true);
    setError(null);
    try {
      const savedRoutine = await dailyRoutineService.create(routine);
      setDailyRoutine(savedRoutine);
    } catch (err) {
      setError('Nem sikerült menteni a napi rutint');
      console.error('Hiba a napi rutin mentésekor:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentBaby]);

  const saveDefaultRoutine = useCallback(async (routine: Omit<DailyRoutine, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentBaby) return;

    setIsLoading(true);
    setError(null);
    try {
      const savedRoutine = await dailyRoutineService.setDefaultRoutine(currentBaby.id, routine);
      setDefaultRoutine(savedRoutine);
    } catch (err) {
      setError('Nem sikerült menteni az alapértelmezett rutint');
      console.error('Hiba az alapértelmezett rutin mentésekor:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentBaby]);

  return (
    <DailyRoutineContext.Provider
      value={{
        dailyRoutine,
        defaultRoutine,
        isLoading,
        error,
        loadDailyRoutine,
        loadDefaultRoutine,
        saveDailyRoutine,
        saveDefaultRoutine,
      }}
    >
      {children}
    </DailyRoutineContext.Provider>
  );
};

export const useDailyRoutineContext = () => {
  const context = useContext(DailyRoutineContext);
  if (!context) {
    throw new Error('useDailyRoutineContext must be used within a DailyRoutineProvider');
  }
  return context;
}; 