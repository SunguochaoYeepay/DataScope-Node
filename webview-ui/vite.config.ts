import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/',  // 这里定义应用的基础路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000, // 修改端口为3000避免与其他服务冲突
    cors: true, // 启用CORS
    proxy: {
      // 配置代理
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    headers: {
      // 更新CSP策略，确保允许本地样式加载
      'Content-Security-Policy': "default-src 'self' http://localhost:5000; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:5000 ws://localhost:5000 http://localhost:3000 ws://localhost:3000"
    },
    strictPort: false // 允许尝试其他端口，如果3000被占用
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