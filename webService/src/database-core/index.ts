/**
 * 数据库核心功能入口文件
 * 提供获取查询计划转换器、分析器和优化器的工厂函数
 */

import { DatabaseType } from '../types/database';
import { MySQLQueryPlanConverter } from './query-plan/mysql-query-plan-converter';
import { MySQLPlanAnalyzer } from './query-plan/mysql-plan-analyzer';
import { MySQLQueryOptimizer } from './query-optimizer/mysql-query-optimizer';

/**
 * 查询计划转换器接口
 */
export interface QueryPlanConverter {
  /**
   * 转换传统格式的EXPLAIN结果
   */
  convertTraditionalExplain(explainResult: any, query: string): any;
  
  /**
   * 转换JSON格式的EXPLAIN结果
   */
  convertJsonExplain(explainJsonResult: any, query: string): any;
}

/**
 * 查询计划分析器接口
 */
export interface QueryPlanAnalyzer {
  /**
   * 分析查询计划
   */
  analyze(queryPlan: any): any;
  
  /**
   * 获取优化建议
   */
  getOptimizationTips(queryPlan: any): string[];
}

/**
 * 查询优化器接口
 */
export interface QueryOptimizer {
  /**
   * 分析SQL并提供优化建议
   */
  analyzeSql(queryPlan: any, sql: string): any[];
  
  /**
   * 生成优化后的SQL
   */
  generateOptimizedSql(sql: string, suggestions: any[]): string;
}

/**
 * 获取查询计划转换器
 * @param dbType 数据库类型
 * @returns 查询计划转换器实例
 */
export function getQueryPlanConverter(dbType: DatabaseType): QueryPlanConverter {
  const lowerType = dbType.toLowerCase();
  
  switch (lowerType) {
    case 'mysql':
      return new MySQLQueryPlanConverter();
    case 'postgresql':
      // 临时使用MySQL转换器
      console.warn('PostgreSQL查询计划转换器尚未实现，临时使用MySQL转换器');
      return new MySQLQueryPlanConverter();
    case 'sqlserver':
      // 临时使用MySQL转换器
      console.warn('SQL Server查询计划转换器尚未实现，临时使用MySQL转换器');
      return new MySQLQueryPlanConverter();
    case 'oracle':
      // 临时使用MySQL转换器
      console.warn('Oracle查询计划转换器尚未实现，临时使用MySQL转换器');
      return new MySQLQueryPlanConverter();
    default:
      throw new Error(`不支持的数据库类型: ${dbType}`);
  }
}

/**
 * 获取查询计划分析器
 * @param dbType 数据库类型
 * @returns 查询计划分析器实例
 */
export function getQueryPlanAnalyzer(dbType: DatabaseType): QueryPlanAnalyzer {
  const lowerType = dbType.toLowerCase();
  
  switch (lowerType) {
    case 'mysql':
      return new MySQLPlanAnalyzer();
    case 'postgresql':
      // 临时使用MySQL分析器
      console.warn('PostgreSQL查询计划分析器尚未实现，临时使用MySQL分析器');
      return new MySQLPlanAnalyzer();
    case 'sqlserver':
      // 临时使用MySQL分析器
      console.warn('SQL Server查询计划分析器尚未实现，临时使用MySQL分析器');
      return new MySQLPlanAnalyzer();
    case 'oracle':
      // 临时使用MySQL分析器
      console.warn('Oracle查询计划分析器尚未实现，临时使用MySQL分析器');
      return new MySQLPlanAnalyzer();
    default:
      throw new Error(`不支持的数据库类型: ${dbType}`);
  }
}

/**
 * 获取SQL查询优化器
 * @param dbType 数据库类型
 * @returns SQL查询优化器实例
 */
export function getQueryOptimizer(dbType: DatabaseType): QueryOptimizer {
  const lowerType = dbType.toLowerCase();
  
  switch (lowerType) {
    case 'mysql':
      return new MySQLQueryOptimizer();
    case 'postgresql':
      // 临时使用MySQL优化器
      console.warn('PostgreSQL查询优化器尚未实现，临时使用MySQL优化器');
      return new MySQLQueryOptimizer();
    case 'sqlserver':
      // 临时使用MySQL优化器
      console.warn('SQL Server查询优化器尚未实现，临时使用MySQL优化器');
      return new MySQLQueryOptimizer();
    case 'oracle':
      // 临时使用MySQL优化器
      console.warn('Oracle查询优化器尚未实现，临时使用MySQL优化器');
      return new MySQLQueryOptimizer();
    default:
      throw new Error(`不支持的数据库类型: ${dbType}`);
  }
} 