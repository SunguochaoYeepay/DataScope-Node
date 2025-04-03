/**
 * 应用错误基类
 */

/**
 * 应用错误基类
 * 所有自定义错误类的基础类
 */
export class AppError extends Error {
  /**
   * 错误代码
   */
  public errorCode: number;
  
  /**
   * 错误类型
   */
  public errorType: string;
  
  /**
   * HTTP状态码
   */
  public statusCode: number;
  
  /**
   * 错误时间戳
   */
  public timestamp: string;
  
  /**
   * 错误路径
   */
  public path: string;
  
  /**
   * 请求ID
   */
  public requestId: string;
  
  /**
   * 原始错误
   */
  public originalError?: Error;
  
  /**
   * 错误详情
   */
  public details?: any;

  /**
   * 创建应用错误实例
   * @param code 错误代码
   * @param message 错误消息
   * @param errorType 错误类型
   * @param originalError 原始错误
   * @param details 错误详情
   */
  constructor(
    code: number,
    message: string,
    errorType = 'APP_ERROR',
    originalError?: Error,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.errorCode = code;
    this.errorType = errorType;
    this.statusCode = 500;
    this.timestamp = new Date().toISOString();
    this.path = '';
    this.requestId = '';
    this.originalError = originalError;
    this.details = details;

    // 捕获堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * 设置HTTP状态码
   * @param code HTTP状态码
   * @returns 当前实例
   */
  setStatusCode(code: number): this {
    this.statusCode = code;
    return this;
  }

  /**
   * 设置错误路径
   * @param path 错误路径
   * @returns 当前实例
   */
  setPath(path: string): this {
    this.path = path;
    return this;
  }

  /**
   * 设置请求ID
   * @param id 请求ID
   * @returns 当前实例
   */
  setRequestId(id: string): this {
    this.requestId = id;
    return this;
  }

  /**
   * 获取错误详情对象
   * @returns 错误详情对象
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.errorCode,
      type: this.errorType,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      path: this.path,
      requestId: this.requestId,
      details: this.details
    };
  }
}