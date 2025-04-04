/**
 * HTTP客户端工具
 * 提供基于fetch的HTTP请求方法，用于与API交互
 */

// 导入mock数据服务
import { getMockIntegration, getMockIntegrations, executeMockQuery } from '../services/mockData';
import { mockQueryService } from '../services/mock-query';
import axios from 'axios';

// 为Window对象扩展handleMockAxiosRequest方法
declare global {
  interface Window {
    handleMockAxiosRequest: (url: string, method?: string, data?: any) => Promise<any>;
  }
}

// 从环境变量获取API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// 检查是否启用mock模式
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
console.log('Mock 模式:', USE_MOCK ? '已启用' : '已禁用', 'API基础URL:', API_BASE_URL);

// 如果启用Mock模式，设置axios拦截器
if (USE_MOCK) {
  // 请求拦截器
  axios.interceptors.request.use(
    function (config) {
      const url = config.url || '';
      console.log('[Mock Axios] 拦截请求:', url, config.method);
      
      // 所有API请求都转为mock请求处理
      if (url.includes('/api/')) {
        // 设置一个标记，表示这是一个被拦截的请求
        config.headers = config.headers || {};
        config.headers['X-Mocked-Request'] = 'true';
      }
      
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      // 只处理API请求的错误和被标记为模拟的请求
      if (
        error.config && 
        error.config.url &&
        error.config.url.includes('/api/') &&
        (error.config.headers && error.config.headers['X-Mocked-Request'])
      ) {
        console.log('[Mock Axios] 处理失败的请求:', error.config.url);
        
        try {
          // 使用与fetch拦截器相同的处理函数来生成模拟响应
          const mockResponse = await window.handleMockAxiosRequest(
            error.config.url,
            error.config.method || 'GET',
            error.config.data ? JSON.parse(error.config.data) : undefined
          );
          
          return Promise.resolve({
            data: mockResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          });
        } catch (mockError) {
          console.error('[Mock Axios] 生成模拟响应失败:', mockError);
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  // 添加全局处理函数
  window.handleMockAxiosRequest = async function(url: string, method = 'GET', data?: any) {
    console.log('[Mock Axios] 生成模拟响应:', url, method, data);
    
    // 随机延迟200-600ms
    await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 200));
    
    try {
      // 使用fetch-interceptor中相同的逻辑处理请求
      if (url.includes('/api/low-code/apis')) {
        // 获取集成列表
        if (url === '/api/low-code/apis' && method.toUpperCase() === 'GET') {
          console.log('[Mock Axios] 返回模拟集成列表');
          const mockIntegrations = Array.from({ length: 5 }, (_, i) => ({
            id: `integration-${i+1}`,
            name: `模拟集成 ${i+1}`,
            description: `这是一个用于测试的模拟集成 ${i+1}`,
            type: i % 3 === 0 ? 'REST' : (i % 3 === 1 ? 'GRAPHQL' : 'SOAP'),
            baseUrl: `https://api.example.com/v${i+1}`,
            authType: i % 2 === 0 ? 'BEARER' : 'BASIC',
            status: 'ACTIVE',
            createdAt: new Date(Date.now() - i * 86400000).toISOString(),
            updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
            endpoints: [
              {
                id: `endpoint-${i+1}-1`,
                name: `获取数据 ${i+1}`,
                method: 'GET',
                path: '/data',
                description: '获取数据接口'
              },
              {
                id: `endpoint-${i+1}-2`,
                name: `创建资源 ${i+1}`,
                method: 'POST',
                path: '/resource',
                description: '创建资源接口'
              }
            ]
          }));
          return { success: true, data: mockIntegrations };
        }
        
        // 获取单个集成
        const singleIntegrationMatch = url.match(/\/api\/low-code\/apis\/([^\/]+)$/);
        if (singleIntegrationMatch && method.toUpperCase() === 'GET') {
          const integrationId = singleIntegrationMatch[1];
          const mockIntegration = {
            id: integrationId,
            name: `模拟集成 ${integrationId}`,
            description: `这是一个用于测试的模拟集成 ${integrationId}`,
            type: 'REST',
            baseUrl: `https://api.example.com/v1`,
            authType: 'BEARER',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            endpoints: [
              {
                id: `endpoint-${integrationId}-1`,
                name: `获取数据`,
                method: 'GET',
                path: '/data',
                description: '获取数据接口'
              }
            ]
          };
          return { success: true, data: mockIntegration };
        }
        
        // 创建集成
        if (url === '/api/low-code/apis' && method.toUpperCase() === 'POST') {
          const newId = `integration-new-${Date.now()}`;
          const newIntegration = {
            id: newId,
            name: data?.name || `新集成`,
            description: data?.description || '',
            type: data?.type || 'REST',
            baseUrl: data?.baseUrl || 'https://api.example.com',
            authType: data?.authType || 'NONE',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            endpoints: data?.endpoints || []
          };
          return { success: true, data: newIntegration };
        }
        
        // 测试集成
        const testIntegrationMatch = url.match(/\/api\/low-code\/apis\/([^\/]+)\/test$/);
        if (testIntegrationMatch && method.toUpperCase() === 'POST') {
          return { 
            success: true, 
            data: {
              resultType: 'JSON',
              jsonResponse: {
                success: true,
                message: '测试成功',
                timestamp: new Date().toISOString(),
                requestDetails: data,
                responseData: Array.from({ length: 5 }, (_, i) => ({
                  id: i + 1,
                  name: `测试项目 ${i + 1}`,
                  value: Math.round(Math.random() * 100)
                }))
              }
            }
          };
        }
      }
      
      // 处理其他API请求...
      return { success: true, data: [] };
    } catch (error) {
      console.error('[Mock Axios] 处理请求失败:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : String(error) 
      };
    }
  };
  
  console.log('[Mock] Axios拦截器已启用');
}

/**
 * HTTP请求配置选项
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

/**
 * 解析响应
 */
async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    const data = await response.json();
    
    // 检查API响应格式
    if (data && data.success !== undefined) {
      return data.data;
    }
    
    return data;
  }
  
  return response.text();
}

