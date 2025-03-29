/**
 * MySQL查询优化器
 * 基于查询执行计划分析，生成优化建议和优化后的SQL查询
 */
import { QueryPlan } from '../../types/query-plan';
/**
 * 优化建议类型
 */
export interface OptimizationSuggestion {
    type: string;
    priority: number;
    description: string;
    action: string;
    impact: string;
    example?: string;
}
/**
 * MySQL查询优化器
 * 分析查询执行计划，提供SQL优化建议
 */
export declare class MySQLQueryOptimizer {
    /**
     * 分析SQL查询并生成优化建议
     * @param plan 查询执行计划
     * @param sql 原始SQL查询
     * @returns 优化建议数组
     */
    analyzeSql(plan: QueryPlan, sql: string): OptimizationSuggestion[];
    /**
     * 将优化提示转换为优化建议
     * @param tip 优化提示
     * @returns 优化建议
     */
    private convertTipToSuggestion;
    /**
     * 分析SQL语句结构
     * @param sql SQL查询语句
     * @param suggestions 存放生成的建议
     */
    private analyzeSqlStructure;
    /**
     * 分析性能特征
     * @param plan 查询执行计划
     * @param suggestions 存放生成的建议
     */
    private analyzePerformanceFeatures;
    /**
     * 根据优化建议生成优化后的SQL查询
     * @param originalSql 原始SQL查询
     * @param suggestions 优化建议
     * @returns 优化后的SQL查询
     */
    generateOptimizedSql(originalSql: string, suggestions: OptimizationSuggestion[]): string;
}
