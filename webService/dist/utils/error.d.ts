/**
 * 错误类型定义
 */
export declare const ErrorCodes: {
    INVALID_REQUEST: string;
    UNAUTHORIZED: string;
    FORBIDDEN: string;
    NOT_FOUND: string;
    METHOD_NOT_ALLOWED: string;
    CONFLICT: string;
    INTERNAL_SERVER_ERROR: string;
    SERVICE_UNAVAILABLE: string;
    DATABASE_ERROR: string;
    VALIDATION_ERROR: string;
    DATA_SOURCE_CONNECTION_ERROR: string;
    QUERY_EXECUTION_ERROR: string;
};
/**
 * 基础应用错误类
 */
export declare class AppError extends Error {
    statusCode: number;
    errorCode: string;
    constructor(message: string, statusCode?: number, errorCode?: string);
}
/**
 * API错误类
 */
export declare class ApiError extends AppError {
    details: any;
    constructor(message: string, statusCode?: number, details?: any);
    static badRequest(message: string, code: number, errors: any): ApiError;
}
/**
 * 数据库错误类
 */
export declare class DatabaseError extends AppError {
    details: any;
    constructor(message: string, details?: any);
}
/**
 * 数据源连接错误类
 */
export declare class DataSourceConnectionError extends AppError {
    dataSourceId: string;
    constructor(message: string, dataSourceId: string);
}
/**
 * 查询执行错误类
 */
export declare class QueryExecutionError extends AppError {
    dataSourceId: string;
    sql: string;
    constructor(message: string, dataSourceId: string, sql: string);
}
/**
 * 参数验证错误类
 */
export declare class ValidationError extends AppError {
    errors: Array<{
        field: string;
        message: string;
    }>;
    constructor(errors: Array<{
        field: string;
        message: string;
    }>);
}
