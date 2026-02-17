import apiClient from './client';
import { CreateOrderRequest, CreateOrderResponse, Order } from './types';
import { initializeSocket, getSocket } from '@/lib/socket';

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    // استخدام الاتصال الموجود مسبقاً، أو تهيئة جديد كاحتياط
    const socket = getSocket() || initializeSocket();

    return new Promise((resolve, reject) => {
      let isResolved = false;

      // Emit order via socket
      socket.emit('create-order', data, (response: any) => {
        if (isResolved) return; // تجاهل الاستجابة إذا تم حل الـ Promise بالفعل
        isResolved = true;

        console.log('Create Order Socket Response:', response);

        if (response && response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error(response?.message || 'فشل إرسال الطلب'));
        }
      });

      // Timeout after 30 seconds (زيادة المهلة للشبكات الضعيفة)
      setTimeout(() => {
        if (isResolved) return; // لا ترفض إذا تمت الاستجابة بالفعل
        isResolved = true;
        reject(new Error('انتهت مهلة إرسال الطلب. يرجى التحقق من اتصال الإنترنت'));
      }, 30000);
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
