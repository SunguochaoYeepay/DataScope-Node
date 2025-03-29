# 查询执行计划功能设计文档

## 概述

查询执行计划功能允许用户查看数据库系统如何执行SQL查询，帮助开发人员和数据分析师优化查询性能。本文档详细描述查询执行计划功能的设计和实现方案。

## 系统设计

### 1. 架构图

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   API层      │      │   服务层      │      │  连接器层     │
│  Controller  │──────▶  Service     │──────▶  Connector   │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                     │
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ /api/queries │      │QueryService  │      │MySQLConnector│
│  /explain    │      │explainQuery()│      │explainQuery()│
└──────────────┘      └──────────────┘      └──────────────┘
```

### 2. 执行计划数据模型

MySQL执行计划基本结构：

```typescript
interface QueryPlanNode {
  id: number;              // 操作ID
  selectType: string;      // 查询类型
  table: string;           // 表名
  partitions?: string;     // 分区
  type: string;            // 连接类型
  possibleKeys?: string;   // 可能使用的索引
  key?: string;            // 实际使用的索引
  keyLen?: string;         // 索引长度
  ref?: string;            // 索引引用
  rows: number;            // 扫描行数估计
  filtered: number;        // 按表条件过滤的百分比
  extra?: string;          // 附加信息
  children?: QueryPlanNode[]; // 子查询计划（用于复杂查询）
}

interface QueryPlan {
  planNodes: QueryPlanNode[];
  warnings?: string[];
  query: string;           // 原始查询
  estimatedCost?: number;  // 估计成本
  estimatedRows: number;   // 估计返回行数
}
```

## 接口定义

### 1. 数据库连接器扩展

向`DatabaseConnector`接口添加查询执行计划方法：

```typescript
interface DatabaseConnector {
  // 现有方法...
  
  /**
   * 获取查询执行计划
   * @param sql 查询语句
   * @param params 查询参数
   * @returns 执行计划
   */
  explainQuery(sql: string, params?: any[]): Promise<QueryPlan>;
}
```

### 2. 服务层扩展

在`QueryService`中添加查询执行计划方法：

```typescript
/**
 * 获取查询执行计划
 */
async explainQuery(dataSourceId: string, sql: string, params: any[] = []): Promise<QueryPlan>;
```

### 3. API层扩展

添加新的API端点获取查询执行计划：

```
POST /api/queries/explain
```

请求体：

```json
{
  "dataSourceId": "uuid-string",
  "sql": "SELECT * FROM users WHERE id > ?",
  "params": [100]
}
```

## 实现方案

### 1. MySQL执行计划获取

MySQL提供了两种执行计划格式：

1. **传统EXPLAIN**：以表格形式返回执行计划
2. **EXPLAIN FORMAT=JSON**：以JSON格式返回更详细的执行计划

我们将同时支持这两种格式，并提供格式转换功能：

```typescript
/**
 * 获取MySQL查询执行计划
 */
async explainQuery(sql: string, params: any[] = []): Promise<QueryPlan> {
  try {
    // 验证SQL语句是否为SELECT查询
    if (!this.isSelectQuery(sql)) {
      throw new Error("只有SELECT查询可以获取执行计划");
    }
    
    // 获取传统格式的执行计划
    const traditionalPlan = await this.executeQuery(`EXPLAIN ${sql}`, params);
    
    // 获取JSON格式的执行计划（更详细）
    const jsonPlan = await this.executeQuery(`EXPLAIN FORMAT=JSON ${sql}`, params);
    
    // 解析JSON格式计划
    const jsonData = JSON.parse(jsonPlan.rows[0].EXPLAIN);
    
    // 转换为统一的QueryPlan格式
    return this.convertToQueryPlan(traditionalPlan.rows, jsonData, sql);
  } catch (error: any) {
    logger.error('获取查询执行计划失败', {
      error: error?.message || '未知错误',
      sql,
      dataSourceId: this._dataSourceId
    });
    throw new QueryExecutionError(
      `获取查询执行计划失败: ${error?.message || '未知错误'}`,
      this._dataSourceId,
      sql
    );
  }
}
```

### 2. 执行计划解析与转换

对于复杂查询，执行计划可能包含嵌套结构，我们需要将其转换为层次结构：

```typescript
/**
 * 将MySQL执行计划转换为统一格式
 */
