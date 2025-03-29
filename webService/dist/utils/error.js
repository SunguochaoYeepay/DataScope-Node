"use strict";
/**
 * 错误类型定义
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.QueryExecutionError = exports.DataSourceConnectionError = exports.DatabaseError = exports.ApiError = exports.AppError = exports.ErrorCodes = void 0;
exports.ErrorCodes = {
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
class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = exports.ErrorCodes.INTERNAL_SERVER_ERROR) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        // 兼容 Error 类继承
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * API错误类
 */
class ApiError extends AppError {
    constructor(message, statusCode = 400, details = null) {
        super(message, statusCode, exports.ErrorCodes.INVALID_REQUEST);
        this.details = details;
    }
    static badRequest(message, code, errors) {
        return new ApiError(message, 400, { code, errors });
    }
}
exports.ApiError = ApiError;
/**
 * 数据库错误类
 */
class DatabaseError extends AppError {
    constructor(message, details = null) {
        super(message, 500, exports.ErrorCodes.DATABASE_ERROR);
        this.details = details;
    }
}
exports.DatabaseError = DatabaseError;
/**
 * 数据源连接错误类
 */
class DataSourceConnectionError extends AppError {
    constructor(message, dataSourceId) {
        super(message, 400, exports.ErrorCodes.DATA_SOURCE_CONNECTION_ERROR);
        this.dataSourceId = dataSourceId;
    }
}
exports.DataSourceConnectionError = DataSourceConnectionError;
/**
 * 查询执行错误类
 */
class QueryExecutionError extends AppError {
    constructor(message, dataSourceId, sql) {
        super(message, 400, exports.ErrorCodes.QUERY_EXECUTION_ERROR);
        this.dataSourceId = dataSourceId;
        this.sql = sql;
    }
}
exports.QueryExecutionError = QueryExecutionError;
/**
 * 参数验证错误类
 */
class ValidationError extends AppError {
    constructor(errors) {
        super('请求参数验证失败', 400, exports.ErrorCodes.VALIDATION_ERROR);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=error.js.map