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
    },
  };
});
