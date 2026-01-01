import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, Language } from '@/i18n/translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: () => boolean;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      
      setLanguage: (lang) => {
        set({ language: lang });
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      },
      
      t: (key: string) => {
        const { language } = get();
        const keys = key.split('.');
        let value: any = translations[language];
        
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            // Fallback to English
            value = translations.en;
            for (const fallbackKey of keys) {
              if (value && typeof value === 'object' && fallbackKey in value) {
                value = value[fallbackKey];
              } else {
                return key; // Return key if not found
              }
            }
            break;
          }
        }
        
        return typeof value === 'string' ? value : key;
      },
      
      isRTL: () => get().language === 'ar',
    }),
    {
      name: 'salada-language',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = state.language;
        }
      },
    }
  )
);