/**
 * 构建URL（包含查询参数）
 */
function buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  
  if (!queryString) {
    return url;
  }
  
  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
}

/**
 * 处理模拟数据请求
 */
async function handleMockRequest<T>(url: string, options: RequestOptions = {}, data?: any): Promise<T> {
  // 打印模拟请求日志
  console.log('模拟API请求:', url, options.method, data || options.params);

  // 延迟模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 集成相关API
  if (url.includes('/api/low-code/apis')) {
    // 获取集成列表
    if (url === '/api/low-code/apis' && options.method === 'GET') {
      return { success: true, data: await getMockIntegrations() } as any;
    }
    
    // 获取单个集成
    const singleIntegrationMatch = url.match(/\/api\/low-code\/apis\/([^\/]+)$/);
    if (singleIntegrationMatch && options.method === 'GET') {
      const integrationId = singleIntegrationMatch[1];
      return { success: true, data: await getMockIntegration(integrationId) } as any;
    }
    
    // 测试集成
    const testIntegrationMatch = url.match(/\/api\/low-code\/apis\/([^\/]+)\/test$/);
    if (testIntegrationMatch && options.method === 'POST') {
      const integrationId = testIntegrationMatch[1];
      return { success: true, data: await executeMockQuery(integrationId, data) } as any;
    }
  }
  
  // 查询相关API
  if (url.includes('/api/queries')) {
    if (url.match(/\/api\/queries\/\w+$/)) {
      // 获取单个查询
      const queryId = url.split('/').pop() || '';
      return { success: true, data: mockQueryService.getQueryById(queryId) } as any;
    }
    
    if (url === '/api/queries') {
      // 获取查询列表
      return { 
        success: true, 
        data: {
          records: Array.from({ length: 10 }, (_, i) => mockQueryService.getQueryById(`query-${i+1}`)),
          total: 100,
          page: options.params?.page || 1,
          pageSize: options.params?.size || 10
        } 
      } as any;
    }
    
    if (url === '/api/queries/execute') {
      // 执行查询
      const queryId = data?.queryId || 'query-001';
      return { 
        success: true, 
        data: mockQueryService.executeQuery(queryId, { 
          params: data?.params, 
          page: data?.page || 1, 
          pageSize: data?.pageSize || 10 
        })
      } as any;
    }
  }
  
  // 数据源相关API
  if (url.includes('/api/datasources')) {
    // 返回模拟的数据源列表
    return { 
      success: true, 
      data: Array.from({ length: 5 }, (_, i) => ({
        id: `ds-${i+1}`,
        name: `模拟数据源 ${i+1}`,
        type: i % 2 === 0 ? 'MYSQL' : 'POSTGRESQL',
        status: 'ACTIVE',
        host: 'localhost',
        database: `db_${i+1}`,
        createdAt: new Date().toISOString()
      }))
    } as any;
  }

  // 默认返回空数据
  return { success: true, data: [] } as any;
}

/**
 * 发送HTTP请求
 */
async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  // 如果启用了Mock模式，使用模拟数据
  if (USE_MOCK) {
    return handleMockRequest<T>(url, options);
  }

  const { params, timeout, ...fetchOptions } = options;
  
  // 构建完整URL
  const fullUrl = buildUrl(`${API_BASE_URL}${url}`, params);
  
  // 设置默认请求头
  if (!fetchOptions.headers) {
    fetchOptions.headers = {};
  }
  
  // 将headers转为Record以便设置Content-Type
  const headers = fetchOptions.headers as Record<string, string>;
  
  if (!headers['Content-Type'] && !(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  // 处理超时
  const controller = new AbortController();
  const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;
  
  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      signal: controller.signal
    });
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // 处理HTTP错误
    if (!response.ok) {
      const errorData = await parseResponse(response);
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      };
    }
    
    return await parseResponse(response);
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('请求超时');
    }
    
    throw error;
  }
}

/**
 * HTTP客户端
 */
export const http = {
  /**
   * 发送GET请求
   */
  get: <T = any>(url: string, options: RequestOptions = {}): Promise<T> => {
    return request<T>(url, { ...options, method: 'GET' });
  },
  
  /**
   * 发送POST请求
   */
  post: <T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> => {
    // 如果启用了Mock模式，使用模拟数据
    if (USE_MOCK) {
      return handleMockRequest<T>(url, { ...options, method: 'POST' }, data);
    }
    
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  },
  
  /**
   * 发送PUT请求
   */
  put: <T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> => {
    // 如果启用了Mock模式，使用模拟数据
    if (USE_MOCK) {
      return handleMockRequest<T>(url, { ...options, method: 'PUT' }, data);
    }
    
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  },
  
  /**
   * 发送DELETE请求
   */
  delete: <T = any>(url: string, options: RequestOptions = {}): Promise<T> => {
    // 如果启用了Mock模式，使用模拟数据
    if (USE_MOCK) {
      return handleMockRequest<T>(url, { ...options, method: 'DELETE' });
    }
    
    return request<T>(url, { ...options, method: 'DELETE' });
  },
  
  /**
   * 发送PATCH请求
   */
  patch: <T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> => {
    // 如果启用了Mock模式，使用模拟数据
    if (USE_MOCK) {
      return handleMockRequest<T>(url, { ...options, method: 'PATCH' }, data);
    }
    
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }
}; 