"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Import translations
import enTranslations from './translations/en.json';
import deTranslations from './translations/de.json';
import frTranslations from './translations/fr.json';

type Language = 'en' | 'de' | 'fr';

type Translations = {
  [key: string]: any;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: Translations;
  availableLanguages: { code: Language; name: string }[];
}

const translations: Record<Language, Translations> = {
  en: enTranslations,
  de: deTranslations,
  fr: frTranslations,
};

const availableLanguages = [
  { code: 'en' as Language, name: 'English' },
  { code: 'de' as Language, name: 'Deutsch' },
  { code: 'fr' as Language, name: 'Français' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for stored language preference
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['en', 'de', 'fr'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    } else {
      // Default to browser language if available and supported
      const browserLang = navigator.language.split('-')[0] as Language;
      if (['en', 'de', 'fr'].includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Optional: Refresh the page to apply translations everywhere
    // router.refresh();
  };

  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to English if translation is missing
        let fallback = translations.en;
        for (const fallbackKey of keys) {
          if (fallback && fallback[fallbackKey] !== undefined) {
            fallback = fallback[fallbackKey];
          } else {
            return key; // Return the key if no translation found
          }
        }
        value = typeof fallback === 'string' ? fallback : key;
        break;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters in the translation string if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(`{${paramKey}}`, paramValue);
      });
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      translations: translations[language],
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
