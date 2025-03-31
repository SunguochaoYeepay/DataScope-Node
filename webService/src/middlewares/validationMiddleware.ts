import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import ApiError from '../utils/apiError';

/**
 * 验证中间件，用于验证请求参数
 */

/**
 * 验证数据源ID
 * @param req 请求对象
 * @param res 响应对象
 * @param next 下一个中间件
 */
export const validateDataSourceId = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { dataSourceId } = req.params;
    
    if (!dataSourceId || dataSourceId.trim() === '') {
      throw new ApiError('数据源ID不能为空', StatusCodes.BAD_REQUEST);
    }
    
    // 简单字符串检查，不做UUID格式验证
    if (typeof dataSourceId !== 'string') {
      throw new ApiError('数据源ID格式不正确', StatusCodes.BAD_REQUEST);
    }
    
    next();
  } catch (error) {
    logger.error('数据源ID验证失败', { error });
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError('验证数据源ID失败', StatusCodes.BAD_REQUEST));
    }
  }
};

/**
 * 验证表名
 * @param req 请求对象
 * @param res 响应对象
 * @param next 下一个中间件
 */
export const validateTableName = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { tableName } = req.params;
    
    if (!tableName || tableName.trim() === '') {
      throw new ApiError('表名不能为空', StatusCodes.BAD_REQUEST);
    }
    
    next();
  } catch (error) {
    logger.error('表名验证失败', { error });
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError('验证表名失败', StatusCodes.BAD_REQUEST));
    }
  }
}; 