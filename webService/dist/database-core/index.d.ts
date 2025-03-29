/**
 * 数据库核心模块入口
 * 导出查询计划分析和优化相关的组件
 */
import { MySQLQueryPlanConverter } from './query-plan/mysql-query-plan-converter';
import { MySQLPlanAnalyzer } from './query-plan/mysql-plan-analyzer';
import { MySQLQueryOptimizer, OptimizationSuggestion } from './query-optimizer/mysql-query-optimizer';
export { MySQLQueryPlanConverter, MySQLPlanAnalyzer, MySQLQueryOptimizer, OptimizationSuggestion };
export declare function getQueryPlanConverter(dbType: string): MySQLQueryPlanConverter;
export declare function getQueryPlanAnalyzer(dbType: string): MySQLPlanAnalyzer;
export declare function getQueryOptimizer(dbType: string): MySQLQueryOptimizer;
