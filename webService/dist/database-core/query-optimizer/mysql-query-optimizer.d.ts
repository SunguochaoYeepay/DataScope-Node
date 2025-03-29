/**
 * MySQL查询优化器
 * 提供查询分析和优化建议
 */
import { QueryPlan } from '../../types/query-plan';
/**
 * 优化建议类型
 */
export interface OptimizationSuggestion {
    type: string;
    description: string;
    suggestedFix: string;
    originalSql?: string;
    optimizedSql?: string;
    estimatedImprovement?: number;
}
export declare class MySQLQueryOptimizer {
    /**
     * 分析查询并生成优化建议
     * @param queryPlan 查询执行计划
     * @param originalSql 原始SQL查询
     * @returns 优化建议列表
     */
    analyzeSql(queryPlan: QueryPlan, originalSql: string): OptimizationSuggestion[];
    /**
     * 生成优化后的SQL
     * @param originalSql 原始SQL
     * @param suggestions 优化建议
     * @returns 优化后的SQL
     */
    generateOptimizedSql(originalSql: string, suggestions: OptimizationSuggestion[]): string;
    /**
     * 识别查询模式
     * @param queryPlan 查询执行计划
     * @param sql 原始SQL
     * @returns 识别出的模式列表
     */
    private identifyQueryPatterns;
    /**
     * 生成SELECT列建议
     * @param sql 原始SQL
     * @returns 优化建议
     */
    private generateSelectColumnsRecommendation;
    /**
     * 生成LIKE通配符建议
     * @param sql 原始SQL
     * @returns 优化建议
     */
    private generateLikeRecommendation;
    /**
     * 生成子查询优化建议
     * @param sql 原始SQL
     * @returns 优化建议
     */
    private generateSubqueryRecommendation;
    /**
     * 生成索引建议
     * @param queryPlan 查询执行计划
     * @param sql 原始SQL
     * @returns 优化建议
     */
    private generateIndexRecommendation;
    /**
     * 生成连接优化建议
     * @param queryPlan 查询执行计划
     * @param sql 原始SQL
     * @returns 优化建议
     */
    private generateJoinOptimizationRecommendation;
    /**
     * 添加基于执行计划的具体建议
     * @param queryPlan 查询执行计划
     * @param sql 原始SQL
     * @param suggestions 现有建议列表
     */
    private addPlanBasedSuggestions;
}
