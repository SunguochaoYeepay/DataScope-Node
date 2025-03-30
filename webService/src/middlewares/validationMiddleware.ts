import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import ApiError from '../utils/apiError';

/**
 * 验证数据源ID
 * @param req 请求对象
 * @param res 响应对象
 * @param next 下一个中间件
 */
export const validateDataSourceId = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { dataSourceId } = req.params;
    
    if (!dataSourceId) {
      throw new ApiError('数据源ID不能为空', 400);
    }
    
    // UUID格式验证
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(dataSourceId)) {
      logger.warn(`无效的数据源ID格式: ${dataSourceId}`);
      // 临时放宽验证，允许任何非空ID
      // throw new ApiError('无效的数据源ID格式', 400);
    }
    
    next();
  } catch (error) {
    logger.error('数据源ID验证失败', { error });
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: '请求参数验证失败'
      });
    }
  }
}; 