import { Request, Response, NextFunction } from 'express';
import { ApiError, AppError } from '../../utils/error';
import logger from '../../utils/logger';

/**
 * 自定义验证错误对象接口
 */
interface ValidationErrorObject {
  type: string;
  value: any;
  msg: string;
  path: string;
  location: string;
}

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 记录错误日志
  const logContext = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    requestId: req.headers['x-request-id'],
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  };
  
  if (err instanceof AppError || err instanceof ApiError) {
    logger.error(`API错误: ${err.message}`, logContext);
    
    // 处理应用错误
    const response = {
      success: false,
      error: {
        message: err.message,
        code: err.errorCode
      }
    };
    
    // 添加错误详情（如果有）
    if (err instanceof ApiError && err.details) {
      Object.assign(response.error, { details: err.details });
    }
    
    res.status(err.statusCode).json(response);
    return;
  } else {
    // 处理验证错误
    if (Array.isArray(err) && err.length > 0 && err[0] && 'msg' in err[0]) {
      logger.error(`验证错误`, {
        ...logContext,
        validationErrors: err
      });
      
      const errors = err.map((e: ValidationErrorObject) => ({
        field: e.path,
        message: e.msg,
        value: e.value
      }));
      
      res.status(400).json({
        success: false,
        error: {
          message: '请求参数验证失败',
          code: 'VALIDATION_ERROR',
          errors
        }
      });
      return;
    } else {
      // 处理未知错误
      logger.error(`未捕获错误: ${err.message}`, logContext);
      
      res.status(500).json({
        success: false,
        error: {
          message: '服务器内部错误',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
      return;
    }
  }
};

/**
 * 404错误处理中间件
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const err = new AppError(`未找到路径: ${req.originalUrl}`, 404, 'NOT_FOUND');
  next(err);
};