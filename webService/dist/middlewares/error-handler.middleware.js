"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * 全局错误处理中间件
 * 捕获并统一处理应用中抛出的所有错误
 */
function errorHandler(err, req, res, next) {
    // 获取请求ID (假设使用了request-id中间件)
    const requestId = req.headers['x-request-id'] || 'unknown';
    // 日志记录错误
    logger_1.default.error(`[${requestId}] 请求错误: ${err.message}`, {
        error: err,
        path: req.path,
        method: req.method,
        requestId,
        stack: err.stack
    });
    // 如果是AppError类型的错误，使用其定义的状态码和错误信息
    if (err instanceof errors_1.AppError) {
        // 设置请求路径和请求ID
        err.setPath(req.path).setRequestId(requestId);
        // 发送错误响应 - 确保格式符合测试要求
        return res.status(err.statusCode).json({
            error: {
                code: err.errorCode,
                type: err.errorType,
                message: err.message,
                path: err.path,
                timestamp: err.timestamp,
                requestId: err.requestId,
                details: err.details || undefined
            }
        });
    }
    // 处理未知错误（非AppError类型）
    const unknownError = errors_1.ApiError.internal('服务器内部错误', {
        originalMessage: err.message
    });
    // 设置请求路径和请求ID
    unknownError.setPath(req.path).setRequestId(requestId);
    // 发送错误响应 - 确保格式符合测试要求
    return res.status(500).json({
        error: {
            code: unknownError.errorCode,
            type: unknownError.errorType,
            message: unknownError.message,
            path: unknownError.path,
            timestamp: unknownError.timestamp,
            requestId: unknownError.requestId,
            details: unknownError.details || undefined
        }
    });
}
//# sourceMappingURL=error-handler.middleware.js.map