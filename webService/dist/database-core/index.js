"use strict";
/**
 * 数据库核心功能入口文件
 * 提供获取查询计划转换器、分析器和优化器的工厂函数
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryPlanConverter = getQueryPlanConverter;
exports.getQueryPlanAnalyzer = getQueryPlanAnalyzer;
exports.getQueryOptimizer = getQueryOptimizer;
const mysql_query_plan_converter_1 = require("./query-plan/mysql-query-plan-converter");
const mysql_plan_analyzer_1 = require("./query-plan/mysql-plan-analyzer");
const mysql_query_optimizer_1 = require("./query-optimizer/mysql-query-optimizer");
/**
 * 获取查询计划转换器
 * @param dbType 数据库类型
 * @returns 查询计划转换器实例
 */
function getQueryPlanConverter(dbType) {
    const lowerType = dbType.toLowerCase();
    switch (lowerType) {
        case 'mysql':
            return new mysql_query_plan_converter_1.MySQLQueryPlanConverter();
        case 'postgresql':
            // 临时使用MySQL转换器
            console.warn('PostgreSQL查询计划转换器尚未实现，临时使用MySQL转换器');
            return new mysql_query_plan_converter_1.MySQLQueryPlanConverter();
        case 'sqlserver':
            // 临时使用MySQL转换器
            console.warn('SQL Server查询计划转换器尚未实现，临时使用MySQL转换器');
            return new mysql_query_plan_converter_1.MySQLQueryPlanConverter();
        case 'oracle':
            // 临时使用MySQL转换器
            console.warn('Oracle查询计划转换器尚未实现，临时使用MySQL转换器');
            return new mysql_query_plan_converter_1.MySQLQueryPlanConverter();
        default:
            throw new Error(`不支持的数据库类型: ${dbType}`);
    }
}
/**
 * 获取查询计划分析器
 * @param dbType 数据库类型
 * @returns 查询计划分析器实例
 */
function getQueryPlanAnalyzer(dbType) {
    const lowerType = dbType.toLowerCase();
    switch (lowerType) {
        case 'mysql':
            return new mysql_plan_analyzer_1.MySQLPlanAnalyzer();
        case 'postgresql':
            // 临时使用MySQL分析器
            console.warn('PostgreSQL查询计划分析器尚未实现，临时使用MySQL分析器');
            return new mysql_plan_analyzer_1.MySQLPlanAnalyzer();
        case 'sqlserver':
            // 临时使用MySQL分析器
            console.warn('SQL Server查询计划分析器尚未实现，临时使用MySQL分析器');
            return new mysql_plan_analyzer_1.MySQLPlanAnalyzer();
        case 'oracle':
            // 临时使用MySQL分析器
            console.warn('Oracle查询计划分析器尚未实现，临时使用MySQL分析器');
            return new mysql_plan_analyzer_1.MySQLPlanAnalyzer();
        default:
            throw new Error(`不支持的数据库类型: ${dbType}`);
    }
}
/**
 * 获取SQL查询优化器
 * @param dbType 数据库类型
 * @returns SQL查询优化器实例
 */
function getQueryOptimizer(dbType) {
    const lowerType = dbType.toLowerCase();
    switch (lowerType) {
        case 'mysql':
            return new mysql_query_optimizer_1.MySQLQueryOptimizer();
        case 'postgresql':
            // 临时使用MySQL优化器
            console.warn('PostgreSQL查询优化器尚未实现，临时使用MySQL优化器');
            return new mysql_query_optimizer_1.MySQLQueryOptimizer();
        case 'sqlserver':
            // 临时使用MySQL优化器
            console.warn('SQL Server查询优化器尚未实现，临时使用MySQL优化器');
            return new mysql_query_optimizer_1.MySQLQueryOptimizer();
        case 'oracle':
            // 临时使用MySQL优化器
            console.warn('Oracle查询优化器尚未实现，临时使用MySQL优化器');
            return new mysql_query_optimizer_1.MySQLQueryOptimizer();
        default:
            throw new Error(`不支持的数据库类型: ${dbType}`);
    }
}
//# sourceMappingURL=index.js.map