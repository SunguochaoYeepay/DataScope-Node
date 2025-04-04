import { defineConfig, loadEnv as viteLoadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 读取环境变量
  const env = viteLoadEnv(mode, process.cwd());
  const useMockApi = env.VITE_USE_MOCK_API === 'true';
  
  console.log(`构建模式: ${mode}, 使用Mock API: ${useMockApi}`);
  
  return {
    plugins: [vue()],
    base: '/',  // 这里定义应用的基础路径
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3200, // 修改为3200端口，避免与现有服务冲突
      strictPort: true, // 强制使用指定端口，如果被占用则退出
      cors: true, // 启用CORS
      proxy: {
        // API请求代理配置
        '/api': {
          // 在Mock模式下，将API请求代理到本地接口
          target: useMockApi ? 'http://localhost:4000' : 'http://localhost:3100',
          changeOrigin: true,
          secure: false
        }
      },
      headers: {
        // 更新CSP策略，确保允许本地样式加载
        'Content-Security-Policy': "default-src 'self' http://localhost:3100; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:3100 ws://localhost:3100"
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
  }
})