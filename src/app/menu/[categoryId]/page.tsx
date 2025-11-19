'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { MenuItemCard } from '@/components/molecules/MenuItemCard';
import { Loading } from '@/components/atoms/Loading';
import { Button } from '@/components/atoms/Button';
import { useI18n } from '@/hooks/useI18n';
import { useSessionGuard } from '@/hooks/useSessionGuard';
import { useNotification } from '@/hooks/useNotification';
import { menuApi } from '@/api/menu';
import { MenuItem } from '@/api/types';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const { sessionId } = useSessionGuard();
  const { success } = useNotification();
  const dispatch = useAppDispatch();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const categoryId = parseInt(params.categoryId as string);
        const data = await menuApi.getItemsByCategory(categoryId);
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchItems();
    }
  }, [sessionId, params.categoryId]);

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart({ item, quantity: 1 }));
    success(t('item.addedToCart'));
  };

  if (loading) return <MainLayout><Loading /></MainLayout>;
  if (error) return <MainLayout><div className="text-error">{error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="secondary" onClick={() => router.back()}>
          {t('common.back')}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-muted py-12">
          <p>{t('menu.noItems')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={() => handleAddToCart(item)}
              onViewDetails={() => router.push(`/item/${item.id}`)}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
