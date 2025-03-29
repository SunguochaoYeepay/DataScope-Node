/**
 * MySQL查询计划转换器
 * 将MySQL的EXPLAIN结果转换为统一的查询计划格式
 */
import { QueryPlan } from '../../types/query-plan';
/**
 * EXPLAIN结果格式
 */
type ExplainRow = {
    id?: number | string;
    select_type?: string;
    table?: string;
    partitions?: string;
    type?: string;
    possible_keys?: string | null;
    key?: string | null;
    key_len?: string | number | null;
    ref?: string | null;
    rows?: number | string;
    filtered?: number | string;
    Extra?: string | null;
    [key: string]: any;
};
export declare class MySQLQueryPlanConverter {
    /**
     * 转换传统EXPLAIN结果为标准查询计划格式
     * @param explainRows EXPLAIN结果行
     * @param sql 原始SQL查询
     * @returns 标准查询计划
     */
    convertTraditionalExplain(explainRows: ExplainRow[], sql: string): QueryPlan;
    /**
     * 转换JSON格式EXPLAIN结果为标准查询计划格式
     * @param jsonExplain JSON格式EXPLAIN结果
     * @param sql 原始SQL查询
     * @returns 标准查询计划
     */
    convertJsonExplain(jsonExplain: any, sql: string): QueryPlan;
    /**
     * 递归提取JSON EXPLAIN结果中的节点
     * @param node JSON EXPLAIN节点
     * @param planNodes 计划节点数组
     * @param depth 当前深度
     */
    private extractJsonExplainNodes;
    /**
     * 从JSON EXPLAIN节点构建Extra字符串
     * @param node JSON EXPLAIN节点
     * @returns Extra字符串
     */
    private buildExtraString;
    /**
     * 估算查询成本
     * @param nodes 计划节点数组
     * @returns 估算成本
     */
    private estimateQueryCost;
}
export {};
