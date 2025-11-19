'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { CartItemCard } from '@/components/molecules/CartItemCard';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { useI18n } from '@/hooks/useI18n';
import { useSessionGuard } from '@/hooks/useSessionGuard';
import { useNotification } from '@/hooks/useNotification';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateQuantity, updateItemNotes, removeFromCart, setOrderNotes, clearCart } from '@/store/slices/cartSlice';
import { ordersApi } from '@/api/orders';
import { formatCurrency } from '@/utils/formatters';

export default function CartPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { sessionId } = useSessionGuard();
  const { success, error } = useNotification();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const orderNotes = useAppSelector((state) => state.cart.orderNotes);

  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!sessionId || cartItems.length === 0) return;

    setLoading(true);
    try {
      await ordersApi.createOrder({
        sessionId,
        items: cartItems.map((item) => ({
          itemId: item.item.id,
          quantity: item.quantity,
          notes: item.notes,
        })),
        notes: orderNotes,
      });

      success(t('cart.orderSuccess'));
      dispatch(clearCart());
      router.push('/menu');
    } catch (err: any) {
      error(err.response?.data?.message || t('cart.orderError'));
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-text mb-4">{t('cart.title')}</h1>
          <p className="text-muted mb-6">{t('cart.empty')}</p>
          <Button variant="primary" onClick={() => router.push('/menu')}>
            {t('cart.addItems')}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-text mb-6">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((cartItem) => (
            <CartItemCard
              key={cartItem.item.id}
              cartItem={cartItem}
              onQuantityChange={(quantity) =>
                dispatch(updateQuantity({ itemId: cartItem.item.id, quantity }))
              }
              onNotesChange={(notes) =>
                dispatch(updateItemNotes({ itemId: cartItem.item.id, notes }))
              }
              onRemove={() => dispatch(removeFromCart(cartItem.item.id))}
            />
          ))}

          <div className="bg-surface rounded shadow-md p-4">
            <Textarea
              label={t('cart.orderNotes')}
              placeholder={t('cart.orderNotes')}
              value={orderNotes || ''}
              onChange={(e) => dispatch(setOrderNotes(e.target.value))}
              rows={3}
              fullWidth
            />
          </div>
        </div>

        <div>
          <div className="bg-surface rounded shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-text mb-4">{t('cart.orderSummary')}</h2>

            <div className="space-y-2 mb-6">
              {cartItems.map((cartItem) => (
                <div key={cartItem.item.id} className="flex justify-between text-sm">
                  <span className="text-muted">
                    {cartItem.quantity}x {cartItem.item.nameAr || cartItem.item.name}
                  </span>
                  <span className="text-text">
                    {formatCurrency(cartItem.item.price * cartItem.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-text">{t('cart.total')}</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(total)} {t('common.sar')}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handlePlaceOrder}
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {t('cart.placeOrder')}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
