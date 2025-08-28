import apiClient from './api-client';
import type { Schedule, ScheduleData } from '../types';

export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await apiClient.get('/schedules');
  return response.data;
};

export const createSchedule = async (data: ScheduleData): Promise<Schedule> => {
  const response = await apiClient.post('/schedules', data);
  return response.data;
};

export const updateSchedule = async (id: string, data: Partial<ScheduleData>): Promise<Schedule> => {
  const response = await apiClient.put(`/schedules/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id: string): Promise<void> => {
  await apiClient.delete(`/schedules/${id}`);
};

export const completeSchedule = async (id: string): Promise<Schedule> => {
  const response = await apiClient.put(`/schedules/${id}/complete`);
  return response.data;
};
