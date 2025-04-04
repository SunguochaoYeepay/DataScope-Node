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
  pageNumber?: number;    // 当前页码，从1开始
  pageSize?: number;      // 每页记录数
  sortBy?: string;        // 排序字段
  sortDirection?: 'asc'|'desc'; // 排序方向
  page?: number;      // 兼容性
  limit?: number;     // 兼容性
  offset?: number;    // 兼容性
  sort?: string;      // 兼容性
  order?: string;     // 兼容性
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
  estimatedCost: number | undefined;
  estimatedRows: number;
  optimizationTips: string[];
  performanceAnalysis?: any;
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
  explainQuery(sql: string, params?: any[]): Promise<any>;
  
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

export interface QueryResulMeta {
  columns: Array<{
    name: string;
    type: string;
  }>;
  rowCount: number;
}