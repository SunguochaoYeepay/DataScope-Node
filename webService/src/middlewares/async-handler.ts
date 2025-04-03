/**
 * 异步请求处理包装器
 */
import { Request, Response, NextFunction } from 'express';

/**
 * 异步请求处理包装器
 * 捕获异步路由处理器中的错误并传递给下一个错误处理中间件
 * 
 * @param fn 异步路由处理函数
 * @returns 包装后的异步路由处理函数
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};