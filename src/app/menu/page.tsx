'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
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
  const { t, language } = useI18n();
  const { sessionId } = useSessionGuard();
  const { success } = useNotification();
  const dispatch = useAppDispatch();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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
        setFilteredItems(itemsData);
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

  useEffect(() => {
    let filtered = items;

    if (selectedCategory !== null) {
      filtered = filtered.filter(item => item.categoryId === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item => {
        const name = language === 'ar' ? item.nameAr : item.name;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery, items, language]);

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart({ item, quantity: 1 }));
    success(t('item.addedToCart'));
  };

  if (loading) return <MainLayout><Loading /></MainLayout>;
  if (error) return <MainLayout><div className="text-error p-4 text-center">{error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">{t('menu.title')}</h1>
          <p className="text-text-light">{t('menu.browseMenu')}</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={t('menu.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pr-12 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-soft"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-primary text-white shadow-medium'
                  : 'bg-surface text-text-light hover:bg-primary-50 hover:text-primary border border-border'
              }`}
            >
              {t('menu.allCategories')}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-medium'
                    : 'bg-surface text-text-light hover:bg-primary-50 hover:text-primary border border-border'
                }`}
              >
                {language === 'ar' ? category.nameAr : category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">{t('menu.noItems')}</h3>
            <p className="text-text-light">{t('menu.tryDifferentSearch')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={() => handleAddToCart(item)}
                onViewDetails={() => router.push(`/item/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </MainLayout>
  );
}
