import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react/jsx-runtime']  // 👈 important for proper React ESM imports
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true  // 👈 helps with some ESM/CJS mismatches
    }
  }
})
