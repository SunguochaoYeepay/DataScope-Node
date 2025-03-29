import { QueryPlan, QueryPlanNode } from '../../types/query-plan';
/**
 * MySQL查询计划转换器
 * 用于将MySQL原始执行计划转换为统一格式
 */
export declare class MySQLQueryPlanConverter {
    /**
     * 将MySQL EXPLAIN结果转换为统一的QueryPlan格式
     *
     * @param traditionalFormat EXPLAIN传统格式结果
     * @param jsonFormat EXPLAIN FORMAT=JSON格式结果（可选）
     * @param originalQuery 原始SQL查询
     * @returns 标准化的查询计划对象
     */
    static convert(traditionalFormat: any[], jsonFormat: any | null, originalQuery: string): QueryPlan;
    /**
     * 解析传统格式的执行计划
     */
    private static parseTraditionalFormat;
    /**
     * 从JSON格式提取额外信息
     */
    private static extractJsonInfo;
    /**
     * 计算预估总行数
     */
    private static calculateTotalRows;
    /**
     * 生成优化建议
     * 这个方法可以被内部调用，也可以被外部调用
     * @param nodes 查询计划节点数组或完整的查询计划对象
     * @returns 优化建议数组
     */
    static generateOptimizationTips(nodes: QueryPlanNode[] | QueryPlan): string[];
    /**
     * 判断是否存在性能问题
     */
    private static hasPerformanceIssues;
    /**
     * 识别查询瓶颈
     */
    private static identifyBottlenecks;
    /**
     * 根据查询和执行计划建议索引
     * 简单实现，实际应用中可能需要更复杂的启发式算法
     */
    private static suggestIndexes;
}
