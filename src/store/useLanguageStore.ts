import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ko' | 'en';

interface ILanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<ILanguageStore>()(
  persist(
    set => ({
      language: 'ko',
      setLanguage: (language: Language) => {
        set({ language: language });
      },
    }),
    {
      name: 'language-storage', // localstorage 이름
    },
  ),
);
