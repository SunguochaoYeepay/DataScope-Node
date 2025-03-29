"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * 请求日志中间件
 * 记录所有请求的详细信息
 */
function requestLogger(req, res, next) {
    // 生成请求ID并添加到请求头中
    const requestId = (0, uuid_1.v4)();
    req.headers['x-request-id'] = requestId;
    // 记录请求开始时间
    const startTime = Date.now();
    // 记录请求信息
    logger_1.default.info(`[${requestId}] 请求开始: ${req.method} ${req.path}`, {
        method: req.method,
        path: req.path,
        query: req.query,
        headers: req.headers,
        ip: req.ip,
        requestId
    });
    // 在响应完成时记录响应信息
    res.on('finish', () => {
        // 计算请求处理时间
        const duration = Date.now() - startTime;
        // 获取响应状态码
        const statusCode = res.statusCode;
        // 根据状态码选择日志级别
        const logMethod = statusCode >= 400 ? logger_1.default.warn : logger_1.default.info;
        // 记录响应信息
        logMethod(`[${requestId}] 请求完成: ${req.method} ${req.path} ${statusCode} ${duration}ms`, {
            method: req.method,
            path: req.path,
            statusCode,
            duration,
            requestId
        });
    });
    next();
}
//# sourceMappingURL=request-logger.middleware.js.map