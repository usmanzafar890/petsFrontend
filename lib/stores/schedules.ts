import { create } from 'zustand';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, completeSchedule as apiCompleteSchedule } from '../api/schedules';
import type { Schedule, ScheduleData } from '../types';

interface ScheduleState {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
  addSchedule: (data: ScheduleData) => Promise<void>;
  editSchedule: (id: string, data: Partial<ScheduleData>) => Promise<void>;
  removeSchedule: (id: string) => Promise<void>;
  completeSchedule: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],
  isLoading: false,
  error: null,
  fetchSchedules: async () => {
    set({ isLoading: true, error: null });
    try {
      const schedules = await getSchedules();
      set({ schedules, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  addSchedule: async (data) => {
    try {
      const newSchedule = await createSchedule(data);
      set((state) => ({ schedules: [...state.schedules, newSchedule] }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  editSchedule: async (id, data) => {
    try {
      const updatedSchedule = await updateSchedule(id, data);
      set((state) => ({
        schedules: state.schedules.map((s) => (s._id === id ? updatedSchedule : s)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  removeSchedule: async (id) => {
    try {
      await deleteSchedule(id);
      set((state) => ({ 
        schedules: state.schedules.filter((s) => s._id !== id) 
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  completeSchedule: async (id) => {
    try {
      const updatedSchedule = await apiCompleteSchedule(id);
      set((state) => ({
        schedules: state.schedules.map((s) => (s._id === id ? updatedSchedule : s)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
