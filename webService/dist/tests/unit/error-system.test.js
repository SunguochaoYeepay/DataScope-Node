"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 错误处理系统测试
 */
const errors_1 = require("../../utils/errors");
describe('错误处理系统', () => {
    describe('AppError 基础错误类', () => {
        it('应该正确创建错误对象', () => {
            const error = new errors_1.AppError('测试错误', errors_1.ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(errors_1.AppError);
            expect(error.message).toBe('测试错误');
            expect(error.errorCode).toBe(errors_1.ERROR_CODES.INTERNAL_SERVER_ERROR);
            expect(error.statusCode).toBe(500);
            expect(error.timestamp).toBeDefined();
        });
        it('应该能设置路径和请求ID', () => {
            const error = new errors_1.AppError('测试错误', errors_1.ERROR_CODES.INTERNAL_SERVER_ERROR)
                .setPath('/api/test')
                .setRequestId('test-request-id');
            expect(error.path).toBe('/api/test');
            expect(error.requestId).toBe('test-request-id');
        });
        it('应该能添加错误详情', () => {
            const details = { field: 'username', reason: 'too_short' };
            const error = new errors_1.AppError('测试错误', errors_1.ERROR_CODES.VALIDATION_ERROR)
                .addDetails(details);
            expect(error.details).toEqual(details);
        });
        it('应该能转换为响应对象', () => {
            const error = new errors_1.AppError('测试错误', errors_1.ERROR_CODES.INTERNAL_SERVER_ERROR, 500, 'TestError')
                .setPath('/api/test');
            const response = error.toResponse();
            expect(response.statusCode).toBe(500);
            expect(response.error).toBe('TestError');
            expect(response.message).toBe('测试错误');
            expect(response.code).toBe(errors_1.ERROR_CODES.INTERNAL_SERVER_ERROR);
            expect(response.path).toBe('/api/test');
            expect(response.timestamp).toBeDefined();
        });
    });
    describe('ApiError 类', () => {
        it('应该正确创建API错误', () => {
            const error = new errors_1.ApiError('API错误', errors_1.ERROR_CODES.INVALID_REQUEST, 400);
            expect(error).toBeInstanceOf(errors_1.AppError);
            expect(error).toBeInstanceOf(errors_1.ApiError);
            expect(error.errorType).toBe('ApiError');
            expect(error.statusCode).toBe(400);
        });
        it('应该能使用静态工厂方法创建错误', () => {
            const errors = [
                errors_1.ApiError.badRequest('无效请求'),
                errors_1.ApiError.unauthorized('未授权'),
                errors_1.ApiError.forbidden('禁止访问'),
                errors_1.ApiError.notFound('资源不存在'),
                errors_1.ApiError.conflict('资源冲突'),
                errors_1.ApiError.tooManyRequests('请求过多'),
                errors_1.ApiError.internal('服务器错误')
            ];
            expect(errors[0].statusCode).toBe(400);
            expect(errors[1].statusCode).toBe(401);
            expect(errors[2].statusCode).toBe(403);
            expect(errors[3].statusCode).toBe(404);
            expect(errors[4].statusCode).toBe(409);
            expect(errors[5].statusCode).toBe(429);
            expect(errors[6].statusCode).toBe(500);
        });
    });
    describe('DatabaseError 类', () => {
        it('应该正确创建数据库错误', () => {
            const error = new errors_1.DatabaseError('数据库错误');
            expect(error).toBeInstanceOf(errors_1.AppError);
            expect(error).toBeInstanceOf(errors_1.DatabaseError);
            expect(error.errorType).toBe('DatabaseError');
        });
        it('应该能使用静态工厂方法创建错误', () => {
            const errors = [
                errors_1.DatabaseError.connectionError(),
                errors_1.DatabaseError.queryError(),
                errors_1.DatabaseError.transactionError(),
                errors_1.DatabaseError.recordNotFound(),
                errors_1.DatabaseError.recordExists(),
                errors_1.DatabaseError.constraintError()
            ];
            expect(errors[0].errorCode).toBe(errors_1.ERROR_CODES.DATABASE_CONNECTION_ERROR);
            expect(errors[3].statusCode).toBe(404);
            expect(errors[4].statusCode).toBe(409);
        });
    });
    describe('DataSourceError 类', () => {
        it('应该正确创建数据源错误', () => {
            const error = new errors_1.DataSourceError('数据源错误');
            expect(error).toBeInstanceOf(errors_1.AppError);
            expect(error).toBeInstanceOf(errors_1.DataSourceError);
            expect(error.errorType).toBe('DataSourceError');
        });
        it('应该能使用静态工厂方法创建错误', () => {
            const errors = [
                errors_1.DataSourceError.connectionFailed(),
                errors_1.DataSourceError.authenticationFailed(),
                errors_1.DataSourceError.notFound(),
                errors_1.DataSourceError.invalidConfiguration(),
                errors_1.DataSourceError.unsupportedType(),
                errors_1.DataSourceError.timeout()
            ];
            expect(errors[0].errorCode).toBe(errors_1.ERROR_CODES.CONNECTION_FAILED);
            expect(errors[1].statusCode).toBe(401);
            expect(errors[2].statusCode).toBe(404);
            expect(errors[5].statusCode).toBe(408);
        });
    });
    describe('QueryError 类', () => {
        it('应该正确创建查询错误', () => {
            const error = new errors_1.QueryError('查询错误');
            expect(error).toBeInstanceOf(errors_1.AppError);
            expect(error).toBeInstanceOf(errors_1.QueryError);
            expect(error.errorType).toBe('QueryError');
        });
        it('应该能使用静态工厂方法创建错误', () => {
            const errors = [
                errors_1.QueryError.syntaxError(),
                errors_1.QueryError.timeout(),
                errors_1.QueryError.permissionDenied(),
                errors_1.QueryError.resourceNotFound(),
                errors_1.QueryError.tooComplex(),
                errors_1.QueryError.resultTooLarge()
            ];
            expect(errors[0].statusCode).toBe(400);
            expect(errors[1].statusCode).toBe(408);
            expect(errors[2].statusCode).toBe(403);
            expect(errors[5].statusCode).toBe(413);
        });
    });
    describe('ValidationError 类', () => {
        it('应该正确创建验证错误', () => {
            const error = new errors_1.ValidationError('验证错误');
            expect(error).toBeInstanceOf(errors_1.AppError);
            expect(error).toBeInstanceOf(errors_1.ValidationError);
            expect(error.errorType).toBe('ValidationError');
            expect(error.statusCode).toBe(400);
        });
        it('应该能从字段错误创建验证错误', () => {
            const fieldErrors = {
                username: '用户名太短',
                password: '密码不符合要求'
            };
            const error = errors_1.ValidationError.fromFieldErrors(fieldErrors);
            expect(error.details).toEqual(fieldErrors);
            expect(error.statusCode).toBe(400);
        });
        it('应该能使用静态工厂方法创建错误', () => {
            const errors = [
                errors_1.ValidationError.requiredField('username'),
                errors_1.ValidationError.invalidType('age', 'number'),
                errors_1.ValidationError.invalidLength('password', 8, 20),
                errors_1.ValidationError.invalidFormat('email', 'email@example.com')
            ];
            expect(errors[0].message).toContain('username');
            expect(errors[1].details.expected).toBe('number');
            expect(errors[2].details.min).toBe(8);
            expect(errors[2].details.max).toBe(20);
            expect(errors[3].details.format).toBe('email@example.com');
        });
    });
});
//# sourceMappingURL=error-system.test.js.map