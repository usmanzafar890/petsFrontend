import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Password change API
export const changePassword = async (currentPassword: string, newPassword: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/users/change-password`,
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Login history API
export const getLoginHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users/login-history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const clearLoginHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/users/login-history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
