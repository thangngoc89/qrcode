import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative asset paths work out-of-the-box on GitHub Pages
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
