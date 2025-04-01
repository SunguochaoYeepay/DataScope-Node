/**
 * 查询计划服务类
 * 提供查询执行计划获取和比较功能
 */

import { DatabaseConnector } from '../types/connector';
import { QueryPlan } from '../types/query-plan';
import logger from '../utils/logger';
import { DatabaseType } from '../types/database';

interface PlanComparisonResult {
  summary: {
    costDifference: number;
    rowsDifference: number;
    plan1BottlenecksCount: number;
    plan2BottlenecksCount: number;
    improvement: boolean;
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

// MySQL访问类型效率排序（从低到高）
type AccessType = 'ALL' | 'index' | 'range' | 'ref' | 'eq_ref' | 'const' | 'system';

export class QueryPlanService {
  /**
   * 获取SQL查询执行计划
   * @param connector 数据库连接器
   * @param databaseType 数据库类型
   * @param sql SQL查询语句
   * @param params 查询参数
   * @returns 查询执行计划
   */
  public async getQueryPlan(
    connector: DatabaseConnector,
    databaseType: any, 
    sql: string,
    params: any[] = []
  ): Promise<QueryPlan> {
    logger.debug('获取SQL查询执行计划', { sql, databaseType, paramsCount: params?.length || 0 });
    
    try {
      // 使用连接器的explainQuery方法获取执行计划
      // 接口只定义了一个参数，但实现支持两个参数
      // @ts-ignore - 忽略类型检查以支持可选的第二个参数
      const queryPlan = await connector.explainQuery(sql, params);
      
      // 分析执行计划并添加性能建议
      this.analyzePlan(queryPlan);
      
      return queryPlan;
    } catch (error) {
      logger.error('获取SQL查询执行计划失败', { error, sql, databaseType });
      throw error;
    }
  }
  
  /**
   * 比较两个查询执行计划
   * @param plan1 第一个查询执行计划
   * @param plan2 第二个查询执行计划
   * @returns 比较结果
   */
  public comparePlans(plan1: QueryPlan, plan2: QueryPlan): PlanComparisonResult {
    logger.debug('比较查询执行计划');
    
    const result: PlanComparisonResult = {
      summary: {
        costDifference: (plan2.estimatedCost || 0) - (plan1.estimatedCost || 0),
        rowsDifference: (plan2.estimatedRows || 0) - (plan1.estimatedRows || 0),
        plan1BottlenecksCount: this.countBottlenecks(plan1),
        plan2BottlenecksCount: this.countBottlenecks(plan2),
        improvement: (plan1.estimatedCost || 0) > (plan2.estimatedCost || 0)
      },
      nodeComparison: [],
      accessTypeChanges: [],
      indexUsageChanges: []
    };
    
    // 比较节点
    if (plan1.planNodes && plan2.planNodes) {
      // 为简单起见，假设节点顺序匹配
      // 实际情况可能需要更复杂的匹配算法
      const minLength = Math.min(plan1.planNodes.length, plan2.planNodes.length);
      
      for (let i = 0; i < minLength; i++) {
        const node1 = plan1.planNodes[i];
        const node2 = plan2.planNodes[i];
        
        if (node1.table === node2.table) {
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
              plan1: node1.rows,
              plan2: node2.rows,
              difference: node2.rows - node1.rows
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
   * 分析查询执行计划并添加性能建议
   * @param plan 查询执行计划
   */
  private analyzePlan(plan: QueryPlan): void {
    // 初始化性能建议和警告数组
    plan.optimizationTips = [];
    plan.warnings = [];
    
    // 判断是否有节点需要优化
    if (plan.planNodes) {
      plan.planNodes.forEach(node => {
        // 检查全表扫描
        if (node.type === 'ALL' && node.rows > 1000) {
          plan.warnings.push(`表 ${node.table} 正在进行全表扫描，扫描了 ${node.rows} 行`);
          plan.optimizationTips.push(`考虑为表 ${node.table} 添加索引，覆盖常用的查询条件`);
        }
        
        // 检查文件排序
        if (node.extra && node.extra.includes('Using filesort')) {
          plan.warnings.push(`表 ${node.table} 需要文件排序，这可能会影响性能`);
          
          // 提供针对文件排序的优化建议
          if (node.type !== 'index') {
            plan.optimizationTips.push(`考虑为表 ${node.table} 创建包含排序列的索引，以避免文件排序`);
          }
        }
        
        // 检查临时表
        if (node.extra && node.extra.includes('Using temporary')) {
          plan.warnings.push(`查询需要创建临时表来处理 ${node.table} 的数据`);
          plan.optimizationTips.push(`尝试简化GROUP BY或ORDER BY子句，或考虑添加合适的复合索引`);
        }
        
        // 检查低效索引使用
        if (node.key && node.rows > 5000 && node.filtered !== undefined && node.filtered < 20) {
          plan.warnings.push(`表 ${node.table} 使用索引 ${node.key} 效率不高，只过滤了 ${node.filtered}% 的数据`);
          plan.optimizationTips.push(`检查表 ${node.table} 的索引 ${node.key} 的选择性，可能需要更精确的索引`);
        }
      });
    }
    
    // 估算总体成本
    if (!plan.estimatedCost && plan.planNodes && plan.planNodes.length > 0) {
      // 基于行数和过滤率估算成本
      plan.estimatedCost = plan.planNodes.reduce((total, node) => {
        return total + (node.rows * (1 - (node.filtered || 100) / 100));
      }, 0);
    }
    
    // 添加通用优化建议
    if (plan.planNodes && plan.planNodes.length > 3) {
      plan.optimizationTips.push('考虑简化查询，减少复杂JOIN操作');
    }
    
    // 如果没有警告但查询很复杂，添加一个通用建议
    if (plan.warnings.length === 0 && plan.planNodes && plan.planNodes.length > 5) {
      plan.optimizationTips.push('查询结构复杂，考虑拆分为多个简单查询或使用视图');
    }
  }
  
  /**
   * 判断访问类型是否有改进
   * @param oldType 旧访问类型
   * @param newType 新访问类型
   * @returns 是否改进
   */
  private isAccessTypeImprovement(oldType: string, newType: string): boolean {
    // 定义访问类型效率排序（从低到高）
    const typeOrder: Record<string, number> = {
      'ALL': 0,       // 全表扫描，最差
      'index': 1,     // 全索引扫描
      'range': 2,     // 范围扫描
      'ref': 3,       // 非唯一索引查找
      'eq_ref': 4,    // 唯一索引查找
      'const': 5,     // 常量查找，最好
      'system': 6     // 系统表查找，特殊情况
    };
    
    // 获取类型对应的效率值，默认为-1（未知类型）
    const oldValue = typeOrder[oldType] !== undefined ? typeOrder[oldType] : -1;
    const newValue = typeOrder[newType] !== undefined ? typeOrder[newType] : -1;
    
    // 如果新类型效率值更高，则为改进
    return newValue > oldValue;
  }
  
  /**
   * 计算查询计划中的瓶颈数量
   * @param plan 查询计划
   * @returns 瓶颈数量
   */
  private countBottlenecks(plan: QueryPlan): number {
    let count = 0;
    
    if (plan.planNodes) {
      plan.planNodes.forEach(node => {
        // 全表扫描通常是瓶颈
        if (node.type === 'ALL' && node.rows > 1000) {
          count++;
        }
        
        // 文件排序和临时表也是瓶颈
        if (node.extra && (node.extra.includes('Using filesort') || node.extra.includes('Using temporary'))) {
          count++;
        }
        
        // 扫描大量数据但过滤率低的也算瓶颈
        if (node.rows > 5000 && node.filtered !== undefined && node.filtered < 20) {
          count++;
        }
      });
    }
    
    return count;
  }
} 