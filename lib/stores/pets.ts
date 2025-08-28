import { create } from 'zustand';
import { getPets, createPet, updatePet, deletePet } from '../api/pets';
import type { Pet, PetData } from '../types';

interface PetState {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  addPet: (data: PetData) => Promise<void>;
  editPet: (id: string, data: Partial<PetData>) => Promise<void>;
  removePet: (id: string) => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  isLoading: false,
  error: null,
  fetchPets: async () => {
    set({ isLoading: true, error: null });
    try {
      const pets = await getPets();
      set({ pets, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  addPet: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newPet = await createPet(data);
      set((state) => ({ pets: [...state.pets, newPet], isLoading: false }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  editPet: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPet = await updatePet(id, data);
      set((state) => ({
        pets: state.pets.map((pet) => (pet._id === id ? updatedPet : pet)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  removePet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deletePet(id);
      set((state) => ({
        pets: state.pets.filter((pet) => pet._id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
