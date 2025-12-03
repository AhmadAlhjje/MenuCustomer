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
    const fetchInitialOrders = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/orders/session/${sessionId}/summary`);
        const data = await response.json();

        console.log('[CustomerOrders] Received initial orders:', data);

        if (data.success && data.data?.orders) {
          const ordersWithTimer = data.data.orders.map((order: any) => {
            // Handle both 'items' and 'orderItems' property names
            const items = order.items || order.orderItems || [];
            return {
              ...order,
              items: items, // Normalize to 'items'
              preparationTime: items?.[0]?.item?.preparationTime || 0,
              remainingTime: items?.[0]?.item?.preparationTime || 0,
            };
          });
          console.log('[CustomerOrders] Setting orders:', ordersWithTimer);
          setOrders(ordersWithTimer);
        }
      } catch (error) {
        console.error('[CustomerOrders] Error fetching initial orders:', error);
      }
    };

    if (!isOpen || !sessionId) return;

    // Fetch initial orders
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
      const newOrder: OrderWithTimer = {
        ...data.order,
        preparationTime: data.order.items?.[0]?.item?.preparationTime || 0,
        remainingTime: data.order.items?.[0]?.item?.preparationTime || 0,
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
          if (
            order.status === 'preparing' &&
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
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 ${
          language === 'ar' ? 'right-0' : 'left-0'
        } h-full w-full sm:w-[500px] bg-surface shadow-2xl z-50 flex flex-col animate-slideIn`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t('order.myOrders') || 'طلباتي'}</h2>
            <p className="text-blue-50 text-sm mt-1">
              {orders.length} {orders.length === 1 ? t('order.itemNotes') : t('menu.items')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">
                {t('order.noOrders') || 'لا توجد طلبات'}
              </h3>
              <p className="text-text-light">{t('order.startOrdering') || 'ابدأ بطلب أصناف'}</p>
            </div>
          )}

          {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-text-light">
                        #{order.id}
                      </span>
                      {order.status === 'preparing' && order.remainingTime !== undefined && (
                        <div className="mt-1 text-lg font-bold text-yellow-600">
                          {formatTime(order.remainingTime)}
                        </div>
                      )}
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
                <div className="p-4 space-y-2 border-b border-gray-200">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="font-semibold text-text">
                          {language === 'ar' ? item.item?.nameAr : item.item?.name}
                        </p>
                        <p className="text-text-light text-xs">
                          {t('order.quantity')}: {item.quantity}
                        </p>
                        {item.notes && (
                          <p className="text-text-muted text-xs mt-1 italic">
                            &quot;{item.notes}&quot;
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-primary ml-2">
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
                <div className="p-4 space-y-3">
                  {/* Timer */}
                  {order.status === 'preparing' && order.remainingTime !== undefined && (
                    <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm text-yellow-800 font-semibold">
                          {t('order.estimatedTime') || 'الوقت المتبقي'}
                        </p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {formatTime(order.remainingTime)}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === 'delivered' && (
                    <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-green-800 font-semibold">
                        {t('order.ready') || 'جاهز للاستلام'}
                      </p>
                    </div>
                  )}

                  {order.status === 'new' && (
                    <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-blue-800 font-semibold">
                        {t('order.processing') || 'قيد المعالجة'}
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-text font-semibold">{t('order.total')}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(getTotalPrice(order))}
                      </span>
                      <span className="text-sm text-text-light font-semibold">
                        {t('common.sar')}
                      </span>
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
