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
function createMockApi() {
  console.log('[Vite配置] 准备创建Mock API插件');
  
  // 从环境变量读取是否启用Mock
  const isMockEnabled = process.env.VITE_USE_MOCK_API === 'true';
  console.log(`[Vite配置] Mock API环境变量值: VITE_USE_MOCK_API = ${process.env.VITE_USE_MOCK_API}`);
  console.log(`[Vite配置] Mock API: ${isMockEnabled ? '启用' : '禁用'}`);
  
  const mockConfig = {
    delay: 300,
    apiBasePath: '/api',
    logLevel: 'debug',
    enabledModules: ['datasources', 'queries', 'users', 'visualizations', 'integrations', 'low-code']
  };
  
  if (isMockEnabled) {
    console.log('[Mock] 配置:', mockConfig);
    console.log('[Mock] 服务状态: 已启用');
    
    // 这里返回实际的mock插件实现
    return {
      name: 'mock-api',
      configureServer(server) {
        // 导入中间件
        const createMockMiddleware = require('./src/mock/middleware').default;
        const middleware = createMockMiddleware(mockConfig);
        
        // 使用中间件
        server.middlewares.use(middleware);
        console.log('[Mock] 中间件已加载');
      }
    };
  } else {
    console.log('[Mock] 服务状态: 已禁用');
    return null; // 禁用时返回null
  }
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
  const mockPlugin = createMockApi();
  
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
    cacheDir: '.temp/vite_cache',
    // 防止堆栈溢出
    esbuild: {
      logOverride: {
        'this-is-undefined-in-esm': 'silent'
      },
    }
  }
});