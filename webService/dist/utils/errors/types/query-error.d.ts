import { AppError } from '../app-error';
/**
 * 查询执行错误类
 * 用于SQL查询执行过程中的错误
 */
export declare class QueryError extends AppError {
    /**
     * 创建查询错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param details 错误详情
     */
    constructor(message: string, errorCode?: number, statusCode?: number, details?: any);
    /**
     * 创建SQL语法错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static syntaxError(message?: string, details?: any): QueryError;
    /**
     * 创建查询执行超时错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static timeout(message?: string, details?: any): QueryError;
    /**
     * 创建查询权限错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static permissionDenied(message?: string, details?: any): QueryError;
    /**
     * 创建查询资源不存在错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static resourceNotFound(message?: string, details?: any): QueryError;
    /**
     * 创建查询过于复杂错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static tooComplex(message?: string, details?: any): QueryError;
    /**
     * 创建查询结果过大错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static resultTooLarge(message?: string, details?: any): QueryError;
}
