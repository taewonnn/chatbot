import { useState } from 'react';

export default function GeneralSettings() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">테마</label>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              value="light"
              checked={theme === 'light'}
              onChange={e => setTheme(e.target.value as 'light' | 'dark')}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">라이트 모드</span>
          </label>
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              value="dark"
              checked={theme === 'dark'}
              onChange={e => setTheme(e.target.value as 'light' | 'dark')}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">다크 모드</span>
          </label>
        </div>
      </div>
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">언어</label>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              value="ko"
              checked={language === 'ko'}
              onChange={e => setLanguage(e.target.value as 'ko' | 'en')}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">한국어</span>
          </label>
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              value="en"
              checked={language === 'en'}
              onChange={e => setLanguage(e.target.value as 'ko' | 'en')}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">English</span>
          </label>
        </div>
      </div>
    </div>
  );
}
