import { create } from 'zustand';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api/appointments';
import type { VetAppointment, AppointmentData } from '../types';

interface AppointmentState {
  appointments: VetAppointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  addAppointment: (data: AppointmentData) => Promise<void>;
  editAppointment: (id: string, data: Partial<AppointmentData>) => Promise<void>;
  removeAppointment: (id: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  isLoading: false,
  error: null,
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await getAppointments();
      set({ appointments, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  addAppointment: async (data) => {
    try {
      const newAppointment = await createAppointment(data);
      set((state) => ({ appointments: [...state.appointments, newAppointment] }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  editAppointment: async (id, data) => {
    try {
      const updatedAppointment = await updateAppointment(id, data);
      set((state) => ({
        appointments: state.appointments.map((appt) => (appt._id === id ? updatedAppointment : appt)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  removeAppointment: async (id) => {
    try {
      await deleteAppointment(id);
      set((state) => ({ 
        appointments: state.appointments.filter((appt) => appt._id !== id) 
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
