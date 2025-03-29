/**
 * 错误处理模块导出
 */

// 错误码定义
export * from './error-codes';

// 基础错误类
export * from './app-error';

// 具体错误类型
export * from './types/api-error';
export * from './types/database-error';
export * from './types/datasource-error';
export * from './types/query-error';
export * from './types/validation-error';

// 导出类型别名方便使用
import { AppError } from './app-error';
import { ApiError } from './types/api-error';
import { DatabaseError } from './types/database-error';
import { DataSourceError } from './types/datasource-error';
import { QueryError } from './types/query-error';
import { ValidationError } from './types/validation-error';

export type ErrorTypes = 
  | AppError
  | ApiError
  | DatabaseError
  | DataSourceError
  | QueryError
  | ValidationError;