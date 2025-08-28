import { create } from 'zustand';
import { getHealthRecords, createHealthRecord, updateHealthRecord, deleteHealthRecord } from '../api/health';
import type { HealthRecord, HealthRecordData } from '../types';

interface HealthRecordState {
  healthRecords: HealthRecord[];
  isLoading: boolean;
  error: string | null;
  fetchHealthRecords: () => Promise<void>;
  addHealthRecord: (data: HealthRecordData) => Promise<void>;
  editHealthRecord: (id: string, data: Partial<HealthRecordData>) => Promise<void>;
  removeHealthRecord: (id: string) => Promise<void>;
}

export const useHealthRecordStore = create<HealthRecordState>((set) => ({
  healthRecords: [],
  isLoading: false,
  error: null,
  fetchHealthRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const healthRecords = await getHealthRecords();
      set({ healthRecords, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  addHealthRecord: async (data) => {
    try {
      const newRecord = await createHealthRecord(data);
      set((state) => ({ healthRecords: [...state.healthRecords, newRecord] }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  editHealthRecord: async (id, data) => {
    try {
      const updatedRecord = await updateHealthRecord(id, data);
      set((state) => ({
        healthRecords: state.healthRecords.map((rec) => (rec._id === id ? updatedRecord : rec)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  removeHealthRecord: async (id) => {
    try {
      await deleteHealthRecord(id);
      set((state) => ({ 
        healthRecords: state.healthRecords.filter((rec) => rec._id !== id) 
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
