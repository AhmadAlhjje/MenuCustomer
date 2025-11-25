import apiClient from './client';
import { Category, MenuItem } from './types';

export const menuApi = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<any>('/api/menu/categories');
    console.log('Categories API Response:', response.data);

    // Handle different response formats
    if (response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  getItemsByCategory: async (categoryId: number): Promise<MenuItem[]> => {
    const response = await apiClient.get<any>(`/api/menu/categories/${categoryId}/items`);
    console.log('Items by Category API Response:', response.data);

    // Handle different response formats
    if (response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  getAllItems: async (): Promise<MenuItem[]> => {
    const response = await apiClient.get<any>('/api/menu/items');
    console.log('All Items API Response:', response.data);

    // Handle different response formats
    if (response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  getItemById: async (itemId: number): Promise<MenuItem> => {
    const response = await apiClient.get<any>(`/api/menu/items/${itemId}`);
    console.log('Item by ID API Response:', response.data);

    // Handle different response formats
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
};
