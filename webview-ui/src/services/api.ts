/**
 * API服务模块，用于处理HTTP请求
 */

import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 兼容类型声明
declare module 'axios' {
  export interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<AxiosResponse>;
    (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  }
}

/**
 * 获取API基础URL
 * 如果环境变量中有VITE_API_BASE_URL，则使用环境变量的值
 * 否则使用默认值 http://localhost:3100
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3100';

/**
 * 检查是否启用mock模式
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
console.log('API Service - Mock模式:', USE_MOCK ? '已启用' : '已禁用', 'API基础URL:', USE_MOCK ? '(使用Mock数据)' : BASE_URL);

// 创建axios实例
const instance = axios.create({
  baseURL: USE_MOCK ? '' : BASE_URL,  // Mock模式下不设置baseURL，避免发起真实网络请求
  timeout: 30000,  // 超时时间: 30秒
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: any) => {
    // 获取token并添加到请求头
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 如果启用了Mock模式，添加标记
    if (USE_MOCK) {
      config.headers = config.headers || {};
      config.headers['X-Mock-Request'] = 'true';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 处理成功响应
    return response;
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status;
      
      if (status === 401) {
        // 未授权，可能需要登录
        localStorage.removeItem('token');
        // 跳转登录页面
        // window.location.href = '/login';
      } else if (status === 403) {
        // 没有权限
        console.error('没有操作权限');
      } else if (status === 500) {
        // 服务器错误
        console.error('服务器错误，请稍后再试');
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      console.error('网络错误，请检查网络连接');
    } else {
      // 其他错误
      console.error('请求错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API服务
export const api = {
  // GET请求
  get: async <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await instance.get(url, { params, ...config });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  // POST请求
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await instance.post(url, data, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  // PUT请求
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await instance.put(url, data, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  // PATCH请求
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await instance.patch(url, data, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  // DELETE请求
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await instance.delete(url, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default api;