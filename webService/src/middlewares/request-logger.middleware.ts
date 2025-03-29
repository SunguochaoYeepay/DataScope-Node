/**
 * 请求日志中间件
 */
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

/**
 * 请求日志中间件
 * 记录所有请求的详细信息
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // 生成请求ID并添加到请求头中
  const requestId = uuidv4();
  req.headers['x-request-id'] = requestId;
  
  // 记录请求开始时间
  const startTime = Date.now();
  
  // 记录请求信息
  logger.info(`[${requestId}] 请求开始: ${req.method} ${req.path}`, {
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
    const logMethod = statusCode >= 400 ? logger.warn : logger.info;
    
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