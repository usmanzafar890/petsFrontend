import apiClient from './api-client';
import type { HealthRecord, HealthRecordData } from '../types';

export const getHealthRecords = async (): Promise<HealthRecord[]> => {
  const response = await apiClient.get('/health-records');
  return response.data;
};

export const createHealthRecord = async (data: HealthRecordData): Promise<HealthRecord> => {
  const response = await apiClient.post('/health-records', data);
  return response.data;
};

export const updateHealthRecord = async (id: string, data: Partial<HealthRecordData>): Promise<HealthRecord> => {
  const response = await apiClient.put(`/health-records/${id}`, data);
  return response.data;
};

export const deleteHealthRecord = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/health-records/${id}`);
  return response.data;
};
