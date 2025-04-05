/**
 * Vite Mock插件配置
 * 
 * 提供Vite开发服务器的Mock插件配置
 * 用于注册中间件拦截API请求
 */

import type { Plugin } from 'vite';
import { isMockEnabled, logMock } from './config';
import createMockMiddleware from './middleware';

/**
 * 创建Mock服务插件
 * @returns Vite插件
 */
export function createMockPlugin(): Plugin {
  // 记录插件初始化
  logMock('info', '创建Mock Vite插件');
  
  // Mock是否启用
  const enabled = isMockEnabled();
  
  // 如果未启用Mock，则不加载插件
  if (!enabled) {
    logMock('info', 'Mock服务已禁用，不加载插件');
    return {
      name: 'vite-plugin-mock-api-disabled',
      configureServer: () => {}
    };
  }
  
  // 创建并返回插件
  return {
    name: 'vite-plugin-mock-api',
    enforce: 'pre',
    configureServer(server) {
      logMock('info', '配置Vite服务器，注册Mock中间件');
      
      // 获取中间件并注册
      const middleware = createMockMiddleware();
      server.middlewares.use(middleware);
      
      logMock('info', 'Mock中间件已注册到Vite服务器');
    }
  };
}

// 默认导出
export default createMockPlugin; 