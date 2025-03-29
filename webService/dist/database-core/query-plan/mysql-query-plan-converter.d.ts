import { QueryPlan } from '../../types/query-plan';
/**
 * MySQL查询计划转换器
 * 用于将MySQL的EXPLAIN结果转换为标准的QueryPlan格式
 * 支持传统格式和JSON格式的EXPLAIN结果
 */
export declare class MySQLQueryPlanConverter {
    /**
     * 转换MySQL传统格式的EXPLAIN结果
     * @param explainResult EXPLAIN命令的结果
     * @param query 原始SQL查询
     * @returns 转换后的查询计划
     */
    convertTraditionalExplain(explainResult: any[], query: string): QueryPlan;
    /**
     * 转换MySQL JSON格式的EXPLAIN结果
     * 支持MySQL 5.7+的EXPLAIN FORMAT=JSON结果
     * @param jsonExplain JSON格式的EXPLAIN结果
     * @param query 原始SQL查询
     * @returns 转换后的查询计划
     */
    convertJsonExplain(jsonExplain: string, query: string): QueryPlan;
    /**
     * 从JSON EXPLAIN结果中提取查询块
     * @param explainData JSON格式的EXPLAIN数据
     * @returns 查询块对象
     */
    private extractQueryBlock;
    /**
     * 从JSON查询块中提取计划节点
     * @param queryBlock 查询块对象
     * @returns 计划节点数组
     */
    private extractPlanNodesFromJson;
    /**
     * 处理表节点并添加到节点数组
     * @param tableNode 表节点对象
     * @param nodes 节点数组
     */
    private processTableNode;
    /**
     * 格式化可能的键
     * @param possibleKeys 可能的键数组
     * @returns 格式化后的可能键字符串
     */
    private formatPossibleKeys;
    /**
     * 格式化引用列
     * @param ref 引用列对象
     * @returns 格式化后的引用列字符串
     */
    private formatRefColumn;
    /**
     * 格式化额外信息
     * @param tableNode 表节点对象
     * @returns 格式化后的额外信息字符串
     */
    private formatExtraInfo;
    /**
     * 从JSON EXPLAIN结果中提取成本
     * @param queryBlock 查询块对象
     * @returns 提取的成本，如果无法提取则返回undefined
     */
    private extractCostFromJsonExplain;
}
