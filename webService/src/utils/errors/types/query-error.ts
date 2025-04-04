import { AppError } from '../app-error';
import { ERROR_CODES } from '../error-codes';

/**
 * 查询执行错误类
 * 用于SQL查询执行过程中的错误
 */
export class QueryError extends AppError {
  /**
   * 创建查询错误
   * @param message 错误消息
   * @param errorCode 错误码
   * @param statusCode HTTP状态码
   * @param details 错误详情
   */
  constructor(
    message: string,
    errorCode: number = ERROR_CODES.QUERY_EXECUTION_ERROR,
    statusCode: number = 500,
    details?: any
  ) {
    super(message, errorCode, statusCode, 'QueryError', details);
  }

  /**
   * 创建SQL语法错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static syntaxError(message: string = 'SQL语法错误', details?: any): QueryError {
    return new QueryError(message, ERROR_CODES.QUERY_SYNTAX_ERROR, 400, details);
  }

  /**
   * 创建查询执行超时错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static timeout(message: string = '查询执行超时', details?: any): QueryError {
    return new QueryError(message, ERROR_CODES.QUERY_TIMEOUT, 408, details);
  }

  /**
   * 创建查询权限错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static permissionDenied(message: string = '无权执行此查询', details?: any): QueryError {
    return new QueryError(message, ERROR_CODES.QUERY_PERMISSION_DENIED, 403, details);
  }

  /**
   * 创建查询资源不存在错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static resourceNotFound(message: string = '查询的资源不存在', details?: any): QueryError {
    return new QueryError(message, ERROR_CODES.QUERY_RESOURCE_NOT_FOUND, 404, details);
  }

  /**
   * 创建查询过于复杂错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static tooComplex(message: string = '查询过于复杂，请简化查询', details?: any): QueryError {
    return new QueryError(message, ERROR_CODES.QUERY_TOO_COMPLEX, 400, details);
  }

  /**
   * 创建查询结果过大错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static resultTooLarge(message: string = '查询结果过大', details?: any): QueryError {
    return new QueryError(message, ERROR_CODES.QUERY_RESULT_TOO_LARGE, 413, details);
  }
}