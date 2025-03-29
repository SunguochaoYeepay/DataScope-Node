"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const app_error_1 = require("../app-error");
const error_codes_1 = require("../error-codes");
/**
 * 数据验证错误类
 * 用于处理请求参数验证失败的情况
 */
class ValidationError extends app_error_1.AppError {
    /**
     * 创建验证错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param details 错误详情
     */
    constructor(message = '数据验证失败', errorCode = error_codes_1.ERROR_CODES.VALIDATION_ERROR, details) {
        super(message, errorCode, 400, 'ValidationError', details);
    }
    /**
     * 创建字段验证错误
     * @param fieldErrors 字段错误信息
     * @param message 错误消息
     */
    static fromFieldErrors(fieldErrors, message = '数据验证失败') {
        return new ValidationError(message, error_codes_1.ERROR_CODES.VALIDATION_ERROR, fieldErrors);
    }
    /**
     * 创建必填字段缺失错误
     * @param field 字段名
     * @param message 错误消息
     */
    static requiredField(field, message) {
        const errorMessage = message || `字段 ${field} 为必填项`;
        return new ValidationError(errorMessage, error_codes_1.ERROR_CODES.REQUIRED_FIELD_MISSING, { field });
    }
    /**
     * 创建字段类型无效错误
     * @param field 字段名
     * @param expected 期望类型
     * @param message 错误消息
     */
    static invalidType(field, expected, message) {
        const errorMessage = message || `字段 ${field} 类型应为 ${expected}`;
        return new ValidationError(errorMessage, error_codes_1.ERROR_CODES.INVALID_FIELD_TYPE, { field, expected });
    }
    /**
     * 创建字段长度无效错误
     * @param field 字段名
     * @param min 最小长度
     * @param max 最大长度
     * @param message 错误消息
     */
    static invalidLength(field, min, max, message) {
        let errorMessage = message || `字段 ${field} 长度无效`;
        if (min !== undefined && max !== undefined) {
            errorMessage = message || `字段 ${field} 长度应在 ${min} 到 ${max} 之间`;
        }
        else if (min !== undefined) {
            errorMessage = message || `字段 ${field} 长度应不小于 ${min}`;
        }
        else if (max !== undefined) {
            errorMessage = message || `字段 ${field} 长度应不超过 ${max}`;
        }
        return new ValidationError(errorMessage, error_codes_1.ERROR_CODES.INVALID_FIELD_LENGTH, { field, min, max });
    }
    /**
     * 创建字段格式无效错误
     * @param field 字段名
     * @param format 期望格式
     * @param message 错误消息
     */
    static invalidFormat(field, format, message) {
        const errorMessage = message || `字段 ${field} 格式应为 ${format}`;
        return new ValidationError(errorMessage, error_codes_1.ERROR_CODES.INVALID_FIELD_FORMAT, { field, format });
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validation-error.js.map