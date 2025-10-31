import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? process.env.VITE_API_URL || 'https://your-backend-url.zeabur.app'
          : 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})