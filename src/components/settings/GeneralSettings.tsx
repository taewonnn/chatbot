import { useThemeStore } from '../../store/useThemeStore';
import { useLanguageStore } from '../../store/useLanguageStore';

export default function GeneralSettings() {
  const { theme, setTheme } = useThemeStore(); // 테마
  const { language, setLanguage } = useLanguageStore(); // 언어

  return (
    <div className="space-y-6">
      <div>
        <label className="theme-text-secondary mb-3 block text-sm font-medium">테마</label>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              value="light"
              checked={theme === 'light'}
              onChange={e => setTheme(e.target.value as 'light' | 'dark')}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <span className="theme-text-secondary ml-3 text-sm">라이트 모드</span>
          </label>
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              value="dark"
              checked={theme === 'dark'}
              onChange={e => setTheme(e.target.value as 'light' | 'dark')}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <span className="theme-text-secondary ml-3 text-sm">다크 모드</span>
          </label>
        </div>
      </div>
      <div>
        <label className="theme-text-secondary mb-3 block text-sm font-medium">언어</label>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              value="ko"
              checked={language === 'ko'}
              onChange={e => setLanguage(e.target.value as 'ko' | 'en')}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <span className="theme-text-secondary ml-3 text-sm">한국어</span>
          </label>
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              value="en"
              checked={language === 'en'}
              onChange={e => setLanguage(e.target.value as 'ko' | 'en')}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <span className="theme-text-secondary ml-3 text-sm">English</span>
          </label>
        </div>
      </div>
    </div>
  );
}
