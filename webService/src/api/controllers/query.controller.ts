import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import queryService from '../../services/query.service';
import { ApiError } from '../../utils/errors/types/api-error';
import { ERROR_CODES } from '../../utils/errors/error-codes';
import logger from '../../utils/logger';
import dataSourceService from '../../services/datasource.service';

export class QueryController {
  /**
   * 获取查询执行计划
   */
  async explainQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const { dataSourceId, sql, params, includeAnalysis = true } = req.body;
      const plan = await queryService.explainQuery(dataSourceId, sql, params);
      
      // 根据客户端请求决定是否返回完整分析结果
      if (!includeAnalysis && plan.performanceAnalysis) {
        // 缓存原始分析结果但不返回
        plan._performanceAnalysis = plan.performanceAnalysis;
        delete plan.performanceAnalysis;
      }
      
      res.status(200).json({
        success: true,
        data: plan
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 获取查询计划的优化建议
   */
  async getQueryOptimizationTips(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // 从历史记录中获取查询计划
      const planHistory = await queryService.getQueryPlanById(id);
      
      if (!planHistory) {
        throw ApiError.notFound('查询计划不存在');
      }
      
      // 获取优化建议
      const plan = JSON.parse(planHistory.planData);
      
      res.status(200).json({
        success: true,
        data: {
          sql: planHistory.sql,
          optimizationTips: plan.optimizationTips || [],
          performanceAnalysis: plan.performanceAnalysis || {}
        }
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 获取查询计划历史记录
   */
  async getQueryPlanHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId, limit, offset } = req.query;
      
      const result = await queryService.getQueryPlanHistory(
        dataSourceId as string,
        limit ? Number(limit) : 20,
        offset ? Number(offset) : 0
      );
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 取消查询执行
   */
  async cancelQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const success = await queryService.cancelQuery(id);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: '查询已成功取消'
        });
      } else {
        res.status(200).json({
          success: false,
          message: '无法取消查询，查询可能已完成或已取消'
        });
      }
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 执行SQL查询
   */
  async executeQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const { dataSourceId, sql, params, page, pageSize, offset, limit, sort, order } = req.body;
      
      // 检查是否为特殊命令
      const isSpecialCommand = this.isSpecialCommand(sql);
      
      // 对于特殊命令，不传递分页参数
      let queryOptions = isSpecialCommand ? {} : {
        page, pageSize, offset, limit, sort, order
      };
      
      const result = await queryService.executeQuery(dataSourceId, sql, params, queryOptions);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 检查SQL是否为特殊命令（如SHOW, DESCRIBE等），这些命令不支持LIMIT子句
   */
  private isSpecialCommand(sql: string): boolean {
    if (!sql) return false;
    const trimmedSql = sql.trim().toLowerCase();
    return (
      trimmedSql.startsWith('show ') || 
      trimmedSql.startsWith('describe ') || 
      trimmedSql.startsWith('desc ') ||
      trimmedSql === 'show databases;' ||
      trimmedSql === 'show tables;' ||
      trimmedSql === 'show databases' ||
      trimmedSql === 'show tables' ||
      trimmedSql.startsWith('show columns ') ||
      trimmedSql.startsWith('show index ') ||
      trimmedSql.startsWith('show create ') ||
      trimmedSql.startsWith('show grants ') ||
      trimmedSql.startsWith('show triggers ') ||
      trimmedSql.startsWith('show procedure ') ||
      trimmedSql.startsWith('show function ') ||
      trimmedSql.startsWith('show variables ') ||
      trimmedSql.startsWith('show status ') ||
      trimmedSql.startsWith('show engine ') ||
      trimmedSql.startsWith('set ') ||
      trimmedSql.startsWith('use ')
    );
  }

  /**
   * 保存查询
   */
  async saveQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
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
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
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
      check('dataSourceId')
        .not().isEmpty().withMessage('数据源ID不能为空')
        .isString().withMessage('数据源ID必须是字符串')
        .custom(async (dataSourceId) => {
          try {
            // 检查数据源是否存在
            const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
            if (!dataSource) {
              throw new Error('数据源不存在');
            }
            return true;
          } catch (error) {
            throw new Error('无效的数据源ID');
          }
        }),
      check('sql')
        .not().isEmpty().withMessage('SQL查询不能为空')
        .isString().withMessage('SQL查询必须是字符串')
    ];
  }

  /**
   * 验证保存查询请求
   */
  validateSaveQuery() {
    return [
      check('dataSourceId').not().isEmpty().withMessage('数据源ID不能为空'),
      check('name').not().isEmpty().withMessage('名称不能为空'),
      check('sql').not().isEmpty().withMessage('SQL查询语句不能为空'),
    ];
  }

  /**
   * 验证更新查询请求
   */
  validateUpdateQuery() {
    return [
      check('id').not().isEmpty().withMessage('查询ID不能为空'),
    ];
  }
}

export default new QueryController();