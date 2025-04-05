// 极简Vite配置，避免复杂问题
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 简单的Mock插件，避免依赖Node.js模块
function createSimpleMockPlugin() {
  return {
    name: 'vite:simple-mock',
    configureServer(server) {
      // 非常简单的中间件，避免使用复杂的Node API
      server.middlewares.use((req, res, next) => {
        // 只处理API请求
        if (req.url && req.url.startsWith('/api/')) {
          console.log('[简易Mock] 拦截请求:', req.url);
          
          // 简单的Mock数据处理
          const responseData = {
            success: true,
            message: '这是Mock数据',
            data: { mockEnabled: true }
          };
          
          // 返回JSON响应
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(responseData));
          return;
        }
        
        // 非API请求交给下一个中间件
        next();
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSimpleMockPlugin() // 使用简单的Mock插件
  ],
  base: '/', 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 极简优化依赖配置
  optimizeDeps: {
    exclude: ['fsevents']
  },
  // 极简服务器配置
  server: {
    host: 'localhost',
    port: 8080,
    hmr: true
  }
})
