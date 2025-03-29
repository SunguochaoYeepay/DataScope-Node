"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
const app_error_1 = require("../app-error");
const error_codes_1 = require("../error-codes");
/**
 * API错误类
 * 用于API请求处理过程中的错误
 */
class ApiError extends app_error_1.AppError {
    /**
     * 创建API错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param errorType 错误类型
     * @param details 错误详情
     */
    constructor(message, errorCode = error_codes_1.ERROR_CODES.INTERNAL_SERVER_ERROR, statusCode = 500, errorType = 'ApiError', details) {
        super(message, errorCode, statusCode, errorType, details);
    }
    /**
     * 创建400错误 - 无效请求
     * @param message 错误消息
     * @param details 错误详情
     */
    static badRequest(message = '无效的请求参数', details) {
        return new ApiError(message, error_codes_1.ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', details);
    }
    /**
     * 创建401错误 - 未授权
     * @param message 错误消息
     * @param details 错误详情
     */
    static unauthorized(message = '未授权访问', details) {
        return new ApiError(message, error_codes_1.ERROR_CODES.UNAUTHORIZED, 401, 'UNAUTHORIZED', details);
    }
    /**
     * 创建403错误 - 禁止访问
     * @param message 错误消息
     * @param details 错误详情
     */
    static forbidden(message = '禁止访问此资源', details) {
        return new ApiError(message, error_codes_1.ERROR_CODES.FORBIDDEN, 403, 'FORBIDDEN', details);
    }
    /**
     * 创建404错误 - 资源不存在
     * @param message 错误消息
     * @param details 错误详情
     */
    static notFound(message = '请求的资源不存在', details) {
        return new ApiError(message, error_codes_1.ERROR_CODES.RESOURCE_NOT_FOUND, 404, 'NOT_FOUND', details);
    }
    /**
     * 创建409错误 - 资源冲突
     * @param message 错误消息
     * @param details 错误详情
     */
    static conflict(message = '资源冲突', details) {
        return new ApiError(message, error_codes_1.ERROR_CODES.CONFLICT, 409, 'CONFLICT', details);
    }
    /**
     * 创建429错误 - 请求过多
     * @param message 错误消息
     * @param details 错误详情
     */
    static tooManyRequests(message = '请求过于频繁，请稍后再试', details) {
        return new ApiError(message, error_codes_1.ERROR_CODES.TOO_MANY_REQUESTS, 429, 'TOO_MANY_REQUESTS', details);
    }
    /**
     * 创建500错误 - 服务器内部错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static internal(message = '服务器内部错误', details) {
        return new ApiError(message, error_codes_1.ERROR_CODES.INTERNAL_SERVER_ERROR, 500, 'INTERNAL_SERVER_ERROR', details);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=api-error.js.map