import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import dataSourceService from '../../services/datasource.service';
import { ApiError } from '../../utils/errors/types/api-error';
import { ERROR_CODES } from '../../utils/errors/error-codes';
import logger from '../../utils/logger';

export class DataSourceController {
  /**
   * 获取所有数据源
   */
  async getAllDataSources(req: Request, res: Response, next: NextFunction) {
    try {
      const dataSources = await dataSourceService.getAllDataSources();
      res.status(200).json({
        success: true,
        data: dataSources,
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
   * 验证数据源创建请求
   */
  validateCreateDataSource() {
    return [
      body('name').notEmpty().withMessage('名称不能为空'),
      body('type').notEmpty().withMessage('类型不能为空'),
      body('host').notEmpty().withMessage('主机不能为空'),
      body('port').isInt({ min: 1, max: 65535 }).withMessage('端口号必须是1-65535之间的整数'),
      body('username').notEmpty().withMessage('用户名不能为空'),
      body('password').notEmpty().withMessage('密码不能为空'),
      body('database').notEmpty().withMessage('数据库名不能为空'),
    ];
  }

  /**
   * 验证数据源更新请求
   */
  validateUpdateDataSource() {
    return [
      param('id').notEmpty().withMessage('ID不能为空'),
      body('port').optional().isInt({ min: 1, max: 65535 }).withMessage('端口号必须是1-65535之间的整数'),
    ];
  }

  /**
   * 验证测试连接请求
   */
  validateTestConnection() {
    return [
      body('type').notEmpty().withMessage('类型不能为空'),
      body('host').notEmpty().withMessage('主机不能为空'),
      body('port').isInt({ min: 1, max: 65535 }).withMessage('端口号必须是1-65535之间的整数'),
      body('username').notEmpty().withMessage('用户名不能为空'),
      body('password').notEmpty().withMessage('密码不能为空'),
      body('database').notEmpty().withMessage('数据库名不能为空'),
    ];
  }
}

export default new DataSourceController();