/**
 * 用户认证中间件
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errors/types/api-error';
import { ERROR_CODES } from '../utils/errors/error-codes';
import logger from '../utils/logger';

// 扩展Request类型以支持user属性
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * 解析JWT令牌
 */
const parseToken = (authorization: string): string | null => {
  if (!authorization) return null;
  
  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * 用户认证中间件
 * 验证请求中的JWT令牌并提取用户信息
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new ApiError(ERROR_CODES.UNAUTHORIZED, '未提供认证令牌');
    }
    
    const token = parseToken(authorization);
    if (!token) {
      throw new ApiError(ERROR_CODES.UNAUTHORIZED, '无效的认证令牌格式');
    }
    
    // 验证令牌
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token, secret);
    
    // 将用户信息添加到请求对象
    req.user = decoded;
    
    next();
  } catch (error: unknown) {
    // 使用类型保护处理错误
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        logger.warn('认证令牌已过期', { error });
        next(new ApiError(ERROR_CODES.TOKEN_EXPIRED, '认证令牌已过期'));
      } else if (error.name === 'JsonWebTokenError') {
        logger.warn('无效的认证令牌', { error });
        next(new ApiError(ERROR_CODES.TOKEN_INVALID, '无效的认证令牌'));
      } else {
        logger.error('认证过程出错', { error });
        next(error);
      }
    } else {
      logger.error('认证过程出现未知错误类型', { error });
      next(new ApiError(ERROR_CODES.UNAUTHORIZED, '认证失败'));
    }
  }
};