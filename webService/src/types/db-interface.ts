/**
 * 数据库连接器接口定义
 * 所有数据库连接器实现都必须遵循此接口
 */
export interface DatabaseConnector {
  /**
   * 测试连接
   * @returns 是否连接成功
   */
  testConnection(): Promise<boolean>;

  /**
   * 执行查询
   * @param sql SQL语句
   * @param params 查询参数
   * @returns 查询结果
   */
  executeQuery(sql: string, params?: any[]): Promise<any>;

  /**
   * 获取查询计划
   * @param sql SQL语句
   * @returns 查询执行计划
   */
  getQueryPlan?(sql: string): Promise<any>;

  /**
   * 获取数据库元数据
   * @returns 数据库元数据
   */
  getMetadata?(): Promise<any>;

  /**
   * 获取表列表
   * @returns 表列表
   */
  getTables?(): Promise<any[]>;

  /**
   * 获取表结构
   * @param tableName 表名
   * @returns 表结构
   */
  getTableStructure?(tableName: string): Promise<any>;

  /**
   * 获取表索引
   * @param tableName 表名
   * @returns 表索引
   */
  getTableIndexes?(tableName: string): Promise<any[]>;

  /**
   * 获取表关系
   * @param tableName 表名
   * @returns 表关系
   */
  getTableRelationships?(tableName: string): Promise<any[]>;

  /**
   * 获取表统计信息
   * @param tableName 表名
   * @returns 表统计信息
   */
  getTableStats?(tableName: string): Promise<any>;

  /**
   * 关闭连接
   */
  close?(): Promise<void>;

  /**
   * 是否支持JSON格式的EXPLAIN
   */
  isJsonExplainSupported?: boolean;
} 