import { message } from '@/services/message';

/**
 * API响应统一结构
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    statusCode: number;
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * API响应处理配置选项
 */
export interface ResponseHandlerOptions {
  // 是否显示成功消息
  showSuccessMessage?: boolean;
  // 是否显示错误消息
  showErrorMessage?: boolean;
  // 成功消息内容
  successMessage?: string;
  // 错误消息内容
  errorMessage?: string;
  // 成功消息显示时间(毫秒)
  successDuration?: number;
  // 错误消息显示时间(毫秒)
  errorDuration?: number;
}

/**
 * 通用响应处理工具函数
 * 处理API响应并显示相应的消息通知
 * 
 * @param response API响应数据
 * @param options 处理选项
 * @returns 处理后的数据，成功时返回data，失败时抛出异常
 */
export function handleApiResponse<T>(
  response: ApiResponse<T> | any,
  options: ResponseHandlerOptions = {}
): T | null {
  // 设置默认选项
  const {
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = '操作成功',
    errorMessage = '操作失败',
    successDuration = 3000,
    errorDuration = 5000
  } = options;

  try {
    // 判断是否为标准API响应格式
    if (response && typeof response === 'object' && 'success' in response) {
      if (response.success) {
        // 操作成功
        if (showSuccessMessage) {
          message.success(successMessage, successDuration);
        }
        return response.data || null;
      } else {
        // 操作失败
        const errMsg = response.error?.message || errorMessage;
        if (showErrorMessage) {
          message.error(errMsg, errorDuration);
        }
        throw new Error(errMsg);
      }
    }
    
    // 非标准格式，假设成功
    if (showSuccessMessage) {
      message.success(successMessage, successDuration);
    }
    return response;
  } catch (error) {
    // 处理异常
    const errMsg = error instanceof Error ? error.message : errorMessage;
    if (showErrorMessage) {
      message.error(errMsg, errorDuration);
    }
    throw error;
  }
}

/**
 * 创建一个通用的响应处理器
 * 
 * @param defaultOptions 默认处理选项
 * @returns 带有默认配置的响应处理函数
 */
export function createResponseHandler(defaultOptions: ResponseHandlerOptions = {}) {
  return function<T>(response: ApiResponse<T> | any, options: ResponseHandlerOptions = {}) {
    return handleApiResponse<T>(response, { ...defaultOptions, ...options });
  };
}

/**
 * 预配置的响应处理器
 */
export const responseHandler = {
  // 静默处理 - 不显示任何消息
  silent: createResponseHandler({ 
    showSuccessMessage: false, 
    showErrorMessage: false 
  }),
  
  // 只显示错误消息
  errorOnly: createResponseHandler({ 
    showSuccessMessage: false, 
    showErrorMessage: true 
  }),
  
  // 显示所有消息
  all: createResponseHandler({ 
    showSuccessMessage: true, 
    showErrorMessage: true 
  }),
  
  // 自定义处理器
  custom: handleApiResponse
};

/**
 * 在Vue组件中使用的响应处理钩子
 * @returns 响应处理函数和工具
 */
export function useResponseHandler() {
  return {
    // 各种预配置的处理器
    handle: responseHandler,
    
    // 创建自定义处理器
    create: createResponseHandler,
    
    // 通用处理函数
    handleResponse: handleApiResponse
  };
} 