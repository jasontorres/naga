import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations } from './translations';

export type Locale = 'en' | 'bik';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      return (localStorage.getItem('naga.locale') as Locale) || 'en';
    } catch {
      return 'en';
    }
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem('naga.locale', l); } catch {}
    document.documentElement.setAttribute('lang', l === 'bik' ? 'bik' : 'en');
  }, []);

  const t = useCallback((key: string): string => {
    return translations[locale][key] ?? translations.en[key] ?? key;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
