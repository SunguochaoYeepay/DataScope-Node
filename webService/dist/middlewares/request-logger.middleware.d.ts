/**
 * 请求日志中间件
 */
import { Request, Response, NextFunction } from 'express';
/**
 * 请求日志中间件
 * 记录所有请求的详细信息
 */
export declare function requestLogger(req: Request, res: Response, next: NextFunction): void;
