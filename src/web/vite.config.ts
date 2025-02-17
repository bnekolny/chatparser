import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  return {
    base: '/static/',
    plugins: [
      react(),
      viteCompression({algorithm: 'brotliCompress'}),
    ],
    server: {
      https: process.env.CI ? undefined : {
        key: '../.cert/key.pem',
        cert: '../.cert/cert.pem',
      },
      host: '0.0.0.0',
      port: 443,
      proxy: {
        '/api': {
          target: 'http://golang:8080',
          changeOrigin: true,
          //rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/assets': {
          target: 'http://golang:8080',
          changeOrigin: true,
          //rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          dict: resolve(__dirname, 'pages/dict.html'),
        },
      },
    },
  }
})
