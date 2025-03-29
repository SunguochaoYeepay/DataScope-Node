import { QueryPlan } from '../../../types/query-plan';
/**
 * MySQL查询计划适配器
 * 用于转换MySQL的EXPLAIN结果为统一的QueryPlan格式
 */
export declare class MySQLQueryPlanAdapter {
    /**
     * 将MySQL的EXPLAIN结果转换为统一的QueryPlan格式
     * @param traditionalRows 传统格式的执行计划行
     * @param jsonData JSON格式的执行计划数据(可选)
     * @param originalQuery 原始查询语句
     * @returns 统一格式的查询执行计划
     */
    static convert(traditionalRows: any[], jsonData: any, originalQuery: string): QueryPlan;
    /**
     * 根据查询计划生成优化建议
     * @param planNodes 查询计划节点列表
     * @returns 优化建议列表
     */
    private static generateOptimizationTips;
}
