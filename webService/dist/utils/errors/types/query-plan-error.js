"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPlanError = void 0;
const app_error_1 = require("../app-error");
const error_codes_1 = require("../error-codes");
/**
 * 查询计划错误类
 * 用于处理查询执行计划生成和分析过程中的错误
 */
class QueryPlanError extends app_error_1.AppError {
    /**
     * 创建查询计划错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param details 错误详情
     */
    constructor(message, errorCode = error_codes_1.ERROR_CODES.QUERY_EXECUTION_ERROR, statusCode = 500, details) {
        super(message, errorCode, statusCode, 'QueryPlanError', details);
    }
    /**
     * 创建查询计划生成失败错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static generationFailed(message = '无法生成查询执行计划', details) {
        return new QueryPlanError(message, error_codes_1.ERROR_CODES.QUERY_EXECUTION_ERROR, 500, details);
    }
    /**
     * 创建查询计划解析错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static parseError(message = '查询执行计划解析失败', details) {
        return new QueryPlanError(message, error_codes_1.ERROR_CODES.QUERY_SYNTAX_ERROR, 400, details);
    }
    /**
     * 创建查询计划分析错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static analysisError(message = '查询执行计划分析失败', details) {
        return new QueryPlanError(message, error_codes_1.ERROR_CODES.QUERY_EXECUTION_ERROR, 500, details);
    }
    /**
     * 创建不支持的数据库类型错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static unsupportedDatabaseType(message = '不支持的数据库类型', details) {
        return new QueryPlanError(message, error_codes_1.ERROR_CODES.UNSUPPORTED_TYPE, 400, details);
    }
    /**
     * 创建查询计划检索错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static retrievalError(message = '无法检索查询执行计划', details) {
        return new QueryPlanError(message, error_codes_1.ERROR_CODES.QUERY_RESOURCE_NOT_FOUND, 404, details);
    }
    /**
     * 创建查询计划存储错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static storageError(message = '无法存储查询执行计划', details) {
        return new QueryPlanError(message, error_codes_1.ERROR_CODES.DATABASE_ERROR, 500, details);
    }
    /**
     * 创建查询不支持执行计划错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static unsupportedQuery(message = '此类型的查询不支持生成执行计划', details) {
        return new QueryPlanError(message, error_codes_1.ERROR_CODES.INVALID_SQL, 400, details);
    }
}
exports.QueryPlanError = QueryPlanError;
//# sourceMappingURL=query-plan-error.js.map