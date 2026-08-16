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
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['dist/**', 'node_modules/**', 'e2e/**'],
    coverage: {
      all: false,
      exclude: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    },
  },
});
