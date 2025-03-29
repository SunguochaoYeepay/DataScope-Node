/**
 * 数据库连接器接口
 * 定义所有支持的数据库类型必须实现的接口方法
 */
 
export interface ColumnInfo {
  name: string;
  dataType: string;
  columnType: string;
  position: number;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isUnique: boolean;
  isAutoIncrement: boolean;
  defaultValue: string | null;
  description: string | null;
  maxLength: number | null;
  precision: number | null;
  scale: number | null;
}

export interface PrimaryKeyInfo {
  constraintName: string;
  columnName: string;
  position: number;
}

export interface ForeignKeyInfo {
  constraintName: string;
  columnName: string;
  position: number;
  referencedSchema: string;
  referencedTable: string;
  referencedColumn: string;
  updateRule: string;
  deleteRule: string;
}

export interface IndexInfo {
  indexName: string;
  columnName: string;
  nonUnique: boolean;
  sequenceInIndex: number;
  indexType: string;
}

export interface TableInfo {
  name: string;
  type: string;
  schema: string | null;
  description: string | null;
  createTime: Date | null;
  updateTime: Date | null;
}

export interface QueryOptions {
  page?: number;        // 当前页码，从1开始
  pageSize?: number;    // 每页记录数
  offset?: number;      // 偏移量（可替代page）
  limit?: number;       // 限制数量（可替代pageSize）
  sort?: string;        // 排序字段
  order?: 'asc'|'desc'; // 排序方向
}

export interface QueryResult {
  fields: Array<{
    name: string;
    type: string;
    table?: string;
    schema?: string;
  }>;
  rows: any[];
  rowCount: number;     // 当前查询返回的行数
  totalCount?: number;  // 不分页时的总行数（仅在分页查询时返回）
  page?: number;        // 当前页码（仅在分页查询时返回）
  pageSize?: number;    // 每页记录数（仅在分页查询时返回）
  totalPages?: number;  // 总页数（仅在分页查询时返回）
  affectedRows?: number;
  lastInsertId?: number | string;
}

/**
 * 查询计划节点
 */
export interface QueryPlanNode {
  id: number;
  selectType: string;
  table: string;
  type: string;
  possibleKeys?: string;
  key?: string;
  keyLen?: number;
  ref?: string;
  rows: number;
  filtered?: number;
  extra?: string;
  partitions?: string;
  costInfo?: string;
}

/**
 * 查询执行计划
 */
export interface QueryPlan {
  planNodes: QueryPlanNode[];
  warnings: string[];
  query: string;
  estimatedCost: number;
  estimatedRows: number;
  optimizationTips: string[];
}

/**
 * 查询选项
 */
export interface QueryOptions {
  pageSize?: number;
  pageNumber?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface DatabaseConnector {
  /**
   * 测试数据库连接
   */
  testConnection(): Promise<boolean>;
  
  /**
   * 执行查询
   */
  executeQuery(sql: string, params?: any[], queryId?: string, options?: QueryOptions): Promise<QueryResult>;
  
  /**
   * 取消正在执行的查询
   * @param queryId 查询ID
   * @returns 是否成功取消
   */
  cancelQuery(queryId: string): Promise<boolean>;
  
  /**
   * 获取查询执行计划
   * @param sql 查询语句
   * @param params 查询参数
   * @returns 执行计划
   */
  explainQuery(sql: string, params?: any[]): Promise<QueryPlan>;
  
  /**
   * 获取架构列表
   */
  getSchemas(): Promise<string[]>;
  
  /**
   * 获取表列表
   */
  getTables(schema?: string): Promise<TableInfo[]>;
  
  /**
   * 获取列信息
   */
  getColumns(schema: string, table: string): Promise<ColumnInfo[]>;
  
  /**
   * 获取主键信息
   */
  getPrimaryKeys(schema: string, table: string): Promise<PrimaryKeyInfo[]>;
  
  /**
   * 获取外键信息
   */
  getForeignKeys(schema: string, table: string): Promise<ForeignKeyInfo[]>;
  
  /**
   * 获取索引信息
   */
  getIndexes(schema: string, table: string): Promise<IndexInfo[]>;
  
  /**
   * 预览表数据
   */
  previewTableData(schema: string, table: string, limit?: number): Promise<QueryResult>;
  
  /**
   * 关闭连接
   */
  close(): Promise<void>;
}

// 为了向后兼容，定义IDatabaseConnector作为DatabaseConnector的别名
export type IDatabaseConnector = DatabaseConnector;

export interface TableRelationship {
  name: string;
  sourceTable: string;
  targetTable: string;
  sourceColumn: string;
  targetColumn: string;
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
}

export interface TableMeta {
  name: string;
  description: string | null;
  columns: ColumnInfo[];
}

export interface QueryPlanNode {
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

export interface QueryPlan {
  planNodes: QueryPlanNode[];
  warnings?: string[];
  query: string;           // 原始查询
  estimatedCost?: number;  // 估计成本
  estimatedRows: number;   // 估计返回行数
  optimizationTips?: string[]; // 优化建议
}

export interface QueryResulMeta {
  columns: Array<{
    name: string;
    type: string;
  }>;
  rowCount: number;
}