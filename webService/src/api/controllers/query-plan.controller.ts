import { Request, Response, NextFunction } from 'express';
import { param, body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/error';
import { DataSourceService } from '../../services/datasource.service';
import { QueryService } from '../../services/query.service';
import logger from '../../utils/logger';
import { QueryPlan } from '../../types/query-plan';

const prisma = new PrismaClient();
const dataSourceService = new DataSourceService();
const queryService = new QueryService();

/**
 * 查询执行计划控制器
 * 提供查询执行计划相关的API接口
 */
export class QueryPlanController {
  /**
   * 获取SQL查询执行计划
   * @param req Express请求对象
   * @param res Express响应对象
   * @param next Express下一个中间件函数
   */
  async getQueryPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 验证请求参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('请求参数验证失败', 400, JSON.stringify(errors.array()));
      }

      const { dataSourceId } = req.params;
      const { sql } = req.body;

      logger.debug('获取SQL查询执行计划', { dataSourceId, sql });

      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      
      // 获取连接器
      const connector = await dataSourceService.getConnector(dataSource);
      
      // 执行EXPLAIN查询
      const queryPlan = await connector.explainQuery(sql);
      
      res.status(200).json({
        success: true,
        data: queryPlan
      });
    } catch (error: any) {
      logger.error('获取查询执行计划失败', { error });
      next(error);
    }
  }

  /**
   * 保存查询执行计划
   * @param req Express请求对象
   * @param res Express响应对象
   * @param next Express下一个中间件函数
   */
  async saveQueryPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 验证请求参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('请求参数验证失败', 400, JSON.stringify(errors.array()));
      }

      const { queryId } = req.params;
      const { plan, sql } = req.body;

      logger.debug('保存查询执行计划', { queryId, plan });

      // 检查查询是否存在
      const query = await prisma.query.findUnique({
        where: { id: queryId }
      });

      if (!query) {
        throw new ApiError('查询不存在', 404);
      }

      // 保存执行计划
      const savedPlan = await prisma.queryPlan.create({
        data: {
          queryId,
          sql: sql || query.sql,
          plan: plan,
          createdBy: 'system',
          updatedBy: 'system'
        }
      });

      res.status(201).json({
        success: true,
        data: savedPlan
      });
    } catch (error: any) {
      logger.error('保存查询执行计划失败', { error });
      next(error);
    }
  }

  /**
   * 获取查询的执行计划历史记录
   * @param req Express请求对象
   * @param res Express响应对象
   * @param next Express下一个中间件函数
   */
  async getQueryPlanHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 验证请求参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('请求参数验证失败', 400, JSON.stringify(errors.array()));
      }

      const { queryId } = req.params;

      logger.debug('获取查询执行计划历史记录', { queryId });

      // 检查查询是否存在
      const query = await prisma.query.findUnique({
        where: { id: queryId }
      });

      if (!query) {
        throw new ApiError('查询不存在', 404);
      }

      // 获取执行计划历史
      const plans = await prisma.queryPlan.findMany({
        where: { queryId },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: plans
      });
    } catch (error: any) {
      logger.error('获取查询执行计划历史记录失败', { error });
      next(error);
    }
  }

  /**
   * 获取单个查询执行计划详情
   * @param req Express请求对象
   * @param res Express响应对象
   * @param next Express下一个中间件函数
   */
  async getQueryPlanById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 验证请求参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('请求参数验证失败', 400, JSON.stringify(errors.array()));
      }

      const { planId } = req.params;

      logger.debug('获取查询执行计划详情', { planId });

      // 获取执行计划
      const plan = await prisma.queryPlan.findUnique({
        where: { id: planId },
        include: { query: true }
      });

      if (!plan) {
        throw new ApiError('执行计划不存在', 404);
      }

      res.status(200).json({
        success: true,
        data: plan
      });
    } catch (error: any) {
      logger.error('获取查询执行计划详情失败', { error });
      next(error);
    }
  }

  /**
   * 删除查询执行计划
   * @param req Express请求对象
   * @param res Express响应对象
   * @param next Express下一个中间件函数
   */
  async deleteQueryPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 验证请求参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('请求参数验证失败', 400, JSON.stringify(errors.array()));
      }

      const { planId } = req.params;

      logger.debug('删除查询执行计划', { planId });

      // 检查执行计划是否存在
      const plan = await prisma.queryPlan.findUnique({
        where: { id: planId }
      });

      if (!plan) {
        throw new ApiError('执行计划不存在', 404);
      }

      // 删除执行计划
      await prisma.queryPlan.delete({
        where: { id: planId }
      });

      res.status(200).json({
        success: true,
        message: '执行计划已删除'
      });
    } catch (error: any) {
      logger.error('删除查询执行计划失败', { error });
      next(error);
    }
  }
}