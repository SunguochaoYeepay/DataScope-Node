import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/',  // 这里定义应用的基础路径
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    cors: true, // 启用CORS
    headers: {
      // 更新CSP策略，确保允许本地样式加载
      'Content-Security-Policy': "default-src 'self' http://localhost:5000; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:5000 ws://localhost:5000 http://localhost:8080 ws://localhost:8080"
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 生产环境移除 console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})