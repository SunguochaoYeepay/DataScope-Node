/**
 * HTTP客户端工具
 * 提供基于fetch的HTTP请求方法，用于与API交互
 */

// 导入mock数据服务
import { getMockIntegration, getMockIntegrations, executeMockQuery } from '../services/mockData';
import { mockQueryService } from '../services/mock-query';
import axios from 'axios';
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { responseHandler } from './api';
import type { ApiResponse } from './api';
import { message } from '@/services/message';
import type { MessageConfig } from '@/types/message';

// 为Window对象扩展handleMockAxiosRequest方法
declare global {
  interface Window {
    handleMockAxiosRequest: (url: string, method: string, data?: any) => Promise<any>;
  }
}

// 定义API基础URL和超时时间
const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK = false; // 强制禁用模拟模式

// 修改为使用环境变量判断mock模式
// 这样在不同位置使用相同的判断逻辑
const isMockEnabled = () => import.meta.env.VITE_USE_MOCK_API === 'true';

console.log(`[HTTP] 初始化axios, MOCK模式: ${isMockEnabled() ? '已启用' : '已禁用'}, API基础URL: ${API_BASE_URL}`);

// 如果启用Mock模式，设置axios拦截器（已经强制禁用）
if (false && isMockEnabled()) {
  // 请求拦截器
  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const url = config.url || '';
      console.log('[Mock Axios] 拦截请求:', url, config.method);
      
      // 为所有API请求添加Mock标记
      if (url.startsWith('/api/')) {
        // 设置请求头
        config.headers.set('X-Mocked-Request', 'true');
      }
      
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      const { config } = response;
      
      // 如果是普通的成功请求，直接返回数据
      if (response.status >= 200 && response.status < 300) {
        const apiResponse = response.data as ApiResponse;
        
        // 使用带key的方式显示消息，避免重复
        if (apiResponse.success) {
          // 成功响应检查是否有消息需要显示
          if (apiResponse.error?.message && apiResponse.error.message.trim() !== '') {
            // 生成唯一key
            const messageKey = `success-${config.url}-${JSON.stringify(config.params || {})}-${Date.now()}`;
            message.success(apiResponse.error.message, undefined, false);
          }
          return apiResponse.data;
        } else {
          // 业务逻辑错误
          if (apiResponse.error?.message) {
            // 生成包含url和错误代码的唯一key
            const messageKey = `error-${apiResponse.error.code}-${config.url}-${Date.now()}`;
            message.error(apiResponse.error.message, undefined, false);
          }
          return Promise.reject(apiResponse);
        }
      }
      
      return response.data;
    },
    (error: AxiosError) => {
      // 获取请求配置，用于生成唯一键
      const requestConfig = error.config;
      let messageKey = 'network-error';
      
      if (requestConfig?.url) {
        messageKey = `${requestConfig.url}-${error.code || 'unknown'}-${Date.now()}`;
      }
      
      // 处理网络错误
      if (error.response) {
        // 服务器返回了响应，但状态码不在 2xx 范围内
        const { status, data } = error.response;
        const errorData = data as ApiResponse;
        
        switch (status) {
          case 400:
            message.error(`请求错误 (400)${errorData?.error?.message ? ': ' + errorData.error.message : ''}`, undefined, false);
            break;
          case 401:
            message.error('未授权，请重新登录 (401)', undefined, false);
            break;
          case 403:
            message.error('拒绝访问 (403)', undefined, false);
            break;
          case 404:
            message.error(`请求的资源不存在 (404)${errorData?.error?.message ? ': ' + errorData.error.message : ''}`, undefined, false);
            break;
          case 500:
            message.error(`服务器错误 (500)${errorData?.error?.message ? ': ' + errorData.error.message : ''}`, undefined, false);
            break;
          default:
            message.error(`请求错误 (${status})${errorData?.error?.message ? ': ' + errorData.error.message : ''}`, undefined, false);
        }
      } else if (error.request) {
        // 请求已发出，但未收到响应
        message.error('网络连接失败，请检查网络设置', undefined, false);
      } else {
        // 在设置请求时触发错误
        message.error(`请求配置错误: ${error.message}`, undefined, false);
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

// 全局默认是否显示成功消息
const SHOW_SUCCESS_MESSAGE = false;

// 全局默认是否显示错误消息
const SHOW_ERROR_MESSAGE = true;

/**
 * HTTP请求配置选项
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  errorMessage?: string;
  successMessage?: string;
}

/**
 * 解析响应
 */
async function parseResponse<T = any>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    const data = await response.json();
    
    // 检查API响应格式
    if (data && data.success !== undefined) {
      return data.data as T;
    }
    
    return data as T;
  }
  
  return response.text() as unknown as T;
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
      const pageNumber = Number(options.params?.page) || 1;
      const pageSize = Number(options.params?.size) || 10;
      const mockQueries = Array.from({ length: 20 }, (_, i) => mockQueryService.getQueryById(`query-${i+1}`));
      const total = mockQueries.length;
      const totalPages = Math.ceil(total / pageSize);
      const start = (pageNumber - 1) * pageSize;
      const end = Math.min(start + pageSize, total);
      const paginatedQueries = mockQueries.slice(start, end);
      
      // 使用正确的结构返回数据
      return { 
        success: true, 
        data: {
          items: paginatedQueries,
          total: total,
          page: pageNumber,
          size: pageSize,
          totalPages: totalPages,
          hasMore: pageNumber < totalPages
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
  if (isMockEnabled()) {
    try {
      const response = await handleMockRequest<ApiResponse<T>>(url, options);
      // 使用响应处理器处理响应
      return responseHandler.silent(response) as T;
    } catch (error) {
      // 使用响应处理器处理错误
      responseHandler.errorOnly({
        success: false,
        error: {
          statusCode: 500,
          code: 'REQUEST_ERROR',
          message: error instanceof Error ? error.message : String(error)
        }
      });
      throw error;
    }
  }

  const { params, timeout, showSuccessMessage, showErrorMessage, errorMessage, successMessage, ...fetchOptions } = options as RequestOptions & {
    showSuccessMessage?: boolean;
    showErrorMessage?: boolean;
    errorMessage?: string;
    successMessage?: string;
  };
  
  // 在mock模式下使用相对路径，否则添加API基础URL前缀
  const isInMockMode = isMockEnabled();
  const fullUrl = isInMockMode
    ? buildUrl(url, params)  // Mock模式下使用相对路径 
    : buildUrl(`${API_BASE_URL}${url}`, params);  // 非Mock模式使用完整路径
  
  console.log(`[HTTP] 请求URL: ${fullUrl}, MOCK模式: ${isInMockMode}`);
  
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
      const errorResponse = {
        success: false,
        error: {
          statusCode: response.status,
          code: 'API_ERROR',
          message: response.statusText || 'API请求失败',
          details: errorData
        }
      };

      // 使用响应处理器处理错误
      responseHandler.custom(errorResponse, {
        showErrorMessage: showErrorMessage ?? SHOW_ERROR_MESSAGE,
        errorMessage: errorMessage || '请求失败'
      });

      throw errorResponse;
    }
    
    const responseData = await parseResponse<T>(response);
    
    // 使用响应处理器处理成功响应
    const wrappedResponse = typeof responseData === 'object' && responseData !== null && 'success' in responseData
      ? responseData as ApiResponse<T>
      : { success: true, data: responseData } as ApiResponse<T>;

    // 处理响应并返回数据部分
    const result = responseHandler.custom(wrappedResponse, {
      showSuccessMessage: showSuccessMessage ?? SHOW_SUCCESS_MESSAGE,
      showErrorMessage: showErrorMessage ?? SHOW_ERROR_MESSAGE,
      successMessage: successMessage || '操作成功',
      errorMessage: errorMessage || '操作失败'
    });
    
    return result as T;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      const timeoutError = {
        success: false,
        error: {
          statusCode: 408,
          code: 'REQUEST_TIMEOUT',
          message: '请求超时'
        }
      };
      
      // 使用响应处理器处理超时错误
      responseHandler.custom(timeoutError, {
        showErrorMessage: showErrorMessage ?? SHOW_ERROR_MESSAGE,
        errorMessage: errorMessage || '请求超时'
      });
      
      throw timeoutError;
    }
    
    // 已经被响应处理器处理过的错误直接抛出
    if (error && typeof error === 'object' && 'success' in error) {
      throw error;
    }
    
    // 其他类型的错误
    const unknownError = {
      success: false,
      error: {
        statusCode: 500,
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : String(error)
      }
    };
    
    // 使用响应处理器处理未知错误
    responseHandler.custom(unknownError, {
      showErrorMessage: showErrorMessage ?? SHOW_ERROR_MESSAGE,
      errorMessage: errorMessage || '请求出错'
    });
    
    throw unknownError;
  }
}

/**
 * HTTP客户端
 */
export const httpClient = {
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
    if (isMockEnabled()) {
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
    if (isMockEnabled()) {
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
    if (isMockEnabled()) {
      return handleMockRequest<T>(url, { ...options, method: 'DELETE' });
    }
    
    return request<T>(url, { ...options, method: 'DELETE' });
  },
  
  /**
   * 发送PATCH请求
   */
  patch: <T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> => {
    // 如果启用了Mock模式，使用模拟数据
    if (isMockEnabled()) {
      return handleMockRequest<T>(url, { ...options, method: 'PATCH' }, data);
    }
    
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }
};

// 为了向后兼容，导出http别名
export { httpClient as http }; 