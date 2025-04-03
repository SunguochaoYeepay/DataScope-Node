import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/errors/types/api-error';
import systemService from '../../services/system.service';
import logger from '../../utils/logger';
import { getPaginationParams } from '../../utils/api.utils';

/**
 * 系统控制器
 * 处理系统级功能，如日志、健康检查等
 */
export class SystemController {
  /**
   * 获取系统日志
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '请求参数错误',
          errors: errors.array()
        });
      }
      
      const pagination = getPaginationParams(req);
      const { level, search, startDate, endDate } = req.query;
      
      logger.debug('获取系统日志请求', { pagination, level, search, startDate, endDate });
      
      const logs = await systemService.getLogs({
        page: pagination.page,
        size: pagination.size,
        level: level as string,
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string
      });
      
      return res.status(StatusCodes.OK).json({
        success: true,
        data: logs
      });
    } catch (error: any) {
      logger.error('获取系统日志失败', { error });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode
        });
      }
      
      next(error);
    }
  }
  
  /**
   * 获取系统健康状态
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  async getHealthStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await systemService.getHealthStatus();
      
      return res.status(StatusCodes.OK).json({
        success: true,
        data: status
      });
    } catch (error: any) {
      logger.error('获取系统健康状态失败', { error });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode
        });
      }
      
      next(error);
    }
  }
  
  /**
   * 验证获取系统日志请求参数
   */
  validateGetLogs() {
    return [
      check('level').optional().isIn(['error', 'warn', 'info', 'debug']).withMessage('日志级别无效'),
      check('search').optional().isString().withMessage('搜索关键词必须是字符串'),
      check('startDate').optional().isISO8601().withMessage('开始日期格式无效'),
      check('endDate').optional().isISO8601().withMessage('结束日期格式无效')
    ];
  }
}

// 创建单例实例导出
const systemController = new SystemController();
export default systemController; 