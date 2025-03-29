import { AppError } from '../app-error';
import { ERROR_CODES } from '../error-codes';

/**
 * API错误类
 * 用于API请求处理过程中的错误
 */
export class ApiError extends AppError {
  /**
   * 创建API错误
   * @param message 错误消息
   * @param errorCode 错误码
   * @param statusCode HTTP状态码
   * @param errorType 错误类型
   * @param details 错误详情
   */
  constructor(
    message: string,
    errorCode: number = ERROR_CODES.INTERNAL_SERVER_ERROR,
    statusCode: number = 500,
    errorType: string = 'API_ERROR',
    details?: any
  ) {
    super(message, errorCode, statusCode, errorType, details);
  }

  /**
   * 创建400错误 - 无效请求
   * @param message 错误消息
   * @param details 错误详情
   */
  static badRequest(message: string = '无效的请求参数', details?: any): ApiError {
    return new ApiError(message, ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', details);
  }

  /**
   * 创建401错误 - 未授权
   * @param message 错误消息
   * @param details 错误详情
   */
  static unauthorized(message: string = '未授权访问', details?: any): ApiError {
    return new ApiError(message, ERROR_CODES.UNAUTHORIZED, 401, 'UNAUTHORIZED', details);
  }

  /**
   * 创建403错误 - 禁止访问
   * @param message 错误消息
   * @param details 错误详情
   */
  static forbidden(message: string = '禁止访问此资源', details?: any): ApiError {
    return new ApiError(message, ERROR_CODES.FORBIDDEN, 403, 'FORBIDDEN', details);
  }

  /**
   * 创建404错误 - 资源不存在
   * @param message 错误消息
   * @param details 错误详情
   */
  static notFound(message: string = '请求的资源不存在', details?: any): ApiError {
    return new ApiError(message, ERROR_CODES.RESOURCE_NOT_FOUND, 404, 'NOT_FOUND', details);
  }

  /**
   * 创建409错误 - 资源冲突
   * @param message 错误消息
   * @param details 错误详情
   */
  static conflict(message: string = '资源冲突', details?: any): ApiError {
    return new ApiError(message, ERROR_CODES.CONFLICT, 409, 'CONFLICT', details);
  }

  /**
   * 创建429错误 - 请求过多
   * @param message 错误消息
   * @param details 错误详情
   */
  static tooManyRequests(message: string = '请求过于频繁，请稍后再试', details?: any): ApiError {
    return new ApiError(message, ERROR_CODES.TOO_MANY_REQUESTS, 429, 'TOO_MANY_REQUESTS', details);
  }

  /**
   * 创建500错误 - 服务器内部错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static internal(message: string = '服务器内部错误', details?: any): ApiError {
    return new ApiError(message, ERROR_CODES.INTERNAL_SERVER_ERROR, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}