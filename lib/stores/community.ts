import { create } from 'zustand';
import { getCommunityComparison } from '../api/community';
import type { CommunityComparisonData } from '../types/community';

interface CommunityState {
  comparisonData: CommunityComparisonData | null;
  isLoading: boolean;
  error: string | null;
  fetchComparison: (petId: string, metric: string, size: string, color: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  comparisonData: null,
  isLoading: false,
  error: null,
  fetchComparison: async (petId, metric, size, color) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getCommunityComparison(petId, metric, size, color);
      set({ comparisonData: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch community data', isLoading: false });
    }
  },
}));
