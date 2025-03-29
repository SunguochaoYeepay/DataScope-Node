"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/**
 * 应用错误基类
 */
const error_codes_1 = require("./error-codes");
class AppError extends Error {
    /**
     * 创建应用错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param errorType 错误类型
     * @param details 错误详情
     */
    constructor(message, errorCode, statusCode = 500, errorType = 'AppError', details) {
        // 如果message为空，尝试从错误码获取默认消息
        const finalMessage = message || error_codes_1.ERROR_MESSAGES[errorCode] || '未知错误';
        super(finalMessage);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errorType = errorType;
        this.details = details;
        this.timestamp = new Date().toISOString();
        // 兼容 Error 类继承
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    /**
     * 设置请求路径
     * @param path 请求路径
     */
    setPath(path) {
        this.path = path;
        return this;
    }
    /**
     * 设置请求ID
     * @param requestId 请求ID
     */
    setRequestId(requestId) {
        this.requestId = requestId;
        return this;
    }
    /**
     * 添加错误详情
     * @param details 错误详情
     */
    addDetails(details) {
        this.details = details;
        return this;
    }
    /**
     * 转换为响应对象
     */
    toResponse() {
        const response = {
            statusCode: this.statusCode,
            error: this.errorType,
            message: this.message,
            code: this.errorCode,
            timestamp: this.timestamp
        };
        if (this.path) {
            response.path = this.path;
        }
        if (this.details) {
            response.details = this.details;
        }
        return response;
    }
    /**
     * 转换为JSON
     */
    toJSON() {
        return this.toResponse();
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app-error.js.map