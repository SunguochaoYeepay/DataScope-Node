import { defineConfig, loadEnv, Plugin, Connect } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { execSync } from 'child_process'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import createMockMiddleware from './src/mock/middleware'
import { createSimpleMiddleware } from './src/mock/middleware/simple'
import fs from 'fs'
import { ServerResponse } from 'http'

// 强制释放端口函数
function killPort(port: number) {
  console.log(`[Vite] 检查端口 ${port} 占用情况`);
  try {
    if (process.platform === 'win32') {
      execSync(`netstat -ano | findstr :${port}`);
      execSync(`taskkill /F /pid $(netstat -ano | findstr :${port} | awk '{print $5}')`, { stdio: 'inherit' });
    } else {
      execSync(`lsof -i :${port} -t | xargs kill -9`, { stdio: 'inherit' });
    }
    console.log(`[Vite] 已释放端口 ${port}`);
  } catch (e) {
    console.log(`[Vite] 端口 ${port} 未被占用或无法释放`);
  }
}

// 强制清理Vite缓存
function cleanViteCache() {
  console.log('[Vite] 清理依赖缓存');
  const cachePaths = [
    './node_modules/.vite',
    './node_modules/.vite_*',
    './.vite',
    './dist',
    './tmp',
    './.temp'
  ];
  
  cachePaths.forEach(cachePath => {
    try {
      if (fs.existsSync(cachePath)) {
        if (fs.lstatSync(cachePath).isDirectory()) {
          execSync(`rm -rf ${cachePath}`);
        } else {
          fs.unlinkSync(cachePath);
        }
        console.log(`[Vite] 已删除: ${cachePath}`);
      }
    } catch (e) {
      console.log(`[Vite] 无法删除: ${cachePath}`, e);
    }
  });
}

// 清理Vite缓存
cleanViteCache();

// 尝试释放开发服务器端口
killPort(8080);

// 创建Mock API插件
function createMockApiPlugin(useMock: boolean, useSimpleMock: boolean): Plugin | null {
  if (!useMock && !useSimpleMock) {
    return null;
  }
  
  // 加载中间件
  const mockMiddleware = useMock ? createMockMiddleware() : null;
  const simpleMiddleware = useSimpleMock ? createSimpleMiddleware() : null;
  
  return {
    name: 'vite-plugin-mock-api',
    // 关键点：使用 pre 确保此插件先于内置插件执行
    enforce: 'pre' as const,
    // 在服务器创建之前配置
    configureServer(server) {
      // 替换原始请求处理器，使我们的中间件具有最高优先级
      const originalHandler = server.middlewares.handle;
      
      server.middlewares.handle = function(req, res, next) {
        const url = req.url || '';
        
        // 只处理API请求
        if (url.startsWith('/api/')) {
          console.log(`[Mock插件] 检测到API请求: ${req.method} ${url}`);
          
          // 优先处理特定测试API
          if (useSimpleMock && simpleMiddleware && url.startsWith('/api/test')) {
            console.log(`[Mock插件] 使用简单中间件处理: ${url}`);
            
            // 设置一个标记，防止其他中间件处理此请求
            (req as any)._mockHandled = true;
            
            return simpleMiddleware(req, res, (err?: Error) => {
              if (err) {
                console.error(`[Mock插件] 简单中间件处理出错:`, err);
                next(err);
              } else if (!(res as ServerResponse).writableEnded) {
                // 如果响应没有结束，继续处理
                next();
              }
            });
          }
          
          // 处理其他API请求
          if (useMock && mockMiddleware) {
            console.log(`[Mock插件] 使用Mock中间件处理: ${url}`);
            
            // 设置一个标记，防止其他中间件处理此请求
            (req as any)._mockHandled = true;
            
            return mockMiddleware(req, res, (err?: Error) => {
              if (err) {
                console.error(`[Mock插件] Mock中间件处理出错:`, err);
                next(err);
              } else if (!(res as ServerResponse).writableEnded) {
                // 如果响应没有结束，继续处理
                next();
              }
            });
          }
        }
        
        // 对于非API请求，使用原始处理器
        return originalHandler.call(server.middlewares, req, res, next);
      };
    }
  };
}

// 基本配置
export default defineConfig(({ mode }) => {
  // 加载环境变量
  process.env.VITE_USE_MOCK_API = process.env.VITE_USE_MOCK_API || 'false';
  const env = loadEnv(mode, process.cwd(), '');
  
  // 是否启用Mock API - 从环境变量读取
  const useMockApi = process.env.VITE_USE_MOCK_API === 'true';
  
  // 是否禁用HMR - 从环境变量读取
  const disableHmr = process.env.VITE_DISABLE_HMR === 'true';
  
  // 是否使用简单测试模拟API
  const useSimpleMock = true;
  
  console.log(`[Vite配置] 运行模式: ${mode}`);
  console.log(`[Vite配置] Mock API: ${useMockApi ? '启用' : '禁用'}`);
  console.log(`[Vite配置] 简单Mock测试: ${useSimpleMock ? '启用' : '禁用'}`);
  console.log(`[Vite配置] HMR: ${disableHmr ? '禁用' : '启用'}`);
  
  // 创建Mock插件
  const mockPlugin = createMockApiPlugin(useMockApi, useSimpleMock);
  
  // 配置
  return {
    plugins: [
      // 添加Mock插件（如果启用）
      ...(mockPlugin ? [mockPlugin] : []),
      vue(),
    ],
    server: {
      port: 8080,
      strictPort: true,
      host: 'localhost',
      open: false,
      // HMR配置
      hmr: disableHmr ? false : {
        protocol: 'ws',
        host: 'localhost',
        port: 8080,
        clientPort: 8080,
      },
      // 禁用代理，让中间件处理所有请求
      proxy: {}
    },
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      emptyOutDir: true,
      target: 'es2015',
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      // 包含基本依赖
      include: [
        'vue', 
        'vue-router',
        'pinia',
        'axios',
        'dayjs',
        'ant-design-vue',
        'ant-design-vue/es/locale/zh_CN'
      ],
      // 排除特定依赖
      exclude: [
        // 排除插件中的服务器Mock
        'src/plugins/serverMock.ts',
        // 排除fsevents本地模块，避免构建错误
        'fsevents'
      ],
      // 确保依赖预构建正确完成
      force: true,
    },
    // 使用单独的缓存目录
    cacheDir: 'node_modules/.vite_cache',
    // 防止堆栈溢出
    esbuild: {
      logOverride: {
        'this-is-undefined-in-esm': 'silent'
      },
    }
  }
});