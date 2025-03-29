import { AppError } from '../app-error';
/**
 * API错误类
 * 用于API请求处理过程中的错误
 */
export declare class ApiError extends AppError {
    /**
     * 创建API错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param errorType 错误类型
     * @param details 错误详情
     */
    constructor(message: string, errorCode?: number, statusCode?: number, errorType?: string, details?: any);
    /**
     * 创建400错误 - 无效请求
     * @param message 错误消息
     * @param details 错误详情
     */
    static badRequest(message?: string, details?: any): ApiError;
    /**
     * 创建401错误 - 未授权
     * @param message 错误消息
     * @param details 错误详情
     */
    static unauthorized(message?: string, details?: any): ApiError;
    /**
     * 创建403错误 - 禁止访问
     * @param message 错误消息
     * @param details 错误详情
     */
    static forbidden(message?: string, details?: any): ApiError;
    /**
     * 创建404错误 - 资源不存在
     * @param message 错误消息
     * @param details 错误详情
     */
    static notFound(message?: string, details?: any): ApiError;
    /**
     * 创建409错误 - 资源冲突
     * @param message 错误消息
     * @param details 错误详情
     */
    static conflict(message?: string, details?: any): ApiError;
    /**
     * 创建429错误 - 请求过多
     * @param message 错误消息
     * @param details 错误详情
     */
    static tooManyRequests(message?: string, details?: any): ApiError;
    /**
     * 创建500错误 - 服务器内部错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static internal(message?: string, details?: any): ApiError;
}
