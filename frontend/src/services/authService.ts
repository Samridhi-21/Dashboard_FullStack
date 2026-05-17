import { ApiResponse, AuthData, User } from '../types';
import { api } from './api';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthData> => {
    const response = await api.post<ApiResponse<AuthData>>('/auth/register', data);
    return response.data.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthData> => {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', data);
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data.user;
  },
};
