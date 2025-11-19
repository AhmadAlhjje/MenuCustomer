import React from 'react';
import { Category } from '@/api/types';
import { Card } from '../atoms/Card';
import { useI18n } from '@/hooks/useI18n';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const { isRTL } = useI18n();

  return (
    <Card onClick={onClick} className="hover:border-primary border-2 border-transparent">
      <h3 className="text-xl font-bold text-text mb-2">
        {isRTL ? category.nameAr : category.name}
      </h3>
      {category.description && (
        <p className="text-muted text-sm">{category.description}</p>
      )}
    </Card>
  );
};
