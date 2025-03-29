import { Request, Response, NextFunction } from 'express';
/**
 * 全局错误处理中间件
 */
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
/**
 * 404错误处理中间件
 */
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
