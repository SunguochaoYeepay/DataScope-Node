/**
 * 错误处理模块导出
 */

// 错误类型
export { AppError } from './app-error';
export { ApiError } from './types/api-error';

// 错误码定义
export { ErrorCode, ERROR_CODES, ERROR_MESSAGES, GENERAL_ERROR } from './error-codes';
export { VERSION_ERROR, VERSION_ERROR_MESSAGES, VERSION_ERROR_HTTP_STATUS } from './error-codes-version';

// 错误类型分组
export {
  RESOURCE_ERROR,
  QUERY_ERROR,
  DATASOURCE_ERROR,
  VALIDATION_ERROR,
  DATABASE_ERROR,
  AUTH_ERROR
} from './general-error';