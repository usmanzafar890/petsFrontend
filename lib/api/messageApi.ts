import apiClient from "./api-client";

export interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  recipient?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  chatType: 'individual' | 'community';
  chatId: string;
  read: boolean;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  chatType: 'individual' | 'community';
  name?: string;
  description?: string;
  participants: {
    _id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
    lastActive?: string;
  }[];
  lastMessage?: Message;
  createdBy: {
    _id: string;
    name: string;
    avatar?: string;
  };
  isActive: boolean;
  topic?: string;
  icon?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Get all user chats
export const getUserChats = async (): Promise<Chat[]> => {
  const response = await apiClient.get('/messages/chats');
  return response.data;
};

// Get messages for a specific chat
export const getChatMessages = async (
  chatId: string,
  page = 1,
  limit = 20
): Promise<{
  messages: Message[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}> => {
  const response = await apiClient.get(`/messages/chats/${chatId}/messages`, {
    params: { page, limit },
  });
  return response.data;
};

// Create a new community chat
export const createCommunityChat = async (
  data: {
    name: string;
    description?: string;
    topic?: string;
    icon?: string;
  }
): Promise<Chat> => {
  const response = await apiClient.post('/messages/community', data);
  return response.data;
};

// Get all community chats
export const getCommunityChats = async (): Promise<Chat[]> => {
  const response = await apiClient.get('/messages/community');
  return response.data;
};

// Get or create individual chat with another user
export const getOrCreateIndividualChat = async (
  recipientId: string
): Promise<Chat> => {
  const response = await apiClient.get(`/messages/individual/${recipientId}`);
  return response.data;
};

// Delete a chat
export const deleteChat = async (chatId: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/messages/chats/${chatId}`);
  return response.data;
};

// Get all users for new chat creation
export const getAllUsers = async (): Promise<{
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}[]> => {
  const response = await apiClient.get('/users');
  return response.data;
};
