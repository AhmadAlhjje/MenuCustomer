'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { MenuItemCard } from '@/components/molecules/MenuItemCard';
import { AddDishModal } from '@/components/molecules/AddDishModal';
import { OrderList } from '@/components/organisms/OrderList';
import { CustomerOrders } from '@/components/organisms/CustomerOrders';
import { Loading } from '@/components/atoms/Loading';
import { useI18n } from '@/hooks/useI18n';
import { useSessionGuard } from '@/hooks/useSessionGuard';
import { useNotification } from '@/hooks/useNotification';
import { menuApi } from '@/api/menu';
import { ordersApi } from '@/api/orders';
import { Category, MenuItem } from '@/api/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToOrder, updateOrderItemQuantity, removeFromOrder, clearOrder } from '@/store/slices/orderSlice';
import { clearSession } from '@/store/slices/sessionSlice';
import { storage } from '@/utils/storage';

export default function MenuPage() {
  const router = useRouter();
  const { t, language } = useI18n();
  const { sessionId } = useSessionGuard();
  const { success, error: showError } = useNotification();
  const dispatch = useAppDispatch();
  const orderItems = useAppSelector((state) => state.order.items);

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderListOpen, setIsOrderListOpen] = useState(false);
  const [isCustomerOrdersOpen, setIsCustomerOrdersOpen] = useState(false);

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

  const handleSelectDish = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddDish = (item: MenuItem, quantity: number, notes: string) => {
    dispatch(addToOrder({ item, quantity, notes }));
    const itemName = language === 'ar' ? item.nameAr : item.name;
    success(t('order.addedToOrder').replace('{{item}}', itemName));
  };

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromOrder(itemId));
    } else {
      dispatch(updateOrderItemQuantity({ itemId, quantity }));
    }
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromOrder(itemId));
  };

  const handleSendToKitchen = async () => {
    if (!sessionId) {
      showError(t('session.sessionError'));
      return;
    }

    try {
      const items = orderItems.map((orderItem) => ({
        itemId: orderItem.item.id,
        quantity: orderItem.quantity,
        notes: orderItem.notes || '',
      }));

      await ordersApi.createOrder({
        sessionId: typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId,
        items: items,
      });

      dispatch(clearOrder());
      setIsOrderListOpen(false);
      success(t('order.orderSuccess'));
    } catch (err: any) {
      showError(err.message || t('order.orderError'));
    }
  };

  const handleEndSession = () => {
    dispatch(clearSession());
    storage.clearSession();
    success(t('session.sessionEnded') || 'تم إنهاء الجلسة بنجاح');
    router.push('/');
  };

  if (loading) return <MainLayout><Loading /></MainLayout>;
  if (error) return <MainLayout><div className="text-error p-4 text-center">{error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto pb-24">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            {/* <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">{t('menu.title')}</h1> */}
            <p className="text-text-light">{t('menu.browseMenu')}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Customer Orders Button */}
            <button
              onClick={() => setIsCustomerOrdersOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              title={t('order.myOrders') || 'طلباتي'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="hidden sm:inline">{t('order.myOrders') || 'طلباتي'}</span>
            </button>

            {/* End Session Button */}
            <button
              onClick={handleEndSession}
              className="bg-error hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              title={t('session.endSession') || 'إنهاء الجلسة'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">{t('session.endSession') || 'إنهاء'}</span>
            </button>
          </div>
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
                onAddToCart={() => handleSelectDish(item)}
                onViewDetails={() => router.push(`/item/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Dish Modal */}
      <AddDishModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddDish}
      />

      {/* Order List */}
      <OrderList
        items={orderItems}
        isOpen={isOrderListOpen}
        onClose={() => setIsOrderListOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onSendToKitchen={handleSendToKitchen}
      />

      {/* Customer Orders */}
      {sessionId && (
        <CustomerOrders
          sessionId={typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId}
          isOpen={isCustomerOrdersOpen}
          onClose={() => setIsCustomerOrdersOpen(false)}
        />
      )}

      {/* Floating Order Button */}
      {orderItems.length > 0 && (
        <button
          onClick={() => setIsOrderListOpen(true)}
          className="fixed bottom-6 right-6 left-6 sm:left-auto sm:right-6 sm:w-auto bg-error hover:bg-red-600 text-white px-6 py-4 rounded-xl font-semibold shadow-2xl transition-all hover:scale-105 flex items-center justify-center sm:justify-start gap-3 z-40 animate-bounce"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span className="flex items-center gap-2">
            <span>{t('order.currentOrder')}</span>
            <span className="bg-error text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              {orderItems.length}
            </span>
          </span>
        </button>
      )}

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-0.5rem);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </MainLayout>
  );
}
