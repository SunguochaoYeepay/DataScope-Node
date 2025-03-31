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
  
  static badRequest(message: string, code: number, errors: any) {
    return new ApiError(message, 400, { code, errors });
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
  
  constructor(message: string, sqlOrId: string, dataSourceIdOrSql?: string) {
    super(message, 400, ErrorCodes.QUERY_EXECUTION_ERROR);
    
    // 参数顺序兼容性处理：判断第二个参数是否像SQL语句
    if (sqlOrId.toLowerCase().includes('select') || 
        sqlOrId.toLowerCase().includes('show') || 
        sqlOrId.toLowerCase().includes('insert') || 
        sqlOrId.toLowerCase().includes('update') || 
        sqlOrId.toLowerCase().includes('delete') || 
        sqlOrId.toLowerCase().includes('create') || 
        sqlOrId.toLowerCase().includes('alter')) {
      // 第二个参数是SQL，第三个参数是dataSourceId
      this.sql = sqlOrId;
      this.dataSourceId = dataSourceIdOrSql || 'unknown';
    } else {
      // 第二个参数是dataSourceId，第三个参数是SQL
      this.dataSourceId = sqlOrId;
      this.sql = dataSourceIdOrSql || 'unknown';
    }
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