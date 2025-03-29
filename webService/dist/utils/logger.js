"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 日志工具类
 * 基于winston实现的分级日志记录器
 */
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = __importDefault(require("../config/env"));
const uuid_1 = require("uuid");
// 确保日志目录存在
const logDir = env_1.default.logging.dir;
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
// 自定义格式化器 - 添加请求ID和错误堆栈
const customFormat = (0, winston_1.format)((info) => {
    // 如果没有requestId就生成一个
    if (!info.requestId) {
        info.requestId = (0, uuid_1.v4)();
    }
    // 如果有错误对象，处理错误堆栈
    if (info.error instanceof Error) {
        info.stack = info.error.stack;
        info.errorName = info.error.name;
        // 从错误对象中提取额外信息（如AppError的字段）
        const errorObj = info.error; // 使用类型断言来访问可能存在的属性
        if (errorObj.errorCode) {
            info.errorCode = errorObj.errorCode;
        }
        // 移除循环引用
        delete info.error;
    }
    return info;
});
// 定义日志格式
const logFormat = winston_1.format.combine(customFormat(), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json());
// 创建控制台格式
const consoleFormat = winston_1.format.combine(customFormat(), winston_1.format.colorize(), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston_1.format.printf(({ timestamp, level, message, requestId, stack, ...meta }) => {
    const reqId = requestId ? `[${requestId}] ` : '';
    const stackStr = stack ? `\n${stack}` : '';
    // 移除不需要在控制台打印的元数据
    delete meta.errorName;
    delete meta.errorCode;
    const metaStr = Object.keys(meta).length && !meta.silent
        ? `\n${JSON.stringify(meta, null, 2)}`
        : '';
    return `${timestamp} ${level}: ${reqId}${message}${stackStr}${metaStr}`;
}));
// 创建日志记录器
const logger = (0, winston_1.createLogger)({
    level: env_1.default.logging.level,
    format: logFormat,
    defaultMeta: { service: env_1.default.service.name },
    transports: [
        // 写入所有日志到文件
        new winston_1.transports.File({
            filename: path_1.default.join(logDir, 'combined.log'),
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
        }),
        // 写入错误日志到单独文件
        new winston_1.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
        }),
    ],
});
// 非生产环境下添加控制台输出
if (env_1.default.service.env !== 'production') {
    logger.add(new winston_1.transports.Console({
        format: consoleFormat,
    }));
}
// 额外的方法，用于创建子日志记录器（携带指定上下文）
logger.getSubLogger = (context) => {
    // 创建子记录器的方法对象
    const subLogger = {
        error: (message, meta = {}) => logger.error(message, { ...context, ...meta }),
        warn: (message, meta = {}) => logger.warn(message, { ...context, ...meta }),
        info: (message, meta = {}) => logger.info(message, { ...context, ...meta }),
        debug: (message, meta = {}) => logger.debug(message, { ...context, ...meta }),
        verbose: (message, meta = {}) => logger.verbose(message, { ...context, ...meta }),
    };
    return subLogger;
};
exports.default = logger;
//# sourceMappingURL=logger.js.map