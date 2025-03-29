/**
 * 错误类型定义
 */

export const ErrorCodes = {
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATA_SOURCE_CONNECTION_ERROR: 'DATA_SOURCE_CONNECTION_ERROR',
  QUERY_EXECUTION_ERROR: 'QUERY_EXECUTION_ERROR'
};

/**
 * 基础应用错误类
 */
export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  
  constructor(message: string, statusCode: number = 500, errorCode: string = ErrorCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    
    // 兼容 Error 类继承
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * API错误类
 */
export class ApiError extends AppError {
  details: any;
  
  constructor(message: string, statusCode: number = 400, details: any = null) {
    super(message, statusCode, ErrorCodes.INVALID_REQUEST);
    this.details = details;
  }
}

/**
 * 数据库错误类
 */
export class DatabaseError extends AppError {
  details: any;
  
  constructor(message: string, details: any = null) {
    super(message, 500, ErrorCodes.DATABASE_ERROR);
    this.details = details;
  }
}

/**
 * 数据源连接错误类
 */
export class DataSourceConnectionError extends AppError {
  dataSourceId: string;
  
  constructor(message: string, dataSourceId: string) {
    super(message, 400, ErrorCodes.DATA_SOURCE_CONNECTION_ERROR);
    this.dataSourceId = dataSourceId;
  }
}

/**
 * 查询执行错误类
 */
export class QueryExecutionError extends AppError {
  dataSourceId: string;
  sql: string;
  
  constructor(message: string, dataSourceId: string, sql: string) {
    super(message, 400, ErrorCodes.QUERY_EXECUTION_ERROR);
    this.dataSourceId = dataSourceId;
    this.sql = sql;
  }
}

/**
 * 参数验证错误类
 */
export class ValidationError extends AppError {
  errors: Array<{
    field: string;
    message: string;
  }>;
  
  constructor(errors: Array<{ field: string; message: string }>) {
    super('请求参数验证失败', 400, ErrorCodes.VALIDATION_ERROR);
    this.errors = errors;
  }
}