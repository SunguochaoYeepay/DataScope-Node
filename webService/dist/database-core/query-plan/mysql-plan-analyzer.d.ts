import { QueryPlan } from '../../types/query-plan';
export declare class MySQLPlanAnalyzer {
    /**
     * 分析MySQL查询执行计划
     * @param plan 查询执行计划
     * @returns 带有分析结果的查询执行计划
     */
    analyze(plan: QueryPlan): QueryPlan;
    /**
     * 分析性能关注点
     * @param plan 查询执行计划
     * @returns 性能分析结果
     */
    private analyzePerformanceConcerns;
    /**
     * 检查全表扫描
     * @param plan 查询执行计划
     * @param analysis 性能分析结果
     */
    private checkFullTableScans;
    /**
     * 检查文件排序和临时表使用
     * @param plan 查询执行计划
     * @param analysis 性能分析结果
     */
    private checkFileSortAndTemporaryTables;
    /**
     * 检查索引使用情况
     * @param plan 查询执行计划
     * @param analysis 性能分析结果
     */
    private checkIndexUsage;
    /**
     * 检查连接操作
     * @param plan 查询执行计划
     * @param analysis 性能分析结果
     */
    private checkJoinOperations;
    /**
     * 使用分析结果更新计划的警告和优化提示
     * @param plan 查询执行计划
     * @param analysis 性能分析结果
     */
    private updatePlanWithAnalysisResults;
    /**
     * 添加优化提示
     * @param plan 查询执行计划
     * @param analysis 性能分析结果
     */
    private addOptimizationTips;
    /**
     * 更新计划的估算成本和行数
     * @param plan 查询执行计划
     */
    private updatePlanEstimates;
}
