/**
 * 数据库核心模块入口
 * 导出查询计划分析和优化相关的组件
 */

// 导入日志记录器
import logger from '../utils/logger';

// 查询计划转换器
import { MySQLQueryPlanConverter } from './query-plan/mysql-query-plan-converter';

// 查询计划分析器
import { MySQLPlanAnalyzer } from './query-plan/mysql-plan-analyzer';

// 查询优化器
import { MySQLQueryOptimizer, OptimizationSuggestion } from './query-optimizer/mysql-query-optimizer';

// 数据库类型
import { DatabaseType } from '../types/database';

// 导出查询计划相关组件
export {
  // 查询计划转换器
  MySQLQueryPlanConverter,
  
  // 查询计划分析器
  MySQLPlanAnalyzer,
  
  // 查询优化器
  MySQLQueryOptimizer,
  OptimizationSuggestion
};

// 工厂函数 - 获取指定数据库类型的查询计划转换器
export function getQueryPlanConverter(dbType: string) {
  // 当前只支持MySQL，其他数据库类型返回默认MySQL转换器或抛出错误
  const normalizedType = dbType.toLowerCase();
  
  if (normalizedType === 'mysql') {
    return new MySQLQueryPlanConverter();
  }
  
  // 对于其他类型，暂时返回MySQL转换器
  logger.warn(`数据库类型 ${dbType} 的查询计划转换器尚未实现，使用MySQL转换器替代`);
  return new MySQLQueryPlanConverter();
  
  // 未来扩展时，取消下面注释并实现对应的转换器
  /*
  switch (normalizedType) {
    case 'mysql':
      return new MySQLQueryPlanConverter();
    case 'postgresql':
      // return new PostgreSQLQueryPlanConverter();
    case 'sqlserver':
      // return new SQLServerQueryPlanConverter();
    case 'oracle':
      // return new OracleQueryPlanConverter();
    default:
      throw new Error(`不支持的数据库类型: ${dbType}`);
  }
  */
}

// 工厂函数 - 获取指定数据库类型的查询计划分析器
export function getQueryPlanAnalyzer(dbType: string) {
  // 当前只支持MySQL，其他数据库类型返回默认MySQL分析器或抛出错误
  const normalizedType = dbType.toLowerCase();
  
  if (normalizedType === 'mysql') {
    return new MySQLPlanAnalyzer();
  }
  
  // 对于其他类型，暂时返回MySQL分析器
  logger.warn(`数据库类型 ${dbType} 的查询计划分析器尚未实现，使用MySQL分析器替代`);
  return new MySQLPlanAnalyzer();
  
  // 未来扩展时，取消下面注释并实现对应的分析器
  /*
  switch (normalizedType) {
    case 'mysql':
      return new MySQLPlanAnalyzer();
    case 'postgresql':
      // return new PostgreSQLPlanAnalyzer();
    case 'sqlserver':
      // return new SQLServerPlanAnalyzer();
    case 'oracle':
      // return new OraclePlanAnalyzer();
    default:
      throw new Error(`不支持的数据库类型: ${dbType}`);
  }
  */
}

// 工厂函数 - 获取指定数据库类型的查询优化器
export function getQueryOptimizer(dbType: string) {
  // 当前只支持MySQL，其他数据库类型返回默认MySQL优化器或抛出错误
  const normalizedType = dbType.toLowerCase();
  
  if (normalizedType === 'mysql') {
    return new MySQLQueryOptimizer();
  }
  
  // 对于其他类型，暂时返回MySQL优化器
  logger.warn(`数据库类型 ${dbType} 的查询优化器尚未实现，使用MySQL优化器替代`);
  return new MySQLQueryOptimizer();
  
  // 未来扩展时，取消下面注释并实现对应的优化器
  /*
  switch (normalizedType) {
    case 'mysql':
      return new MySQLQueryOptimizer();
    case 'postgresql':
      // return new PostgreSQLQueryOptimizer();
    case 'sqlserver':
      // return new SQLServerQueryOptimizer();
    case 'oracle':
      // return new OracleQueryOptimizer();
    default:
      throw new Error(`不支持的数据库类型: ${dbType}`);
  }
  */
} 