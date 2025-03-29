"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLQueryPlanConverter = void 0;
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * MySQL查询计划转换器
 * 用于将MySQL原始执行计划转换为统一格式
 */
class MySQLQueryPlanConverter {
    /**
     * 将MySQL EXPLAIN结果转换为统一的QueryPlan格式
     *
     * @param traditionalFormat EXPLAIN传统格式结果
     * @param jsonFormat EXPLAIN FORMAT=JSON格式结果（可选）
     * @param originalQuery 原始SQL查询
     * @returns 标准化的查询计划对象
     */
    static convert(traditionalFormat, jsonFormat, originalQuery) {
        // 解析传统格式结果
        const planNodes = this.parseTraditionalFormat(traditionalFormat);
        // 提取JSON格式附加信息
        const jsonInfo = this.extractJsonInfo(jsonFormat);
        // 构建完整的查询计划
        const queryPlan = {
            planNodes,
            query: originalQuery,
            estimatedRows: this.calculateTotalRows(planNodes),
            estimatedCost: jsonInfo.estimatedCost,
            warnings: [],
            optimizationTips: this.generateOptimizationTips(planNodes)
        };
        // 添加性能分析
        if (this.hasPerformanceIssues(planNodes)) {
            queryPlan.performanceAnalysis = {
                bottlenecks: this.identifyBottlenecks(planNodes).map(bottleneck => ({
                    severity: 'high',
                    type: 'bottleneck',
                    description: bottleneck,
                    suggestedAction: '查看优化建议'
                })),
                indexUsage: {
                    missingIndexes: this.suggestIndexes(planNodes, originalQuery).map(suggestion => ({
                        severity: 'medium',
                        type: 'missing_index',
                        description: suggestion,
                        suggestedAction: '添加合适的索引'
                    })),
                    inefficientIndexes: []
                },
                joinAnalysis: []
            };
        }
        return queryPlan;
    }
    /**
     * 解析传统格式的执行计划
     */
    static parseTraditionalFormat(rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }
        return rows.map((row) => {
            const planNode = {
                id: Number(row.id) || 1,
                selectType: row.select_type || 'SIMPLE',
                table: row.table || '',
                type: row.type || '',
                possibleKeys: row.possible_keys,
                key: row.key,
                keyLen: row.key_len ? row.key_len : undefined,
                ref: row.ref,
                rows: Number(row.rows || '0'),
                filtered: Number(row.filtered || '100'),
                extra: row.Extra || row.extra
            };
            return planNode;
        });
    }
    /**
     * 从JSON格式提取额外信息
     */
    static extractJsonInfo(jsonFormat) {
        let estimatedCost;
        const extraInfo = {};
        if (jsonFormat && typeof jsonFormat === 'object') {
            try {
                let jsonData;
                // 处理可能的不同格式情况
                if (typeof jsonFormat.EXPLAIN === 'string') {
                    jsonData = JSON.parse(jsonFormat.EXPLAIN);
                }
                else if (jsonFormat.EXPLAIN && typeof jsonFormat.EXPLAIN === 'object') {
                    jsonData = jsonFormat.EXPLAIN;
                }
                else if (jsonFormat.query_block) {
                    jsonData = jsonFormat;
                }
                if (jsonData && jsonData.query_block) {
                    const queryBlock = jsonData.query_block;
                    // 提取成本信息
                    if (queryBlock.cost_info && queryBlock.cost_info.query_cost) {
                        estimatedCost = Number(queryBlock.cost_info.query_cost);
                    }
                    // 存储其他可能有用的信息
                    extraInfo.queryBlock = queryBlock;
                }
            }
            catch (error) {
                logger_1.default.warn('解析JSON格式查询计划时出错', { error });
            }
        }
        return { estimatedCost, extraInfo };
    }
    /**
     * 计算预估总行数
     */
    static calculateTotalRows(nodes) {
        if (nodes.length === 0) {
            return 0;
        }
        // 对于简单查询，使用第一个节点的行数
        // 对于复杂查询（如JOIN），可以使用行数总和或其他启发式方法
        return nodes.reduce((total, node) => total + node.rows, 0);
    }
    /**
     * 生成优化建议
     * 这个方法可以被内部调用，也可以被外部调用
     * @param nodes 查询计划节点数组或完整的查询计划对象
     * @returns 优化建议数组
     */
    static generateOptimizationTips(nodes) {
        const tips = [];
        // 判断参数是查询计划节点数组还是完整的查询计划对象
        const planNodes = Array.isArray(nodes)
            ? nodes
            : nodes.planNodes;
        // 如果是完整的查询计划对象且已有优化建议，直接返回
        if (!Array.isArray(nodes) && nodes.optimizationTips && nodes.optimizationTips.length > 0) {
            return nodes.optimizationTips;
        }
        // 检查全表扫描
        const fullScanNodes = planNodes.filter(node => node.type === 'ALL');
        if (fullScanNodes.length > 0) {
            tips.push(`发现${fullScanNodes.length}个全表扫描，考虑为表${fullScanNodes.map(n => n.table).join(', ')}添加索引`);
        }
        // 检查缺少索引但扫描大量行的情况
        const noIndexNodes = planNodes.filter(node => !node.key && node.rows > 100);
        if (noIndexNodes.length > 0) {
            tips.push(`表${noIndexNodes.map(n => n.table).join(', ')}没有使用索引，且扫描行数较大`);
        }
        // 检查文件排序情况
        const filesortNodes = planNodes.filter(node => node.extra && node.extra.includes('Using filesort'));
        if (filesortNodes.length > 0) {
            tips.push('查询使用了文件排序，考虑添加适当的索引以避免排序');
        }
        // 检查临时表使用
        const tempTableNodes = planNodes.filter(node => node.extra && node.extra.includes('Using temporary'));
        if (tempTableNodes.length > 0) {
            tips.push('查询使用了临时表，考虑简化查询或添加适当的索引');
        }
        // 检查表连接问题
        if (planNodes.length > 1) {
            const joinProblems = planNodes.filter(node => node.type === 'ALL' &&
                (node.rows > 1000 || !node.key));
            if (joinProblems.length > 0) {
                tips.push('表连接可能不够高效，检查连接条件和相关索引');
            }
        }
        // 如果是完整的查询计划对象且有性能分析信息
        if (!Array.isArray(nodes)) {
            const plan = nodes;
            // 检查执行成本
            if (plan.estimatedCost && plan.estimatedCost > 1000) {
                tips.push(`查询估计成本较高 (${plan.estimatedCost.toFixed(2)})，考虑优化查询或添加索引`);
            }
            // 检查性能分析结果
            if (plan.performanceAnalysis && plan.performanceAnalysis.bottlenecks && plan.performanceAnalysis.bottlenecks.length > 0) {
                tips.push(`发现查询的性能瓶颈: ${plan.performanceAnalysis.bottlenecks.join(', ')}`);
            }
        }
        // 如果没有生成任何建议，添加一个标准消息
        if (tips.length === 0) {
            tips.push('查询执行计划看起来已经优化得很好。没有发现明显的性能问题。');
        }
        return tips;
    }
    /**
     * 判断是否存在性能问题
     */
    static hasPerformanceIssues(nodes) {
        // 检查是否有全表扫描
        const hasFullScan = nodes.some(node => node.type === 'ALL');
        // 检查是否有文件排序或临时表
        const hasInefficiencies = nodes.some(node => node.extra && (node.extra.includes('Using filesort') ||
            node.extra.includes('Using temporary')));
        // 检查是否有大量行扫描
        const hasLargeScans = nodes.some(node => node.rows > 1000);
        return hasFullScan || hasInefficiencies || hasLargeScans;
    }
    /**
     * 识别查询瓶颈
     */
    static identifyBottlenecks(nodes) {
        const bottlenecks = [];
        // 检查全表扫描
        const fullScans = nodes.filter(node => node.type === 'ALL');
        if (fullScans.length > 0) {
            bottlenecks.push(`全表扫描: ${fullScans.map(n => n.table).join(', ')}`);
        }
        // 检查低效的表连接
        const inefficientJoins = nodes.filter(node => node.type !== 'eq_ref' &&
            node.type !== 'const' &&
            node.rows > 100);
        if (inefficientJoins.length > 0 && nodes.length > 1) {
            bottlenecks.push(`低效表连接: ${inefficientJoins.map(n => n.table).join(', ')}`);
        }
        // 检查临时表和文件排序
        for (const node of nodes) {
            if (node.extra) {
                if (node.extra.includes('Using temporary')) {
                    bottlenecks.push(`临时表使用: ${node.table}`);
                }
                if (node.extra.includes('Using filesort')) {
                    bottlenecks.push(`文件排序: ${node.table}`);
                }
            }
        }
        return bottlenecks;
    }
    /**
     * 根据查询和执行计划建议索引
     * 简单实现，实际应用中可能需要更复杂的启发式算法
     */
    static suggestIndexes(nodes, query) {
        const suggestions = [];
        // 提取可能的WHERE子句和ORDER BY子句中的列
        const whereMatch = query.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+GROUP\s+BY|\s+LIMIT|\s*$)/i);
        const orderByMatch = query.match(/ORDER\s+BY\s+(.+?)(?:\s+LIMIT|\s*$)/i);
        // 遍历全表扫描节点
        for (const node of nodes.filter(n => n.type === 'ALL')) {
            // 如果存在WHERE条件，建议在WHERE条件列上创建索引
            if (whereMatch && whereMatch[1]) {
                // 这里用简单提取来示例，实际中可能需要SQL解析器
                const conditions = whereMatch[1].split(/\s+AND\s+/i);
                const columns = conditions.map(cond => {
                    const colMatch = cond.match(/(\w+)\s*[=<>]/);
                    return colMatch ? colMatch[1] : null;
                }).filter(Boolean);
                if (columns.length > 0) {
                    suggestions.push(`表 ${node.table} 可能受益于列 (${columns.join(', ')}) 上的索引`);
                }
            }
            // 如果存在ORDER BY并且使用了filesort，建议在ORDER BY列上创建索引
            if (orderByMatch && orderByMatch[1] && node.extra && node.extra.includes('Using filesort')) {
                const orderColumns = orderByMatch[1].split(/\s*,\s*/).map(col => col.trim().split(/\s+/)[0]);
                if (orderColumns.length > 0) {
                    suggestions.push(`表 ${node.table} 的排序可能受益于列 (${orderColumns.join(', ')}) 上的索引`);
                }
            }
        }
        return suggestions;
    }
}
exports.MySQLQueryPlanConverter = MySQLQueryPlanConverter;
//# sourceMappingURL=mysql-query-plan-converter.js.map