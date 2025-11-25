import React from 'react';
import Link from 'next/link';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { useI18n } from '@/hooks/useI18n';
import { useAppSelector } from '@/store';

export const Header: React.FC = () => {
  const { t } = useI18n();
  const orderItems = useAppSelector((state) => state.order.items);
  const orderCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/menu" className="text-2xl font-bold text-primary">
            {t('menu.title')}
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};
