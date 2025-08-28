import axios from 'axios';
import { getToken } from '../stores/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getCommunityComparison = async (petId: string, metric: string, size: string, color: string) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/community/compare/${petId}?metric=${metric}&sizeOfPet=${size}&colorOfPet=${color}`, config);
  return response.data;
};
