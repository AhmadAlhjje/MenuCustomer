import React from 'react';
import { Button } from '../atoms/Button';
import { useI18n } from '@/hooks/useI18n';

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage, t } = useI18n();

  const toggleLanguage = () => {
    changeLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
      title={language === 'ar' ? 'English' : 'العربية'}
      aria-label="Toggle language"
    >
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502-.684l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v1M3 5l5.68 5.68m0 0l1.414-1.414m-1.414 1.414l1.414 1.414m0 0l5.68 5.68M9 5a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
      </svg>
    </button>
  );
};
