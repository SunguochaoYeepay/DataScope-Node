/**
 * 全局错误处理中间件
 */
import { Request, Response, NextFunction } from 'express';
/**
 * 全局错误处理中间件
 * 捕获并统一处理应用中抛出的所有错误
 */
export declare function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response | void;
