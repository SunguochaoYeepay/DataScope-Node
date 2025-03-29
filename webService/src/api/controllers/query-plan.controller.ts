import { Request, Response, NextFunction } from 'express';
import { param, body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/error';
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
        throw new ApiError('缺少必要参数', 400);
      }
      
      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 获取数据库连接
      const connector = await dataSourceService.getConnector(dataSourceId);
      
      // 解析和获取查询计划
      if (!connector.getQueryPlan) {
        throw new ApiError('数据库连接器不支持查询计划功能', 400);
      }
      const planResult = await connector.getQueryPlan(sql);
      
      // 获取转换器并转换为统一格式
      const converter = getQueryPlanConverter(dataSource.type);
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
      const analyzer = getQueryPlanAnalyzer(dataSource.type);
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
        throw new ApiError('缺少查询计划ID', 400);
      }
      
      // 从数据库获取计划
      const queryPlan = await prisma.queryPlan.findUnique({
        where: { id: planId },
        include: {
          query: true
        }
      });
      
      if (!queryPlan) {
        throw new ApiError('查询计划不存在', 404);
      }
      
      // 获取相关的数据源
      const dataSource = await dataSourceService.getDataSourceById(queryPlan.dataSourceId);
      
      // 解析计划数据
      const planData = JSON.parse(queryPlan.planData) as QueryPlan;
      
      // 获取优化器
      const optimizer = getQueryOptimizer(dataSource.type);
      
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
   * 比较两个查询计划
   * @param req 请求对象
   * @param res 响应对象
   */
  public async comparePlans(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { planAId, planBId } = req.body;
      
      if (!planAId || !planBId) {
        throw new ApiError('缺少必要参数', 400);
      }
      
      // 获取两个计划
      const [planA, planB] = await Promise.all([
        prisma.queryPlan.findUnique({ where: { id: planAId } }),
        prisma.queryPlan.findUnique({ where: { id: planBId } })
      ]);
      
      if (!planA || !planB) {
        throw new ApiError('一个或多个查询计划不存在', 404);
      }
      
      // 解析计划数据
      const planAData = JSON.parse(planA.planData) as QueryPlan;
      const planBData = JSON.parse(planB.planData) as QueryPlan;
      
      // 计算性能改进
      const improvement = this.calculateImprovement(planAData, planBData);
      
      // 生成比较数据
      const comparisonData = {
        costDifference: (planBData.estimatedCost || 0) - (planAData.estimatedCost || 0),
        costImprovement: improvement,
        planAWarnings: planAData.warnings.length || 0,
        planBWarnings: planBData.warnings.length || 0,
        planANodes: planAData.planNodes.length || 0,
        planBNodes: planBData.planNodes.length || 0,
        comparisonPoints: this.generateComparisonPoints(planAData, planBData)
      };
      
      // 保存比较结果到数据库
      const comparison = await prisma.queryPlanComparison.create({
        data: {
          planAId,
          planBId,
          comparisonData: JSON.stringify(comparisonData),
          improvement,
          createdBy: req.user?.id
        }
      });
      
      // 返回比较结果
      res.status(200).json({
        success: true,
        data: {
          comparison: comparisonData,
          id: comparison.id
        }
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
   * 计算性能改进百分比
   * @param planA 原始计划
   * @param planB 优化后计划
   * @returns 改进百分比
   */
  private calculateImprovement(planA: QueryPlan, planB: QueryPlan): number {
    // 如果没有成本估算，使用行数估算
    const costA = planA.estimatedCost || planA.estimatedRows || 0;
    const costB = planB.estimatedCost || planB.estimatedRows || 0;
    
    if (costA === 0) return 0;
    
    // 计算改进百分比
    const improvement = ((costA - costB) / costA) * 100;
    
    // 返回改进百分比（最小0%，不计算负改进）
    return Math.max(0, Math.round(improvement));
  }
  
  /**
   * 生成比较要点
   * @param planA 原始计划
   * @param planB 优化后计划
   * @returns 比较要点列表
   */
  private generateComparisonPoints(planA: QueryPlan, planB: QueryPlan): Array<{key: string, description: string}> {
    const points: Array<{key: string, description: string}> = [];
    
    // 比较扫描行数
    if ((planA.estimatedRows || 0) > (planB.estimatedRows || 0)) {
      points.push({
        key: 'reduced_rows',
        description: `优化后扫描行数减少了 ${((planA.estimatedRows || 0) - (planB.estimatedRows || 0)).toLocaleString()} 行`
      });
    }
    
    // 比较成本
    if ((planA.estimatedCost || 0) > (planB.estimatedCost || 0)) {
      points.push({
        key: 'reduced_cost',
        description: `优化后估算成本降低了 ${Math.round(((planA.estimatedCost || 0) - (planB.estimatedCost || 0)) / (planA.estimatedCost || 1) * 100)}%`
      });
    }
    
    // 比较临时表使用
    const tempTablesA = planA.planNodes?.filter(n => n.extra?.includes('Using temporary')).length || 0;
    const tempTablesB = planB.planNodes?.filter(n => n.extra?.includes('Using temporary')).length || 0;
    
    if (tempTablesA > tempTablesB) {
      points.push({
        key: 'reduced_temp_tables',
        description: `优化后减少了 ${tempTablesA - tempTablesB} 个临时表的使用`
      });
    }
    
    // 比较文件排序
    const filesortsA = planA.planNodes?.filter(n => n.extra?.includes('Using filesort')).length || 0;
    const filesortsB = planB.planNodes?.filter(n => n.extra?.includes('Using filesort')).length || 0;
    
    if (filesortsA > filesortsB) {
      points.push({
        key: 'reduced_filesorts',
        description: `优化后减少了 ${filesortsA - filesortsB} 个文件排序操作`
      });
    }
    
    // 全表扫描比较
    const fullScansA = planA.planNodes?.filter(n => n.type === 'ALL').length || 0;
    const fullScansB = planB.planNodes?.filter(n => n.type === 'ALL').length || 0;
    
    if (fullScansA > fullScansB) {
      points.push({
        key: 'reduced_full_scans',
        description: `优化后减少了 ${fullScansA - fullScansB} 个全表扫描`
      });
    }
    
    return points;
  }
  
  /**
   * 保存查询计划到数据库
   * @param plan 查询计划
   * @param dataSourceId 数据源ID
   * @param userId 用户ID
   * @returns 保存的查询计划记录
   */
  private async saveQueryPlan(plan: QueryPlan, dataSourceId: string, userId?: string): Promise<any> {
    try {
      // 查找或创建查询记录
      let queryId: string;
      
      // 检查是否有关联的查询
      const existingQuery = await prisma.query.findFirst({
        where: {
          sqlContent: plan.query,
          dataSourceId
        }
      });
      
      if (existingQuery) {
        queryId = existingQuery.id;
      } else {
        // 创建新查询
        const newQuery = await prisma.query.create({
          data: {
            name: `Query ${new Date().toISOString()}`,
            sqlContent: plan.query,
            dataSourceId,
            createdBy: userId
          }
        });
        queryId = newQuery.id;
      }
      
      // 创建查询计划记录
      const queryPlan = await prisma.queryPlan.create({
        data: {
          queryId,
          dataSourceId,
          name: `Plan ${new Date().toISOString()}`,
          sql: plan.query,
          planData: JSON.stringify(plan),
          estimatedCost: plan.estimatedCost,
          optimizationTips: JSON.stringify(plan.optimizationTips || []),
          isAnalyzed: true,
          createdBy: userId
        }
      });
      
      return queryPlan;
    } catch (error) {
      logger.error('保存查询计划失败', { error });
      throw error;
    }
  }
  
  /**
   * 获取查询计划历史
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getQueryPlanHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { queryId } = req.params;
      
      if (!queryId) {
        throw new ApiError('缺少查询ID', 400);
      }
      
      // 获取查询的所有执行计划
      const plans = await prisma.queryPlan.findMany({
        where: { queryId },
        orderBy: { createdAt: 'desc' }
      });
      
      res.status(200).json({
        success: true,
        data: plans
      });
    } catch (error) {
      logger.error('获取查询计划历史失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取查询计划历史时发生错误',
          error: (error as Error).message
        });
      }
    }
  }

  /**
   * 保存查询执行计划
   * @param req 请求对象
   * @param res 响应对象
   */
  public async savePlan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { dataSourceId, name, sql, planData } = req.body;
      const userId = req.user?.id || 'system';
      
      // 解析计划数据
      const plan = typeof planData === 'string' ? JSON.parse(planData) : planData;
      
      // 保存到数据库
      const savedPlan = await prisma.queryPlan.create({
        data: {
          dataSourceId,
          name,
          sql,
          planData: typeof planData === 'string' ? planData : JSON.stringify(planData),
          estimatedCost: plan.estimatedCost,
          optimizationTips: plan.optimizationTips ? JSON.stringify(plan.optimizationTips) : null,
          isAnalyzed: true,
          createdBy: userId
        }
      });
      
      res.status(201).json({
        success: true,
        data: savedPlan
      });
    } catch (error) {
      logger.error('保存查询计划失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '保存查询计划时发生错误',
          error: (error as Error).message
        });
      }
    }

  /**
   * 获取所有保存的查询执行计划
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getAllSavedPlans(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { dataSourceId } = req.query;
      const userId = req.user?.id;
      
      // 构建查询条件
      const where: any = {
        createdBy: userId
      };
      
      if (dataSourceId) {
        where.dataSourceId = dataSourceId as string;
      }
      
      // 获取所有保存的计划
      const plans = await prisma.queryPlan.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.status(200).json({
        success: true,
        data: plans
      });
    } catch (error) {
      logger.error('获取查询计划列表失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取查询计划列表时发生错误',
          error: (error as Error).message
        });
      }
    }
  }

  /**
   * 获取特定的查询执行计划
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getSavedPlan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // 获取计划
      const plan = await prisma.queryPlan.findUnique({
        where: { id }
      });
      
      if (!plan) {
        throw new ApiError('查询计划不存在', 404);
      }
      
      res.status(200).json({
        success: true,
        data: plan
      });
    } catch (error) {
      logger.error('获取查询计划详情失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取查询计划详情时发生错误',
          error: (error as Error).message
        });
      }
    }
  }

  /**
   * 删除查询执行计划
   * @param req 请求对象
   * @param res 响应对象
   */
  public async deletePlan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      // 获取计划
      const plan = await prisma.queryPlan.findUnique({
        where: { id }
      });
      
      if (!plan) {
        throw new ApiError('查询计划不存在', 404);
      }
      
      // 检查权限
      if (plan.createdBy !== userId && req.user?.role !== 'admin') {
        throw new ApiError('没有权限删除此查询计划', 403);
      }
      
      // 删除计划
      await prisma.queryPlan.delete({
        where: { id }
      });
      
      res.status(200).json({
        success: true,
        message: '查询计划已成功删除'
      });
    } catch (error) {
      logger.error('删除查询计划失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '删除查询计划时发生错误',
          error: (error as Error).message
        });
      }
    }

  /**
   * 获取优化后的SQL查询
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getOptimizedQuery(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new ApiError('缺少查询计划ID', 400);
      }
      
      // 获取查询计划
      const queryPlan = await prisma.queryPlan.findUnique({
        where: { id }
      });
      
      if (!queryPlan) {
        throw new ApiError('查询计划不存在', 404);
      }
      
      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(queryPlan.dataSourceId);
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 解析计划数据
      let planData: QueryPlan;
      try {
        planData = JSON.parse(queryPlan.planData);
      } catch (e) {
        throw new ApiError('无法解析查询计划数据', 500);
      }
      
      // 获取优化器
      const optimizer = getQueryOptimizer(dataSource.type);
      
      // 分析SQL并生成优化建议
      const suggestions = optimizer.analyzeSql(planData, queryPlan.sql);
      
      // 生成优化后的SQL
      const optimizedSql = optimizer.generateOptimizedSql(queryPlan.sql, suggestions);
      
      // 返回结果
      res.status(200).json({
        success: true,
        data: {
          originalSql: queryPlan.sql,
          optimizedSql: optimizedSql,
          suggestions: suggestions
        }
      });
    } catch (error: any) {
      logger.error('获取优化后SQL查询失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取优化后SQL查询失败',
          error: error.message || '未知错误'
        });
      }
    }
  }
}