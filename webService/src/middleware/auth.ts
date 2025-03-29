/**
 * 身份验证中间件
 */
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/error';
import jwt from 'jsonwebtoken';
import config from '../config';

// 扩展Request接口以支持用户信息
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
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    // 从请求头获取Authorization字段
    const authHeader = req.headers.authorization;
    
    // 检查是否提供了Authorization头
    if (!authHeader) {
      throw new ApiError('未提供认证令牌', 401);
    }
    
    // 检查令牌格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new ApiError('认证令牌格式无效', 401);
    }
    
    const token = parts[1];
    
    // 验证令牌
    try {
      // 使用开发模式令牌
      if (process.env.NODE_ENV === 'development' && token === 'development-token') {
        req.user = {
          id: 'dev-user',
          role: 'admin',
          email: 'dev@example.com'
        };
        return next();
      }
      
      // 验证JWT令牌
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string; email: string };
      
      // 将解码后的用户信息添加到请求对象
      req.user = decoded;
      
      next();
    } catch (error) {
      throw new ApiError('认证令牌无效或已过期', 401);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * 验证用户是否具有管理员权限的中间件
 * @param req 请求对象
 * @param res 响应对象
 * @param next 下一个中间件
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    // 确保用户已经通过身份验证
    if (!req.user) {
      throw new ApiError('未提供认证令牌', 401);
    }
    
    // 检查用户角色
    if (req.user.role !== 'admin') {
      throw new ApiError('需要管理员权限', 403);
    }
    
    next();
  } catch (error) {
    next(error);
  }
} 