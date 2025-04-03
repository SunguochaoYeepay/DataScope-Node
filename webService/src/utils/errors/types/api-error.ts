/**
 * API错误类
 */
import { AppError } from '../app-error';
import { ErrorCode } from '../error-codes';

/**
 * API错误类
 * 扩展自AppError，用于表示API调用过程中的错误
 */
export class ApiError extends AppError {
  /**
   * 创建API错误实例
   * @param code 错误代码
   * @param message 错误消息
   * @param originalError 原始错误
   * @param details 错误详情
   */
  /**
   * 创建API错误实例
   * 支持两种形式的参数，兼容不同版本的调用方式：
   * 1. (code, message, ...)新型调用：错误码优先
   * 2. (message, code, ...)旧型调用：消息优先
   */
  constructor(codeOrMessage: number | string, messageOrCode: string | number, originalErrorOrHttpStatus?: Error | number | string, detailsOrErrorType?: any | string, extraDetails?: any) {
    // 判断调用方式
    let code: number;
    let message: string;
    let originalError: Error | undefined;
    let details: any;
    
    if (typeof codeOrMessage === 'number') {
      // 新型调用：(code, message, originalError?, details?)
      code = codeOrMessage;
      message = messageOrCode as string;
      originalError = originalErrorOrHttpStatus instanceof Error ? originalErrorOrHttpStatus : undefined;
      details = detailsOrErrorType;
    } else {
      // 旧型调用：(message, code, httpStatus?, errorType?, details?)
      message = codeOrMessage;
      code = (typeof messageOrCode === 'number') ? messageOrCode : ErrorCode.UNKNOWN_ERROR;
      
      // 如果是原始错误消息字符串
      if (typeof originalErrorOrHttpStatus === 'string') {
        details = { originalError: originalErrorOrHttpStatus };
      } else {
        details = extraDetails || detailsOrErrorType;
      }
    }
    
    // 调用父类构造函数
    super(message, code, 500, 'API_ERROR', details);
    this.name = 'ApiError';

    // 根据错误代码设置HTTP状态码
    this.statusCode = this.getHttpStatusFromCode(code);
    
    // 如果指定了HTTP状态码，则使用指定的状态码
    if (typeof originalErrorOrHttpStatus === 'number') {
      this.statusCode = originalErrorOrHttpStatus;
    }

    // 捕获堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
  
  /**
   * 兼容旧版API错误类的创建方法
   * 允许先传错误消息，再传状态码/错误码
   * @param message 错误消息
   * @param code HTTP状态码或错误码
   * @param originalError 原始错误消息
   */
  static create(message: string, code: number = 500, originalError?: string): ApiError {
    const errorCode = code >= 10000 ? code : ErrorCode.UNKNOWN_ERROR;
    const details = originalError ? { originalError } : undefined;
    return new ApiError(errorCode, message, undefined, details);
  }

  /**
   * 根据错误代码获取对应的HTTP状态码
   * @param code 错误代码
   * @returns HTTP状态码
   */
  private getHttpStatusFromCode(code: number): number {
    // 错误代码范围与HTTP状态码映射
    if (code >= 10000 && code < 20000) return 400; // 请求错误
    if (code >= 20000 && code < 30000) return 404; // 资源不存在
    if (code >= 30000 && code < 40000) return 401; // 未授权
    if (code >= 40000 && code < 50000) return 403; // 禁止访问
    if (code >= 50000 && code < 60000) return 409; // 冲突
    if (code >= 60000) return 500; // 服务器错误
    
    return 500; // 默认服务器错误
  }

  /**
   * 创建一个包含内部错误详情的API错误
   * @param message 错误消息
   * @param details 错误详情
   * @returns API错误实例
   */
  static internal(message: string, details?: any): ApiError {
    return new ApiError(ErrorCode.INTERNAL_SERVER_ERROR, message, undefined, details);
  }

  /**
   * 创建一个表示未授权的API错误
   * @param message 错误消息
   * @returns API错误实例
   */
  static unauthorized(message = '未授权'): ApiError {
    return new ApiError(ErrorCode.UNAUTHORIZED, message);
  }

  /**
   * 创建一个表示禁止访问的API错误
   * @param message 错误消息
   * @returns API错误实例
   */
  static forbidden(message = '禁止访问'): ApiError {
    return new ApiError(ErrorCode.FORBIDDEN, message);
  }

  /**
   * 创建一个表示资源不存在的API错误
   * @param message 错误消息
   * @returns API错误实例
   */
  static notFound(message = '资源不存在'): ApiError {
    return new ApiError(ErrorCode.NOT_FOUND, message);
  }

  /**
   * 创建一个表示请求无效的API错误
   * @param message 错误消息
   * @returns API错误实例
   */
  static badRequest(message = '请求无效'): ApiError {
    return new ApiError(ErrorCode.BAD_REQUEST, message);
  }
  
  /**
   * 创建一个表示冲突错误的API错误
   * @param message 错误消息
   * @returns API错误实例
   */
  static conflict(message = '资源冲突'): ApiError {
    return new ApiError(ErrorCode.CONFLICT, message);
  }
  
  /**
   * 创建一个表示请求次数过多的API错误
   * @param message 错误消息
   * @returns API错误实例
   */
  static tooManyRequests(message = '请求次数过多'): ApiError {
    return new ApiError(ErrorCode.TOO_MANY_REQUESTS, message);
  }
}