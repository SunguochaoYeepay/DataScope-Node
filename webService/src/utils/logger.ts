/**
 * 日志工具类
 * 基于winston实现的分级日志记录器
 */
import { createLogger, format, transports, Logger } from 'winston';
import path from 'path';
import fs from 'fs';
import config from '../config/env';
import { v4 as uuidv4 } from 'uuid';

// 确保日志目录存在
const logDir = config.logging.dir;
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 自定义格式化器 - 添加请求ID和错误堆栈
const customFormat = format((info) => {
  // 如果没有requestId就生成一个
  if (!info.requestId) {
    info.requestId = uuidv4();
  }
  
  // 如果有错误对象，处理错误堆栈
  if (info.error instanceof Error) {
    info.stack = info.error.stack;
    info.errorName = info.error.name;
    // 从错误对象中提取额外信息（如AppError的字段）
    const errorObj = info.error as any; // 使用类型断言来访问可能存在的属性
    if (errorObj.errorCode) {
      info.errorCode = errorObj.errorCode;
    }
    // 移除循环引用
    delete info.error;
  }
  
  return info;
});

// 定义日志格式
const logFormat = format.combine(
  customFormat(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// 创建控制台格式
const consoleFormat = format.combine(
  customFormat(),
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.printf(({ timestamp, level, message, requestId, stack, ...meta }) => {
    const reqId = requestId ? `[${requestId}] ` : '';
    const stackStr = stack ? `\n${stack}` : '';
    
    // 移除不需要在控制台打印的元数据
    delete meta.errorName;
    delete meta.errorCode;
    
    const metaStr = Object.keys(meta).length && !meta.silent
      ? `\n${JSON.stringify(meta, null, 2)}`
      : '';
      
    return `${timestamp} ${level}: ${reqId}${message}${stackStr}${metaStr}`;
  })
);

// 创建日志记录器
const logger = createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: config.service.name },
  transports: [
    // 写入所有日志到文件
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    // 写入错误日志到单独文件
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
});

// 非生产环境下添加控制台输出
if (config.service.env !== 'production') {
  logger.add(
    new transports.Console({
      format: consoleFormat,
    })
  );
}

// 扩展Logger接口
interface ExtendedLogger extends Logger {
  getSubLogger: (context: Record<string, any>) => {
    error: (message: string, meta?: Record<string, any>) => void;
    warn: (message: string, meta?: Record<string, any>) => void;
    info: (message: string, meta?: Record<string, any>) => void;
    debug: (message: string, meta?: Record<string, any>) => void;
    verbose: (message: string, meta?: Record<string, any>) => void;
  };
}

// 额外的方法，用于创建子日志记录器（携带指定上下文）
(logger as ExtendedLogger).getSubLogger = (context: Record<string, any>) => {
  // 创建子记录器的方法对象
  const subLogger = {
    error: (message: string, meta: Record<string, any> = {}) => 
      logger.error(message, { ...context, ...meta }),
    warn: (message: string, meta: Record<string, any> = {}) => 
      logger.warn(message, { ...context, ...meta }),
    info: (message: string, meta: Record<string, any> = {}) => 
      logger.info(message, { ...context, ...meta }),
    debug: (message: string, meta: Record<string, any> = {}) => 
      logger.debug(message, { ...context, ...meta }),
    verbose: (message: string, meta: Record<string, any> = {}) => 
      logger.verbose(message, { ...context, ...meta }),
  };
  
  return subLogger;
};

export default logger as ExtendedLogger;