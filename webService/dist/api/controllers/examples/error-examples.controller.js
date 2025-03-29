"use strict";
/**
 * 错误示例控制器，用于演示不同类型的错误和错误处理
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorExamplesIndex = exports.demonstrateSuccess = exports.demonstrateAppError = exports.demonstrateDatabaseError = exports.demonstrateAuthenticationError = exports.demonstrateAuthorizationError = exports.demonstrateValidationError = void 0;
const api_error_1 = require("../../../utils/errors/types/api-error");
const database_error_1 = require("../../../utils/errors/types/database-error");
const app_error_1 = require("../../../utils/errors/app-error");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * 演示验证错误
 * @param req 请求对象
 * @param res 响应对象
 */
const demonstrateValidationError = (req, res) => {
    // 模拟验证错误
    const error = api_error_1.ApiError.badRequest('请求参数验证失败', {
        field: 'username',
        message: '用户名不能为空'
    });
    // 抛出错误，将由错误处理中间件捕获
    throw error;
};
exports.demonstrateValidationError = demonstrateValidationError;
/**
 * 演示授权错误
 * @param req 请求对象
 * @param res 响应对象
 */
const demonstrateAuthorizationError = (req, res) => {
    // 模拟授权错误
    const error = api_error_1.ApiError.forbidden('您没有权限执行此操作', {
        action: 'delete',
        resource: 'user'
    });
    // 抛出错误，将由错误处理中间件捕获
    throw error;
};
exports.demonstrateAuthorizationError = demonstrateAuthorizationError;
/**
 * 演示认证错误
 * @param req 请求对象
 * @param res 响应对象
 */
const demonstrateAuthenticationError = (req, res) => {
    // 模拟认证错误
    const error = api_error_1.ApiError.unauthorized('认证失败，请重新登录');
    // 抛出错误，将由错误处理中间件捕获
    throw error;
};
exports.demonstrateAuthenticationError = demonstrateAuthenticationError;
/**
 * 演示数据库错误
 * @param req 请求对象
 * @param res 响应对象
 */
const demonstrateDatabaseError = (req, res) => {
    const subtype = req.query.subtype;
    if (subtype === 'connection') {
        // 模拟数据库连接错误
        const error = database_error_1.DatabaseError.connectionError('无法连接到数据库', {
            dbName: 'main',
            host: 'localhost'
        });
        throw error;
    }
    else if (subtype === 'query') {
        // 模拟数据库查询错误
        const error = database_error_1.DatabaseError.queryError('SQL语法错误', {
            sql: 'SELCT * FROM users',
            errorCode: 'ER_PARSE_ERROR'
        });
        throw error;
    }
    else if (subtype === 'notFound') {
        // 模拟记录未找到错误
        const id = req.query.id;
        const error = database_error_1.DatabaseError.recordNotFound('数据库记录不存在', {
            table: 'users',
            id: id || 'unknown'
        });
        throw error;
    }
    else {
        // 默认数据库错误
        const error = new database_error_1.DatabaseError('发生了数据库错误', 70000);
        throw error;
    }
};
exports.demonstrateDatabaseError = demonstrateDatabaseError;
/**
 * 演示应用错误
 * @param req 请求对象
 * @param res 响应对象
 */
const demonstrateAppError = (req, res) => {
    // 模拟应用错误
    const error = new app_error_1.AppError('应用程序运行时错误', 50000, 500, 'AppError', {
        module: 'report-generator',
        operation: 'generatePDF'
    });
    // 设置请求路径和ID
    error.path = req.path;
    error.requestId = req.headers['x-request-id'];
    // 抛出错误，将由错误处理中间件捕获
    throw error;
};
exports.demonstrateAppError = demonstrateAppError;
/**
 * 演示处理成功操作 - 返回正常响应
 * @param req 请求对象
 * @param res 响应对象
 */
const demonstrateSuccess = (req, res) => {
    logger_1.default.info('处理成功请求');
    res.status(200).json({
        success: true,
        message: '操作成功',
        data: {
            id: '12345',
            timestamp: new Date()
        }
    });
};
exports.demonstrateSuccess = demonstrateSuccess;
/**
 * 错误演示API主入口
 * @param req 请求对象
 * @param res 响应对象
 */
const errorExamplesIndex = (req, res) => {
    const type = req.query.type;
    if (!type) {
        res.status(200).json({
            message: '错误演示API',
            availableTypes: [
                'badRequest',
                'unauthorized',
                'forbidden',
                'notFound',
                'conflict',
                'tooManyRequests',
                'internal'
            ],
            usage: '添加?type=错误类型来演示不同的错误响应'
        });
        return;
    }
    switch (type) {
        case 'badRequest':
            throw api_error_1.ApiError.badRequest('无效的请求参数', { field: 'username', value: '' });
        case 'unauthorized':
            throw api_error_1.ApiError.unauthorized('身份验证失败');
        case 'forbidden':
            throw api_error_1.ApiError.forbidden('权限不足，禁止访问此资源');
        case 'notFound':
            throw api_error_1.ApiError.notFound('请求的资源不存在');
        case 'conflict':
            throw api_error_1.ApiError.conflict('资源冲突，无法完成请求');
        case 'tooManyRequests':
            throw api_error_1.ApiError.tooManyRequests('请求频率过高，请稍后再试');
        case 'internal':
            throw api_error_1.ApiError.internal('服务器内部错误');
        default:
            throw api_error_1.ApiError.badRequest(`不支持的错误类型: ${type}`);
    }
};
exports.errorExamplesIndex = errorExamplesIndex;
//# sourceMappingURL=error-examples.controller.js.map