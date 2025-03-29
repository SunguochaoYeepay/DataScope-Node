/**
 * MySQL适配器类
 * 用于处理MySQL数据库查询计划特定格式和抽象成通用格式
 */
export class MySQLPlanAdapter {
  /**
   * 将MySQL EXPLAIN结果转换为通用查询计划格式
   * @param explainResult MySQL EXPLAIN结果
   * @param jsonExplain 可选的JSON格式EXPLAIN结果
   * @returns 统一格式的查询计划
   */
  convertToQueryPlan(explainResult: any[], jsonExplain: any, sql: string): QueryPlan {
    const planNodes: QueryPlanNode[] = [];
    
    // 处理标准EXPLAIN输出
    for (const row of explainResult) {
      planNodes.push({
        id: Number(row.id) || 1,
        selectType: row.select_type || 'SIMPLE',
        table: row.table || '',
        type: row.type || 'ALL', // 默认为全表扫描
        possibleKeys: row.possible_keys || null,
        key: row.key || null,
        keyLen: row.key_len ? row.key_len : undefined,
        ref: row.ref || null,
        rows: Number(row.rows) || 0,
        filtered: Number(row.filtered) || 100,
        extra: row.Extra || null
      });
    }
    
    // 提取其他信息（从JSON格式，如果可用）
    let estimatedCost;
    let estimatedRows = 0;
    
    if (jsonExplain && jsonExplain.query_block) {
      if (jsonExplain.query_block.cost_info) {
        estimatedCost = Number(jsonExplain.query_block.cost_info.query_cost);
      }
      
      // 递归处理嵌套子查询
      this.processNestedBlocks(jsonExplain.query_block, planNodes);
    }
    
    // 如果没有从JSON获取到行数估计，使用常规EXPLAIN行的总和
    if (estimatedRows === 0 && planNodes.length > 0) {
      estimatedRows = planNodes.reduce((sum, node) => sum + node.rows, 0);
    }
    
    return {
      planNodes,
      warnings: [],
      query: sql,
      estimatedCost,
      estimatedRows,
      optimizationTips: []
    };
  }
  
  /**
   * 递归处理JSON格式查询计划中的嵌套块
   */
  private processNestedBlocks(queryBlock: any, planNodes: QueryPlanNode[]): void {
    // 处理嵌套子查询
    if (queryBlock.nested_loop) {
      for (const loop of queryBlock.nested_loop) {
        if (loop.table) {
          this.extractNodeInfo(loop.table, planNodes);
        }
        
        if (loop.subquery) {
          this.processNestedBlocks(loop.subquery.query_block, planNodes);
        }
      }
    }
    
    // 处理简单表
    if (queryBlock.table) {
      this.extractNodeInfo(queryBlock.table, planNodes);
    }
  }
  
  /**
   * 从JSON表信息中提取节点信息
   */
  private extractNodeInfo(tableInfo: any, planNodes: QueryPlanNode[]): void {
    if (!tableInfo.table_name) return;
    
    // 查找是否已有相同节点（根据ID和表名）
    const existingNodeIndex = planNodes.findIndex(node => 
      node.id === Number(tableInfo.table_scan_id) && 
      node.table === tableInfo.table_name
    );
    
    // 如果找到并且有更详细的信息，则更新
    if (existingNodeIndex >= 0) {
      if (tableInfo.access_type) {
        planNodes[existingNodeIndex].type = tableInfo.access_type;
      }
      if (tableInfo.used_key_parts) {
        planNodes[existingNodeIndex].keyLen = tableInfo.used_key_parts.length;
      }
      return;
    }
    
    // 否则添加新节点
    if (tableInfo.cost_info) {
      planNodes.push({
        id: Number(tableInfo.table_scan_id) || planNodes.length + 1,
        selectType: 'SIMPLE',
        table: tableInfo.table_name,
        type: tableInfo.access_type || 'ALL',
        possibleKeys: tableInfo.possible_keys ? tableInfo.possible_keys.join(', ') : null,
        key: tableInfo.used_key || null,
        keyLen: tableInfo.used_key_parts ? tableInfo.used_key_parts.length : undefined,
        ref: null,
        rows: Number(tableInfo.rows_examined_per_scan) || 0,
        filtered: Number(tableInfo.filtered) || 100,
        extra: null
      });
    }
  }
}