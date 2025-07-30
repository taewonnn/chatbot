/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/hooks/**/*.{js,jsx,ts,tsx}',
    './src/store/**/*.{js,jsx,ts,tsx}',
    './src/utils/**/*.{js,jsx,ts,tsx}',
    './src/api/**/*.{js,jsx,ts,tsx}',
    './src/config/**/*.{js,jsx,ts,tsx}',
    './src/firebase/**/*.{js,jsx,ts,tsx}',
    './src/guards/**/*.{js,jsx,ts,tsx}',
    './src/router/**/*.{js,jsx,ts,tsx}',
    './src/types/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'sans-serif',
        ],
      },

      colors: {
        666: '#666666',
        999: '#999999',
      },
      screens: {
        xs: '320px', // 매우 작은 모바일 디바이스
        sm: '480px', // 커스텀 소형 디바이스
        md: '768px', // 중형 디바이스
        lg: '1024px', // 대형 디바이스
        xl: '1280px', // 초대형 디바이스
        '2xl': '1536px', // 제일 큰 화면
      },
    },
  },
  plugins: [],
};
