import { create } from 'zustand';
import type { DailyLog, DailyLogData } from '@/lib/types';
import api from '@/lib/api';

interface DailyLogState {
  dailyLogs: DailyLog[];
  loading: boolean;
  error: string | null;
  fetchDailyLogs: (petId: string) => Promise<void>;
  addDailyLog: (petId: string, logData: DailyLogData) => Promise<void>;
}

export const useDailyLogStore = create<DailyLogState>((set) => ({
  dailyLogs: [],
  loading: false,
  error: null,
  fetchDailyLogs: async (petId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/pets/${petId}/dailylogs`);
      set({ dailyLogs: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch daily logs', loading: false });
    }
  },
  addDailyLog: async (petId, logData) => {
    try {
      const response = await api.post(`/pets/${petId}/dailylogs`, logData);
      set((state) => ({
        dailyLogs: [response.data, ...state.dailyLogs],
      }));
    } catch (error) {
      console.error('Failed to add daily log:', error);
      // Optionally set an error state
    }
  },
}));
