import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/static/',
  plugins: [react()],
  server: {
    host: true,
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://chatparser:8080',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