private convertToQueryPlan(traditionalRows: any[], jsonData: any, originalQuery: string): QueryPlan {
  const planNodes: QueryPlanNode[] = [];
  
  // 处理传统格式的执行计划行
  for (const row of traditionalRows) {
    const planNode: QueryPlanNode = {
      id: row.id,
      selectType: row.select_type,
      table: row.table,
      type: row.type,
      possibleKeys: row.possible_keys,
      key: row.key,
      keyLen: row.key_len,
      ref: row.ref,
      rows: row.rows,
      filtered: row.filtered,
      extra: row.Extra
    };
    
    planNodes.push(planNode);
  }
  
  // 从JSON格式中提取其他有用信息
  const queryBlock = jsonData.query_block;
  const estimatedRows = queryBlock.select_id || 
                        (queryBlock.nested_loop && queryBlock.nested_loop[0].table.rows);
                        
  // 构建完整的执行计划对象
  return {
    planNodes,
    query: originalQuery,
    estimatedRows: estimatedRows || 0,
    estimatedCost: queryBlock.cost_info?.query_cost
  };
}
```

### 3. 查询服务实现

```typescript
/**
 * 获取查询执行计划
 */
async explainQuery(dataSourceId: string, sql: string, params: any[] = []): Promise<any> {
  try {
    // 获取数据源连接器
    const connector = await dataSourceService.getConnector(dataSourceId);
    
    // 调用连接器的执行计划方法
    return await connector.explainQuery(sql, params);
  } catch (error: any) {
    logger.error('获取查询执行计划失败', { error, dataSourceId, sql });
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('获取查询执行计划失败', 500, error?.message || '未知错误');
  }
}
```

### 4. 控制器实现

```typescript
/**
 * 获取查询执行计划
 */
async explainQuery(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError('验证错误', 400, { errors: errors.array() });
    }

    const { dataSourceId, sql, params } = req.body;
    const plan = await queryService.explainQuery(dataSourceId, sql, params);
    
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error: any) {
    next(error);
  }
}
```

### 5. 路由定义

```typescript
/**
 * @swagger
 * /queries/explain:
 *   post:
 *     summary: 获取查询执行计划
 *     tags: [Queries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataSourceId:
 *                 type: string
 *               sql:
 *                 type: string
 *               params:
 *                 type: array
 *             required:
 *               - dataSourceId
 *               - sql
 *     responses:
 *       200:
 *         description: 查询执行计划
 */
router.post('/explain', [
  body('dataSourceId').isUUID().withMessage('无效的数据源ID'),
  body('sql').notEmpty().withMessage('SQL语句不能为空'),
], queryController.explainQuery);
```

## 实现步骤

1. 扩展`DatabaseConnector`接口，添加`explainQuery`方法
2. 在`MySQLConnector`中实现执行计划获取和转换
3. 在`QueryService`中添加`explainQuery`方法
4. 添加API控制器方法和路由
5. 更新API文档，添加执行计划相关说明
6. 添加单元测试和集成测试

## 执行计划可视化

### 1. 执行计划树形结构

为了便于前端可视化，我们可以将执行计划转换为树形结构：

```typescript
/**
 * 将MySQL执行计划转换为树形结构
 */
private convertToTree(traditionalRows: any[]): QueryPlanNode[] {
  // 创建节点映射表
  const nodesMap = new Map<number, QueryPlanNode>();
  
  // 第一次遍历，创建所有节点
  for (const row of traditionalRows) {
    const node: QueryPlanNode = {
      id: row.id,
      selectType: row.select_type,
      table: row.table,
      type: row.type,
      possibleKeys: row.possible_keys,
      key: row.key,
      keyLen: row.key_len,
      ref: row.ref,
      rows: row.rows,
      filtered: row.filtered,
      extra: row.Extra,
      children: []
    };
    
    nodesMap.set(node.id, node);
  }
  
  // 构建树
  const rootNodes: QueryPlanNode[] = [];
  for (const node of nodesMap.values()) {
    if (node.selectType === 'PRIMARY' || node.selectType === 'SIMPLE') {
      rootNodes.push(node);
    } else if (node.selectType.includes('SUBQUERY')) {
      // 查找父节点
      const parentNode = findParentNode(nodesMap, node);
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        rootNodes.push(node);
      }
    }
  }
  
  return rootNodes;
}
```

### 2. 执行计划可视化建议

除了原始执行计划外，还可以提供查询优化建议：

```typescript
/**
 * 分析执行计划并生成优化建议
 */
private generateOptimizationTips(plan: QueryPlan): string[] {
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
  
  return tips;
}
```

## 注意事项与限制

1. 只能获取SELECT查询的执行计划
2. 不同数据库系统的执行计划格式差异较大
3. 执行计划分析仅供参考，实际执行可能会有差异
4. 可能需要特定的数据库权限才能获取执行计划

## 未来扩展

1. 支持其他数据库系统（如PostgreSQL、Oracle）的执行计划
2. 提供更详细的查询性能分析
3. 自动索引推荐功能
4. 查询执行计划历史记录和比较