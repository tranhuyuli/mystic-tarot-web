import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationSchema, TRANSLATIONS } from '../i18n/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LANG_STORAGE_KEY = 'mystic_tarot_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (stored === 'vi' || stored === 'en') return stored;
    } catch {}
    return 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'vi') {
      document.title = 'Tâm An Tarot - Trực Giác & Chữa Lành Tâm Hồn';
    } else {
      document.title = 'Tam An Tarot - Intuitive Healing & Cosmic Wisdom';
    }
  }, [language]);

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
