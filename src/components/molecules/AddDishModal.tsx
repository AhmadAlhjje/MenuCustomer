'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/api/types';
import { Button } from '../atoms/Button';
import { useI18n } from '@/hooks/useI18n';
import { formatCurrency } from '@/utils/formatters';

interface AddDishModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem, quantity: number, notes: string) => void;
}

export const AddDishModal: React.FC<AddDishModalProps> = ({
  item,
  isOpen,
  onClose,
  onAdd,
}) => {
  const { t, language } = useI18n();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isOpen || !item) return null;

  const handleAdd = () => {
    onAdd(item, quantity, notes);
    setQuantity(1);
    setNotes('');
    onClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setNotes('');
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const itemName = language === 'ar' ? item.nameAr : item.name;
  const totalPrice = (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-surface rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{itemName}</h2>
              {item.description && (
                <p className="text-primary-50 text-sm line-clamp-2">{item.description}</p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price Display */}
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
            <div className="flex items-center justify-between">
              <span className="text-text-light font-medium">{t('menu.price')}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(typeof item.price === 'string' ? parseFloat(item.price) : item.price)}
                </span>
                <span className="text-sm text-text-light font-medium">{t('common.sar')}</span>
              </div>
            </div>
            {item.preparationTime && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-primary-100">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-text text-sm">
                  {t('menu.preparationTime')}: <span className="font-semibold">{item.preparationTime} {t('menu.minutes')}</span>
                </span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-text font-semibold mb-3 text-lg">
              {t('order.quantityLabel')}
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={decrementQuantity}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                </svg>
              </button>

              <div className="flex-1 text-center">
                <div className="text-4xl font-bold text-primary">{quantity}</div>
                <div className="text-text-light text-sm mt-1">{t('order.quantity')}</div>
              </div>

              <button
                onClick={incrementQuantity}
                className="w-12 h-12 flex items-center justify-center bg-primary hover:bg-primary-dark active:scale-95 rounded-xl transition-all shadow-md"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-text font-semibold mb-3 text-lg">
              {t('order.notesLabel')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('order.itemNotesPlaceholder')}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
              rows={3}
            />
          </div>

          {/* Total Price */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-5 border-2 border-primary-200">
            <div className="flex items-center justify-between">
              <span className="text-text font-bold text-lg">{t('order.total')}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(totalPrice)}
                </span>
                <span className="text-base text-text-light font-semibold">{t('common.sar')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface p-6 border-t border-border rounded-b-2xl">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleClose}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleAdd}
              className="flex-[2] shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{t('menu.addToOrder')}</span>
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
