/**
 * HTTP客户端工具
 * 提供基于fetch的HTTP请求方法，用于与API交互
 */

// 默认API基础URL
const API_BASE_URL = '';

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
 * 发送HTTP请求
 */
async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
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
    return request<T>(url, { ...options, method: 'DELETE' });
  },
  
  /**
   * 发送PATCH请求
   */
  patch: <T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> => {
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }
}; 