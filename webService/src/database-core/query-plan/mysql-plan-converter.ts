import { QueryPlan, QueryPlanNode } from '../../types/query-plan';
import logger from '../../utils/logger';

/**
 * MySQL查询计划转换器
 * 负责将MySQL传统格式和JSON格式的执行计划转换为统一的QueryPlan格式
 */
export class MySQLQueryPlanConverter {
  /**
   * 将MySQL执行计划转换为统一格式
   * @param traditionalRows 传统EXPLAIN输出行
   * @param jsonData JSON格式的EXPLAIN输出
   * @param originalQuery 原始SQL查询
   * @returns 统一格式的查询计划
   */
  public static convertToQueryPlan(traditionalRows: any[], jsonData: any, originalQuery: string): QueryPlan {
    const planNodes: QueryPlanNode[] = [];
    
    // 处理传统格式的执行计划行
    for (const row of traditionalRows) {
      const planNode: QueryPlanNode = {
        id: row.id || 1,
        selectType: row.select_type || 'SIMPLE',
        table: row.table || '',
        type: row.type || '',
        possibleKeys: row.possible_keys,
        key: row.key,
        keyLen: row.key_len,
        ref: row.ref,
        rows: parseInt(row.rows || '0', 10),
        filtered: parseFloat(row.filtered || '100'),
        extra: row.Extra
      };
      
      planNodes.push(planNode);
    }
    
    // 从 JSON 格式中提取其他有用信息
    let estimatedRows = 0;
    let estimatedCost;
    let performanceAnalysis = {};
    
    if (jsonData && jsonData.query_block) {
      const queryBlock = jsonData.query_block;
      estimatedRows = queryBlock.select_id ? parseInt(queryBlock.select_id, 10) : 0;
      
      if (queryBlock.cost_info && queryBlock.cost_info.query_cost) {
        estimatedCost = parseFloat(queryBlock.cost_info.query_cost);
      }
      
      // 提取性能分析信息
      performanceAnalysis = this.extractPerformanceData(jsonData);
    }
    
    // 使用传统行数如果JSON格式没有提供
    if (estimatedRows === 0 && planNodes.length > 0) {
      estimatedRows = planNodes.reduce((total, node) => total + node.rows, 0);
    }
    
    // 构建完整的执行计划对象
    return {
      planNodes,
      query: originalQuery,
      estimatedRows,
      estimatedCost,
      warnings: [],
      optimizationTips: [],
      performanceAnalysis: {
        bottlenecks: [],
        indexUsage: {
          missingIndexes: [],
          inefficientIndexes: []
        },
        joinAnalysis: []
      }
    };
  }
  
  /**
   * 从JSON格式执行计划中提取关键性能数据
   * @param jsonData JSON格式的执行计划
   * @returns 提取的性能分析数据
   */
  private static extractPerformanceData(jsonData: any): any {
    try {
      const performanceData: any = {
        costInfo: {},
        usedIndexes: [],
        materializedTables: [],
        joinTypes: []
      };
      
      if (!jsonData || !jsonData.query_block) {
        return performanceData;
      }
      
      const queryBlock = jsonData.query_block;
      
      // 提取成本信息
      if (queryBlock.cost_info) {
        performanceData.costInfo = {
          readCost: queryBlock.cost_info.read_cost,
          evalCost: queryBlock.cost_info.eval_cost,
          prefixCost: queryBlock.cost_info.prefix_cost,
          queryCost: queryBlock.cost_info.query_cost
        };
      }
      
      // 递归遍历查询块，收集性能相关数据
      this.traverseQueryBlock(queryBlock, performanceData);
      
      return performanceData;
    } catch (error) {
      logger.warn('从JSON执行计划提取性能数据失败', { error: (error as Error).message });
      return {};
    }
  }
  
  /**
   * 递归遍历查询块，收集性能相关数据
   * @param node 查询块节点
   * @param performanceData 性能数据收集对象
   */
  private static traverseQueryBlock(node: any, performanceData: any): void {
    // 处理表对象
    if (node.table) {
      // 收集使用的索引
      if (node.table.key && !performanceData.usedIndexes.includes(node.table.key)) {
        performanceData.usedIndexes.push(node.table.key);
      }
      
      // 收集物化表信息
      if (node.table.materialized) {
        performanceData.materializedTables.push({
          selectId: node.table.materialized.select_id,
          cost: node.table.materialized.cost_info?.query_cost
        });
      }
      
      // 收集连接类型
      if (node.table.access_type && !performanceData.joinTypes.includes(node.table.access_type)) {
        performanceData.joinTypes.push(node.table.access_type);
      }
    }
    
    // 递归处理嵌套查询
    if (node.nested_loop) {
      node.nested_loop.forEach((loop: any) => this.traverseQueryBlock(loop, performanceData));
    }
    
    // 处理子查询
    if (node.subqueries) {
      node.subqueries.forEach((subquery: any) => this.traverseQueryBlock(subquery, performanceData));
    }
    
    // 处理UNION查询
    if (node.union_result) {
      if (node.union_result.query_specifications) {
        node.union_result.query_specifications.forEach((spec: any) => 
          this.traverseQueryBlock(spec, performanceData)
        );
      }
    }
  }
  
  /**
   * 分析执行计划并生成优化建议
   * @param plan 执行计划
   * @returns 优化建议数组
   */
  public static generateOptimizationTips(plan: QueryPlan): string[] {
    const tips: string[] = [];
    
    // 检查表扫描
    const fullScanNodes = plan.planNodes.filter(node => node.type === 'ALL');
    if (fullScanNodes.length > 0) {
      tips.push(`发现${fullScanNodes.length}个全表扫描，考虑为表${fullScanNodes.map(n => n.table).join(', ')}添加索引`);
    }
    
    // 检查索引使用
    const noIndexNodes = plan.planNodes.filter(node => !node.key && node.rows > 100);
    if (noIndexNodes.length > 0) {
      tips.push(`表${noIndexNodes.map(n => n.table).join(', ')}没有使用索引，且扫描行数较大`);
    }
    
    // 检查临时表和文件排序
    const fileSort = plan.planNodes.some(node => node.extra && node.extra.includes('Using filesort'));
    const tempTable = plan.planNodes.some(node => node.extra && node.extra.includes('Using temporary'));
    
    if (fileSort) {
      tips.push('查询使用了文件排序，考虑添加适当的索引以避免排序');
    }
    
    if (tempTable) {
      tips.push('查询使用了临时表，考虑简化查询或添加适当的索引');
    }
    
    // 检查JOIN类型
    const badJoinTypes = plan.planNodes.filter(node => ['ALL', 'index'].includes(node.type) && node.rows > 1000);
    if (badJoinTypes.length > 0) {
      tips.push('查询中存在效率较低的JOIN操作，考虑添加索引或优化JOIN条件');
    }
    
    // 检查多表连接顺序
    if (plan.planNodes.length > 2) {
      // 检查连接顺序是否最优（简单启发式算法：小表应该先连接）
      let previousRows = 0;
      let orderIssue = false;
      
      for (const node of plan.planNodes) {
        if (previousRows > 0 && node.rows < previousRows * 0.1) {
          orderIssue = true;
          break;
        }
        previousRows = node.rows;
      }
      
      if (orderIssue) {
        tips.push('多表连接顺序可能不是最优的，考虑调整表的连接顺序，先连接小表');
      }
    }
    
    return tips;
  }
}