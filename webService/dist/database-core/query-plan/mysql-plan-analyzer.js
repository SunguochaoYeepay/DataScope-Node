"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLPlanAnalyzer = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * MySQL查询计划分析器
 * 专门负责分析MySQL的查询执行计划并提供优化建议
 */
class MySQLPlanAnalyzer {
    /**
     * 分析MySQL查询计划并提供优化建议
     * @param plan 查询执行计划
     * @returns 优化建议列表
     */
    provideOptimizationSuggestions(plan) {
        const tips = [];
        try {
            // 检查全表扫描
            this.checkFullTableScans(plan, tips);
            // 检查索引使用情况
            this.checkIndexUsage(plan, tips);
            // 检查临时表和文件排序
            this.checkTemporaryTablesAndFilesort(plan, tips);
            // 检查表连接
            this.checkTableJoins(plan, tips);
            // 检查WHERE子句
            this.checkWhereConditions(plan, tips);
            // 检查LIMIT优化
            this.checkLimitOptimization(plan, tips);
        }
        catch (error) {
            logger_1.default.error('生成查询优化建议时出错', { error });
            // 发生错误时返回基本建议
            if (tips.length === 0) {
                tips.push('无法对此查询生成详细的优化建议');
            }
        }
        return tips;
    }
    /**
     * 执行性能分析，提取关键指标
     * @param plan 查询执行计划
     * @returns 性能分析结果
     */
    analyzePerformance(plan) {
        try {
            const tablesScanned = this.getTablesFromPlan(plan);
            const totalRows = plan.estimatedRows;
            const accessTypes = this.getAccessTypes(plan);
            const indexesUsed = this.getIndexesUsed(plan);
            const joinTypes = this.getJoinTypes(plan);
            // 计算估算的I/O成本
            let ioLoad = 'low';
            if (totalRows > 1000000 || accessTypes.includes('ALL')) {
                ioLoad = 'high';
            }
            else if (totalRows > 10000 || accessTypes.includes('index')) {
                ioLoad = 'medium';
            }
            // 计算索引使用效率
            const indexEfficiency = this.calculateIndexEfficiency(plan);
            // 计算总体性能评分 (0-100)
            const performanceScore = this.calculatePerformanceScore(plan);
            return {
                tablesScanned,
                totalRows,
                accessTypes,
                indexesUsed,
                joinTypes,
                ioLoad,
                indexEfficiency,
                performanceScore,
                bottlenecks: this.identifyBottlenecks(plan)
            };
        }
        catch (error) {
            logger_1.default.error('分析查询性能时出错', { error });
            return {
                error: '无法完成性能分析',
                tablesScanned: this.getTablesFromPlan(plan),
                totalRows: plan.estimatedRows
            };
        }
    }
    /**
     * 从计划中提取表名列表
     */
    getTablesFromPlan(plan) {
        const tables = new Set();
        for (const node of plan.planNodes) {
            if (node.table) {
                tables.add(node.table);
            }
        }
        return Array.from(tables);
    }
    /**
     * 从计划中提取访问类型列表
     */
    getAccessTypes(plan) {
        return plan.planNodes.map(node => node.type);
    }
    /**
     * 从计划中提取使用的索引列表
     */
    getIndexesUsed(plan) {
        const indexes = new Set();
        for (const node of plan.planNodes) {
            if (node.key) {
                indexes.add(node.key);
            }
        }
        return Array.from(indexes);
    }
    /**
     * 获取连接类型
     */
    getJoinTypes(plan) {
        // 对于MySQL，连接类型通常在extra字段中
        const joinTypes = new Set();
        for (const node of plan.planNodes) {
            if (node.extra) {
                if (node.extra.includes('Using join buffer')) {
                    joinTypes.add('block nested loop');
                }
                else if (node.extra.includes('Using index for')) {
                    joinTypes.add('index join');
                }
            }
        }
        return Array.from(joinTypes);
    }
    /**
     * 检查全表扫描
     */
    checkFullTableScans(plan, tips) {
        const fullScanNodes = plan.planNodes.filter(node => node.type === 'ALL');
        if (fullScanNodes.length > 0) {
            tips.push(`检测到${fullScanNodes.length}个全表扫描操作，考虑为表 ${fullScanNodes.map(n => n.table).join(', ')} 添加适当的索引`);
            // 提供更具体的建议
            for (const node of fullScanNodes) {
                if (node.extra && node.extra.includes('Using where')) {
                    tips.push(`为表 ${node.table} 的WHERE子句中使用的列添加索引可能会提高性能`);
                }
            }
        }
    }
    /**
     * 检查索引使用情况
     */
    checkIndexUsage(plan, tips) {
        // 检查没有使用索引但扫描行数大的节点
        const noIndexNodes = plan.planNodes.filter(node => !node.key && node.rows > 100 && node.type !== 'system');
        if (noIndexNodes.length > 0) {
            tips.push(`表 ${noIndexNodes.map(n => n.table).join(', ')} 没有使用索引，且扫描行数较大`);
        }
        // 检查可能的索引但未使用
        const missedIndexNodes = plan.planNodes.filter(node => !node.key && node.possibleKeys && node.rows > 10);
        if (missedIndexNodes.length > 0) {
            tips.push(`有可用索引但未被优化器选择: ${missedIndexNodes.map(n => n.table).join(', ')}`);
        }
    }
    /**
     * 检查临时表和文件排序
     */
    checkTemporaryTablesAndFilesort(plan, tips) {
        const tempTableNodes = plan.planNodes.filter(node => node.extra && node.extra.includes('Using temporary'));
        if (tempTableNodes.length > 0) {
            tips.push('查询使用了临时表，这可能导致性能下降。考虑重写查询或添加适当的索引');
            if (tempTableNodes.some(node => node.extra && node.extra.includes('Using filesort'))) {
                tips.push('临时表上执行了文件排序，这会显著影响性能。考虑在ORDER BY列上添加索引');
            }
        }
        else {
            // 单独检查文件排序
            const fileSortNodes = plan.planNodes.filter(node => node.extra && node.extra.includes('Using filesort'));
            if (fileSortNodes.length > 0) {
                tips.push('查询使用了文件排序，考虑在ORDER BY列上添加索引以避免排序操作');
            }
        }
    }
    /**
     * 检查表连接
     */
    checkTableJoins(plan, tips) {
        if (plan.planNodes.length <= 1) {
            return; // 无连接查询
        }
        // 检查嵌套循环连接
        const nestedLoopNodes = plan.planNodes.filter(node => node.extra && node.extra.includes('Using join buffer'));
        if (nestedLoopNodes.length > 0) {
            tips.push('查询使用了嵌套循环连接，这可能在大型表上效率低下。确保在连接列上有适当的索引');
        }
        // 检查驱动表选择
        const firstNode = plan.planNodes[0];
        if (firstNode.rows > 1000 && plan.planNodes.some(node => node.rows < firstNode.rows / 10)) {
            tips.push('优化器可能没有选择最优的驱动表。考虑使用STRAIGHT_JOIN并首先指定较小的表');
        }
    }
    /**
     * 检查WHERE条件
     */
    checkWhereConditions(plan, tips) {
        const indexRangeNodes = plan.planNodes.filter(node => node.type === 'range');
        if (indexRangeNodes.length > 0) {
            if (indexRangeNodes.some(node => node.rows > 1000)) {
                tips.push('索引范围扫描仍返回大量行，考虑细化WHERE条件或创建更精确的复合索引');
            }
        }
        // 检查索引有效性
        plan.planNodes.forEach(node => {
            if (node.key && node.extra && node.extra.includes('Using index condition')) {
                tips.push(`表 ${node.table} 使用了索引条件下推（ICP），这表明索引不能完全满足查询条件`);
            }
        });
    }
    /**
     * 检查LIMIT优化
     */
    checkLimitOptimization(plan, tips) {
        // 检查是否存在排序+LIMIT模式
        const sortLimitNodes = plan.planNodes.filter(node => node.extra && node.extra.includes('Using filesort'));
        if (sortLimitNodes.length > 0 &&
            plan.query.toLowerCase().includes('limit') &&
            plan.query.toLowerCase().includes('order by')) {
            tips.push('查询包含ORDER BY和LIMIT，但可能需要扫描和排序大量数据。考虑添加ORDER BY列的索引或使用延迟连接优化');
        }
    }
    /**
     * 计算索引使用效率
     */
    calculateIndexEfficiency(plan) {
        let totalNodes = plan.planNodes.length;
        let nodesUsingIndexes = plan.planNodes.filter(node => node.key).length;
        return totalNodes > 0 ? (nodesUsingIndexes / totalNodes) * 100 : 0;
    }
    /**
     *
     * 计算总体性能评分
     */
    calculatePerformanceScore(plan) {
        // 基础分数为100
        let score = 100;
        // 扣分项：全表扫描
        const fullScanNodes = plan.planNodes.filter(node => node.type === 'ALL');
        score -= fullScanNodes.length * 20;
        // 扣分项：文件排序和临时表
        const sortAndTempNodes = plan.planNodes.filter(node => node.extra && (node.extra.includes('Using filesort') || node.extra.includes('Using temporary')));
        score -= sortAndTempNodes.length * 15;
        // 扣分项：估计行数过大
        if (plan.estimatedRows > 1000000) {
            score -= 25;
        }
        else if (plan.estimatedRows > 100000) {
            score -= 15;
        }
        else if (plan.estimatedRows > 10000) {
            score -= 5;
        }
        // 扣分项：无索引的JOIN
        const badJoinNodes = plan.planNodes.filter(node => !node.key && node.type !== 'system' && plan.planNodes.length > 1);
        score -= badJoinNodes.length * 10;
        // 限制分数范围在0-100之间
        return Math.max(0, Math.min(100, score));
    }
    /**
     * 识别查询中的瓶颈
     */
    identifyBottlenecks(plan) {
        const bottlenecks = [];
        // 检查主要瓶颈
        const fullScanNodes = plan.planNodes.filter(node => node.type === 'ALL');
        if (fullScanNodes.length > 0) {
            bottlenecks.push('全表扫描');
        }
        const tempTableNodes = plan.planNodes.filter(node => node.extra && node.extra.includes('Using temporary'));
        if (tempTableNodes.length > 0) {
            bottlenecks.push('使用临时表');
        }
        const filesortNodes = plan.planNodes.filter(node => node.extra && node.extra.includes('Using filesort'));
        if (filesortNodes.length > 0) {
            bottlenecks.push('文件排序');
        }
        // 检查是否有大量数据处理
        if (plan.estimatedRows > 100000) {
            bottlenecks.push('处理大量数据');
        }
        // 检查不良连接
        if (plan.planNodes.length > 1 &&
            plan.planNodes.some(node => node.type === 'ALL' || node.rows > 10000)) {
            bottlenecks.push('低效的表连接');
        }
        return bottlenecks;
    }
}
exports.MySQLPlanAnalyzer = MySQLPlanAnalyzer;
//# sourceMappingURL=mysql-plan-analyzer.js.map