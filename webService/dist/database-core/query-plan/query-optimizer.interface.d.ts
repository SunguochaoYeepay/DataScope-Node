import { QueryPlan } from '../../types/query-plan';
/**
 * 查询优化器接口
 * 提供针对SQL查询和查询计划的优化功能
 */
export interface QueryOptimizer {
    /**
     * 分析SQL查询并提供优化建议
     * @param plan 查询计划数据
     * @param sql 原始SQL查询
     * @returns 优化建议列表
     */
    analyzeSql(plan: QueryPlan, sql: string): Array<{
        type: string;
        description: string;
        recommendation: string;
        impact: 'low' | 'medium' | 'high';
        confidence: 'low' | 'medium' | 'high';
    }>;
    /**
     * 生成优化后的SQL查询
     * @param originalSql 原始SQL查询
     * @param suggestions 优化建议列表
     * @returns 优化后的SQL查询
     */
    generateOptimizedSql(originalSql: string, suggestions: Array<{
        type: string;
        description: string;
        recommendation: string;
        impact: 'low' | 'medium' | 'high';
        confidence: 'low' | 'medium' | 'high';
    }>): string;
    /**
     * 预测优化后查询的性能改进
     * @param originalPlan 原始查询计划
     * @param optimizedSql 优化后的SQL查询
     * @returns 预测的性能改进
     */
    predictPerformanceImprovement?(originalPlan: QueryPlan, optimizedSql: string): {
        estimatedImprovement: number;
        metrics: {
            originalCost?: number;
            estimatedNewCost?: number;
            originalRows?: number;
            estimatedNewRows?: number;
            [key: string]: any;
        };
    };
    /**
     * 检测常见的SQL反模式
     * @param sql SQL查询
     * @returns 检测到的反模式列表
     */
    detectAntiPatterns(sql: string): Array<{
        pattern: string;
        description: string;
        position?: {
            start: number;
            end: number;
        };
        severity: 'low' | 'medium' | 'high';
    }>;
}
