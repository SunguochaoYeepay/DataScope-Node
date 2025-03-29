"use strict";
/**
 * MySQL查询计划分析器
 * 专门用于分析MySQL数据库的查询执行计划
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLPlanAnalyzer = void 0;
class MySQLPlanAnalyzer {
    /**
     * 分析MySQL查询计划，提取关键性能指标
     * @param plan 查询执行计划
     * @returns 性能分析结果
     */
    analyzePerformance(plan) {
        return {
            // 查询估计成本
            estimatedCost: plan.estimatedCost,
            // 估计扫描的行数
            estimatedRows: plan.estimatedRows,
            // 扫描的表数量
            tablesScanned: this.getTablesScanned(plan).length,
            // 是否使用了索引
            usesIndexes: this.checkIfUsesIndexes(plan),
            // 是否有全表扫描
            hasFullTableScan: this.hasFullTableScan(plan),
            // 是否使用了临时表
            usesTemporaryTable: this.checkIfUsesTemporaryTable(plan),
            // 是否使用了文件排序
            usesFileSort: this.checkIfUsesFileSort(plan),
            // 性能得分(0-100)
            performanceScore: this.calculatePerformanceScore(plan),
            // 详细分析
            details: this.getDetailedAnalysis(plan)
        };
    }
    /**
     * 提供深度优化建议
     * @param plan 查询执行计划
     * @returns 优化建议列表
     */
    provideOptimizationSuggestions(plan) {
        const suggestions = [];
        // 分析索引使用情况
        this.analyzeIndexUsage(plan, suggestions);
        // 分析查询结构
        this.analyzeQueryStructure(plan, suggestions);
        // 分析排序和分组
        this.analyzeSortingAndGrouping(plan, suggestions);
        // 添加更具体的建议
        this.addDatabaseSpecificSuggestions(plan, suggestions);
        return suggestions;
    }
    /**
     * 获取执行计划中的表列表
     */
    getTablesScanned(plan) {
        const tables = new Set();
        for (const node of plan.planNodes) {
            if (node.table) {
                tables.add(node.table);
            }
        }
        return Array.from(tables);
    }
    /**
     * 检查执行计划是否使用了索引
     */
    checkIfUsesIndexes(plan) {
        return plan.planNodes.some(node => node.key && node.key !== 'NULL');
    }
    /**
     * 检查是否有全表扫描
     */
    hasFullTableScan(plan) {
        return plan.planNodes.some(node => node.type === 'ALL');
    }
    /**
     * 检查执行计划是否使用了临时表
     */
    checkIfUsesTemporaryTable(plan) {
        return plan.planNodes.some(node => node.extra && node.extra.includes('Using temporary'));
    }
    /**
     * 检查执行计划是否使用了文件排序
     */
    checkIfUsesFileSort(plan) {
        return plan.planNodes.some(node => node.extra && node.extra.includes('Using filesort'));
    }
    /**
     * 计算查询性能得分(0-100)
     */
    calculatePerformanceScore(plan) {
        let score = 100;
        // 有全表扫描，扣15分
        if (this.hasFullTableScan(plan)) {
            score -= 15;
        }
        // 没有使用索引，扣20分
        if (!this.checkIfUsesIndexes(plan)) {
            score -= 20;
        }
        // 使用临时表，扣10分
        if (this.checkIfUsesTemporaryTable(plan)) {
            score -= 10;
        }
        // 使用文件排序，扣10分
        if (this.checkIfUsesFileSort(plan)) {
            score -= 10;
        }
        // 根据估计行数扣分
        if (plan.estimatedRows > 1000000) {
            score -= 15; // 超过一百万行，扣15分
        }
        else if (plan.estimatedRows > 100000) {
            score -= 10; // 超过十万行，扣10分
        }
        else if (plan.estimatedRows > 10000) {
            score -= 5; // 超过一万行，扣5分
        }
        // 确保分数在0-100之间
        return Math.max(0, Math.min(100, score));
    }
    /**
     * 获取详细分析信息
     */
    getDetailedAnalysis(plan) {
        // 分析每个表的扫描情况
        const tableAnalysis = plan.planNodes.map(node => {
            return {
                table: node.table,
                scanType: node.type,
                usedIndex: node.key || '无',
                rows: node.rows,
                filtered: node.filtered,
                issues: this.getNodeIssues(node)
            };
        });
        return {
            tableAnalysis,
            complexityLevel: this.getQueryComplexityLevel(plan),
            bottlenecks: this.identifyBottlenecks(plan)
        };
    }
    /**
     * 获取节点存在的问题
     */
    getNodeIssues(node) {
        const issues = [];
        if (node.type === 'ALL') {
            issues.push('全表扫描');
        }
        if (!node.key && node.rows > 100) {
            issues.push('未使用索引且行数较多');
        }
        if (node.extra) {
            if (node.extra.includes('Using temporary')) {
                issues.push('使用临时表');
            }
            if (node.extra.includes('Using filesort')) {
                issues.push('使用文件排序');
            }
            if (node.extra.includes('Using where')) {
                // 如果同时有Using where但没有合适的索引
                if (!node.key || node.key === 'NULL') {
                    issues.push('条件过滤无索引支持');
                }
            }
        }
        return issues;
    }
    /**
     * 获取查询复杂度级别
     */
    getQueryComplexityLevel(plan) {
        const nodeCount = plan.planNodes.length;
        const hasJoin = plan.planNodes.some(node => node.type.includes('join'));
        const hasSubquery = plan.planNodes.some(node => node.selectType !== 'SIMPLE');
        if (hasSubquery && hasJoin && nodeCount > 5) {
            return '高';
        }
        else if ((hasJoin && nodeCount > 3) || hasSubquery) {
            return '中';
        }
        else {
            return '低';
        }
    }
    /**
     * 识别性能瓶颈
     */
    identifyBottlenecks(plan) {
        const bottlenecks = [];
        // 寻找扫描行数最多的节点
        let maxRowsNode = plan.planNodes[0];
        for (const node of plan.planNodes) {
            if (node.rows > maxRowsNode.rows) {
                maxRowsNode = node;
            }
        }
        if (maxRowsNode.rows > 10000) {
            bottlenecks.push(`表${maxRowsNode.table}扫描行数过多(${maxRowsNode.rows}行)`);
        }
        // 检查是否有不良的连接类型
        const poorJoins = plan.planNodes.filter(node => ['ALL', 'index'].includes(node.type) && node.selectType.includes('JOIN'));
        if (poorJoins.length > 0) {
            bottlenecks.push(`存在${poorJoins.length}个低效连接操作`);
        }
        // 检查是否有非常低的过滤率
        const poorFiltering = plan.planNodes.filter(node => node.filtered < 20);
        if (poorFiltering.length > 0) {
            bottlenecks.push(`${poorFiltering.length}个操作的过滤效率低于20%`);
        }
        return bottlenecks;
    }
    /**
     * 分析索引使用情况并提供建议
     */
    analyzeIndexUsage(plan, suggestions) {
        // 检查未使用索引的表
        const noIndexNodes = plan.planNodes.filter(node => !node.key && node.type === 'ALL' && node.rows > 100);
        if (noIndexNodes.length > 0) {
            for (const node of noIndexNodes) {
                suggestions.push(`为表${node.table}添加适当的索引，当前全表扫描了${node.rows}行`);
            }
        }
        // 检查可能的索引但未使用
        const unusedPossibleKeys = plan.planNodes.filter(node => node.possibleKeys && !node.key);
        if (unusedPossibleKeys.length > 0) {
            for (const node of unusedPossibleKeys) {
                suggestions.push(`表${node.table}有可用索引但未被选择使用，检查WHERE条件和索引列顺序`);
            }
        }
    }
    /**
     * 分析查询结构并提供建议
     */
    analyzeQueryStructure(plan, suggestions) {
        // 检查是否有复杂子查询
        const hasComplexSubquery = plan.planNodes.some(node => node.selectType.includes('SUBQUERY') || node.selectType.includes('DERIVED'));
        if (hasComplexSubquery) {
            suggestions.push('查询包含子查询或派生表，考虑重写为JOIN操作提高性能');
        }
        // 检查连接操作
        const joinNodes = plan.planNodes.filter(node => node.selectType.includes('JOIN'));
        if (joinNodes.length > 3) {
            suggestions.push('查询包含多个连接操作，考虑拆分复杂查询或优化连接顺序');
        }
    }
    /**
     * 分析排序和分组操作并提供建议
     */
    analyzeSortingAndGrouping(plan, suggestions) {
        // 检查文件排序
        const fileSortNodes = plan.planNodes.filter(node => node.extra && node.extra.includes('Using filesort'));
        if (fileSortNodes.length > 0) {
            for (const node of fileSortNodes) {
                suggestions.push(`表${node.table}使用了文件排序，考虑添加包含ORDER BY列的索引`);
            }
        }
        // 检查临时表
        const tempTableNodes = plan.planNodes.filter(node => node.extra && node.extra.includes('Using temporary'));
        if (tempTableNodes.length > 0) {
            for (const node of tempTableNodes) {
                suggestions.push(`表${node.table}使用了临时表，可能是由于GROUP BY或ORDER BY的列没有合适索引`);
            }
        }
    }
    /**
     * 添加数据库特定的优化建议
     */
    addDatabaseSpecificSuggestions(plan, suggestions) {
        // 检查是否有LIMIT但没有ORDER BY索引
        const hasLimitWithoutIndexOrder = plan.planNodes.some(node => node.extra &&
            node.extra.includes('Using filesort') &&
            plan.query.toLowerCase().includes('limit'));
        if (hasLimitWithoutIndexOrder) {
            suggestions.push('查询使用了LIMIT但没有合适的ORDER BY索引，可能导致不一致的结果');
        }
        // 检查是否有不必要的列
        if (plan.query.includes('SELECT *')) {
            suggestions.push('避免使用SELECT *，只选择需要的列以减少I/O和内存使用');
        }
        // 检查是否有大表放在小表前面做连接
        // （这需要估计表大小，这里简化处理）
        const joinOrder = plan.planNodes.filter(node => node.selectType.includes('JOIN'));
        if (joinOrder.length > 1) {
            const firstJoinRows = joinOrder[0]?.rows || 0;
            const otherJoinsWithLessRows = joinOrder.slice(1).filter(node => node.rows < firstJoinRows);
            if (otherJoinsWithLessRows.length > 0) {
                suggestions.push('考虑调整JOIN顺序，将小表放在前面作为驱动表');
            }
        }
    }
}
exports.MySQLPlanAnalyzer = MySQLPlanAnalyzer;
//# sourceMappingURL=mysql-plan-analyzer.js.map