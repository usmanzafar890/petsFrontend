import axios from 'axios';
import type { EmergencyVet } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const findNearbyVets = async (latitude: number, longitude: number): Promise<{ userAddress: string; vets: EmergencyVet[] }> => {
  const response = await axios.post(`${API_URL}/api/emergency`, { latitude, longitude });
  return response.data;
};
