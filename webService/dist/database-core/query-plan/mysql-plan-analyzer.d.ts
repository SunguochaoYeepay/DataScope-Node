import { QueryPlan } from '../../types/query-plan';
/**
 * MySQL查询计划分析器
 * 专门负责分析MySQL的查询执行计划并提供优化建议
 */
export declare class MySQLPlanAnalyzer {
    /**
     * 分析MySQL查询计划并提供优化建议
     * @param plan 查询执行计划
     * @returns 优化建议列表
     */
    provideOptimizationSuggestions(plan: QueryPlan): string[];
    /**
     * 执行性能分析，提取关键指标
     * @param plan 查询执行计划
     * @returns 性能分析结果
     */
    analyzePerformance(plan: QueryPlan): any;
    /**
     * 从计划中提取表名列表
     */
    private getTablesFromPlan;
    /**
     * 从计划中提取访问类型列表
     */
    private getAccessTypes;
    /**
     * 从计划中提取使用的索引列表
     */
    private getIndexesUsed;
    /**
     * 获取连接类型
     */
    private getJoinTypes;
    /**
     * 检查全表扫描
     */
    private checkFullTableScans;
    /**
     * 检查索引使用情况
     */
    private checkIndexUsage;
    /**
     * 检查临时表和文件排序
     */
    private checkTemporaryTablesAndFilesort;
    /**
     * 检查表连接
     */
    private checkTableJoins;
    /**
     * 检查WHERE条件
     */
    private checkWhereConditions;
    /**
     * 检查LIMIT优化
     */
    private checkLimitOptimization;
    /**
     * 计算索引使用效率
     */
    private calculateIndexEfficiency;
    /**
     *
     * 计算总体性能评分
     */
    private calculatePerformanceScore;
    /**
     * 识别查询中的瓶颈
     */
    private identifyBottlenecks;
}
