import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3003,
    open: true,
  },
  base: '/', // ✅ Vercel에서는 base: '/' 로 설정
});
