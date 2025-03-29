export interface IErrorResponse {
    statusCode: number;
    error: string;
    message: string;
    code: number;
    timestamp: string;
    path?: string;
    details?: any;
}
export declare class AppError extends Error {
    statusCode: number;
    errorCode: number;
    errorType: string;
    details?: any;
    path?: string;
    timestamp: string;
    requestId?: string;
    /**
     * 创建应用错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param errorType 错误类型
     * @param details 错误详情
     */
    constructor(message: string, errorCode: number, statusCode?: number, errorType?: string, details?: any);
    /**
     * 设置请求路径
     * @param path 请求路径
     */
    setPath(path: string): this;
    /**
     * 设置请求ID
     * @param requestId 请求ID
     */
    setRequestId(requestId: string): this;
    /**
     * 添加错误详情
     * @param details 错误详情
     */
    addDetails(details: any): this;
    /**
     * 转换为响应对象
     */
    toResponse(): IErrorResponse;
    /**
     * 转换为JSON
     */
    toJSON(): object;
}
