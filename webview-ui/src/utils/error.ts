/**
 * 错误处理工具函数
 */

/**
 * 从各种类型的错误中提取错误消息
 * @param error 任意类型的错误对象
 * @returns 格式化后的错误消息字符串
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    try {
      return JSON.stringify(error);
    } catch (e) {
      return 'Unknown error object';
    }
  }
  
  return 'Unknown error';
}

/**
 * 创建统一的错误对象
 * @param message 错误消息
 * @param code 错误代码
 * @returns 格式化的错误对象
 */
export function createError(message: string, code: string = 'ERROR'): Error {
  const error = new Error(message);
  (error as any).code = code;
  return error;
}

export default {
  getErrorMessage,
  createError
}; 