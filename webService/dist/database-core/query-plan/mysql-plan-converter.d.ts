import { QueryPlan } from '../../types/query-plan';
/**
 * MySQL查询计划转换器
 * 负责将MySQL传统格式和JSON格式的执行计划转换为统一的QueryPlan格式
 */
export declare class MySQLQueryPlanConverter {
    /**
     * 将MySQL执行计划转换为统一格式
     * @param traditionalRows 传统EXPLAIN输出行
     * @param jsonData JSON格式的EXPLAIN输出
     * @param originalQuery 原始SQL查询
     * @returns 统一格式的查询计划
     */
    static convertToQueryPlan(traditionalRows: any[], jsonData: any, originalQuery: string): QueryPlan;
    /**
     * 从JSON格式执行计划中提取关键性能数据
     * @param jsonData JSON格式的执行计划
     * @returns 提取的性能分析数据
     */
    private static extractPerformanceData;
    /**
     * 递归遍历查询块，收集性能相关数据
     * @param node 查询块节点
     * @param performanceData 性能数据收集对象
     */
    private static traverseQueryBlock;
    /**
     * 分析执行计划并生成优化建议
     * @param plan 执行计划
     * @returns 优化建议数组
     */
    static generateOptimizationTips(plan: QueryPlan): string[];
}
