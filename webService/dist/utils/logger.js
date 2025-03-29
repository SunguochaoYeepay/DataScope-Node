"use strict";
/**
 * 日志工具
 * 提供统一的日志记录接口
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
/**
 * 日志级别
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (LogLevel = {}));
/**
 * 当前日志级别
 */
const currentLogLevel = () => {
    const level = (config_1.default.logging?.level || 'info').toLowerCase();
    switch (level) {
        case 'error': return LogLevel.ERROR;
        case 'warn': return LogLevel.WARN;
        case 'info': return LogLevel.INFO;
        case 'debug': return LogLevel.DEBUG;
        default: return LogLevel.INFO;
    }
};
/**
 * 格式化日志内容
 * @param message 日志消息
 * @param data 附加数据
 * @returns 格式化后的日志字符串
 */
const formatLog = (message, data) => {
    const timestamp = new Date().toISOString();
    const dataString = data ? ` ${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] ${message}${dataString}`;
};
/**
 * 日志记录工具
 */
const logger = {
    /**
     * 错误日志
     * @param message 日志消息
     * @param data 附加数据
     */
    error: (message, data) => {
        if (currentLogLevel() >= LogLevel.ERROR) {
            console.error(`[ERROR] ${formatLog(message, data)}`);
        }
    },
    /**
     * 警告日志
     * @param message 日志消息
     * @param data 附加数据
     */
    warn: (message, data) => {
        if (currentLogLevel() >= LogLevel.WARN) {
            console.warn(`[WARN] ${formatLog(message, data)}`);
        }
    },
    /**
     * 信息日志
     * @param message 日志消息
     * @param data 附加数据
     */
    info: (message, data) => {
        if (currentLogLevel() >= LogLevel.INFO) {
            console.info(`[INFO] ${formatLog(message, data)}`);
        }
    },
    /**
     * 调试日志
     * @param message 日志消息
     * @param data 附加数据
     */
    debug: (message, data) => {
        if (currentLogLevel() >= LogLevel.DEBUG) {
            console.debug(`[DEBUG] ${formatLog(message, data)}`);
        }
    }
};
exports.default = logger;
//# sourceMappingURL=logger.js.map