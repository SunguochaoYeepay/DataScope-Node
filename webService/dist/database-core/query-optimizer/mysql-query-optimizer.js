"use strict";
/**
 * MySQL查询优化器
 * 提供查询分析和优化建议
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLQueryOptimizer = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * 查询模式类型
 */
var QueryPattern;
(function (QueryPattern) {
    QueryPattern["SELECT_ALL"] = "select_all";
    QueryPattern["WILDCARD_LIKE"] = "wildcard_like";
    QueryPattern["IN_SUBQUERY"] = "in_subquery";
    QueryPattern["MULTIPLE_JOINS"] = "multiple_joins";
    QueryPattern["GROUP_BY_NO_INDEX"] = "group_by_no_index";
    QueryPattern["ORDER_BY_NO_INDEX"] = "order_by_no_index";
    QueryPattern["LIMIT_WITHOUT_ORDER"] = "limit_without_order";
    QueryPattern["COUNT_ALL"] = "count_all";
    QueryPattern["TEMP_TABLE"] = "temp_table";
    QueryPattern["FILE_SORT"] = "file_sort";
    QueryPattern["FULL_TABLE_SCAN"] = "full_table_scan";
})(QueryPattern || (QueryPattern = {}));
class MySQLQueryOptimizer {
    /**
     * 分析查询并生成优化建议
     * @param queryPlan 查询执行计划
     * @param originalSql 原始SQL查询
     * @returns 优化建议列表
     */
    analyzeSql(queryPlan, originalSql) {
        logger_1.default.debug('开始分析MySQL查询', { query: originalSql.substring(0, 100) + '...' });
        const suggestions = [];
        try {
            // 分析查询模式
            const patterns = this.identifyQueryPatterns(queryPlan, originalSql);
            // 基于模式生成建议
            if (patterns.includes(QueryPattern.SELECT_ALL)) {
                suggestions.push(this.generateSelectColumnsRecommendation(originalSql));
            }
            if (patterns.includes(QueryPattern.WILDCARD_LIKE)) {
                suggestions.push(this.generateLikeRecommendation(originalSql));
            }
            if (patterns.includes(QueryPattern.IN_SUBQUERY)) {
                suggestions.push(this.generateSubqueryRecommendation(originalSql));
            }
            if (patterns.includes(QueryPattern.FULL_TABLE_SCAN)) {
                suggestions.push(this.generateIndexRecommendation(queryPlan, originalSql));
            }
            if (patterns.includes(QueryPattern.MULTIPLE_JOINS)) {
                suggestions.push(this.generateJoinOptimizationRecommendation(queryPlan, originalSql));
            }
            // 补充基于计划的建议
            this.addPlanBasedSuggestions(queryPlan, originalSql, suggestions);
            logger_1.default.debug('MySQL查询分析完成', { suggestionCount: suggestions.length });
            return suggestions;
        }
        catch (error) {
            logger_1.default.error('分析MySQL查询时出错', { error });
            // 返回一般性建议
            return [{
                    type: 'general',
                    description: '无法完全分析查询，提供通用优化建议',
                    suggestedFix: '检查查询语法并尝试简化查询结构',
                    originalSql
                }];
        }
    }
    /**
     * 生成优化后的SQL
     * @param originalSql 原始SQL
     * @param suggestions 优化建议
     * @returns 优化后的SQL
     */
    generateOptimizedSql(originalSql, suggestions) {
        logger_1.default.debug('开始生成优化SQL');
        try {
            // 从中选择最有价值的建议应用
            // 实际应用中这里可能需要更复杂的逻辑
            for (const suggestion of suggestions) {
                if (suggestion.optimizedSql) {
                    logger_1.default.debug('应用优化建议', {
                        type: suggestion.type,
                        description: suggestion.description
                    });
                    return suggestion.optimizedSql;
                }
            }
            // 如果没有直接的SQL优化，提供注释说明
            return `/* 
 * 优化建议:
 * ${suggestions.map(s => s.description).join('\n * ')}
 */\n${originalSql}`;
        }
        catch (error) {
            logger_1.default.error('生成优化SQL时出错', { error });
            return originalSql;
        }
    }
    /**
     * 识别查询模式
     * @param queryPlan 查询执行计划
     * @param sql 原始SQL
     * @returns 识别出的模式列表
     */
    identifyQueryPatterns(queryPlan, sql) {
        const patterns = [];
        const sqlLower = sql.toLowerCase();
        // 检查 SELECT *
        if (sqlLower.includes('select *')) {
            patterns.push(QueryPattern.SELECT_ALL);
        }
        // 检查 LIKE '%...%'
        if (sqlLower.includes('like \'%') || sqlLower.includes('like "%')) {
            patterns.push(QueryPattern.WILDCARD_LIKE);
        }
        // 检查子查询
        if (sqlLower.includes(' in (select ')) {
            patterns.push(QueryPattern.IN_SUBQUERY);
        }
        // 检查多表连接
        const joinCount = (sqlLower.match(/join/g) || []).length;
        if (joinCount >= 3) {
            patterns.push(QueryPattern.MULTIPLE_JOINS);
        }
        // 检查执行计划中的模式
        if (queryPlan.planNodes) {
            // 检查全表扫描
            if (queryPlan.planNodes.some(node => node.type === 'ALL')) {
                patterns.push(QueryPattern.FULL_TABLE_SCAN);
            }
            // 检查文件排序
            if (queryPlan.planNodes.some(node => node.extra && node.extra.includes('Using filesort'))) {
                patterns.push(QueryPattern.FILE_SORT);
            }
            // 检查临时表
            if (queryPlan.planNodes.some(node => node.extra && node.extra.includes('Using temporary'))) {
                patterns.push(QueryPattern.TEMP_TABLE);
            }
        }
        // 检查GROUP BY
        if (sqlLower.includes('group by') && patterns.includes(QueryPattern.TEMP_TABLE)) {
            patterns.push(QueryPattern.GROUP_BY_NO_INDEX);
        }
        // 检查ORDER BY
        if (sqlLower.includes('order by') && patterns.includes(QueryPattern.FILE_SORT)) {
            patterns.push(QueryPattern.ORDER_BY_NO_INDEX);
        }
        // 检查LIMIT无ORDER BY
        if (sqlLower.includes('limit') && !sqlLower.includes('order by')) {
            patterns.push(QueryPattern.LIMIT_WITHOUT_ORDER);
        }
        // 检查COUNT(*)
        if (sqlLower.includes('count(*)') && !sqlLower.includes('where')) {
            patterns.push(QueryPattern.COUNT_ALL);
        }
        return patterns;
    }
    /**
     * 生成SELECT列建议
     * @param sql 原始SQL
     * @returns 优化建议
     */
    generateSelectColumnsRecommendation(sql) {
        return {
            type: 'select_columns',
            description: '避免使用SELECT *，明确指定需要的列',
            suggestedFix: '替换SELECT * 为明确的列列表',
            originalSql: sql,
            estimatedImprovement: 15
        };
    }
    /**
     * 生成LIKE通配符建议
     * @param sql 原始SQL
     * @returns 优化建议
     */
    generateLikeRecommendation(sql) {
        return {
            type: 'like_optimization',
            description: '前导通配符（如LIKE \'%text\'）会阻止索引使用',
            suggestedFix: '考虑使用全文索引或去除前导通配符',
            originalSql: sql,
            estimatedImprovement: 30
        };
    }
    /**
     * 生成子查询优化建议
     * @param sql 原始SQL
     * @returns 优化建议
     */
    generateSubqueryRecommendation(sql) {
        return {
            type: 'subquery_optimization',
            description: 'IN子查询可能性能较差，考虑使用JOIN替代',
            suggestedFix: '将IN (SELECT...)改为JOIN操作',
            originalSql: sql,
            estimatedImprovement: 25
        };
    }
    /**
     * 生成索引建议
     * @param queryPlan 查询执行计划
     * @param sql 原始SQL
     * @returns 优化建议
     */
    generateIndexRecommendation(queryPlan, sql) {
        // 查找进行全表扫描的表
        const fullScanTables = queryPlan.planNodes?.filter(node => node.type === 'ALL')
            .map(node => node.table) || [];
        let tableStr = fullScanTables.join(', ');
        if (fullScanTables.length > 2) {
            tableStr = `${fullScanTables.slice(0, 2).join(', ')} 等`;
        }
        return {
            type: 'missing_index',
            description: `表 ${tableStr} 进行了全表扫描`,
            suggestedFix: '为WHERE和JOIN条件中使用的列添加合适的索引',
            originalSql: sql,
            estimatedImprovement: 50
        };
    }
    /**
     * 生成连接优化建议
     * @param queryPlan 查询执行计划
     * @param sql 原始SQL
     * @returns 优化建议
     */
    generateJoinOptimizationRecommendation(queryPlan, sql) {
        return {
            type: 'join_optimization',
            description: '查询包含多表连接，可能影响性能',
            suggestedFix: '检查连接顺序，确保小表在内层，为连接条件添加索引',
            originalSql: sql,
            estimatedImprovement: 35
        };
    }
    /**
     * 添加基于执行计划的具体建议
     * @param queryPlan 查询执行计划
     * @param sql 原始SQL
     * @param suggestions 现有建议列表
     */
    addPlanBasedSuggestions(queryPlan, sql, suggestions) {
        // 使用计划中的优化提示
        if (queryPlan.optimizationTips && queryPlan.optimizationTips.length > 0) {
            queryPlan.optimizationTips.forEach((tip, index) => {
                suggestions.push({
                    type: `plan_based_tip_${index}`,
                    description: tip,
                    suggestedFix: '根据执行计划分析结果进行优化',
                    originalSql: sql,
                    estimatedImprovement: 20
                });
            });
        }
        // 从警告生成建议
        if (queryPlan.warnings && queryPlan.warnings.length > 0) {
            queryPlan.warnings.forEach((warning, index) => {
                // 过滤掉已经转化为提示的警告
                const alreadyCovered = suggestions.some(s => s.description.includes(warning));
                if (!alreadyCovered) {
                    suggestions.push({
                        type: `plan_warning_${index}`,
                        description: `警告: ${warning}`,
                        suggestedFix: '解决执行计划中标识的问题',
                        originalSql: sql,
                        estimatedImprovement: 15
                    });
                }
            });
        }
    }
}
exports.MySQLQueryOptimizer = MySQLQueryOptimizer;
//# sourceMappingURL=mysql-query-optimizer.js.map