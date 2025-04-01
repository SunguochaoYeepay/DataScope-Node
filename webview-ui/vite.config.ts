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
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          // 添加错误处理
          proxy.on('error', (err, req, res) => {
            console.error('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 设置正确的请求头
            proxyReq.setHeader('Origin', 'http://localhost:8080');
          });
        }
      }
    },
    cors: true, // 启用CORS
    headers: {
      // 设置正确的CSP策略
      'Content-Security-Policy': "default-src 'self' http://localhost:5000; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:5000 ws://localhost:5000"
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