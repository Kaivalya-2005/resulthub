import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  build: {
    commonjsOptions: {
      include: [/lucide-react/],
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
