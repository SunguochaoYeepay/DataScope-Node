import { AppError } from '../app-error';
/**
 * 数据库错误类
 * 用于数据库操作过程中的错误
 */
export declare class DatabaseError extends AppError {
    /**
     * 创建数据库错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param details 错误详情
     */
    constructor(message: string, errorCode?: number, statusCode?: number, details?: any);
    /**
     * 创建数据库连接错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static connectionError(message?: string, details?: any): DatabaseError;
    /**
     * 创建数据库查询错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static queryError(message?: string, details?: any): DatabaseError;
    /**
     * 创建事务错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static transactionError(message?: string, details?: any): DatabaseError;
    /**
     * 创建记录未找到错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static recordNotFound(message?: string, details?: any): DatabaseError;
    /**
     * 创建记录已存在错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static recordExists(message?: string, details?: any): DatabaseError;
    /**
     * 创建数据库约束错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static constraintError(message?: string, details?: any): DatabaseError;
}
