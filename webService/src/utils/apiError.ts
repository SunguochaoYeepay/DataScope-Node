/**
 * 自定义API错误类，用于标准化错误处理
 */
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  /**
   * 创建一个API错误实例
   * @param message 错误消息
   * @param statusCode HTTP状态码
   * @param isOperational 是否是可操作的错误（而非程序错误）
   */
  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // 捕获堆栈跟踪
    Error.captureStackTrace(this, this.constructor);
    
    // 设置原型，使instanceof可以正常工作
    Object.setPrototypeOf(this, ApiError.prototype);
  }
  
  /**
   * 创建一个400 Bad Request错误
   * @param message 错误消息
   * @returns ApiError实例
   */
  static badRequest(message: string): ApiError {
    return new ApiError(message, 400);
  }
  
  /**
   * 创建一个401 Unauthorized错误
   * @param message 错误消息
   * @returns ApiError实例
   */
  static unauthorized(message = '未授权访问'): ApiError {
    return new ApiError(message, 401);
  }
  
  /**
   * 创建一个403 Forbidden错误
   * @param message 错误消息
   * @returns ApiError实例
   */
  static forbidden(message = '禁止访问'): ApiError {
    return new ApiError(message, 403);
  }
  
  /**
   * 创建一个404 Not Found错误
   * @param message 错误消息
   * @returns ApiError实例
   */
  static notFound(message = '未找到请求的资源'): ApiError {
    return new ApiError(message, 404);
  }
  
  /**
   * 创建一个409 Conflict错误
   * @param message 错误消息
   * @returns ApiError实例
   */
  static conflict(message: string): ApiError {
    return new ApiError(message, 409);
  }
  
  /**
   * 创建一个422 Unprocessable Entity错误
   * @param message 错误消息
   * @returns ApiError实例
   */
  static validationError(message = '请求数据验证失败'): ApiError {
    return new ApiError(message, 422);
  }
  
  /**
   * 创建一个500 Internal Server Error错误
   * @param message 错误消息
   * @returns ApiError实例
   */
  static internal(message = '服务器内部错误'): ApiError {
    return new ApiError(message, 500, false);
  }
}

export default ApiError; 