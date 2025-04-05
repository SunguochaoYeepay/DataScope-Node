/**
 * Mock服务配置文件
 * 
 * 控制Mock服务的启用/禁用状态、日志级别等
 */

// 从环境变量或全局设置中获取是否启用Mock服务
export function isEnabled(): boolean {
  try {
    // 在Node.js环境中
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.VITE_USE_MOCK_API === 'true') {
        return true;
      }
      if (process.env.VITE_USE_MOCK_API === 'false') {
        return false;
      }
    }
    
    // 在浏览器环境中
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        return true;
      }
      if (import.meta.env.VITE_USE_MOCK_API === 'false') {
        return false;
      }
    }
    
    // 检查localStorage (仅在浏览器环境)
    if (typeof window !== 'undefined' && window.localStorage) {
      const localStorageValue = localStorage.getItem('USE_MOCK_API');
      if (localStorageValue === 'true') {
        return true;
      }
      if (localStorageValue === 'false') {
        return false;
      }
    }
    
    // 默认情况：开发环境下启用，生产环境禁用
    const isDevelopment = 
      (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') ||
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV === true);
    
    return isDevelopment;
  } catch (error) {
    // 出错时的安全回退
    console.warn('[Mock] 检查环境变量出错，默认禁用Mock服务', error);
    return false;
  }
}

// 向后兼容旧代码的函数
export function isMockEnabled(): boolean {
  return isEnabled();
}

// Mock服务配置
export const mockConfig = {
  // 是否启用Mock服务
  enabled: isEnabled(),
  
  // 请求延迟（毫秒）
  delay: 300,
  
  // API基础路径，用于判断是否需要拦截请求
  apiBasePath: '/api',
  
  // 日志级别: 'none', 'error', 'info', 'debug'
  logLevel: 'debug',
  
  // 启用的模块
  modules: {
    datasources: true,
    queries: true,
    users: true,
    visualizations: true,
    integrations: true,
    'low-code': true  // 添加low-code模块支持，涵盖/api/low-code/apis路径
  }
};

// 判断是否应该拦截请求
export function shouldMockRequest(req: any): boolean {
  // 必须启用Mock服务
  if (!mockConfig.enabled) {
    return false;
  }
  
  // 获取URL，确保url是字符串
  const url = req?.url || '';
  if (typeof url !== 'string') {
    console.error('[Mock] 收到非字符串URL:', url);
    return false;
  }
  
  // 必须是API请求
  if (!url.startsWith(mockConfig.apiBasePath)) {
    return false;
  }
  
  // 路径检查通过，应该拦截请求
  return true;
}

// 记录日志
export function logMock(level: 'error' | 'info' | 'debug', ...args: any[]): void {
  const { logLevel } = mockConfig;
  
  if (logLevel === 'none') return;
  
  if (level === 'error' && ['error', 'info', 'debug'].includes(logLevel)) {
    console.error('[Mock ERROR]', ...args);
  } else if (level === 'info' && ['info', 'debug'].includes(logLevel)) {
    console.info('[Mock INFO]', ...args);
  } else if (level === 'debug' && logLevel === 'debug') {
    console.log('[Mock DEBUG]', ...args);
  }
}

// 初始化时输出Mock服务状态
try {
  console.log(`[Mock] 服务状态: ${mockConfig.enabled ? '已启用' : '已禁用'}`);
  if (mockConfig.enabled) {
    console.log(`[Mock] 配置:`, {
      delay: mockConfig.delay,
      apiBasePath: mockConfig.apiBasePath,
      logLevel: mockConfig.logLevel,
      enabledModules: Object.entries(mockConfig.modules)
        .filter(([_, enabled]) => enabled)
        .map(([name]) => name)
    });
  }
} catch (error) {
  console.warn('[Mock] 输出配置信息出错', error);
}