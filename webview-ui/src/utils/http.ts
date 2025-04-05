/**
 * HTTP客户端工具
 * 提供基于fetch的HTTP请求方法，用于与API交互
 */

// 删除已不存在的Mock服务导入
// 原参考：getMockIntegration, getMockIntegrations, executeMockQuery
// import { getMockIntegration, getMockIntegrations, executeMockQuery } from '../services/mockData';
// import { mockQueryService } from '../services/mock-query';
import axios from 'axios';
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { responseHandler, type ApiResponse } from './api';
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

// 请求类型定义
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  errorMessage?: string;
  successMessage?: string;
}

/**
 * 解析响应数据
 */
async function parseResponse<T = any>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (data && typeof data === 'object' && 'success' in data) {
      if (data.success && data.data !== undefined) {
        return data.data as T;
      }
      return data as T;
    }
    return data as T;
  }
  
  const text = await response.text();
  return text as unknown as T;
}

/**
 * 构建URL，添加查询参数
 */
function buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
  if (!params) return url;
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  
  const queryString = queryParams.toString();
  if (!queryString) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${queryString}`;
}

/**
 * Mock请求处理器
 * 现在使用统一的Mock服务架构，不再依赖旧的实现
 */
async function handleMockRequest<T>(url: string, options: RequestOptions = {}, data?: any): Promise<T> {
  console.log('[Mock] 处理Mock请求:', url, options.method || 'GET');
  
  // 延迟模拟网络请求时间
  await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 300) + 200));
  
  try {
    // 统一返回格式，让统一的Mock中间件处理
    console.log(`[Mock] 模拟请求 ${options.method || 'GET'} ${url} 被转发到统一的Mock中间件处理`);
    
    // 返回空数据，实际请求会被统一的Mock中间件处理
    return { success: true, data: [] } as unknown as T;
  } catch (error) {
    console.error('[Mock] 模拟请求处理失败:', error);
    throw new Error(`模拟请求失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * HTTP请求方法
 * @param url 请求URL
 * @param options 请求选项
 * @returns 响应数据
 */
async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // 添加时间戳防止缓存
  const timestamp = Date.now();
  const fullUrl = buildUrl(url, { ...params, _t: timestamp });
  
  // 设置超时
  const timeout = options.timeout || 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // 检查是否使用Mock模式
    const useMock = isMockEnabled();
    if (useMock && url.includes('/api/')) {
      console.log('[Mock] 拦截请求:', url);
      return await handleMockRequest<T>(url, options, 
        options.method?.toUpperCase() === 'POST' || options.method?.toUpperCase() === 'PUT' ? 
        options.body : undefined);
    }
    
    // 实际发送fetch请求
    console.log('[HTTP] 发送请求:', fullUrl, options.method || 'GET');
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      }
    });
    
    // 检查HTTP状态
    if (!response.ok) {
      // 尝试解析错误响应
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP错误: ${response.status}`);
      } catch (parseError) {
        throw new Error(`HTTP错误 ${response.status}: ${response.statusText}`);
      }
    }
    
    // 解析响应
    return await parseResponse<T>(response);
  } catch (error) {
    console.error('[HTTP] 请求失败:', error);
    
    // 显示错误消息
    if (options.showErrorMessage !== false) {
      const errorMsg = options.errorMessage || 
        (error instanceof Error ? error.message : '请求失败');
      message.error(errorMsg);
    }
    
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// 导出HTTP方法
export const http = {
  /**
   * 发送GET请求
   */
  async get<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, { ...options, method: 'GET' });
  },
  
  /**
   * 发送POST请求
   */
  async post<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  },
  
  /**
   * 发送PUT请求
   */
  async put<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  },
  
  /**
   * 发送DELETE请求
   */
  async delete<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, { ...options, method: 'DELETE' });
  },
  
  /**
   * 发送PATCH请求
   */
  async patch<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  },
}; 