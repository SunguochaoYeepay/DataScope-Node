import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError';
import logger from '../utils/logger';

/**
 * 认证中间件
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 从请求头获取Authorization token
    const authHeader = req.headers.authorization;
    
    // 开发环境暂时跳过校验
    logger.debug('认证中间件: 开发环境跳过认证');
    
    // 添加用户信息到请求对象
    (req as any).user = {
      id: 'system',
      name: 'System User',
      roles: ['admin']
    };
    
    next();
  } catch (error: any) {
    logger.error('认证失败', { error });
    next(new ApiError('认证失败', StatusCodes.UNAUTHORIZED));
  }
}