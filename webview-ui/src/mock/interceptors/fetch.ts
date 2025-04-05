/**
 * Fetch拦截器实现
 * 
 * 拦截Fetch请求，根据URL匹配，返回模拟数据或转发到真实后端
 */

import services from '../services';
import { mockConfig, logMock } from '../config';
import { createMockErrorResponse } from '../services/utils';

// 拦截函数类型定义
type InterceptorHandler = (url: string, options: RequestInit) => Promise<Response | null>;

// API路径映射
const API_MAPPINGS: Record<string, Partial<Record<string, InterceptorHandler>>> = {
  // 数据源相关API
  '/api/datasources': {
    GET: handleGetDataSources,
    POST: handleCreateDataSource
  },
  '/api/datasources/test': {
    POST: handleTestConnection
  }
};

// 存储原始fetch
let originalFetch: typeof fetch | undefined;

/**
 * 设置fetch拦截器
 */
export function setupFetchInterceptor(): void {
  // 如果不启用mock，直接返回
  if (!mockConfig.enabled) {
    console.log('[Mock Fetch] 拦截器已禁用');
    return;
  }
  
  // 已经设置过，不重复设置
  if (originalFetch) {
    return;
  }
  
  // 保存原始fetch
  originalFetch = window.fetch;
  
  // 替换fetch
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    try {
      // 转换输入为URL和选项
      const url = input instanceof Request ? input.url : input.toString();
      const options = input instanceof Request 
        ? { method: input.method, headers: input.headers, body: input.body }
        : init || {};
      
      // 只拦截/api/开头的请求
      const urlObj = new URL(url, window.location.origin);
      if (!urlObj.pathname.startsWith('/api/')) {
        // 非API请求，直接使用原始fetch
        return originalFetch!(input, init);
      }
      
      // 调用拦截处理
      const mockResponse = await handleInterception(url, options);
      
      // 如果有模拟响应，返回模拟响应
      if (mockResponse) {
        // 记录拦截的请求
        logMock('info', `[Mock Fetch] 拦截请求: ${options.method || 'GET'} ${url}`);
        return mockResponse;
      }
      
      // 否则调用原始fetch
      if (originalFetch) {
        return originalFetch(input, init);
      }
      
      // 如果originalFetch为undefined，抛出错误
      throw new Error('原始fetch未定义，拦截器可能配置错误');
    } catch (error) {
      logMock('error', '[Mock Fetch] 拦截器错误:', error);
      
      // 发生错误时返回错误响应
      const errorData = createMockErrorResponse(
        error instanceof Error ? error.message : 'Unknown error in mock interceptor',
        'MOCK_INTERCEPTOR_ERROR'
      );
      
      return new Response(JSON.stringify(errorData), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
  
  console.log('[Mock Fetch] 拦截器已启用，仅拦截/api/请求');
}

/**
 * 移除fetch拦截器
 */
export function removeFetchInterceptor(): void {
  if (originalFetch) {
    window.fetch = originalFetch;
    originalFetch = undefined;
    
    console.log('[Mock Fetch] 拦截器已移除');
  }
}

/**
 * 处理拦截
 */
async function handleInterception(url: string, options: RequestInit): Promise<Response | null> {
  // 如果不启用mock，直接跳过
  if (!mockConfig.enabled) {
    return null;
  }
  
  try {
    // 从URL中提取路径
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname;
    const method = (options.method || 'GET').toUpperCase();
    
    // 仅处理/api/开头的请求
    if (!path.startsWith('/api/')) {
      return null;
    }
    
    // 检查是否有匹配的处理程序
    for (const [pattern, handlers] of Object.entries(API_MAPPINGS)) {
      if (path.startsWith(pattern) || path === pattern) {
        // 使用索引访问操作符并检查方法是否存在
        const handler = method in handlers ? handlers[method] : undefined;
        
        if (handler) {
          const response = await handler(url, options);
          return response;
        }
      }
    }
    
    // 没有找到处理程序
    return null;
  } catch (error) {
    logMock('error', '[Mock] 拦截处理错误:', error);
    return null;
  }
}

/**
 * 创建响应
 */
function createResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * 获取数据源列表
 */
async function handleGetDataSources(url: string, options: RequestInit): Promise<Response | null> {
  // 解析URL参数
  const urlObj = new URL(url, window.location.origin);
  const page = parseInt(urlObj.searchParams.get('page') || '1');
  const size = parseInt(urlObj.searchParams.get('size') || '10');
  const name = urlObj.searchParams.get('name') || undefined;
  const type = urlObj.searchParams.get('type') || undefined;
  const status = urlObj.searchParams.get('status') || undefined;
  
  // 单个数据源处理
  const pathParts = urlObj.pathname.split('/').filter(Boolean);
  if (pathParts.length === 2 && pathParts[0] === 'api' && pathParts[1] === 'datasources') {
    try {
      const result = await services.dataSource.getDataSources({
        page, size, name, type, status
      });
      return createResponse({ success: true, data: result });
    } catch (error) {
      return createResponse({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }, 500);
    }
  }
  
  // 获取单个数据源详情
  if (pathParts.length === 3 && pathParts[0] === 'api' && pathParts[1] === 'datasources') {
    const id = pathParts[2];
    try {
      const result = await services.dataSource.getDataSource(id);
      return createResponse({ success: true, data: result });
    } catch (error) {
      return createResponse({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }, 404);
    }
  }
  
  return null;
}

/**
 * 创建数据源
 */
async function handleCreateDataSource(url: string, options: RequestInit): Promise<Response | null> {
  try {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const result = await services.dataSource.createDataSource(body);
    return createResponse({ success: true, data: result });
  } catch (error) {
    return createResponse({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }, 400);
  }
}

/**
 * 测试数据源连接
 */
async function handleTestConnection(url: string, options: RequestInit): Promise<Response | null> {
  try {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const result = await services.dataSource.testConnection(body);
    return createResponse({ success: true, data: result });
  } catch (error) {
    return createResponse({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }, 400);
  }
}

export default {
  setupFetchInterceptor,
  removeFetchInterceptor
}; 