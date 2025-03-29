import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';
import config from '../config/env';

// 确保日志目录存在
const logDir = config.logging.dir;
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 定义日志格式
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// 创建控制台格式
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : '';
    return `${timestamp} ${level}: ${message}${metaStr}`;
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

export default logger;