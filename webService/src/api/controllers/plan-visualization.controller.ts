import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import queryService from '../../services/query.service';
import { ApiError } from '../../utils/errors/types/api-error';
import { ERROR_CODES } from '../../utils/errors/error-codes';
import logger from '../../utils/logger';
import { PrismaClient } from '@prisma/client';
import { QueryPlan, QueryPlanNode } from '../../types/query-plan';

const prisma = new PrismaClient();

// 可视化数据接口定义
interface VisualizationData {
  nodes: Array<{
    id: number;
    label: string;
    type: string;
    table: string;
    rows: number;
    filtered: number;
    key: string;
    extra: string;
    cost: number;
    isBottleneck: boolean;
  }>;
  links: Array<{
    source: number;
    target: number;
    value: number;
  }>;
  summary: {
    totalCost: number;
    totalRows: number;
    bottlenecks: number;
    warnings: string[];
    optimizationTips: string[];
  };
}

// 计划比较结果接口
interface PlanComparisonResult {
  summary: {
    costDifference: number;
    rowsDifference: number;
    plan1BottlenecksCount: number;
    plan2BottlenecksCount: number;
  };
  nodeComparison: Array<{
    table: string;
    rows: {
      plan1: number;
      plan2: number;
      difference: number;
    };
    filtered: {
      plan1: number;
      plan2: number;
      difference: number;
    };
    accessType: {
      plan1: string;
      plan2: string;
      improved: boolean;
    };
  }>;
  accessTypeChanges: Array<{
    table: string;
    from: string;
    to: string;
    improvement: boolean;
  }>;
  indexUsageChanges: Array<{
    table: string;
    from: string;
    to: string;
  }>;
}

/**
 * 查询执行计划可视化控制器
 * 提供查询执行计划可视化相关的API接口
 */
export class PlanVisualizationController {
  /**
   * 获取查询执行计划的可视化数据
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  async getVisualizationData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const { planId } = req.params;
      
      // 获取查询计划
      const planHistory = await queryService.getQueryPlanById(planId);
      
      if (!planHistory) {
        throw ApiError.notFound('查询计划不存在');
      }
      
      // 解析计划数据
      const planData = JSON.parse(planHistory.planData);
      
      // 转换为可视化格式
      const visualizationData = this.transformToVisualizationFormat(planData);
      
      res.status(200).json({
        success: true,
        data: visualizationData
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 比较两个查询计划
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  async comparePlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const { planId1, planId2 } = req.params;
      
      // 获取两个查询计划
      const [plan1, plan2] = await Promise.all([
        queryService.getQueryPlanById(planId1),
        queryService.getQueryPlanById(planId2)
      ]);
      
      if (!plan1 || !plan2) {
        throw ApiError.notFound('一个或多个查询计划不存在');
      }
      
      // 解析计划数据
      const planData1 = JSON.parse(plan1.planData);
      const planData2 = JSON.parse(plan2.planData);
      
      // 比较两个计划
      const comparisonResult = this.comparePlanData(planData1, planData2);
      
      res.status(200).json({
        success: true,
        data: comparisonResult
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 保存查询计划分析注释
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  async saveAnalysisNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const { planId } = req.params;
      const { notes } = req.body;
      
      // 验证查询计划是否存在
      const planHistory = await queryService.getQueryPlanById(planId);
      
      if (!planHistory) {
        throw ApiError.notFound('查询计划不存在');
      }
      
      // 保存注释
      // 注意：这里需要实现保存注释的功能，可能需要扩展数据模型
      // 此处为示例代码，实际实现需要根据数据库结构调整
      /*
      await prisma.queryPlanAnalysisNote.upsert({
        where: { 
          planId: planId 
        },
        update: { 
          notes: notes 
        },
        create: {
          planId: planId,
          notes: notes,
          createdAt: new Date(),
          createdBy: req.user?.id || 'system'
        }
      });
      */
      
