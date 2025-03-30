import { Request, Response, NextFunction } from 'express';
import { param, body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/errors/types/api-error';
import { ERROR_CODES } from '../../utils/errors/error-codes';
import { DataSourceService } from '../../services/datasource.service';
import { QueryService } from '../../services/query.service';
import logger from '../../utils/logger';
import { QueryPlan, QueryPlanNode } from '../../types/query-plan';
import { QueryPlanService } from '../../services/query-plan.service';
import { DatabaseType } from '../../types/database';
import { 
  getQueryPlanConverter, 
  getQueryPlanAnalyzer,
  getQueryOptimizer
} from '../../database-core';
import config from '../../config';


const prisma = new PrismaClient();
const dataSourceService = new DataSourceService();
const queryService = new QueryService();
const queryPlanService = new QueryPlanService();

// 请求体接口定义
interface GetPlanRequest {
  dataSourceId: string;
  sql: string;
}

// 保存计划请求接口
interface SavePlanRequest {
  dataSourceId: string;
  name: string;
  sql: string;
  planData: QueryPlan;
}

// 比较计划请求接口
interface ComparePlansRequest {
  planAId: string;
  planBId: string;
}

// 扩展Request接口以支持用户信息
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * 查询计划控制器
 * 处理查询计划的获取、分析和优化
 */
export class QueryPlanController {
  /**
   * 获取查询的执行计划
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getQueryPlan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { dataSourceId, sql } = req.body as GetPlanRequest;
      
      if (!dataSourceId || !sql) {
        throw ApiError.badRequest('缺少必要参数');
      }
      
      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw ApiError.notFound('数据源不存在');
      }
      
      // 实际执行逻辑
      // 获取数据库连接
      const connector = await dataSourceService.getConnector(dataSourceId);
      
      // 获取查询计划
      let planResult: QueryPlan;
      
      if (connector.getQueryPlan) {
        // 使用连接器的getQueryPlan方法
        planResult = await connector.getQueryPlan(sql);
      } else if (connector.explainQuery) {
        // 回退到explainQuery方法
        planResult = await connector.explainQuery(sql);
      } else {
        throw ApiError.badRequest('数据库连接器不支持查询计划功能');
      }
      
      // 获取转换器并转换为统一格式
      const converter = getQueryPlanConverter(dataSource.type as DatabaseType);
      let queryPlan: QueryPlan;
      
      if (dataSource.type.toLowerCase() === 'mysql') {
        if (connector.isJsonExplainSupported) {
          queryPlan = converter.convertJsonExplain(JSON.stringify(planResult), sql);
        } else {
          queryPlan = planResult;
        }
      } else {
        queryPlan = planResult;
      }
      
      // 分析查询计划
      const analyzer = getQueryPlanAnalyzer(dataSource.type as DatabaseType);
      const analyzedPlan = analyzer.analyze(queryPlan);
      
      // 保存到数据库
      const savedPlan = await this.saveQueryPlan(analyzedPlan, dataSourceId, req.user?.id);
      
      // 返回分析结果
      res.status(200).json({
        success: true,
        data: {
          plan: analyzedPlan,
          id: savedPlan.id
        }
      });
    } catch (error) {
      logger.error('获取查询计划失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取查询计划时发生错误',
          error: (error as Error).message
        });
      }
    }
  }
  
  /**
   * 获取查询的执行计划 (路由别名)
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getPlan(req: AuthenticatedRequest, res: Response): Promise<void> {
    return this.getQueryPlan(req, res);
  }
  
  /**
   * 获取查询的优化建议
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getOptimizationTips(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { planId } = req.params;
      
      if (!planId) {
        throw ApiError.badRequest('缺少查询计划ID');
      }
      
      // 从数据库获取计划
      const queryPlan = await prisma.queryPlan.findUnique({
        where: { id: planId },
        include: {
          query: true
        }
      });
      
      if (!queryPlan) {
        throw ApiError.notFound('查询计划不存在');
      }
      
      // 获取相关的数据源
      const dataSource = await dataSourceService.getDataSourceById(queryPlan.dataSourceId);
      
      // 解析计划数据
      const planData = JSON.parse(queryPlan.planData) as QueryPlan;
      
      // 获取优化器
      const optimizer = getQueryOptimizer(dataSource.type as DatabaseType);
      
      // 获取优化建议
      const suggestions = optimizer.analyzeSql(planData, queryPlan.sql);
      
      // 生成优化后的SQL
      const optimizedSql = optimizer.generateOptimizedSql(queryPlan.sql, suggestions);
      
      // 更新优化提示到数据库
      await prisma.queryPlan.update({
        where: { id: planId },
        data: {
          optimizationTips: JSON.stringify(suggestions)
        }
      });
      
      // 返回优化建议
      res.status(200).json({
        success: true,
        data: {
          suggestions,
          optimizedSql
        }
      });
    } catch (error) {
      logger.error('获取优化建议失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取优化建议时发生错误',
          error: (error as Error).message
        });
      }
    }
  }

  /**
   * 保存查询计划到数据库
   * @param plan 查询计划
   * @param dataSourceId 数据源ID
   * @param userId 用户ID
   * @returns 保存的计划对象
   */
  private async saveQueryPlan(plan: QueryPlan, dataSourceId: string, userId?: string): Promise<any> {
    try {
      const planJson = JSON.stringify(plan);
      
      // 创建查询计划记录
      return await prisma.queryPlan.create({
        data: {
          dataSourceId,
          sql: plan.query || '',
          planData: planJson,
          createdBy: userId || 'system',
        }
      });
    } catch (error) {
      logger.error('保存查询计划失败', { error });
      // 仅记录错误，不中断流程
      return { id: `error-${Date.now()}` };
    }
  }
  
  /**
   * 比较两个查询计划
   * @param req 请求对象
   * @param res 响应对象
   */
  public async comparePlans(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { planAId, planBId } = req.body;
      
      if (!planAId || !planBId) {
        throw ApiError.badRequest('缺少必要参数');
      }
      
      // 获取两个计划的数据
      const [planA, planB] = await Promise.all([
        prisma.queryPlan.findUnique({
          where: { id: planAId }
        }),
        prisma.queryPlan.findUnique({
          where: { id: planBId }
        })
      ]);
      
      if (!planA || !planB) {
        throw ApiError.notFound('一个或多个查询计划不存在');
      }
      
      // 解析计划数据
      const planAData = JSON.parse(planA.planData) as QueryPlan;
      const planBData = JSON.parse(planB.planData) as QueryPlan;
      
      // 获取数据源类型
      const dataSource = await dataSourceService.getDataSourceById(planA.dataSourceId);
      if (!dataSource) {
        throw ApiError.notFound('数据源不存在');
      }
      
      // 计算性能改进
      const costA = planAData.estimatedCost || planAData.estimatedRows || 0;
      const costB = planBData.estimatedCost || planBData.estimatedRows || 0;
      const improvement = costA > 0 ? Math.max(0, Math.round(((costA - costB) / costA) * 100)) : 0;
      
      // 生成比较数据
      const comparisonData = {
        costDifference: (planBData.estimatedCost || 0) - (planAData.estimatedCost || 0),
        costImprovement: improvement,
        planAWarnings: planAData.warnings?.length || 0,
        planBWarnings: planBData.warnings?.length || 0,
        planANodes: planAData.planNodes?.length || 0,
        planBNodes: planBData.planNodes?.length || 0
      };
      
      // 返回比较结果
      res.status(200).json({
        success: true,
        data: comparisonData
      });
    } catch (error) {
      logger.error('比较查询计划失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '比较查询计划时发生错误',
          error: (error as Error).message
        });
      }
    }
  }
  
  /**
   * 获取查询计划历史记录
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getQueryPlanHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const dataSourceId = req.query.dataSourceId as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      // 获取查询计划历史
      const result = await queryService.getQueryPlanHistory(
        dataSourceId,
        limit,
        offset
      );
      
      // 返回历史记录
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('获取查询计划历史记录失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取查询计划历史记录时发生错误',
          error: (error as Error).message
        });
      }
    }
  }
  
  /**
   * 获取特定的查询计划
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getQueryPlanById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { planId } = req.params;
      
      if (!planId) {
        throw ApiError.badRequest('缺少查询计划ID');
      }
      
      // 获取查询计划
      const queryPlan = await queryService.getQueryPlanById(planId);
      
      if (!queryPlan) {
        throw ApiError.notFound('查询计划不存在');
      }
      
      // 解析计划数据
      const planData = JSON.parse(queryPlan.planData);
      
      // 返回查询计划
      res.status(200).json({
        success: true,
        data: {
          id: queryPlan.id,
          sql: queryPlan.sql,
          dataSourceId: queryPlan.dataSourceId,
          createdAt: queryPlan.createdAt,
          plan: planData
        }
      });
    } catch (error) {
      logger.error('获取查询计划失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取查询计划时发生错误',
          error: (error as Error).message
        });
      }
    }
  }
}