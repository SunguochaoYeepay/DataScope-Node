"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
const app_error_1 = require("../app-error");
const error_codes_1 = require("../error-codes");
/**
 * 数据库错误类
 * 用于数据库操作过程中的错误
 */
class DatabaseError extends app_error_1.AppError {
    /**
     * 创建数据库错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param details 错误详情
     */
    constructor(message, errorCode = error_codes_1.ERROR_CODES.DATABASE_ERROR, statusCode = 500, details) {
        super(message, errorCode, statusCode, 'DatabaseError', details);
    }
    /**
     * 创建数据库连接错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static connectionError(message = '数据库连接失败', details) {
        return new DatabaseError(message, error_codes_1.ERROR_CODES.DATABASE_CONNECTION_ERROR, 500, details);
    }
    /**
     * 创建数据库查询错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static queryError(message = '数据库查询执行失败', details) {
        return new DatabaseError(message, error_codes_1.ERROR_CODES.DATABASE_QUERY_ERROR, 500, details);
    }
    /**
     * 创建事务错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static transactionError(message = '数据库事务执行失败', details) {
        return new DatabaseError(message, error_codes_1.ERROR_CODES.DATABASE_TRANSACTION_ERROR, 500, details);
    }
    /**
     * 创建记录未找到错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static recordNotFound(message = '请求的数据库记录不存在', details) {
        return new DatabaseError(message, error_codes_1.ERROR_CODES.DATABASE_RECORD_NOT_FOUND, 404, details);
    }
    /**
     * 创建记录已存在错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static recordExists(message = '数据库记录已存在', details) {
        return new DatabaseError(message, error_codes_1.ERROR_CODES.DATABASE_RECORD_EXISTS, 409, details);
    }
    /**
     * 创建数据库约束错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static constraintError(message = '违反数据库约束', details) {
        return new DatabaseError(message, error_codes_1.ERROR_CODES.DATABASE_CONSTRAINT_ERROR, 400, details);
    }
}
exports.DatabaseError = DatabaseError;
//# sourceMappingURL=database-error.js.map