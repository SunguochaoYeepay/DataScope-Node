"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceError = void 0;
const app_error_1 = require("../app-error");
const error_codes_1 = require("../error-codes");
/**
 * 数据源错误类
 * 用于数据源操作过程中的错误
 */
class DataSourceError extends app_error_1.AppError {
    /**
     * 创建数据源错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param statusCode HTTP状态码
     * @param details 错误详情
     */
    constructor(message, errorCode = error_codes_1.ERROR_CODES.DATASOURCE_ERROR, statusCode = 500, details) {
        super(message, errorCode, statusCode, 'DataSourceError', details);
    }
    /**
     * 创建数据源连接失败错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static connectionFailed(message = '无法连接到数据源', details) {
        return new DataSourceError(message, error_codes_1.ERROR_CODES.CONNECTION_FAILED, 500, details);
    }
    /**
     * 创建数据源认证失败错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static authenticationFailed(message = '数据源认证失败', details) {
        return new DataSourceError(message, error_codes_1.ERROR_CODES.AUTHENTICATION_FAILED, 401, details);
    }
    /**
     * 创建数据源不存在错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static notFound(message = '数据源不存在', details) {
        return new DataSourceError(message, error_codes_1.ERROR_CODES.NOT_FOUND, 404, details);
    }
    /**
     * 创建数据源配置无效错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static invalidConfiguration(message = '数据源配置无效', details) {
        return new DataSourceError(message, error_codes_1.ERROR_CODES.INVALID_DATASOURCE_CONFIG, 400, details);
    }
    /**
     * 创建数据源类型不支持错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static unsupportedType(message = '不支持的数据源类型', details) {
        return new DataSourceError(message, error_codes_1.ERROR_CODES.UNSUPPORTED_DATASOURCE_TYPE, 400, details);
    }
    /**
     * 创建数据源超时错误
     * @param message 错误消息
     * @param details 错误详情
     */
    static timeout(message = '数据源操作超时', details) {
        return new DataSourceError(message, error_codes_1.ERROR_CODES.TIMEOUT, 408, details);
    }
}
exports.DataSourceError = DataSourceError;
//# sourceMappingURL=datasource-error.js.map