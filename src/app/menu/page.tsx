'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { CategoryCard } from '@/components/molecules/CategoryCard';
import { MenuItemCard } from '@/components/molecules/MenuItemCard';
import { Loading } from '@/components/atoms/Loading';
import { useI18n } from '@/hooks/useI18n';
import { useSessionGuard } from '@/hooks/useSessionGuard';
import { useNotification } from '@/hooks/useNotification';
import { menuApi } from '@/api/menu';
import { Category, MenuItem } from '@/api/types';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';

export default function MenuPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { sessionId } = useSessionGuard();
  const { success } = useNotification();
  const dispatch = useAppDispatch();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, itemsData] = await Promise.all([
          menuApi.getAllCategories(),
          menuApi.getAllItems(),
        ]);
        setCategories(categoriesData);
        setItems(itemsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchData();
    }
  }, [sessionId]);

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart({ item, quantity: 1 }));
    success(t('item.addedToCart'));
  };

  if (loading) return <MainLayout><Loading /></MainLayout>;
  if (error) return <MainLayout><div className="text-error">{error}</div></MainLayout>;

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-text mb-6">{t('menu.title')}</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-text mb-4">{t('menu.categories')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => router.push(`/menu/${category.id}`)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-text mb-4">{t('menu.items')}</h2>
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
      </div>
    </MainLayout>
  );
}
