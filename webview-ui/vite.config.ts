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
      port: 3100, // 修改为固定端口3100
      strictPort: true, // 强制使用指定端口，如果被占用则退出
      cors: true, // 启用CORS
      proxy: useMockApi ? undefined : {
        // 配置代理，仅在非Mock模式下启用
        '/api': {
          target: 'http://localhost:3100',
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