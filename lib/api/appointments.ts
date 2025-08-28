import apiClient from './api-client';
import type { VetAppointment, AppointmentData } from '../types';

export const getAppointments = async (): Promise<VetAppointment[]> => {
  const response = await apiClient.get('/appointments');
  return response.data;
};

export const createAppointment = async (data: AppointmentData): Promise<VetAppointment> => {
  const response = await apiClient.post('/appointments', data);
  return response.data;
};

export const updateAppointment = async (id: string, data: Partial<AppointmentData>): Promise<VetAppointment> => {
  const response = await apiClient.put(`/appointments/${id}`, data);
  return response.data;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await apiClient.delete(`/appointments/${id}`);
};
