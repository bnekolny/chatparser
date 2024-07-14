import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  return {
    base: '/static/',
    plugins: [
      react(),
      viteCompression({algorithm: 'brotliCompress'}),
    ],
    server: {
      https: {
        key: '../.cert/key.pem',
        cert: '../.cert/cert.pem',
      },
      host: '0.0.0.0',
      port: 443,
      proxy: {
        '/api': {
          target: 'http://chatparser:8080',
          changeOrigin: true,
          //rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    },
    build: {
      sourcemap: false
    }
  }
})
