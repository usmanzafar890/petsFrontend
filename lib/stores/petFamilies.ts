import { create } from 'zustand';
import axios from 'axios';
import { PetFamily, PetFamilyData, Pet, PetRole } from '@/lib/types';

interface PetFamilyStore {
  petFamilies: PetFamily[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  fetchPetFamilies: () => Promise<void>;
  getPetFamily: (id: string) => Promise<PetFamily | null>;
  createPetFamily: (data: PetFamilyData) => Promise<PetFamily | null>;
  updatePetFamily: (id: string, data: Partial<PetFamilyData>) => Promise<PetFamily | null>;
  deletePetFamily: (id: string) => Promise<boolean>;
  
  // Pet management within families
  addPetToFamily: (familyId: string, petId: string, role?: PetRole, relationshipNotes?: string) => Promise<boolean>;
  removePetFromFamily: (familyId: string, petId: string) => Promise<boolean>;
  updatePetRole: (familyId: string, petId: string, role: PetRole, relationshipNotes?: string) => Promise<boolean>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const usePetFamilyStore = create<PetFamilyStore>((set, get) => ({
  petFamilies: [],
  loading: false,
  error: null,

  fetchPetFamilies: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/pet-families`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ petFamilies: response.data.data, loading: false });
    } catch (error: any) {
      console.error('Error fetching pet families:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch pet families', 
        loading: false 
      });
    }
  },

  getPetFamily: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/pet-families/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ loading: false });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching pet family:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch pet family', 
        loading: false 
      });
      return null;
    }
  },

  createPetFamily: async (data: PetFamilyData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/pet-families`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const newFamily = response.data.data;
      set(state => ({ 
        petFamilies: [...state.petFamilies, newFamily],
        loading: false 
      }));
      
      return newFamily;
    } catch (error: any) {
      console.error('Error creating pet family:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to create pet family', 
        loading: false 
      });
      return null;
    }
  },

  updatePetFamily: async (id: string, data: Partial<PetFamilyData>) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/pet-families/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const updatedFamily = response.data.data;
      set(state => ({
        petFamilies: state.petFamilies.map(family => 
          family._id === id ? updatedFamily : family
        ),
        loading: false
      }));
      
      return updatedFamily;
    } catch (error: any) {
      console.error('Error updating pet family:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update pet family', 
        loading: false 
      });
      return null;
    }
  },

  deletePetFamily: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/pet-families/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      set(state => ({
        petFamilies: state.petFamilies.filter(family => family._id !== id),
        loading: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting pet family:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to delete pet family', 
        loading: false 
      });
      return false;
    }
  },

  addPetToFamily: async (familyId: string, petId: string, role?: PetRole, relationshipNotes?: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const payload = { petId, role, relationshipNotes };
      
      await axios.post(`${API_URL}/pet-families/${familyId}/pets`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh the pet family data to get updated pets list
      const response = await axios.get(`${API_URL}/pet-families/${familyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const updatedFamily = response.data.data;
      set(state => ({
        petFamilies: state.petFamilies.map(family => 
          family._id === familyId ? updatedFamily : family
        ),
        loading: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error adding pet to family:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to add pet to family', 
        loading: false 
      });
      return false;
    }
  },

  removePetFromFamily: async (familyId: string, petId: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/pet-families/${familyId}/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh the pet family data to get updated pets list
      const response = await axios.get(`${API_URL}/pet-families/${familyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const updatedFamily = response.data.data;
      set(state => ({
        petFamilies: state.petFamilies.map(family => 
          family._id === familyId ? updatedFamily : family
        ),
        loading: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error removing pet from family:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to remove pet from family', 
        loading: false 
      });
      return false;
    }
  },

  updatePetRole: async (familyId: string, petId: string, role: PetRole, relationshipNotes?: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const payload = { role, relationshipNotes };
      
      await axios.put(`${API_URL}/pet-families/${familyId}/pets/${petId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh the pet family data to get updated pets list
      const response = await axios.get(`${API_URL}/pet-families/${familyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const updatedFamily = response.data.data;
      set(state => ({
        petFamilies: state.petFamilies.map(family => 
          family._id === familyId ? updatedFamily : family
        ),
        loading: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error updating pet role:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update pet role', 
        loading: false 
      });
      return false;
    }
  },
}));
