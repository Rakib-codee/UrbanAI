import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { useState, useEffect } from 'react';
import i18n from './i18n';

// Custom hook to use translation with language switching
export function useTranslation() {
  const { t, i18n: i18nInstance } = useTranslationOriginal();
  const [language, setLanguage] = useState<string>(i18nInstance.language);

  // Function to change language
  const changeLanguage = (lng: string) => {
    i18nInstance.changeLanguage(lng);
    setLanguage(lng);
    // Save language preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
  };

  useEffect(() => {
    // Update state when language changes
    const handleLanguageChanged = (lng: string) => {
      setLanguage(lng);
    };

    i18nInstance.on('languageChanged', handleLanguageChanged);

    return () => {
      i18nInstance.off('languageChanged', handleLanguageChanged);
    };
  }, [i18nInstance]);

  return {
    t,
    i18n: i18nInstance,
    language,
    changeLanguage,
    // Helper function to check if current language is Bengali
    isBangla: language === 'bn',
    // Helper function to check if current language is English
    isEnglish: language === 'en',
    // Helper function to check if current language is Chinese
    isChinese: language === 'zh'
  };
}

// Language options for selection UI
export const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' }
];

// Initialize i18n
export function initI18n() {
  // Make sure i18n is initialized
  return i18n;
} 