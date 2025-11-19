import apiClient from './client';
import { CreateOrderRequest, CreateOrderResponse, Order } from './types';

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<CreateOrderResponse>('/api/orders', data);
    return response.data.order;
  },

  getOrdersBySession: async (sessionId: number): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(`/api/orders/session/${sessionId}`);
    return response.data;
  },

  getOrderDetails: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/api/orders/${orderId}`);
    return response.data;
  },
};
