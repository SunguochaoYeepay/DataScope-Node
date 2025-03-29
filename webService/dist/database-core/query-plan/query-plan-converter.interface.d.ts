import { QueryPlan } from '../../types/query-plan';
/**
 * 查询计划转换器接口
 * 将特定数据库的查询计划格式转换为统一格式
 */
export interface QueryPlanConverter {
    /**
     * 转换传统的EXPLAIN结果
     * @param explainOutput 数据库EXPLAIN命令的输出
     * @param sql 原始SQL查询语句
     * @returns 统一格式的查询计划
     */
    convertTraditionalExplain(explainOutput: string, sql: string): QueryPlan;
    /**
     * 转换JSON格式的EXPLAIN结果
     * 适用于支持JSON格式输出的数据库（如MySQL 5.7+, PostgreSQL）
     * @param jsonExplain EXPLAIN JSON格式的输出
     * @param sql 原始SQL查询语句
     * @returns 统一格式的查询计划
     */
    convertJsonExplain(jsonExplain: string, sql: string): QueryPlan;
    /**
     * 转换可视化格式的EXPLAIN结果
     * 适用于特定可视化工具生成的格式
     * @param visualExplain 可视化格式的EXPLAIN输出
     * @param sql 原始SQL查询语句
     * @returns 统一格式的查询计划
     */
    convertVisualExplain?(visualExplain: any, sql: string): QueryPlan;
    /**
     * 提取查询计划中的关键指标
     * @param plan 原始数据库特定的查询计划格式
     * @returns 关键性能指标
     */
    extractMetrics(plan: any): {
        estimatedRows?: number;
        estimatedCost?: number;
        actualRows?: number;
        actualTime?: number;
        warnings?: string[];
        [key: string]: any;
    };
}
