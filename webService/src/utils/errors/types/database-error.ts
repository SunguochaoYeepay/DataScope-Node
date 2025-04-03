import { AppError } from '../app-error';
import { ERROR_CODES, GENERAL_ERROR } from '../error-codes';

/**
 * 数据库错误类
 * 用于数据库操作过程中的错误
 */
export class DatabaseError extends AppError {
  /**
   * 创建数据库错误
   * @param message 错误消息
   * @param errorCode 错误码
   * @param statusCode HTTP状态码
   * @param details 错误详情
   */
  constructor(
    message: string,
    errorCode: number = ERROR_CODES.DATABASE_ERROR,
    statusCode: number = 500,
    details?: any
  ) {
    super(message, errorCode, statusCode, 'DatabaseError', details);
  }

  /**
   * 创建数据库连接错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static connectionError(message: string = '数据库连接失败', details?: any): DatabaseError {
    return new DatabaseError(message, ERROR_CODES.DATABASE_CONNECTION_ERROR, 500, details);
  }

  /**
   * 创建数据库查询错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static queryError(message: string = '数据库查询执行失败', details?: any): DatabaseError {
    return new DatabaseError(message, ERROR_CODES.DATABASE_QUERY_ERROR, 500, details);
  }

  /**
   * 创建事务错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static transactionError(message: string = '数据库事务执行失败', details?: any): DatabaseError {
    return new DatabaseError(message, ERROR_CODES.DATABASE_TRANSACTION_ERROR, 500, details);
  }

  /**
   * 创建记录未找到错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static recordNotFound(message: string = '请求的数据库记录不存在', details?: any): DatabaseError {
    return new DatabaseError(message, GENERAL_ERROR.DATABASE_RECORD_NOT_FOUND, 404, details);
  }

  /**
   * 创建记录已存在错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static recordExists(message: string = '数据库记录已存在', details?: any): DatabaseError {
    return new DatabaseError(message, GENERAL_ERROR.DATABASE_RECORD_EXISTS, 409, details);
  }

  /**
   * 创建数据库约束错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static constraintError(message: string = '违反数据库约束', details?: any): DatabaseError {
    return new DatabaseError(message, ERROR_CODES.DATABASE_CONSTRAINT_ERROR, 400, details);
  }
}