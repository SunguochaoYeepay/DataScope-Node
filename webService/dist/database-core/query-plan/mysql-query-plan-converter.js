"use strict";
/**
 * MySQL查询计划转换器
 * 将MySQL的EXPLAIN结果转换为统一的查询计划格式
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLQueryPlanConverter = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
class MySQLQueryPlanConverter {
    /**
     * 转换传统EXPLAIN结果为标准查询计划格式
     * @param explainRows EXPLAIN结果行
     * @param sql 原始SQL查询
     * @returns 标准查询计划
     */
    convertTraditionalExplain(explainRows, sql) {
        logger_1.default.debug('开始转换MySQL传统EXPLAIN结果', { rowCount: explainRows.length });
        try {
            // 创建计划节点
            const planNodes = explainRows.map((row, index) => {
                const node = {
                    id: typeof row.id === 'string' ? parseInt(row.id) : (row.id || index + 1),
                    selectType: row.select_type || 'SIMPLE',
                    table: row.table || '未知表',
                    type: row.type || 'ALL',
                    possibleKeys: row.possible_keys,
                    key: row.key,
                    keyLen: row.key_len,
                    ref: row.ref,
                    rows: typeof row.rows === 'string' ? parseInt(row.rows) : (row.rows || 0),
                    filtered: typeof row.filtered === 'string' ? parseFloat(row.filtered) : (row.filtered || 100),
                    extra: row.Extra
                };
                return node;
            });
            // 创建查询计划
            const queryPlan = {
                planNodes,
                query: sql,
                estimatedRows: planNodes.reduce((sum, node) => sum + node.rows, 0),
                warnings: [],
                optimizationTips: []
            };
            // 估算成本基于总扫描行数
            queryPlan.estimatedCost = this.estimateQueryCost(planNodes);
            logger_1.default.debug('MySQL传统EXPLAIN结果转换完成', { nodeCount: planNodes.length });
            return queryPlan;
        }
        catch (error) {
            logger_1.default.error('转换MySQL传统EXPLAIN结果时出错', { error });
            // 返回最小可用计划
            return {
                planNodes: [],
                query: sql,
                estimatedRows: 0,
                warnings: ['无法解析查询执行计划'],
                optimizationTips: ['请检查查询语法或数据库连接']
            };
        }
    }
    /**
     * 转换JSON格式EXPLAIN结果为标准查询计划格式
     * @param jsonExplain JSON格式EXPLAIN结果
     * @param sql 原始SQL查询
     * @returns 标准查询计划
     */
    convertJsonExplain(jsonExplain, sql) {
        logger_1.default.debug('开始转换MySQL JSON EXPLAIN结果');
        try {
            // 递归提取节点
            const planNodes = [];
            this.extractJsonExplainNodes(jsonExplain, planNodes);
            // 创建查询计划
            const queryPlan = {
                planNodes,
                query: sql,
                estimatedRows: planNodes.reduce((sum, node) => sum + node.rows, 0),
                warnings: [],
                optimizationTips: []
            };
            // 估算成本基于总扫描行数和操作类型
            queryPlan.estimatedCost = this.estimateQueryCost(planNodes);
            logger_1.default.debug('MySQL JSON EXPLAIN结果转换完成', { nodeCount: planNodes.length });
            return queryPlan;
        }
        catch (error) {
            logger_1.default.error('转换MySQL JSON EXPLAIN结果时出错', { error });
            // 返回最小可用计划
            return {
                planNodes: [],
                query: sql,
                estimatedRows: 0,
                warnings: ['无法解析JSON格式的查询执行计划'],
                optimizationTips: ['请检查查询语法或MySQL版本兼容性']
            };
        }
    }
    /**
     * 递归提取JSON EXPLAIN结果中的节点
     * @param node JSON EXPLAIN节点
     * @param planNodes 计划节点数组
     * @param depth 当前深度
     */
    extractJsonExplainNodes(node, planNodes, depth = 0) {
        if (!node)
            return;
        // 处理当前节点
        if (node.table_name || node.table) {
            const planNode = {
                id: planNodes.length + 1,
                selectType: node.select_type || node.query_block_type || 'SIMPLE',
                table: node.table_name || node.table || '未知表',
                type: node.access_type || 'ALL',
                possibleKeys: node.possible_keys ? node.possible_keys.join(', ') : null,
                key: node.key || null,
                keyLen: node.key_length || null,
                ref: node.ref ? (Array.isArray(node.ref) ? node.ref.join(', ') : node.ref) : null,
                rows: node.rows || 0,
                filtered: node.filtered || 100,
                extra: this.buildExtraString(node)
            };
            planNodes.push(planNode);
        }
        // 处理子节点
        if (node.query_block) {
            this.extractJsonExplainNodes(node.query_block, planNodes, depth + 1);
        }
        if (node.nested_loop) {
            if (Array.isArray(node.nested_loop)) {
                node.nested_loop.forEach((childNode) => {
                    this.extractJsonExplainNodes(childNode, planNodes, depth + 1);
                });
            }
            else {
                this.extractJsonExplainNodes(node.nested_loop, planNodes, depth + 1);
            }
        }
        if (node.materialized_from_subquery) {
            this.extractJsonExplainNodes(node.materialized_from_subquery, planNodes, depth + 1);
        }
        // 处理其他可能的子节点类型
        const childProperties = [
            'ordering_operation', 'grouping_operation', 'duplicates_removal',
            'table', 'tables', 'used_columns', 'message'
        ];
        for (const prop of childProperties) {
            if (node[prop] && typeof node[prop] === 'object') {
                this.extractJsonExplainNodes(node[prop], planNodes, depth + 1);
            }
        }
    }
    /**
     * 从JSON EXPLAIN节点构建Extra字符串
     * @param node JSON EXPLAIN节点
     * @returns Extra字符串
     */
    buildExtraString(node) {
        const extras = [];
        if (node.using_index)
            extras.push('Using index');
        if (node.using_temporary)
            extras.push('Using temporary');
        if (node.using_filesort)
            extras.push('Using filesort');
        if (node.using_where)
            extras.push('Using where');
        if (node.using_join_buffer)
            extras.push('Using join buffer');
        if (node.using_index_condition)
            extras.push('Using index condition');
        if (node.using_mrr)
            extras.push('Using MRR');
        if (node.using_union)
            extras.push('Using union');
        if (node.using_sort_union)
            extras.push('Using sort_union');
        if (node.using_intersect)
            extras.push('Using intersect');
        if (node.ignored_indexes)
            extras.push(`Ignored indexes: ${node.ignored_indexes}`);
        return extras.length > 0 ? extras.join('; ') : null;
    }
    /**
     * 估算查询成本
     * @param nodes 计划节点数组
     * @returns 估算成本
     */
    estimateQueryCost(nodes) {
        if (nodes.length === 0)
            return 0;
        // 基础成本因子
        const costFactors = {
            'ALL': 10, // 全表扫描成本最高
            'index': 5, // 全索引扫描
            'range': 2, // 范围扫描
            'ref': 1, // 非唯一索引查找
            'eq_ref': 0.5, // 唯一索引查找
            'const': 0.1, // 常量查找
            'system': 0.01, // 系统表查找
            'NULL': 0 // 无需访问表
        };
        // 计算每个节点的成本并求和
        let totalCost = 0;
        for (const node of nodes) {
            let nodeCost = node.rows;
            // 应用访问类型系数
            const typeFactor = costFactors[node.type] || 1;
            nodeCost *= typeFactor;
            // 考虑额外操作成本
            if (node.extra) {
                if (node.extra.includes('Using temporary'))
                    nodeCost *= 2;
                if (node.extra.includes('Using filesort'))
                    nodeCost *= 1.5;
            }
            totalCost += nodeCost;
        }
        return Math.round(totalCost);
    }
}
exports.MySQLQueryPlanConverter = MySQLQueryPlanConverter;
//# sourceMappingURL=mysql-query-plan-converter.js.map