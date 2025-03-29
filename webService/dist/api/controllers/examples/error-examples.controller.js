"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demonstrateQueryError = exports.demonstrateDataSourceError = exports.demonstrateDatabaseError = exports.demonstrateValidationError = exports.demonstrateApiErrors = void 0;
const errors_1 = require("../../../utils/errors");
/**
 * 展示API错误的各种用法
 */
const demonstrateApiErrors = (req, res, next) => {
    const errorType = req.query.type;
    switch (errorType) {
        case 'badRequest':
            throw errors_1.ApiError.badRequest('无效的请求参数', { field: 'username', issue: '长度必须大于3个字符' });
        case 'unauthorized':
            throw errors_1.ApiError.unauthorized('用户未登录或会话已过期');
        case 'forbidden':
            throw errors_1.ApiError.forbidden('没有权限访问此资源');
        case 'notFound':
            throw errors_1.ApiError.notFound('请求的资源不存在');
        case 'conflict':
            throw errors_1.ApiError.conflict('资源已存在', { resource: 'user', identifier: req.query.id });
        case 'tooManyRequests':
            throw errors_1.ApiError.tooManyRequests('请求频率过高，请稍后再试');
        case 'internal':
            throw errors_1.ApiError.internal('服务器内部错误', { context: '处理用户请求时发生未知错误' });
        default:
            // 正常响应
            return res.json({
                message: '错误演示API',
                description: '使用?type=xxx查询参数测试不同类型的错误',
                availableTypes: [
                    'badRequest', 'unauthorized', 'forbidden', 'notFound',
                    'conflict', 'tooManyRequests', 'internal', 'validation',
                    'database', 'dataSource', 'query'
                ]
            });
    }
};
exports.demonstrateApiErrors = demonstrateApiErrors;
/**
 * 展示验证错误用法
 */
const demonstrateValidationError = (req, res, next) => {
    const errors = [
        { field: 'username', message: '用户名不能为空' },
        { field: 'password', message: '密码必须包含字母和数字' },
        { field: 'email', message: '邮箱格式不正确' }
    ];
    // 创建新的ValidationError实例
    const error = new errors_1.ValidationError('表单验证失败', errors_1.ERROR_CODES.VALIDATION_FAILED);
    error.addDetails(errors);
    throw error;
};
exports.demonstrateValidationError = demonstrateValidationError;
/**
 * 展示数据库错误用法
 */
const demonstrateDatabaseError = (req, res, next) => {
    const errorType = req.query.subtype;
    switch (errorType) {
        case 'connection':
            throw errors_1.DatabaseError.connectionError('无法连接到数据库', {
                dbName: 'main',
                host: 'localhost'
            });
        case 'query':
            throw errors_1.DatabaseError.queryError('SQL查询执行失败', {
                sql: 'SELECT * FROM non_existent_table'
            });
        case 'transaction':
            throw errors_1.DatabaseError.transactionError('事务执行失败', {
                operation: '创建用户和关联资料'
            });
        case 'notFound':
            throw errors_1.DatabaseError.recordNotFound('数据库记录不存在', {
                table: 'users',
                id: req.query.id
            });
        default:
            // 创建新的DatabaseError实例
            const error = new errors_1.DatabaseError('数据库操作错误', errors_1.ERROR_CODES.DATABASE_ERROR);
            throw error;
    }
};
exports.demonstrateDatabaseError = demonstrateDatabaseError;
/**
 * 展示数据源错误用法
 */
const demonstrateDataSourceError = (req, res, next) => {
    const errorType = req.query.subtype;
    switch (errorType) {
        case 'connection':
            throw errors_1.DataSourceError.connectionFailed('无法连接到数据源', {
                source: 'MySQL',
                host: 'db.example.com'
            });
        case 'authentication':
            throw errors_1.DataSourceError.authenticationFailed('数据源认证失败', {
                source: 'PostgreSQL'
            });
        case 'notFound':
            throw errors_1.DataSourceError.notFound('数据源不存在', {
                id: req.query.id
            });
        default:
            // 创建新的DataSourceError实例
            const error = new errors_1.DataSourceError('数据源操作错误', errors_1.ERROR_CODES.DATASOURCE_ERROR);
            throw error;
    }
};
exports.demonstrateDataSourceError = demonstrateDataSourceError;
/**
 * 展示查询错误用法
 */
const demonstrateQueryError = (req, res, next) => {
    const errorType = req.query.subtype;
    switch (errorType) {
        case 'syntax':
            throw errors_1.QueryError.syntaxError('SQL语法错误', {
                sql: 'SELECT * FORM users',
                position: 7
            });
        case 'timeout':
            throw errors_1.QueryError.timeout('查询执行超时', {
                sql: 'SELECT * FROM large_table',
                executionTime: '30s',
                timeout: '15s'
            });
        case 'permission':
            throw errors_1.QueryError.permissionDenied('无权执行此查询', {
                table: 'sensitive_data',
                operation: 'SELECT'
            });
        default:
            // 创建新的QueryError实例
            const error = new errors_1.QueryError('查询执行失败', errors_1.ERROR_CODES.QUERY_EXECUTION_ERROR);
            throw error;
    }
};
exports.demonstrateQueryError = demonstrateQueryError;
//# sourceMappingURL=error-examples.controller.js.map