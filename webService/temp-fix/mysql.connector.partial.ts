/**
 * 获取查询执行计划
 * @param sql 查询语句
 * @param params 查询参数
 * @returns 执行计划
 */
async explainQuery(sql: string, params: any[] = []): Promise<any> {
  // 验证SQL语句是否为SELECT查询
  if (!this.isSelectQuery(sql)) {
    throw new QueryExecutionError(
      '只有SELECT查询可以获取执行计划',
      this._dataSourceId,
      sql
    );
  }
  
  let connection;
  try {
    connection = await this.pool.getConnection();
    
    // 获取传统格式的执行计划
    const [traditionalRows] = await connection.query(`EXPLAIN ${sql}`, params) as any;
    
    // 尝试获取JSON格式的执行计划（更详细）
    let jsonData: any = null;
    try {
      const [jsonRows] = await connection.query(`EXPLAIN FORMAT=JSON ${sql}`, params) as any;
      if (jsonRows && jsonRows[0] && jsonRows[0].EXPLAIN) {
        jsonData = JSON.parse(jsonRows[0].EXPLAIN);
      }
    } catch (jsonError: any) {
      logger.warn('获取JSON格式执行计划失败，使用传统格式', {
        error: jsonError?.message || '未知错误',
        dataSourceId: this._dataSourceId
      });
    }
    
    // 将执行计划转换为统一格式
    const queryPlan = this.convertToQueryPlan(traditionalRows, jsonData, sql);
    
    // 生成优化建议
    queryPlan.optimizationTips = this.generateOptimizationTips(queryPlan);
    
    return queryPlan;
  } catch (error: any) {
    logger.error('获取查询执行计划失败', {
      error: error?.message || '未知错误',
      dataSourceId: this._dataSourceId,
      sql
    });
    throw new QueryExecutionError(
      `获取查询执行计划失败: ${error?.message || '未知错误'}`,
      this._dataSourceId,
      sql
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * 将MySQL执行计划转换为统一格式
 */
private convertToQueryPlan(traditionalRows: any[], jsonData: any, originalQuery: string): QueryPlan {
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
  
  if (jsonData && jsonData.query_block) {
    const queryBlock = jsonData.query_block;
    estimatedRows = queryBlock.select_id ? parseInt(queryBlock.select_id, 10) : 0;
    
    if (queryBlock.cost_info && queryBlock.cost_info.query_cost) {
      estimatedCost = parseFloat(queryBlock.cost_info.query_cost);
    }
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
    optimizationTips: []
  };
}