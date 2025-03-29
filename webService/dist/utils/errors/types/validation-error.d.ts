import { AppError } from '../app-error';
/**
 * 数据验证错误类
 * 用于处理请求参数验证失败的情况
 */
export declare class ValidationError extends AppError {
    /**
     * 创建验证错误
     * @param message 错误消息
     * @param errorCode 错误码
     * @param details 错误详情
     */
    constructor(message?: string, errorCode?: number, details?: any);
    /**
     * 创建字段验证错误
     * @param fieldErrors 字段错误信息
     * @param message 错误消息
     */
    static fromFieldErrors(fieldErrors: Record<string, string>, message?: string): ValidationError;
    /**
     * 创建必填字段缺失错误
     * @param field 字段名
     * @param message 错误消息
     */
    static requiredField(field: string, message?: string): ValidationError;
    /**
     * 创建字段类型无效错误
     * @param field 字段名
     * @param expected 期望类型
     * @param message 错误消息
     */
    static invalidType(field: string, expected: string, message?: string): ValidationError;
    /**
     * 创建字段长度无效错误
     * @param field 字段名
     * @param min 最小长度
     * @param max 最大长度
     * @param message 错误消息
     */
    static invalidLength(field: string, min?: number, max?: number, message?: string): ValidationError;
    /**
     * 创建字段格式无效错误
     * @param field 字段名
     * @param format 期望格式
     * @param message 错误消息
     */
    static invalidFormat(field: string, format: string, message?: string): ValidationError;
}
