import apiClient from './client';
import { CreateOrderRequest, CreateOrderResponse, Order } from './types';

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<any>('/api/orders', data);
    console.log('Create Order API Response:', response.data);

    // Handle different response formats
    if (response.data.data && response.data.data.order) {
      return response.data.data.order;
    } else if (response.data.order) {
      return response.data.order;
    }
    return response.data;
  },

  getOrdersBySession: async (sessionId: number): Promise<Order[]> => {
    const response = await apiClient.get<any>(`/api/orders/session/${sessionId}`);
    console.log('Orders by Session API Response:', response.data);

    // Handle different response formats
    if (response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  getOrderDetails: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get<any>(`/api/orders/${orderId}`);
    console.log('Order Details API Response:', response.data);

    // Handle different response formats
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
};
