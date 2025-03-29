/**
 * ValidationError 类测试
 */
import { ValidationError, ERROR_CODES } from '../../../../src/utils/errors';

describe('ValidationError', () => {
  const mockTimestamp = new Date('2025-01-01T00:00:00.000Z');
  
  beforeAll(() => {
    // 模拟日期时间
    global.Date = class extends Date {
      constructor() {
        super();
        return mockTimestamp;
      }
      
      toISOString() {
        return mockTimestamp.toISOString();
      }
    } as any;
  });
  
  afterAll(() => {
    // 恢复原始 Date
    global.Date = Date;
  });
  
  it('应该创建基础验证错误', () => {
    const error = new ValidationError('参数验证失败');
    
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(error.errorType).toBe('ValidationError');
    expect(error.message).toBe('参数验证失败');
  });
  
  it('应该从字段错误创建验证错误', () => {
    const fieldErrors = {
      username: '用户名不能为空',
      password: '密码长度不足'
    };
    
    const error = ValidationError.fromFieldErrors(fieldErrors, '表单验证失败');
    
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(error.errorType).toBe('ValidationError');
    expect(error.message).toBe('表单验证失败');
    expect(error.details).toEqual(fieldErrors);
  });
  
  it('应该创建必填字段错误', () => {
    const error = ValidationError.requiredField('username', '用户名不能为空');
    
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.REQUIRED_FIELD_MISSING);
    expect(error.errorType).toBe('ValidationError');
    expect(error.message).toBe('用户名不能为空');
    expect(error.details).toEqual({ field: 'username' });
  });
  
  it('应该创建字段类型错误', () => {
    const error = ValidationError.invalidType('age', 'number', '年龄必须是数字');
    
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.INVALID_FIELD_TYPE);
    expect(error.errorType).toBe('ValidationError');
    expect(error.message).toBe('年龄必须是数字');
    expect(error.details).toEqual({ field: 'age', expected: 'number' });
  });
  
  it('应该创建字段长度错误 - 指定范围', () => {
    const error = ValidationError.invalidLength('password', 8, 20, '密码长度必须在8-20个字符之间');
    
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.INVALID_FIELD_LENGTH);
    expect(error.errorType).toBe('ValidationError');
    expect(error.message).toBe('密码长度必须在8-20个字符之间');
    expect(error.details).toEqual({ field: 'password', min: 8, max: 20 });
  });
  
  it('应该创建字段长度错误 - 仅最小值', () => {
    const error = ValidationError.invalidLength('password', 8, undefined, '密码长度不能少于8个字符');
    
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.INVALID_FIELD_LENGTH);
    expect(error.errorType).toBe('ValidationError');
    expect(error.message).toBe('密码长度不能少于8个字符');
    expect(error.details).toEqual({ field: 'password', min: 8, max: undefined });
  });
  
  it('应该创建字段格式错误', () => {
    const error = ValidationError.invalidFormat('email', 'email@example.com', '邮箱格式不正确');
    
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.INVALID_FIELD_FORMAT);
    expect(error.errorType).toBe('ValidationError');
    expect(error.message).toBe('邮箱格式不正确');
    expect(error.details).toEqual({ field: 'email', format: 'email@example.com' });
  });
  
  it('应该支持链式方法调用', () => {
    const error = new ValidationError('参数验证失败')
      .setPath('/api/users')
      .setRequestId('test-request-id')
      .addDetails({ context: 'registration' });
    
    expect(error.path).toBe('/api/users');
    expect(error.requestId).toBe('test-request-id');
    expect(error.details).toEqual({ context: 'registration' });
  });
  
  it('应该有正确的响应格式', () => {
    const error = new ValidationError('参数验证失败')
      .setPath('/api/users')
      .setRequestId('test-request-id');
    
    const response = error.toResponse();
    
    expect(response).toEqual({
      statusCode: 400,
      error: 'ValidationError',
      message: '参数验证失败',
      code: ERROR_CODES.VALIDATION_ERROR,
      timestamp: mockTimestamp.toISOString(),
      path: '/api/users'
    });
  });
});