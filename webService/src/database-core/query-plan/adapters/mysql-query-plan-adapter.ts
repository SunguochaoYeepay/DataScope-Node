import { QueryPlan, QueryPlanNode } from '../../../types/query-plan';

/**
 * MySQL查询计划适配器
 * 用于转换MySQL的EXPLAIN结果为统一的QueryPlan格式
 */
export class MySQLQueryPlanAdapter {
  /**
   * 将MySQL的EXPLAIN结果转换为统一的QueryPlan格式
   * @param traditionalRows 传统格式的执行计划行
   * @param jsonData JSON格式的执行计划数据(可选)
   * @param originalQuery 原始查询语句
   * @returns 统一格式的查询执行计划
   */
  static convert(traditionalRows: any[], jsonData: any, originalQuery: string): QueryPlan {
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
    let estimatedCost = 0;
    
    if (jsonData && jsonData.query_block) {
      const queryBlock = jsonData.query_block;
      estimatedRows = queryBlock.select_id ? parseInt(queryBlock.select_id, 10) : 0;
      
      if (queryBlock.cost_info && queryBlock.cost_info.query_cost) {
        estimatedCost = parseFloat(queryBlock.cost_info.query_cost);
      }
    }
    
    // 使用传统行数如果JSON格式没有提供
    if (estimatedRows === 0 && planNodes.length > 0) {
      estimatedRows = planNodes.reduce((total: number, node: QueryPlanNode) => total + node.rows, 0);
    }
    
    // 构建完整的执行计划对象
    return {
      planNodes,
      warnings: [],
      query: originalQuery,
      estimatedRows,
      estimatedCost,
      optimizationTips: this.generateOptimizationTips(planNodes)
    };
  }
  
  /**
   * 根据查询计划生成优化建议
   * @param planNodes 查询计划节点列表
   * @returns 优化建议列表
   */
  private static generateOptimizationTips(planNodes: QueryPlanNode[]): string[] {
    const tips: string[] = [];
    
    // 检查表扫描
    const fullScanNodes = planNodes.filter((node: QueryPlanNode) => node.type === 'ALL');
    if (fullScanNodes.length > 0) {
      tips.push(`发现${fullScanNodes.length}个全表扫描，考虑为表${fullScanNodes.map((n: QueryPlanNode) => n.table).join(', ')}添加索引`);
    }
    
    // 检查索引使用
    const noIndexNodes = planNodes.filter((node: QueryPlanNode) => !node.key && node.rows > 100);
    if (noIndexNodes.length > 0) {
      tips.push(`表${noIndexNodes.map((n: QueryPlanNode) => n.table).join(', ')}没有使用索引，且扫描行数较大`);
    }
    
    // 检查临时表和文件排序
    const fileSort = planNodes.some((node: QueryPlanNode) => node.extra && node.extra.includes('Using filesort'));
    const tempTable = planNodes.some((node: QueryPlanNode) => node.extra && node.extra.includes('Using temporary'));
    
    if (fileSort) {
      tips.push('查询使用了文件排序，考虑添加适当的索引以避免排序');
    }
    
    if (tempTable) {
      tips.push('查询使用了临时表，考虑简化查询或添加适当的索引');
    }
    
    return tips;
  }
}