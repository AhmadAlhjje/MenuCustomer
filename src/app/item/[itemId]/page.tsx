'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { Loading } from '@/components/atoms/Loading';
import { Button } from '@/components/atoms/Button';
import { useI18n } from '@/hooks/useI18n';
import { useSessionGuard } from '@/hooks/useSessionGuard';
import { useNotification } from '@/hooks/useNotification';
import { menuApi } from '@/api/menu';
import { MenuItem } from '@/api/types';
import { useAppDispatch } from '@/store';
import { addToOrder } from '@/store/slices/orderSlice';
import { formatCurrency } from '@/utils/formatters';
import Image from 'next/image';
import { AddDishModal } from '@/components/molecules/AddDishModal';

const getItemImages = (item: MenuItem): string[] => {
  if (item.images) {
    // إذا كانت images مصفوفة جاهزة
    if (Array.isArray(item.images)) {
      return item.images;
    }
    // إذا كانت string تحتاج parsing
    try {
      const parsed = JSON.parse(item.images as string);
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

export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useI18n();
  const { sessionId } = useSessionGuard();
  const { success } = useNotification();
  const dispatch = useAppDispatch();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddDish = (selectedItem: MenuItem, quantity: number, notes: string) => {
    dispatch(addToOrder({ item: selectedItem, quantity, notes }));
    const itemName = language === 'ar' ? selectedItem.nameAr : selectedItem.name;
    success(t('order.addedToOrder').replace('{{item}}', itemName));
  };

  if (loading) return <MainLayout><Loading /></MainLayout>;
  if (error || !item) return <MainLayout><div className="text-error p-4 text-center">{error || 'Item not found'}</div></MainLayout>;

  const images = getItemImages(item);
  const itemName = language === 'ar' ? item.nameAr : item.name;
  const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-text hover:text-primary transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('common.back')}</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              {images.length > 0 ? (
                <Image
                  src={getImageUrl(images[selectedImageIndex])}
                  alt={itemName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                  <svg className="w-24 h-24 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-error text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl">
                    {t('menu.unavailable')}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? 'ring-4 ring-primary shadow-lg scale-105'
                        : 'ring-2 ring-gray-200 hover:ring-primary-light opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt={`${itemName} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="flex flex-col">
            <div className="flex-1">
              {/* Category Badge */}
              {item.category && (
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-primary-50 text-primary rounded-full text-sm font-semibold">
                    {language === 'ar' ? item.category.nameAr : item.category.name}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 leading-tight">
                {itemName}
              </h1>

              {/* Description */}
              {item.description && (
                <p className="text-text-light text-lg mb-6 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Price Card */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-5 border-2 border-primary-200">
                  <div className="text-text-light text-sm mb-1 font-medium">{t('menu.price')}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(itemPrice)}
                    </span>
                    <span className="text-sm text-text-light font-semibold">{t('common.sar')}</span>
                  </div>
                </div>

                {/* Preparation Time Card */}
                {item.preparationTime && (
                  <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                    <div className="text-text-light text-sm mb-1 font-medium">{t('menu.preparationTime')}</div>
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-2xl font-bold text-text">
                        {item.preparationTime} <span className="text-base font-medium">{t('menu.minutes')}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="sticky bottom-0 bg-surface pt-6 border-t border-gray-200">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                disabled={!item.isAvailable}
                fullWidth
                className="shadow-xl text-lg py-4"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{t('menu.selectDish')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Dish Modal */}
      <AddDishModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddDish}
      />
    </MainLayout>
  );
}
