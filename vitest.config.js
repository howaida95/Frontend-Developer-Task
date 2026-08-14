import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      '@features': path.resolve(process.cwd(), 'src/features'),
      '@shared': path.resolve(process.cwd(), 'src/shared'),
      '@layouts': path.resolve(process.cwd(), 'src/layouts'),
      '@routes': path.resolve(process.cwd(), 'src/routes'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    include: ['src/test/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['e2e/**', 'dist/**', 'node_modules/**'],
    coverage: {
      all: false,
      exclude: ['src/test/**'],
    },
  },
});
