import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';

const srcPath = (directory = '') => path.resolve(process.cwd(), 'src', directory);

export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '@': srcPath(),
      '@features': srcPath('features'),
      '@shared': srcPath('shared'),
      '@layouts': srcPath('layouts'),
      '@routes': srcPath('routes'),
      '@services': srcPath('services'),
      '@store': srcPath('store'),
      '@assets': srcPath('assets'),
      'styles': srcPath('styles')
    },
  },
  server: {
    port: 5173,
  },
});
