import React from 'react';
import { CartItem } from '@/store/slices/cartSlice';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { useI18n } from '@/hooks/useI18n';
import { formatCurrency } from '@/utils/formatters';

interface CartItemCardProps {
  cartItem: CartItem;
  onQuantityChange: (quantity: number) => void;
  onNotesChange: (notes: string) => void;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  cartItem,
  onQuantityChange,
  onNotesChange,
  onRemove,
}) => {
  const { t, isRTL } = useI18n();

  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-text">
            {isRTL ? cartItem.item.nameAr : cartItem.item.name}
          </h3>
          <p className="text-primary font-bold">
            {formatCurrency(cartItem.item.price * cartItem.quantity)} {t('common.sar')}
          </p>
        </div>
        <Button variant="danger" size="sm" onClick={onRemove}>
          {t('common.delete')}
        </Button>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-text mb-1">
          {t('cart.quantity')}
        </label>
        <Input
          type="number"
          min="1"
          value={cartItem.quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
          fullWidth
        />
      </div>

      <Textarea
        label={t('cart.itemNotes')}
        placeholder={t('cart.notes')}
        value={cartItem.notes || ''}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={2}
        fullWidth
      />
    </Card>
  );
};
