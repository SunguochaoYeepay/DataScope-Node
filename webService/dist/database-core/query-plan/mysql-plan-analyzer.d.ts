/**
 * MySQL查询计划分析器
 * 专门用于分析MySQL数据库的查询执行计划
 */
import { QueryPlan } from '../../types/query-plan';
export declare class MySQLPlanAnalyzer {
    /**
     * 分析MySQL查询计划，提取关键性能指标
     * @param plan 查询执行计划
     * @returns 性能分析结果
     */
    analyzePerformance(plan: QueryPlan): any;
    /**
     * 提供深度优化建议
     * @param plan 查询执行计划
     * @returns 优化建议列表
     */
    provideOptimizationSuggestions(plan: QueryPlan): string[];
    /**
     * 获取执行计划中的表列表
     */
    private getTablesScanned;
    /**
     * 检查执行计划是否使用了索引
     */
    private checkIfUsesIndexes;
    /**
     * 检查是否有全表扫描
     */
    private hasFullTableScan;
    /**
     * 检查执行计划是否使用了临时表
     */
    private checkIfUsesTemporaryTable;
    /**
     * 检查执行计划是否使用了文件排序
     */
    private checkIfUsesFileSort;
    /**
     * 计算查询性能得分(0-100)
     */
    private calculatePerformanceScore;
    /**
     * 获取详细分析信息
     */
    private getDetailedAnalysis;
    /**
     * 获取节点存在的问题
     */
    private getNodeIssues;
    /**
     * 获取查询复杂度级别
     */
    private getQueryComplexityLevel;
    /**
     * 识别性能瓶颈
     */
    private identifyBottlenecks;
    /**
     * 分析索引使用情况并提供建议
     */
    private analyzeIndexUsage;
    /**
     * 分析查询结构并提供建议
     */
    private analyzeQueryStructure;
    /**
     * 分析排序和分组操作并提供建议
     */
    private analyzeSortingAndGrouping;
    /**
     * 添加数据库特定的优化建议
     */
    private addDatabaseSpecificSuggestions;
}
