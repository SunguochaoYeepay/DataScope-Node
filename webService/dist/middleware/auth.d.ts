/**
 * 身份验证中间件
 */
import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
        email: string;
        [key: string]: any;
    };
}
/**
 * 验证用户令牌的中间件
 * @param req 请求对象
 * @param res 响应对象
 * @param next 下一个中间件
 */
export declare function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
/**
 * 验证用户是否具有管理员权限的中间件
 * @param req 请求对象
 * @param res 响应对象
 * @param next 下一个中间件
 */
export declare function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
