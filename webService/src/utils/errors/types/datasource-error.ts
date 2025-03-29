import { AppError } from '../app-error';
import { ERROR_CODES } from '../error-codes';

/**
 * 数据源错误类
 * 用于数据源连接和操作过程中的错误
 */
export class DataSourceError extends AppError {
  /**
   * 创建数据源错误
   * @param message 错误消息
   * @param errorCode 错误码
   * @param statusCode HTTP状态码
   * @param details 错误详情
   */
  constructor(
    message: string,
    errorCode: number = ERROR_CODES.DATASOURCE_ERROR,
    statusCode: number = 500,
    details?: any
  ) {
    super(message, errorCode, statusCode, 'DataSourceError', details);
  }

  /**
   * 创建连接失败错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static connectionFailed(message: string = '数据源连接失败', details?: any): DataSourceError {
    return new DataSourceError(message, ERROR_CODES.CONNECTION_FAILED, 500, details);
  }

  /**
   * 创建认证失败错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static authenticationFailed(message: string = '数据源认证失败', details?: any): DataSourceError {
    return new DataSourceError(message, ERROR_CODES.AUTHENTICATION_FAILED, 401, details);
  }

  /**
   * 创建数据源不存在错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static notFound(message: string = '数据源不存在', details?: any): DataSourceError {
    return new DataSourceError(message, ERROR_CODES.DATASOURCE_NOT_FOUND, 404, details);
  }

  /**
   * 创建数据源配置无效错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static invalidConfiguration(message: string = '数据源配置无效', details?: any): DataSourceError {
    return new DataSourceError(message, ERROR_CODES.INVALID_DATASOURCE_CONFIG, 400, details);
  }

  /**
   * 创建数据源类型不支持错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static unsupportedType(message: string = '不支持的数据源类型', details?: any): DataSourceError {
    return new DataSourceError(message, ERROR_CODES.UNSUPPORTED_DATASOURCE_TYPE, 400, details);
  }

  /**
   * 创建数据源超时错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static timeout(message: string = '数据源操作超时', details?: any): DataSourceError {
    return new DataSourceError(message, ERROR_CODES.DATASOURCE_TIMEOUT, 408, details);
  }
}