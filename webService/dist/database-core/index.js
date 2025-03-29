"use strict";
/**
 * 数据库核心模块入口
 * 导出查询计划分析和优化相关的组件
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLQueryOptimizer = exports.MySQLPlanAnalyzer = exports.MySQLQueryPlanConverter = void 0;
exports.getQueryPlanConverter = getQueryPlanConverter;
exports.getQueryPlanAnalyzer = getQueryPlanAnalyzer;
exports.getQueryOptimizer = getQueryOptimizer;
// 查询计划转换器
const mysql_query_plan_converter_1 = require("./query-plan/mysql-query-plan-converter");
Object.defineProperty(exports, "MySQLQueryPlanConverter", { enumerable: true, get: function () { return mysql_query_plan_converter_1.MySQLQueryPlanConverter; } });
// 查询计划分析器
const mysql_plan_analyzer_1 = require("./query-plan/mysql-plan-analyzer");
Object.defineProperty(exports, "MySQLPlanAnalyzer", { enumerable: true, get: function () { return mysql_plan_analyzer_1.MySQLPlanAnalyzer; } });
// 查询优化器
const mysql_query_optimizer_1 = require("./query-optimizer/mysql-query-optimizer");
Object.defineProperty(exports, "MySQLQueryOptimizer", { enumerable: true, get: function () { return mysql_query_optimizer_1.MySQLQueryOptimizer; } });
// 工厂函数 - 获取指定数据库类型的查询计划转换器
function getQueryPlanConverter(dbType) {
    switch (dbType.toLowerCase()) {
        case 'mysql':
            return new mysql_query_plan_converter_1.MySQLQueryPlanConverter();
        // 未来支持更多数据库类型
        default:
            throw new Error(`不支持的数据库类型: ${dbType}`);
    }
}
// 工厂函数 - 获取指定数据库类型的查询计划分析器
function getQueryPlanAnalyzer(dbType) {
    switch (dbType.toLowerCase()) {
        case 'mysql':
            return new mysql_plan_analyzer_1.MySQLPlanAnalyzer();
        // 未来支持更多数据库类型
        default:
            throw new Error(`不支持的数据库类型: ${dbType}`);
    }
}
// 工厂函数 - 获取指定数据库类型的查询优化器
function getQueryOptimizer(dbType) {
    switch (dbType.toLowerCase()) {
        case 'mysql':
            return new mysql_query_optimizer_1.MySQLQueryOptimizer();
        // 未来支持更多数据库类型
        default:
            throw new Error(`不支持的数据库类型: ${dbType}`);
    }
}
//# sourceMappingURL=index.js.map