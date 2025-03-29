import { QueryPlan } from '../../types/query-plan';
/**
 * MySQL查询计划分析器
 * 分析MySQL执行计划并提供优化建议
 */
export declare class MySQLPlanAnalyzer {
    /**
     * 分析MySQL查询执行计划
     * @param plan 查询执行计划
     * @returns 带有分析结果的查询执行计划
     */
    analyze(plan: QueryPlan): QueryPlan;
    /**
     * 获取查询计划的优化建议
     * @param queryPlan 查询执行计划
     * @returns 优化建议数组
     */
    getOptimizationTips(queryPlan: QueryPlan): string[];
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
     * 将内部分析结果转换为查询计划需要的性能分析格式
     * @param analysis 性能分析结果
     * @param planNodes 计划节点
     * @returns 格式化的性能分析输出
     */
    private convertToPerformanceAnalysis;
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
