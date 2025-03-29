import { QueryPlan, QueryPlanNode } from '../../types/query-plan';
import logger from '../../utils/logger';

/**
 * MySQL查询计划转换器
 * 用于将MySQL的EXPLAIN结果转换为标准的QueryPlan格式
 * 支持传统格式和JSON格式的EXPLAIN结果
 */
export class MySQLQueryPlanConverter {
  /**
   * 转换MySQL传统格式的EXPLAIN结果
   * @param explainResult EXPLAIN命令的结果
   * @param query 原始SQL查询
   * @returns 转换后的查询计划
   */
  public convertTraditionalExplain(explainResult: any[], query: string): QueryPlan {
    logger.debug('转换MySQL传统格式EXPLAIN结果', { rowCount: explainResult.length });
    
    try {
      // 创建计划节点
      const planNodes: QueryPlanNode[] = explainResult.map((row, index) => {
        return {
          id: index + 1,
          selectType: row.select_type || '',
          table: row.table || '',
          partitions: row.partitions || null,
          type: row.type || '',
          possibleKeys: row.possible_keys || null,
          key: row.key || null,
          keyLen: row.key_len || null,
          ref: row.ref || null,
          rows: parseInt(row.rows) || 0,
          filtered: parseFloat(row.filtered) || 100,
          extra: row.Extra || null
        };
      });
      
      // 创建并返回查询计划
      return {
        query,
        planNodes,
        estimatedRows: planNodes.reduce((sum, node) => sum + node.rows, 0),
        warnings: [],
        optimizationTips: []
      };
    } catch (error) {
      logger.error('转换MySQL传统格式EXPLAIN结果时出错', { error });
      throw new Error(`转换EXPLAIN结果失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 转换MySQL JSON格式的EXPLAIN结果
   * 支持MySQL 5.7+的EXPLAIN FORMAT=JSON结果
   * @param jsonExplain JSON格式的EXPLAIN结果
   * @param query 原始SQL查询
   * @returns 转换后的查询计划
   */
  public convertJsonExplain(jsonExplain: string, query: string): QueryPlan {
    logger.debug('转换MySQL JSON格式EXPLAIN结果');
    
    try {
      // 解析JSON结果
      const explainData = typeof jsonExplain === 'string' 
        ? JSON.parse(jsonExplain)
        : jsonExplain;
      
      // 提取执行计划
      const queryBlock = this.extractQueryBlock(explainData);
      if (!queryBlock) {
        throw new Error('无法从JSON EXPLAIN结果中提取查询块');
      }
      
      // 转换节点
      const planNodes: QueryPlanNode[] = this.extractPlanNodesFromJson(queryBlock);
      
      // 计算估算行数
      const estimatedRows = planNodes.reduce((sum, node) => sum + node.rows, 0);
      
      // 创建并返回查询计划
      return {
        query,
        planNodes,
        estimatedRows,
        estimatedCost: this.extractCostFromJsonExplain(queryBlock),
        warnings: [],
        optimizationTips: []
      };
    } catch (error) {
      logger.error('转换MySQL JSON格式EXPLAIN结果时出错', { error });
      throw new Error(`转换JSON EXPLAIN结果失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 从JSON EXPLAIN结果中提取查询块
   * @param explainData JSON格式的EXPLAIN数据
   * @returns 查询块对象
   */
  private extractQueryBlock(explainData: any): any {
    // 处理JSON格式的EXPLAIN结果
    if (explainData.query_block) {
      return explainData.query_block;
    }
    
    // 尝试从包含多个查询的结果中提取
    if (Array.isArray(explainData)) {
      for (const item of explainData) {
        if (item.query_block) {
          return item.query_block;
        }
      }
    }
    
    return null;
  }
  
  /**
   * 从JSON查询块中提取计划节点
   * @param queryBlock 查询块对象
   * @returns 计划节点数组
   */
  private extractPlanNodesFromJson(queryBlock: any): QueryPlanNode[] {
    const nodes: QueryPlanNode[] = [];
    
    // 处理表访问操作
    if (queryBlock.table) {
      this.processTableNode(queryBlock.table, nodes);
    }
    
    // 处理嵌套循环
    if (queryBlock.nested_loop) {
      for (const nestedItem of queryBlock.nested_loop) {
        if (nestedItem.table) {
          this.processTableNode(nestedItem.table, nodes);
        }
      }
    }
    
    // 处理连接操作
    if (queryBlock.join_preparation && queryBlock.join_preparation.expanded_query) {
      // 可以提取扩展查询信息
    }
    
    // 处理排序操作
    if (queryBlock.ordering_operation) {
      // 可以提取排序信息
    }
    
    // 确保节点有唯一ID
    nodes.forEach((node, index) => {
      node.id = index + 1;
    });
    
    return nodes;
  }
  
  /**
   * 处理表节点并添加到节点数组
   * @param tableNode 表节点对象
   * @param nodes 节点数组
   */
  private processTableNode(tableNode: any, nodes: QueryPlanNode[]): void {
    const node: QueryPlanNode = {
      id: nodes.length + 1,
      selectType: tableNode.select_type || tableNode.access_type || '',
      table: tableNode.table_name || '',
      partitions: null,
      type: tableNode.access_type || '',
      possibleKeys: this.formatPossibleKeys(tableNode.possible_keys),
      key: tableNode.key ? tableNode.key : null,
      keyLen: tableNode.key_length ? tableNode.key_length : null,
      ref: this.formatRefColumn(tableNode.ref),
      rows: parseInt(tableNode.rows) || 0,
      filtered: parseFloat(tableNode.filtered) || 100,
      extra: this.formatExtraInfo(tableNode)
    };
    
    nodes.push(node);
    
    // 处理子查询或派生表
    if (tableNode.materialized_from_subquery) {
      const subqueryBlock = tableNode.materialized_from_subquery.query_block;
      if (subqueryBlock) {
        const subNodes = this.extractPlanNodesFromJson(subqueryBlock);
        nodes.push(...subNodes);
      }
    }
  }
  
  /**
   * 格式化可能的键
   * @param possibleKeys 可能的键数组
   * @returns 格式化后的可能键字符串
   */
  private formatPossibleKeys(possibleKeys: any): string | null {
    if (!possibleKeys || !Array.isArray(possibleKeys)) return null;
    if (possibleKeys.length === 0) return null;
    
    return possibleKeys.map(key => key.key_name || key).join(', ');
  }
  
  /**
   * 格式化引用列
   * @param ref 引用列对象
   * @returns 格式化后的引用列字符串
   */
  private formatRefColumn(ref: any): string | null {
    if (!ref) return null;
    
    if (Array.isArray(ref)) {
      return ref.join(', ');
    }
    
    if (typeof ref === 'object') {
      return Object.values(ref).join(', ');
    }
    
    return ref.toString();
  }
  
  /**
   * 格式化额外信息
   * @param tableNode 表节点对象
   * @returns 格式化后的额外信息字符串
   */
  private formatExtraInfo(tableNode: any): string | null {
    const extraParts: string[] = [];
    
    // 检查是否使用临时表
    if (tableNode.using_temporary_table) {
      extraParts.push('Using temporary');
    }
    
    // 检查是否使用文件排序
    if (tableNode.using_filesort) {
      extraParts.push('Using filesort');
    }
    
    // 检查是否使用索引条件下推
    if (tableNode.index_condition) {
      extraParts.push('Using index condition');
    }
    
    // 检查是否仅使用索引
    if (tableNode.using_index) {
      extraParts.push('Using index');
    }
    
    // 检查是否使用WHERE子句
    if (tableNode.attached_condition) {
      extraParts.push('Using where');
    }
    
    // 如果有预定义的extra字段，直接使用
    if (tableNode.extra) {
      extraParts.push(tableNode.extra);
    }
    
    return extraParts.length > 0 ? extraParts.join('; ') : null;
  }
  
  /**
   * 从JSON EXPLAIN结果中提取成本
   * @param queryBlock 查询块对象
   * @returns 提取的成本，如果无法提取则返回undefined
   */
  private extractCostFromJsonExplain(queryBlock: any): number | undefined {
    // 尝试获取总成本
    if (queryBlock.cost_info && typeof queryBlock.cost_info.query_cost === 'number') {
      return parseFloat(queryBlock.cost_info.query_cost);
    }
    
    // 尝试获取表成本
    if (queryBlock.table && queryBlock.table.cost_info) {
      return parseFloat(queryBlock.table.cost_info.read_cost || 0) +
        parseFloat(queryBlock.table.cost_info.eval_cost || 0);
    }
    
    // 如果存在嵌套循环，累加所有表的成本
    if (queryBlock.nested_loop) {
      let totalCost = 0;
      for (const nestedItem of queryBlock.nested_loop) {
        if (nestedItem.table && nestedItem.table.cost_info) {
          totalCost += parseFloat(nestedItem.table.cost_info.read_cost || 0) +
            parseFloat(nestedItem.table.cost_info.eval_cost || 0);
        }
      }
      return totalCost > 0 ? totalCost : undefined;
    }
    
    return undefined;
  }
}