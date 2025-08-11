import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3003,
      open: true,
    },
    base: '/',
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Firebase 관련 라이브러리들을 별도 청크로 분리
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/functions'],
            // React 관련 라이브러리들을 별도 청크로 분리
            react: ['react', 'react-dom'],
            // 라우터 관련 라이브러리들을 별도 청크로 분리
            router: ['react-router-dom'],
            // UI 라이브러리들을 별도 청크로 분리
            ui: ['react-icons', 'react-markdown'],
            // 유틸리티 라이브러리들을 별도 청크로 분리
            utils: ['zustand', 'react-hook-form'],
          },
        },
      },
    },
  };
});
