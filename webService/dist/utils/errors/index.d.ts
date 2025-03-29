/**
 * 错误处理模块导出
 */
export * from './error-codes';
export * from './app-error';
export * from './types/api-error';
export * from './types/database-error';
export * from './types/datasource-error';
export * from './types/query-error';
export * from './types/validation-error';
export * from './types/query-plan-error';
import { AppError } from './app-error';
import { ApiError } from './types/api-error';
import { DatabaseError } from './types/database-error';
import { DataSourceError } from './types/datasource-error';
import { QueryError } from './types/query-error';
import { ValidationError } from './types/validation-error';
import { QueryPlanError } from './types/query-plan-error';
export type ErrorTypes = AppError | ApiError | DatabaseError | DataSourceError | QueryError | ValidationError | QueryPlanError;
