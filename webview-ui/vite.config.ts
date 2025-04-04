import { defineConfig, loadEnv as viteLoadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import { createMockServerMiddleware } from './src/plugins/serverMock'
import type { Plugin } from 'vite'

// 创建自定义Mock插件
function createMockServerPlugin(): Plugin {
  return {
    name: 'vite:mock-server',
    configureServer(server) {
      // 注册中间件，确保它在最前面处理请求
      server.middlewares.use(createMockServerMiddleware());
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 读取环境变量
  const env = viteLoadEnv(mode, process.cwd());
  const useMockApi = env.VITE_USE_MOCK_API === 'true';
  
  console.log(`构建模式: ${mode}, 使用Mock API: ${useMockApi}`);
  
  const plugins = [vue()];
  
  // 如果启用Mock模式，添加Mock服务器插件
  if (useMockApi) {
    plugins.push(createMockServerPlugin());
  }
  
  return {
    plugins,
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
      // 根据模式选择代理或内置Mock
      ...(useMockApi ? {
        // 在Mock模式下，不使用代理
      } : {
        // 在正常模式下，使用代理
        proxy: {
          // API请求代理配置
          '/api': {
            target: 'http://localhost:3100',
            changeOrigin: true,
            secure: false
          }
        }
      }),
      headers: {
        // 更新CSP策略，确保允许本地样式加载和Axios的使用
        'Content-Security-Policy': "default-src 'self' http://localhost:3100 https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:3100 ws://localhost:3100"
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