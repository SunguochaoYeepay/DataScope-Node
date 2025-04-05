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
const API_BASE_URL = import.meta.env.VITE_USE_MOCK_API === 'true' ? '' : 'http://localhost:5000';
const TIMEOUT = 15000;

// 修改为使用环境变量判断mock模式
const isMockEnabled = () => import.meta.env.VITE_USE_MOCK_API === 'true';

console.log(`[HTTP] 初始化axios, MOCK模式: ${isMockEnabled() ? '已启用' : '已禁用'}, API基础URL: ${API_BASE_URL}`);

// 创建axios实例
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 添加响应拦截器 - 标准错误处理
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果是普通的成功请求，直接返回数据
    if (response.status >= 200 && response.status < 300) {
      const apiResponse = response.data as ApiResponse;
      
      if (apiResponse.success) {
        // 成功响应检查是否有消息需要显示
        if (apiResponse.error?.message && apiResponse.error.message.trim() !== '') {
          // 生成唯一key
          const messageKey = `success-${response.config.url}-${Date.now()}`;
          message.success(apiResponse.error.message, undefined, false);
        }
        return apiResponse.data;
      } else {
        // 业务逻辑错误
        if (apiResponse.error?.message) {
          // 生成包含url和错误代码的唯一key
          const messageKey = `error-${apiResponse.error.code}-${response.config.url}-${Date.now()}`;
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

/**
 * HTTP GET请求
 * @param url 请求路径
 * @param params 请求参数
 * @param config 请求配置
 * @returns Promise
 */
async function get<T = any>(url: string, params?: any, config?: any): Promise<T> {
  return instance.get(url, { params, ...config });
}

/**
 * HTTP POST请求
 * @param url 请求路径
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise
 */
async function post<T = any>(url: string, data?: any, config?: any): Promise<T> {
  return instance.post(url, data, config);
}

/**
 * HTTP PUT请求
 * @param url 请求路径
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise
 */
async function put<T = any>(url: string, data?: any, config?: any): Promise<T> {
  return instance.put(url, data, config);
}

/**
 * HTTP DELETE请求
 * @param url 请求路径
 * @param config 请求配置
 * @returns Promise
 */
async function del<T = any>(url: string, config?: any): Promise<T> {
  return instance.delete(url, config);
}

/**
 * 使用fetch API发送请求
 * 当axios出现问题时的备用方法
 */
async function fetchApi(url: string, options: RequestInit = {}) {
  // 确保URL正确
  if (!url.startsWith('http')) {
    url = `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
  }
  
  // 默认选项
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
  };
  
  // 合并选项
  const fetchOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 解析JSON响应
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch API error:', error);
    throw error;
  }
}

// 导出HTTP方法
export const http = {
  get,
  post,
  put,
  delete: del,
  fetch: fetchApi,
  axios: instance,
  baseUrl: API_BASE_URL
};

export default http; 