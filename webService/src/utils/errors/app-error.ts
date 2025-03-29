/**
 * 应用错误基类
 */
import { ERROR_MESSAGES } from './error-codes';

export interface IErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  code: number;
  timestamp: string;
  path?: string;
  details?: any;
}

export class AppError extends Error {
  // HTTP状态码
  public statusCode: number;
  
  // 错误码
  public errorCode: number;
  
  // 错误标识
  public errorType: string;
  
  // 错误详情
  public details?: any;
  
  // 路径信息
  public path?: string;
  
  // 时间戳
  public timestamp: string;
  
  // 请求ID，用于跟踪
  public requestId?: string;
  
  /**
   * 创建应用错误
   * @param message 错误消息
   * @param errorCode 错误码
   * @param statusCode HTTP状态码
   * @param errorType 错误类型
   * @param details 错误详情
   */
  constructor(
    message: string,
    errorCode: number,
    statusCode: number = 500,
    errorType: string = 'AppError',
    details?: any
  ) {
    // 如果message为空，尝试从错误码获取默认消息
    const finalMessage = message || ERROR_MESSAGES[errorCode] || '未知错误';
    
    super(finalMessage);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errorType = errorType;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // 兼容 Error 类继承
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * 设置请求路径
   * @param path 请求路径
   */
  setPath(path: string): this {
    this.path = path;
    return this;
  }
  
  /**
   * 设置请求ID
   * @param requestId 请求ID
   */
  setRequestId(requestId: string): this {
    this.requestId = requestId;
    return this;
  }
  
  /**
   * 添加错误详情
   * @param details 错误详情
   */
  addDetails(details: any): this {
    this.details = details;
    return this;
  }
  
  /**
   * 转换为响应对象
   */
  toResponse(): IErrorResponse {
    const response: IErrorResponse = {
      statusCode: this.statusCode,
      error: this.errorType,
      message: this.message,
      code: this.errorCode,
      timestamp: this.timestamp
    };
    
    if (this.path) {
      response.path = this.path;
    }
    
    if (this.details) {
      response.details = this.details;
    }
    
    return response;
  }
  
  /**
   * 转换为JSON
   */
  toJSON(): object {
    return this.toResponse();
  }
}