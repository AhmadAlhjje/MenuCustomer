import React from 'react';
import { Button } from '../atoms/Button';
import { useI18n } from '@/hooks/useI18n';

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage, t } = useI18n();

  const toggleLanguage = () => {
    changeLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button variant="secondary" size="sm" onClick={toggleLanguage}>
      {language === 'ar' ? 'English' : 'العربية'}
    </Button>
  );
};
