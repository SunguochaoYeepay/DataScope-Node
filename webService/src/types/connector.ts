/**
 * 数据库连接器接口定义
 */

import { QueryPlan } from './query-plan';

export interface DatabaseConnector {
  /**
   * 测试数据库连接
   * @returns 测试结果
   */
  testConnection(): Promise<{
    success: boolean;
    message: string;
  }>;
  
  /**
   * 获取数据库列表
   * @returns 数据库列表
   */
  getDatabases(): Promise<string[]>;
  
  /**
   * 获取指定数据库的表列表
   * @param database 数据库名称
   * @returns 表列表
   */
  getTables(database: string): Promise<string[]>;
  
  /**
   * 获取指定表的列信息
   * @param database 数据库名称
   * @param table 表名
   * @returns 列信息
   */
  getColumns(database: string, table: string): Promise<Array<{
    name: string;
    type: string;
    nullable: boolean;
    defaultValue?: string;
    isPrimary: boolean;
    isUnique: boolean;
    comment?: string;
  }>>;
  
  /**
   * 获取指定表的索引信息
   * @param database 数据库名称
   * @param table 表名
   * @returns 索引信息
   */
  getIndexes(database: string, table: string): Promise<Array<{
    name: string;
    columns: string[];
    unique: boolean;
    type: string;
  }>>;
  
  /**
   * 执行SQL查询
   * @param sql SQL查询
   * @returns 查询结果
   */
  executeQuery(sql: string): Promise<{
    columns: string[];
    rows: any[];
    rowCount: number;
    executionTime: number;
  }>;
  
  /**
   * 获取SQL查询执行计划
   * @param sql SQL查询
   * @returns 查询执行计划
   */
  explainQuery(sql: string): Promise<QueryPlan>;
  
  /**
   * 关闭数据库连接
   */
  closeConnection(): Promise<void>;
} 