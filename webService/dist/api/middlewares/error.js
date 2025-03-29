"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const error_1 = require("../../utils/error");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
    // 记录错误日志
    const logContext = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        requestId: req.headers['x-request-id'],
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack
        }
    };
    if (err instanceof error_1.AppError || err instanceof error_1.ApiError) {
        logger_1.default.error(`API错误: ${err.message}`, logContext);
        // 处理应用错误
        const response = {
            success: false,
            error: {
                message: err.message,
                code: err.errorCode
            }
        };
        // 添加错误详情（如果有）
        if (err instanceof error_1.ApiError && err.details) {
            Object.assign(response.error, { details: err.details });
        }
        res.status(err.statusCode).json(response);
        return;
    }
    else {
        // 处理验证错误
        if (Array.isArray(err) && err.length > 0 && err[0] && 'msg' in err[0]) {
            logger_1.default.error(`验证错误`, {
                ...logContext,
                validationErrors: err
            });
            const errors = err.map((e) => ({
                field: e.path,
                message: e.msg,
                value: e.value
            }));
            res.status(400).json({
                success: false,
                error: {
                    message: '请求参数验证失败',
                    code: 'VALIDATION_ERROR',
                    errors
                }
            });
            return;
        }
        else {
            // 处理未知错误
            logger_1.default.error(`未捕获错误: ${err.message}`, logContext);
            res.status(500).json({
                success: false,
                error: {
                    message: '服务器内部错误',
                    code: 'INTERNAL_SERVER_ERROR'
                }
            });
            return;
        }
    }
};
exports.errorHandler = errorHandler;
/**
 * 404错误处理中间件
 */
const notFoundHandler = (req, res, next) => {
    const err = new error_1.AppError(`未找到路径: ${req.originalUrl}`, 404, 'NOT_FOUND');
    next(err);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.js.map