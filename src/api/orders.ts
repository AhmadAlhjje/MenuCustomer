import apiClient from './client';
import { CreateOrderRequest, CreateOrderResponse, Order } from './types';
import { initializeSocket } from '@/lib/socket';

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    // Use Socket.IO to send order instead of HTTP
    const socket = initializeSocket();

    return new Promise((resolve, reject) => {
      // Emit order via socket
      socket.emit('create-order', data, (response: any) => {
        console.log('Create Order Socket Response:', response);

        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.message || 'فشل إرسال الطلب'));
        }
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        reject(new Error('انتهت مهلة إرسال الطلب'));
      }, 10000);
    });
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
