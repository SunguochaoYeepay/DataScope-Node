import { AppError } from '../app-error';
import { ERROR_CODES } from '../error-codes';

/**
 * 查询计划错误类
 * 用于处理查询执行计划生成和分析过程中的错误
 */
export class QueryPlanError extends AppError {
  /**
   * 创建查询计划错误
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
    super(message, errorCode, statusCode, 'QueryPlanError', details);
  }

  /**
   * 创建查询计划生成失败错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static generationFailed(message: string = '无法生成查询执行计划', details?: any): QueryPlanError {
    return new QueryPlanError(message, ERROR_CODES.QUERY_EXECUTION_ERROR, 500, details);
  }

  /**
   * 创建查询计划解析错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static parseError(message: string = '查询执行计划解析失败', details?: any): QueryPlanError {
    return new QueryPlanError(message, ERROR_CODES.QUERY_SYNTAX_ERROR, 400, details);
  }

  /**
   * 创建查询计划分析错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static analysisError(message: string = '查询执行计划分析失败', details?: any): QueryPlanError {
    return new QueryPlanError(message, ERROR_CODES.QUERY_EXECUTION_ERROR, 500, details);
  }

  /**
   * 创建不支持的数据库类型错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static unsupportedDatabaseType(message: string = '不支持的数据库类型', details?: any): QueryPlanError {
    return new QueryPlanError(message, ERROR_CODES.UNSUPPORTED_TYPE, 400, details);
  }

  /**
   * 创建查询计划检索错误
   * @param message 错误消息 
   * @param details 错误详情
   */
  static retrievalError(message: string = '无法检索查询执行计划', details?: any): QueryPlanError {
    return new QueryPlanError(message, ERROR_CODES.QUERY_RESOURCE_NOT_FOUND, 404, details);
  }

  /**
   * 创建查询计划存储错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static storageError(message: string = '无法存储查询执行计划', details?: any): QueryPlanError {
    return new QueryPlanError(message, ERROR_CODES.DATABASE_ERROR, 500, details);
  }

  /**
   * 创建查询不支持执行计划错误
   * @param message 错误消息
   * @param details 错误详情
   */
  static unsupportedQuery(message: string = '此类型的查询不支持生成执行计划', details?: any): QueryPlanError {
    return new QueryPlanError(message, ERROR_CODES.INVALID_SQL, 400, details);
  }
}