import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import string from 'vite-plugin-string'; // ✅ Import plugin

export default defineConfig({
  plugins: [
    react(),
    string({
      include: ['**/*.html'], // ✅ Treat all .css files as raw strings
    }),
  ],
  optimizeDeps: {
    include: ['react/jsx-runtime'], // ✅ Your existing setting
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // ✅ Your existing setting
    },
  },
});
