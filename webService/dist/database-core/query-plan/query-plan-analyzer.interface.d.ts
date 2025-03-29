import { QueryPlan } from '../../types/query-plan';
/**
 * 查询计划分析器接口
 * 定义对数据库查询执行计划进行分析的标准方法
 */
export interface QueryPlanAnalyzer {
    /**
     * 分析查询计划
     * @param plan 统一格式的查询计划
     * @returns 分析后的查询计划，包含性能分析和优化建议
     */
    analyze(plan: QueryPlan): QueryPlan;
    /**
     * 识别查询计划中的性能瓶颈
     * @param plan 统一格式的查询计划
     * @returns 瓶颈节点列表
     */
    identifyBottlenecks(plan: QueryPlan): any[];
    /**
     * 提供优化建议
     * @param plan 统一格式的查询计划
     * @returns 优化建议列表
     */
    provideOptimizationTips(plan: QueryPlan): Array<{
        type: string;
        description: string;
        severity: 'low' | 'medium' | 'high';
        nodeIds?: string[];
        operation?: string;
    }>;
    /**
     * 评估计划的整体性能
     * @param plan 统一格式的查询计划
     * @returns 性能评估结果，包含评分和关键指标
     */
    evaluatePerformance(plan: QueryPlan): {
        score: number;
        metrics: Record<string, number | string>;
        issues: Array<{
            type: string;
            description: string;
            impact: 'low' | 'medium' | 'high';
        }>;
    };
}
