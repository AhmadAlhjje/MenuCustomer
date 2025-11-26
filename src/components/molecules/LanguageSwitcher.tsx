import React from "react";
import { Button } from "../atoms/Button";
import { useI18n } from "@/hooks/useI18n";

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage, t } = useI18n();

  const toggleLanguage = () => {
    changeLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
      title={language === "ar" ? "English" : "العربية"}
      aria-label="Toggle language"
    >
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
</svg>
    </button>
  );
};
