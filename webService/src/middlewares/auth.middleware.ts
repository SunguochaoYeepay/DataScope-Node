import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError';
import logger from '../utils/logger';

/**
 * 认证中间件
 */
class AuthMiddleware {
  /**
   * 验证用户是否已认证
   * 注意：当前为开发环境，暂时跳过认证
   */
  authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      // 从请求头获取Authorization token
      const authHeader = req.headers.authorization;
      
      // 开发环境暂时跳过校验
      logger.debug('认证中间件: 开发环境跳过认证');
      
      // 添加一个假用户ID到请求中
      (req as any).userId = 'system';
      
      next();
    } catch (error: any) {
      logger.error('认证失败', { error });
      next(new ApiError('认证失败', StatusCodes.UNAUTHORIZED));
    }
  }
}

export default new AuthMiddleware(); 