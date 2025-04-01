import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import dataSourceService from '../../services/datasource.service';
import { ApiError } from '../../utils/errors/types/api-error';
import { ERROR_CODES } from '../../utils/errors/error-codes';
import logger from '../../utils/logger';
import { getPaginationParams, createSuccessResponse } from '../../utils/api.utils';

export class DataSourceController {
  /**
   * 获取所有数据源
   */
  async getAllDataSources(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPaginationParams(req);
      const dataSources = await dataSourceService.getAllDataSources({
        page: pagination.page,
        size: pagination.size
      });
      
      res.status(200).json({
        success: true,
        data: dataSources
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 获取单个数据源
   */
  async getDataSourceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dataSource = await dataSourceService.getDataSourceById(id);
      res.status(200).json({
        success: true,
        data: dataSource,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 创建数据源
   */
  async createDataSource(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const dataSourceData = {
        name: req.body.name,
        type: req.body.type,
        host: req.body.host,
        port: parseInt(req.body.port, 10),
        username: req.body.username,
        password: req.body.password,
        database: req.body.database,
        description: req.body.description,
        active: req.body.active !== undefined ? req.body.active : true,
        tags: req.body.tags,
      };

      const newDataSource = await dataSourceService.createDataSource(dataSourceData);
      
      res.status(201).json({
        success: true,
        data: newDataSource,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 更新数据源
   */
  async updateDataSource(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const { id } = req.params;

      const updateData: any = {};
      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.host !== undefined) updateData.host = req.body.host;
      if (req.body.port !== undefined) updateData.port = parseInt(req.body.port, 10);
      if (req.body.username !== undefined) updateData.username = req.body.username;
      if (req.body.password !== undefined) updateData.password = req.body.password;
      if (req.body.database !== undefined) updateData.database = req.body.database;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.active !== undefined) updateData.active = req.body.active;
      if (req.body.tags !== undefined) updateData.tags = req.body.tags;

      const updatedDataSource = await dataSourceService.updateDataSource(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedDataSource,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 删除数据源
   */
  async deleteDataSource(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await dataSourceService.deleteDataSource(id);
      
      res.status(200).json({
        success: true,
        message: '数据源已成功删除',
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 测试数据源连接
   */
  async testConnection(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const connectionData = {
        type: req.body.type,
        host: req.body.host,
        port: parseInt(req.body.port, 10),
        username: req.body.username,
        password: req.body.password,
        database: req.body.database,
      };

      const result = await dataSourceService.testConnection(connectionData);
      
      res.status(200).json({
        success: result,
        message: result ? '连接成功' : '连接失败',
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 测试现有数据源连接
   */
  async testExistingConnection(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new ApiError('数据源ID不能为空', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST');
      }
      
      // 获取数据源信息
      const dataSource = await dataSourceService.getDataSourceById(id);
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', ERROR_CODES.NOT_FOUND, 404, 'NOT_FOUND');
      }
      
      // 测试连接
      const connectionData = {
        type: dataSource.type,
        host: dataSource.host,
        port: dataSource.port,
        username: dataSource.username,
        // 对于已存在的数据源，服务层会解密密码
        database: dataSource.databaseName,
        id: dataSource.id // 传递ID，让服务层可以提取加密密码
      };
      
      logger.info(`测试数据源[${id}]连接`, { host: connectionData.host, database: connectionData.database });
      
      const result = await dataSourceService.testExistingConnection(id);
      
      res.status(200).json({
        success: result,
        message: result ? '连接成功' : '连接失败',
        data: {
          dataSourceId: id,
          name: dataSource.name,
          host: dataSource.host,
          database: dataSource.databaseName,
          type: dataSource.type
        }
      });
    } catch (error: any) {
      logger.error(`测试数据源连接失败: ${error.message}`, { error });
      next(error);
    }
  }

  /**
   * 检查数据源状态
   * 触发数据源连接测试，并更新状态
   */
  async checkDataSourceStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new ApiError('数据源ID不能为空', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST');
      }
      
      // 获取数据源信息
      const dataSource = await dataSourceService.getDataSourceById(id);
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', ERROR_CODES.NOT_FOUND, 404, 'NOT_FOUND');
      }
      
      // 导入数据源监控服务
      const { DataSourceMonitorService } = await import('../../services/datasource-monitor.service');
      const monitorService = new DataSourceMonitorService(dataSourceService);
      
      // 检查数据源状态
      await monitorService.checkDataSourceStatus(id);
      
      // 获取更新后的数据源信息
      const updatedDataSource = await dataSourceService.getDataSourceById(id);
      
      res.status(200).json({
        success: true,
        message: '数据源状态检查完成',
        data: {
          id: updatedDataSource.id,
          name: updatedDataSource.name,
          status: updatedDataSource.status,
          lastChecked: new Date().toISOString()
        }
      });
    } catch (error: any) {
      logger.error(`检查数据源状态失败: ${error.message}`, { error });
      next(error);
    }
  }

  /**
   * 验证数据源创建请求
   */
  validateCreateDataSource() {
    return [
      check('name').not().isEmpty().withMessage('名称不能为空'),
      check('type').not().isEmpty().withMessage('类型不能为空'),
      check('host').not().isEmpty().withMessage('主机不能为空'),
      check('port').isInt({ min: 1, max: 65535 }).withMessage('端口号必须是1-65535之间的整数'),
      check('username').not().isEmpty().withMessage('用户名不能为空'),
      check('password').not().isEmpty().withMessage('密码不能为空'),
      check('database').not().isEmpty().withMessage('数据库名不能为空'),
    ];
  }

  /**
   * 验证数据源更新请求
   */
  validateUpdateDataSource() {
    return [
      check('id').not().isEmpty().withMessage('ID不能为空'),
      check('port').optional().isInt({ min: 1, max: 65535 }).withMessage('端口号必须是1-65535之间的整数'),
    ];
  }

  /**
   * 验证测试连接请求
   */
  validateTestConnection() {
    return [
      check('type').not().isEmpty().withMessage('类型不能为空'),
      check('host').not().isEmpty().withMessage('主机不能为空'),
      check('port').isInt({ min: 1, max: 65535 }).withMessage('端口号必须是1-65535之间的整数'),
      check('username').not().isEmpty().withMessage('用户名不能为空'),
      check('password').not().isEmpty().withMessage('密码不能为空'),
      check('database').not().isEmpty().withMessage('数据库名不能为空'),
    ];
  }
}

export default new DataSourceController();