      res.status(200).json({
        success: true,
        message: '分析注释已保存'
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 生成优化后的SQL查询
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  async generateOptimizedQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const { planId } = req.params;
      
      // 获取查询计划
      const planHistory = await queryService.getQueryPlanById(planId);
      
      if (!planHistory) {
        throw ApiError.notFound('查询计划不存在');
      }
      
      // 解析计划数据
      const planData = JSON.parse(planHistory.planData);
      
      // 根据优化建议生成优化后的SQL
      // 这部分可能需要更复杂的逻辑，或者接入AI服务来生成优化建议
      const optimizedSql = this.generateOptimizedSql(planHistory.sql, planData);
      
      res.status(200).json({
        success: true,
        data: {
          originalSql: planHistory.sql,
          optimizedSql: optimizedSql,
          optimizationNotes: planData.optimizationTips || []
        }
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 将查询计划转换为可视化格式
   * @param planData 查询计划数据
   * @returns 可视化格式数据
   */
  private transformToVisualizationFormat(planData: QueryPlan): VisualizationData {
    const result: VisualizationData = {
      nodes: [],
      links: [],
      summary: {
        totalCost: planData.estimatedCost || 0,
        totalRows: planData.estimatedRows || 0,
        bottlenecks: 0,
        warnings: planData.warnings || [],
        optimizationTips: planData.optimizationTips || []
      }
    };
    
    // 处理节点
    if (Array.isArray(planData.planNodes) && planData.planNodes.length > 0) {
      // 首先创建所有节点
      result.nodes = planData.planNodes.map((node: QueryPlanNode, index: number) => {
        const isBottleneck = this.isNodeBottleneck(node);
        if (isBottleneck) {
          result.summary.bottlenecks++;
        }
        
        return {
          id: node.id || index + 1,
          label: `${node.type || 'unknown'} - ${node.table || 'unknown'}`,
          type: node.type || 'unknown',
          table: node.table || 'unknown',
          rows: node.rows || 0,
          filtered: node.filtered || 100,
          key: node.key || '无索引',
          extra: node.extra || '',
          cost: this.calculateNodeCost(node, planData.estimatedCost || 0),
          isBottleneck: isBottleneck
        };
      });
      
      // 然后创建节点之间的连接
      for (let i = 0; i < planData.planNodes.length - 1; i++) {
        const sourceNode = planData.planNodes[i];
        const targetNode = planData.planNodes[i + 1];
        
        if (sourceNode && targetNode) {
          result.links.push({
            source: sourceNode.id || i + 1,
            target: targetNode.id || i + 2,
            value: sourceNode.rows || 0
          });
        }
      }
    }
    
    return result;
  }
  
  /**
   * 计算节点成本
   * @param node 查询计划节点
   * @param totalCost 总成本
   * @returns 节点成本
   */
  private calculateNodeCost(node: QueryPlanNode, totalCost: number): number {
    if (!node || !node.type) return 0;
    const rows = node.rows || 0;
    
    // 如果没有总成本信息，则根据节点的行数估算
    if (!totalCost) {
      return rows;
    }
    
    // 否则尝试根据节点信息分配成本
    // 这里使用简化算法，实际情况可能需要更复杂的计算
    if (node.type === 'ALL') {
      return rows * 2; // 全表扫描成本更高
    } else if (node.type === 'range' || node.type === 'ref') {
      return rows;
    } else if (node.type === 'eq_ref' || node.type === 'const') {
      return 1; // 这些是高效的访问类型
    }
    
    return rows;
  }
  
  /**
   * 判断节点是否为瓶颈
   * @param node 查询计划节点
   * @returns 是否为瓶颈
   */
  private isNodeBottleneck(node: QueryPlanNode): boolean {
    if (!node || !node.type) return false;
    
    // 全表扫描通常是瓶颈
    if (node.type === 'ALL' && (node.rows || 0) > 1000) {
      return true;
    }
    
    // 使用临时表或文件排序的节点
    if (node.extra && (
      node.extra.includes('Using temporary') ||
      node.extra.includes('Using filesort'))
    ) {
      return true;
    }
    
    // 扫描大量行但过滤率低的节点
    if ((node.rows || 0) > 10000 && (node.filtered !== undefined && node.filtered < 20)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * 比较两个查询计划
   * @param plan1 第一个查询计划
   * @param plan2 第二个查询计划
   * @returns 比较结果
   */
  private comparePlanData(plan1: QueryPlan, plan2: QueryPlan): PlanComparisonResult {
    const result: PlanComparisonResult = {
      summary: {
        costDifference: (plan2.estimatedCost || 0) - (plan1.estimatedCost || 0),
        rowsDifference: (plan2.estimatedRows || 0) - (plan1.estimatedRows || 0),
        plan1BottlenecksCount: this.countBottlenecks(plan1),
        plan2BottlenecksCount: this.countBottlenecks(plan2)
      },
      nodeComparison: [],
      accessTypeChanges: [],
      indexUsageChanges: []
    };
    
    // 比较节点
    if (Array.isArray(plan1.planNodes) && Array.isArray(plan2.planNodes) && 
        plan1.planNodes.length > 0 && plan2.planNodes.length > 0) {
      // 为简单起见，假设节点顺序匹配
      // 实际情况可能需要更复杂的匹配算法
      const minLength = Math.min(plan1.planNodes.length, plan2.planNodes.length);
      
      for (let i = 0; i < minLength; i++) {
        const node1 = plan1.planNodes[i];
        const node2 = plan2.planNodes[i];
        
        // 确保节点和表名存在
        if (node1 && node2 && node1.table && node2.table && node1.table === node2.table) {
          // 比较相同表的处理方式
          if (node1.type !== node2.type) {
            result.accessTypeChanges.push({
              table: node1.table,
              from: node1.type,
              to: node2.type,
              improvement: this.isAccessTypeImprovement(node1.type, node2.type)
            });
          }
          
          // 比较索引使用变化
          if (node1.key !== node2.key) {
            result.indexUsageChanges.push({
              table: node1.table,
              from: node1.key || '无索引',
              to: node2.key || '无索引'
            });
          }
          
          // 节点详细比较
          result.nodeComparison.push({
            table: node1.table,
            rows: {
              plan1: node1.rows || 0,
              plan2: node2.rows || 0,
              difference: (node2.rows || 0) - (node1.rows || 0)
            },
            filtered: {
              plan1: node1.filtered || 100,
              plan2: node2.filtered || 100,
              difference: (node2.filtered || 100) - (node1.filtered || 100)
            },
            accessType: {
              plan1: node1.type,
              plan2: node2.type,
              improved: this.isAccessTypeImprovement(node1.type, node2.type)
            }
          });
        }
      }
    }
    
    return result;
  }
  
  /**
   * 计算查询计划中的瓶颈数量
   * @param plan 查询计划
   * @returns 瓶颈数量
   */
  private countBottlenecks(plan: QueryPlan): number {
    let count = 0;
    
    if (Array.isArray(plan.planNodes)) {
      for (const node of plan.planNodes) {
        if (node && this.isNodeBottleneck(node)) {
          count++;
        }
      }
    }
    
    return count;
  }
  
  /**
   * 判断访问类型变化是否是改进
   * @param fromType 原访问类型
   * @param toType 新访问类型
   * @returns 是否改进
   */
  private isAccessTypeImprovement(fromType: string, toType: string): boolean {
    if (!fromType || !toType) return false;
    
    // 定义访问类型的效率排序（从高到低）
    const efficiency = ['system', 'const', 'eq_ref', 'ref', 'fulltext', 'ref_or_null', 
                         'index_merge', 'unique_subquery', 'index_subquery', 
                         'range', 'index', 'ALL'];
    
    const fromIndex = efficiency.indexOf(fromType);
    const toIndex = efficiency.indexOf(toType);
    
    // 如果类型不在列表中，无法比较
    if (fromIndex === -1 || toIndex === -1) return false;
    
    // 索引越小，访问类型越高效
    return toIndex < fromIndex;
  }
  
  /**
   * 根据优化建议生成优化后的SQL
   * @param originalSql 原始SQL
   * @param planData 查询计划数据
   * @returns 优化后的SQL
   */
  private generateOptimizedSql(originalSql: string, planData: any): string {
    if (!originalSql || !planData) return originalSql || '';
    
    // 这里仅作为示例，实际优化需要更复杂的实现
    // 可能需要SQL解析器和根据不同问题的特定优化逻辑
    
    let optimizedSql = originalSql;
    
    // 检查是否有全表扫描，尝试添加WHERE条件提示
    const fullTableScans = Array.isArray(planData.planNodes) ? 
                           planData.planNodes.filter((node: any) => node && node.type === 'ALL') : 
                           [];
    
    if (fullTableScans.length > 0) {
      // 这里只是示例，不会真正修改SQL逻辑
      const tables = fullTableScans.map((node: any) => node.table || 'unknown').join(', ');
      optimizedSql = `/* 建议为表 ${tables} 添加索引 */\n${optimizedSql}`;
    }
    
    // 检查是否使用了文件排序
    const hasFilesort = Array.isArray(planData.planNodes) ? 
                        planData.planNodes.some((node: any) => 
                          node && node.extra && node.extra.includes('Using filesort')
                        ) : 
                        false;
    
    if (hasFilesort) {
      optimizedSql = `/* 考虑添加ORDER BY列的索引 */\n${optimizedSql}`;
    }
    
    // 检查是否使用了临时表
    const hasTempTable = Array.isArray(planData.planNodes) ? 
                         planData.planNodes.some((node: any) => 
                           node && node.extra && node.extra.includes('Using temporary')
                         ) : 
                         false;
    
    if (hasTempTable) {
      optimizedSql = `/* 考虑简化查询或添加索引 */\n${optimizedSql}`;
    }
    
    return optimizedSql;
  }
}

// 导出控制器实例
export default new PlanVisualizationController();