import React from 'react';
import { MenuItem } from '@/api/types';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { useI18n } from '@/hooks/useI18n';
import { formatCurrency } from '@/utils/formatters';
import Image from 'next/image';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  onViewDetails,
}) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="flex flex-col h-full">
      {item.image && (
        <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
          <Image
            src={item.image}
            alt={isRTL ? item.nameAr : item.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-text mb-2">
        {isRTL ? item.nameAr : item.name}
      </h3>
      {item.description && (
        <p className="text-muted text-sm mb-3 line-clamp-2">{item.description}</p>
      )}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-primary font-bold text-lg">
            {formatCurrency(item.price)} {t('common.sar')}
          </span>
          {item.preparationTime && (
            <span className="text-muted text-sm">
              {item.preparationTime} {t('menu.minutes')}
            </span>
          )}
        </div>
        {!item.isAvailable && (
          <p className="text-error text-sm mb-2">{t('menu.unavailable')}</p>
        )}
        <div className="flex gap-2">
          {onViewDetails && (
            <Button variant="secondary" size="sm" onClick={onViewDetails} fullWidth>
              {t('menu.viewDetails')}
            </Button>
          )}
          {onAddToCart && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAddToCart}
              disabled={!item.isAvailable}
              fullWidth
            >
              {t('menu.addToCart')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
