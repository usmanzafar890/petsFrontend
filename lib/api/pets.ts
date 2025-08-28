import apiClient from './api-client';
import type { Pet, PetData } from '../types';

export const getPets = async (): Promise<Pet[]> => {
  const response = await apiClient.get('/pets');
  return response.data;
};

export const createPet = async (data: PetData): Promise<Pet> => {
  const response = await apiClient.post('/pets', data);
  return response.data;
};

export const updatePet = async (id: string, data: Partial<PetData>): Promise<Pet> => {
  const response = await apiClient.put(`/pets/${id}`, data);
  return response.data;
};

export const deletePet = async (id: string): Promise<void> => {
  await apiClient.delete(`/pets/${id}`);
};
