/**
 * 日志工具
 * 提供统一的日志记录接口
 */

import config from '../config';

/**
 * 日志级别
 */
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

/**
 * 当前日志级别
 */
const currentLogLevel = (): LogLevel => {
  const level = (config.logging?.level || 'info').toLowerCase();
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
const formatLog = (message: string, data?: any): string => {
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
  error: (message: string, data?: any): void => {
    if (currentLogLevel() >= LogLevel.ERROR) {
      console.error(`[ERROR] ${formatLog(message, data)}`);
    }
  },

  /**
   * 警告日志
   * @param message 日志消息
   * @param data 附加数据
   */
  warn: (message: string, data?: any): void => {
    if (currentLogLevel() >= LogLevel.WARN) {
      console.warn(`[WARN] ${formatLog(message, data)}`);
    }
  },

  /**
   * 信息日志
   * @param message 日志消息
   * @param data 附加数据
   */
  info: (message: string, data?: any): void => {
    if (currentLogLevel() >= LogLevel.INFO) {
      console.info(`[INFO] ${formatLog(message, data)}`);
    }
  },

  /**
   * 调试日志
   * @param message 日志消息
   * @param data 附加数据
   */
  debug: (message: string, data?: any): void => {
    if (currentLogLevel() >= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${formatLog(message, data)}`);
    }
  }
};

export default logger;