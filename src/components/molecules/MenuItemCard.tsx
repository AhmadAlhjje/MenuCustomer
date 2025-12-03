import React from 'react';
import { MenuItem } from '@/api/types';
import { Button } from '../atoms/Button';
import { useI18n } from '@/hooks/useI18n';
import { formatCurrency } from '@/utils/formatters';
import Image from 'next/image';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
}

// دالة مساعدة لاستخراج الصور
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

// دالة مساعدة لبناء رابط الصورة
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath}`;
};

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  onViewDetails,
}) => {
  const { t, language } = useI18n();
  const images = getItemImages(item);
  const mainImage = images.length > 0 ? getImageUrl(images[0]) : null;

  return (
    <div className="group bg-surface rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/20 flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={language === 'ar' ? item.nameAr : item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <svg className="w-16 h-16 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Image Counter Badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{images.length}</span>
          </div>
        )}

        {/* Availability Badge */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-error text-white px-4 py-2 rounded-full font-semibold text-sm">
              {t('menu.unavailable')}
            </span>
          </div>
        )}

        {/* Quick View Button */}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-md"
          >
            <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-text line-clamp-1 flex-1">
            {language === 'ar' ? item.nameAr : item.name}
          </h3>
          {item.category && (
            <span className="px-2 py-1 bg-primary-50 text-primary text-xs font-semibold rounded-md whitespace-nowrap">
              {language === 'ar' ? item.category.nameAr : item.category.name}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-text-light text-sm mb-3 line-clamp-2 flex-grow">
            {item.description}
          </p>
        )}

        {/* Price and Time */}
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-border-light">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(typeof item.price === 'string' ? parseFloat(item.price) : item.price)}
            </span>
            <span className="text-sm text-text-light font-medium">
              {t('common.sar')}
            </span>
          </div>

          {item.preparationTime && (
            <div className="flex items-center gap-1.5 text-text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                {item.preparationTime} {t('menu.minutes')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="md"
              onClick={onViewDetails}
              className="flex-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">{t('menu.viewDetails')}</span>
            </Button>
          )}
          {onAddToCart && (
            <Button
              variant="primary"
              size="md"
              onClick={onAddToCart}
              disabled={!item.isAvailable}
              className="flex-1 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{t('menu.selectDish')}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
