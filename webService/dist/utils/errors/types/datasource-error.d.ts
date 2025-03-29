import { AppError } from '../app-error';
/**
 * 数据源错误类
 * 用于数据源操作过程中的错误
 */
export declare class DataSourceError extends AppError {
    /**
     * 创建数据源错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param details 错误详情
     */
    constructor(message: string, errorCode?: number, statusCode?: number, details?: any);
    /**
     * 创建数据源连接失败错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static connectionFailed(message?: string, details?: any): DataSourceError;
    /**
     * 创建数据源认证失败错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static authenticationFailed(message?: string, details?: any): DataSourceError;
    /**
     * 创建数据源不存在错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static notFound(message?: string, details?: any): DataSourceError;
    /**
     * 创建数据源配置无效错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static invalidConfiguration(message?: string, details?: any): DataSourceError;
    /**
     * 创建数据源类型不支持错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static unsupportedType(message?: string, details?: any): DataSourceError;
    /**
     * 创建数据源超时错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static timeout(message?: string, details?: any): DataSourceError;
}
