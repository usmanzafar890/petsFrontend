import { getToken } from '../stores/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get all family members for the current user
 */
export const getFamilyMembers = async () => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/family`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch family members');
  }
  
  return response.json();
};

/**
 * Invite a new family member
 */
export const inviteFamilyMember = async (data: { name: string; email: string }) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/family/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to invite family member');
  }
  
  return response.json();
};

/**
 * Remove a family member
 */
export const removeFamilyMember = async (memberId: string) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/family/${memberId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove family member');
  }
  
  return response.json();
};

/**
 * Update membership plan
 * @param plan The new membership plan (basic, premium, professional)
 * @returns Response with updated plan info
 */
export const updateMembershipPlan = async (plan: 'basic' | 'premium' | 'professional') => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/family/plan`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ plan }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    // Check if the error is due to having too many family members for the plan
    if (response.status === 400 && data.currentMembers) {
      throw new Error(`You have ${data.currentMembers} family members. ` +
        `The ${data.planRequested} plan only allows ${data.maxAllowed}.`);
    }
    throw new Error(data.message || 'Failed to update membership plan');
  }
  
  return data;
};

/**
 * Get pending invitations
 */
export const getPendingInvitations = async () => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/family/invitations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch invitations');
  }
  
  return response.json();
};

/**
 * Accept a family invitation
 */
export const acceptFamilyInvitation = async (adminId: string) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/family/accept/${adminId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to accept invitation');
  }
  
  return response.json();
};
