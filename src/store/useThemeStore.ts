import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// 로컬 스토리지에서 테마 불러오기
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) return saved;

    // 시스템 설정 확인
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

// DOM에 테마 적용
const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof window !== 'undefined') {
    document.querySelector('html')?.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }
};

// 초기 테마 가져오기 및 적용
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeStore>(set => ({
  // 초기 테마 설정
  theme: initialTheme,

  // 테마 토글
  toggleTheme: () =>
    set(state => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      return { theme: newTheme };
    }),

  // 테마 설정
  setTheme: theme => {
    applyTheme(theme);
    set({ theme });
  },
}));
