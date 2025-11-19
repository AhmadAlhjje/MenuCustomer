import apiClient from './client';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from './types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<{ data: RegisterResponse }>('/api/auth/register/initial', data);
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },
};
