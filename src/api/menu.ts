import apiClient from './client';
import { Category, MenuItem } from './types';

export const menuApi = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/menu/categories');
    return response.data;
  },

  getItemsByCategory: async (categoryId: number): Promise<MenuItem[]> => {
    const response = await apiClient.get<MenuItem[]>(`/api/menu/categories/${categoryId}/items`);
    return response.data;
  },

  getAllItems: async (): Promise<MenuItem[]> => {
    const response = await apiClient.get<MenuItem[]>('/api/menu/items');
    return response.data;
  },

  getItemById: async (itemId: number): Promise<MenuItem> => {
    const response = await apiClient.get<MenuItem>(`/api/menu/items/${itemId}`);
    return response.data;
  },
};
