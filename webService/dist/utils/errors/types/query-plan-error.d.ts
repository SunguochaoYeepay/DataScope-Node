import { AppError } from '../app-error';
/**
 * 查询计划错误类
 * 用于处理查询执行计划生成和分析过程中的错误
 */
export declare class QueryPlanError extends AppError {
    /**
     * 创建查询计划错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param details 错误详情
     */
    constructor(message: string, errorCode?: number, statusCode?: number, details?: any);
    /**
     * 创建查询计划生成失败错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static generationFailed(message?: string, details?: any): QueryPlanError;
    /**
     * 创建查询计划解析错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static parseError(message?: string, details?: any): QueryPlanError;
    /**
     * 创建查询计划分析错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static analysisError(message?: string, details?: any): QueryPlanError;
    /**
     * 创建不支持的数据库类型错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static unsupportedDatabaseType(message?: string, details?: any): QueryPlanError;
    /**
     * 创建查询计划检索错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static retrievalError(message?: string, details?: any): QueryPlanError;
    /**
     * 创建查询计划存储错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static storageError(message?: string, details?: any): QueryPlanError;
    /**
     * 创建查询不支持执行计划错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static unsupportedQuery(message?: string, details?: any): QueryPlanError;
}
