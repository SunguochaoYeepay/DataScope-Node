import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import queryService from '../../services/query.service';
import { ApiError } from '../../utils/error';
import logger from '../../utils/logger';

export class QueryController {
  /**
   * 执行SQL查询
   */
  async executeQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', 400, { errors: errors.array() });
      }

      const { dataSourceId, sql, params } = req.body;
      const result = await queryService.executeQuery(dataSourceId, sql, params);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 保存查询
   */
  async saveQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', 400, { errors: errors.array() });
      }

      const {
        dataSourceId,
        name,
        description,
        sql,
        tags,
        isPublic
      } = req.body;

      const savedQuery = await queryService.saveQuery({
        dataSourceId,
        name,
        description,
        sql,
        tags,
        isPublic
      });
      
      res.status(201).json({
        success: true,
        data: savedQuery
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 获取所有保存的查询
   */
  async getQueries(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId, tag, isPublic, search } = req.query;
      
      const queries = await queryService.getQueries({
        dataSourceId: dataSourceId as string,
        tag: tag as string,
        isPublic: isPublic === 'true',
        search: search as string
      });
      
      res.status(200).json({
        success: true,
        data: queries
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 获取单个查询
   */
  async getQueryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const query = await queryService.getQueryById(id);
      
      res.status(200).json({
        success: true,
        data: query
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 更新保存的查询
   */
  async updateQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', 400, { errors: errors.array() });
      }

      const { id } = req.params;
      const updateData = req.body;

      const updatedQuery = await queryService.updateQuery(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedQuery
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 删除保存的查询
   */
  async deleteQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await queryService.deleteQuery(id);
      
      res.status(200).json({
        success: true,
        message: '查询已成功删除'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 获取查询历史记录
   */
  async getQueryHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId, limit, offset } = req.query;
      const history = await queryService.getQueryHistory(
        dataSourceId as string,
        limit ? Number(limit) : 50,
        offset ? Number(offset) : 0
      );
      
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 验证执行查询请求
   */
  validateExecuteQuery() {
    return [
      body('dataSourceId').notEmpty().withMessage('数据源ID不能为空'),
      body('sql').notEmpty().withMessage('SQL查询语句不能为空'),
    ];
  }

  /**
   * 验证保存查询请求
   */
  validateSaveQuery() {
    return [
      body('dataSourceId').notEmpty().withMessage('数据源ID不能为空'),
      body('name').notEmpty().withMessage('名称不能为空'),
      body('sql').notEmpty().withMessage('SQL查询语句不能为空'),
    ];
  }

  /**
   * 验证更新查询请求
   */
  validateUpdateQuery() {
    return [
      param('id').notEmpty().withMessage('查询ID不能为空'),
    ];
  }
}

export default new QueryController();