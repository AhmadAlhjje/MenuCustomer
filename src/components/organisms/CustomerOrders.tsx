'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '@/api/types';
import { useI18n } from '@/hooks/useI18n';
import { formatCurrency } from '@/utils/formatters';
import { getSocket } from '@/lib/socket';

interface OrderWithTimer extends Order {
  preparationTime?: number;
  remainingTime?: number;
}

interface CustomerOrdersProps {
  sessionId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({
  sessionId,
  isOpen,
  onClose,
}) => {
  const { t, language } = useI18n();
  const [orders, setOrders] = useState<OrderWithTimer[]>([]);

  // Fetch initial orders and join session
  useEffect(() => {
    const fetchInitialOrders = () => {
      const socket = getSocket();
      if (!socket) {
        console.error('[CustomerOrders] Socket not available');
        return;
      }

      // طلب الطلبات عبر Socket
      socket.emit('get-customer-orders', sessionId, (response: any) => {
        console.log('[CustomerOrders] Received initial orders via socket:', response);

        if (response.success && response.data?.orders) {
          const ordersWithTimer = response.data.orders.map((order: any) => {
            const items = order.items || order.orderItems || [];

            // حساب الوقت المتبقي بناءً على الوقت الفعلي
            let remainingTime = 0;
            if (order.preparationTime && order.startTime) {
              const startTime = new Date(order.startTime).getTime();
              const now = new Date().getTime();
              const elapsedSeconds = Math.floor((now - startTime) / 1000);
              remainingTime = Math.max(0, order.preparationTime - elapsedSeconds);
            }

            return {
              ...order,
              items: items,
              preparationTime: order.preparationTime || 0,
              remainingTime: remainingTime,
            };
          });
          console.log('[CustomerOrders] Setting orders:', ordersWithTimer);
          setOrders(ordersWithTimer);
        }
      });
    };

    if (!isOpen || !sessionId) return;

    // Fetch initial orders via Socket
    fetchInitialOrders();

    // Setup socket listeners
    const socket = getSocket();
    if (!socket) return;

    // Join customer session room
    socket.emit('join-customer-session', sessionId);
    console.log('[CustomerOrders] Joined session:', sessionId);

    const handleNewOrder = (data: any) => {
      // Add all new orders (regardless of status)
      console.log('[CustomerOrders] New order received:', data);

      // حساب الوقت المتبقي بناءً على الوقت الفعلي
      let remainingTime = 0;
      if (data.order.preparationTime && data.order.startTime) {
        const startTime = new Date(data.order.startTime).getTime();
        const now = new Date().getTime();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        remainingTime = Math.max(0, data.order.preparationTime - elapsedSeconds);
      }

      const newOrder: OrderWithTimer = {
        ...data.order,
        preparationTime: data.order.preparationTime || 0,
        remainingTime: remainingTime,
      };
      setOrders((prev) => [...prev, newOrder]);
    };

    const handleOrderStatusUpdate = (data: any) => {
      // Update order status
      console.log('[CustomerOrders] Order status updated:', data);
      setOrders((prev) => {
        const exists = prev.find((order) => order.id === data.order.id);
        if (exists) {
          return prev.map((order) =>
            order.id === data.order.id
              ? {
                  ...order,
                  status: data.order.status,
                  preparationTime: order.preparationTime,
                  remainingTime: data.order.status === 'preparing' ? order.preparationTime : order.remainingTime,
                }
              : order
          );
        }
        return prev;
      });
    };

    socket.on('customer-order-created', handleNewOrder);
    socket.on('customer-order-status-updated', handleOrderStatusUpdate);

    return () => {
      socket.off('customer-order-created', handleNewOrder);
      socket.off('customer-order-status-updated', handleOrderStatusUpdate);
      socket.emit('leave-customer-session', sessionId);
    };
  }, [isOpen, sessionId]);

  // Timer effect
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          // العداد يعمل في حالتي new و preparing
          if (
            (order.status === 'preparing' || order.status === 'new') &&
            order.remainingTime !== undefined &&
            order.remainingTime > 0
          ) {
            return { ...order, remainingTime: order.remainingTime - 1 };
          }
          return order;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500 text-white';
      case 'preparing':
        return 'bg-orange-500 text-white';
      case 'delivered':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return t('order.new') || 'جديد';
      case 'preparing':
        return t('order.preparing') || 'قيد التحضير';
      case 'delivered':
        return t('order.delivered') || 'تم التسليم';
      default:
        return status;
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalPrice = (order: Order) => {
    return order.totalAmount || 0;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 ${
          language === 'ar' ? 'right-0' : 'left-0'
        } h-full w-full sm:w-[500px] bg-background shadow-2xl z-50 flex flex-col animate-slideIn`}
      >
        {/* Header */}
        <div className="bg-primary/5 p-6 flex items-center justify-between border-b-2 border-primary/20">
          <div>
            <h2 className="text-2xl font-bold text-primary">{t('order.myOrders') || 'طلباتي'}</h2>
            <p className="text-text-light text-sm mt-1">
              {orders.length} {orders.length === 1 ? 'طلب' : 'طلبات'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">
                {t('order.noOrders') || 'لا توجد طلبات'}
              </h3>
              <p className="text-text-light text-sm">{t('order.startOrdering') || 'ابدأ بطلب الأصناف من القائمة'}</p>
            </div>
          )}

          {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border-2 border-primary/20 shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-primary/5 p-4 border-b border-primary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-primary/70">رقم الطلب</p>
                      <p className="text-lg font-bold text-primary">#{order.id}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{item.quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text text-sm">
                            {language === 'ar' ? item.item?.nameAr : item.item?.name}
                          </p>
                          {item.notes && (
                            <p className="text-text-muted text-xs italic">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-primary text-sm">
                        {formatCurrency(
                          typeof item.subtotal === 'string'
                            ? parseFloat(item.subtotal)
                            : item.subtotal || (item.price * item.quantity)
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Timer & Total */}
                <div className="px-4 pb-4 space-y-3 border-t border-primary/10 pt-3">
                  {/* Timer for new and preparing */}
                  {(order.status === 'new' || order.status === 'preparing') && order.remainingTime !== undefined && (
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                      order.status === 'preparing'
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}>
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                        order.status === 'preparing'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-semibold mb-0.5 ${
                          order.status === 'preparing' ? 'text-orange-800' : 'text-blue-800'
                        }`}>
                          {order.status === 'preparing'
                            ? 'الوقت المتبقي'
                            : 'وقت التجهيز'
                          }
                        </p>
                        <p className={`text-2xl font-bold ${
                          order.status === 'preparing' ? 'text-orange-600' : 'text-blue-600'
                        }`}>
                          {formatTime(order.remainingTime)}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === 'delivered' && (
                    <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-300">
                      <div className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-green-800 font-bold text-base">
                        جاهز للاستلام
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold text-base">المجموع</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(getTotalPrice(order))}
                        </span>
                        <span className="text-sm text-primary font-medium">
                          ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(${language === 'ar' ? '100%' : '-100%'});
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
