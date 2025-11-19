'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { Loading } from '@/components/atoms/Loading';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { useI18n } from '@/hooks/useI18n';
import { useSessionGuard } from '@/hooks/useSessionGuard';
import { useNotification } from '@/hooks/useNotification';
import { menuApi } from '@/api/menu';
import { MenuItem } from '@/api/types';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';
import { formatCurrency } from '@/utils/formatters';
import Image from 'next/image';

export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const { sessionId } = useSessionGuard();
  const { success } = useNotification();
  const dispatch = useAppDispatch();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemId = parseInt(params.itemId as string);
        const data = await menuApi.getItemById(itemId);
        setItem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchItem();
    }
  }, [sessionId, params.itemId]);

  const handleAddToCart = () => {
    if (item) {
      dispatch(addToCart({ item, quantity }));
      success(t('item.addedToCart'));
      router.push('/menu');
    }
  };

  if (loading) return <MainLayout><Loading /></MainLayout>;
  if (error || !item) return <MainLayout><div className="text-error">{error || 'Item not found'}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="secondary" onClick={() => router.back()}>
          {t('common.back')}
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          {item.image && (
            <div className="relative w-full h-80 mb-6 rounded overflow-hidden">
              <Image
                src={item.image}
                alt={isRTL ? item.nameAr : item.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold text-text mb-4">
            {isRTL ? item.nameAr : item.name}
          </h1>

          {item.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text mb-2">{t('item.description')}</h2>
              <p className="text-muted">{item.description}</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-primary font-bold text-2xl">
                {formatCurrency(item.price)} {t('common.sar')}
              </span>
            </div>
            {item.preparationTime && (
              <span className="text-muted">
                {item.preparationTime} {t('menu.minutes')}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">
              {t('cart.quantity')}
            </label>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="text-xl font-semibold">{quantity}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {!item.isAvailable && (
            <p className="text-error mb-4">{t('menu.unavailable')}</p>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            fullWidth
          >
            {t('menu.addToCart')}
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
}
