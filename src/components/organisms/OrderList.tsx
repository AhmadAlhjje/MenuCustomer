'use client';

import React from 'react';
import { MenuItem } from '@/api/types';
import { OrderItem } from '@/store/slices/orderSlice';
import { Button } from '../atoms/Button';
import { useI18n } from '@/hooks/useI18n';
import { formatCurrency } from '@/utils/formatters';
import Image from 'next/image';

interface OrderListProps {
  items: OrderItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onSendToKitchen: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const getItemImages = (item: MenuItem): string[] => {
  if (item.images) {
    try {
      const parsed = JSON.parse(item.images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (item.image) {
    return [item.image];
  }
  return [];
};

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath}`;
};

export const OrderList: React.FC<OrderListProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onSendToKitchen,
  isOpen,
  onClose,
}) => {
  const { t, language } = useI18n();

  const subtotal = items.reduce((sum, orderItem) => {
    const price = typeof orderItem.item.price === 'string'
      ? parseFloat(orderItem.item.price)
      : orderItem.item.price;
    return sum + (price * orderItem.quantity);
  }, 0);

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
        className={`fixed top-0 ${language === 'ar' ? 'left-0' : 'right-0'} h-full w-full sm:w-[450px] bg-surface shadow-2xl z-50 flex flex-col animate-slideIn`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t('order.currentOrder')}</h2>
            <p className="text-primary-50 text-sm mt-1">
              {items.length} {items.length === 1 ? t('order.itemNotes') : t('menu.items')}
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

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">{t('order.empty')}</h3>
              <p className="text-text-light">{t('order.addMoreItems')}</p>
            </div>
          ) : (
            items.map((orderItem) => {
              const images = getItemImages(orderItem.item);
              const mainImage = images.length > 0 ? getImageUrl(images[0]) : null;
              const itemName = language === 'ar' ? orderItem.item.nameAr : orderItem.item.name;
              const itemPrice = typeof orderItem.item.price === 'string'
                ? parseFloat(orderItem.item.price)
                : orderItem.item.price;

              return (
                <div
                  key={orderItem.item.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={itemName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-text text-base mb-1 truncate">{itemName}</h4>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(itemPrice)}
                        </span>
                        <span className="text-xs text-text-light">{t('common.sar')}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(orderItem.item.id, orderItem.quantity - 1)}
                          disabled={orderItem.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                          </svg>
                        </button>

                        <span className="w-10 text-center font-bold text-text text-lg">
                          {orderItem.quantity}
                        </span>

                        <button
                          onClick={() => onUpdateQuantity(orderItem.item.id, orderItem.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>

                        <button
                          onClick={() => onRemoveItem(orderItem.item.id)}
                          className="ml-auto p-2 hover:bg-error-50 text-error rounded-lg transition-colors"
                          title={t('order.removeItem')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Notes */}
                      {orderItem.notes && (
                        <div className="mt-2 text-xs text-text-light bg-gray-50 p-2 rounded-md border border-gray-200 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          <span className="font-semibold">{t('order.notes')}:</span> {orderItem.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-text-light font-medium">{t('order.subtotal')}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-text">
                        {formatCurrency(itemPrice * orderItem.quantity)}
                      </span>
                      <span className="text-xs text-text-light">{t('common.sar')}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
            {/* Total */}
            <div className="bg-white rounded-xl p-4 border-2 border-primary-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-light">{t('order.subtotal')}</span>
                <span className="text-text font-semibold">{formatCurrency(subtotal)} {t('common.sar')}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-lg font-bold text-text">{t('order.total')}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(subtotal)}
                  </span>
                  <span className="text-sm text-text-light font-semibold">{t('common.sar')}</span>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={onSendToKitchen}
              fullWidth
              className="shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{t('order.sendToKitchen')}</span>
            </Button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            transform: translateX(${language === 'ar' ? '-100%' : '100%'});
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
        /* Custom scrollbar styles for notes */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
};
