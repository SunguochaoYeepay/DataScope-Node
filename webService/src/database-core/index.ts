/**
 * 数据库核心模块入口
 * 导出查询计划分析和优化相关的组件
 */

// 查询计划转换器
import { MySQLQueryPlanConverter } from './query-plan/mysql-query-plan-converter';

// 查询计划分析器
import { MySQLPlanAnalyzer } from './query-plan/mysql-plan-analyzer';

// 查询优化器
import { MySQLQueryOptimizer, OptimizationSuggestion } from './query-optimizer/mysql-query-optimizer';

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
  switch (dbType.toLowerCase()) {
    case 'mysql':
      return new MySQLQueryPlanConverter();
    // 未来支持更多数据库类型
    default:
      throw new Error(`不支持的数据库类型: ${dbType}`);
  }
}

// 工厂函数 - 获取指定数据库类型的查询计划分析器
export function getQueryPlanAnalyzer(dbType: string) {
  switch (dbType.toLowerCase()) {
    case 'mysql':
      return new MySQLPlanAnalyzer();
    // 未来支持更多数据库类型
    default:
      throw new Error(`不支持的数据库类型: ${dbType}`);
  }
}

// 工厂函数 - 获取指定数据库类型的查询优化器
export function getQueryOptimizer(dbType: string) {
  switch (dbType.toLowerCase()) {
    case 'mysql':
      return new MySQLQueryOptimizer();
    // 未来支持更多数据库类型
    default:
      throw new Error(`不支持的数据库类型: ${dbType}`);
  }
} 