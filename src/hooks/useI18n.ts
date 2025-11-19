import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    if (savedLang && savedLang !== i18n.language) {
      changeLanguage(savedLang);
    } else {
      document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  return {
    t,
    language: i18n.language,
    changeLanguage,
    isRTL: i18n.language === 'ar',
  };
};
