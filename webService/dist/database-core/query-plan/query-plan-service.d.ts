import { DatabaseConnector } from '../../services/database/dbInterface';
import { QueryPlan } from '../../types/query-plan';
import { DatabaseType } from '../../types/datasource';
/**
 * 查询计划服务
 * 负责管理和获取数据库查询执行计划
 */
export declare class QueryPlanService {
    private analyzers;
    constructor();
    /**
     * 从数据库连接器获取查询执行计划
     * @param connector 数据库连接器
     * @param databaseType 数据库类型
     * @param sql SQL查询语句
     * @param params 查询参数
     * @returns 查询执行计划
     */
    getQueryPlan(connector: DatabaseConnector, databaseType: DatabaseType, sql: string, params?: any[]): Promise<QueryPlan>;
    /**
     * 分析查询执行计划并提取关键信息
     * @param plan 查询执行计划
     * @param databaseType 数据库类型
     * @returns 查询执行计划关键信息
     */
    extractPlanSummary(plan: QueryPlan, databaseType?: DatabaseType): any;
    /**
     * 获取针对特定查询的优化建议
     * @param plan 查询执行计划
     * @param databaseType 数据库类型
     * @returns 优化建议列表
     */
    getOptimizationSuggestions(plan: QueryPlan, databaseType?: DatabaseType): string[];
    /**
     * 增强查询计划，添加更多分析信息
     * @param plan 原始查询计划
     * @param databaseType 数据库类型
     */
    private enhanceQueryPlan;
    /**
     * 获取特定数据库类型的分析器
     * @param databaseType 数据库类型
     */
    private getAnalyzerForType;
    /**
     * 从计划中提取表名列表
     */
    private getTablesFromPlan;
}
