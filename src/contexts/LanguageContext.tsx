import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from '../types';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  i18n: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languages: Language[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { t: i18nT, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const storedLang = localStorage.getItem('language') || 'fr';
    return languages.find(lang => lang.code === storedLang) || languages[0];
  });

  const setLanguage = (language: Language) => {
    i18n.changeLanguage(language.code).then(() => {
      localStorage.setItem('language', language.code);
      setCurrentLanguage(language);
    });
  };

  const t = (key: string): string => {
    return i18nT(key) || key;
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'fr';
    if (i18n.language !== storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, i18n }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { languages };