/**
 * ApiError 类测试
 */
import { ApiError, ERROR_CODES } from '../../../../src/utils/errors';

describe('ApiError', () => {
  const mockTimestamp = new Date('2025-01-01T00:00:00.000Z');
  const realDateNow = Date.now;
  
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
  
  it('应该创建一个错误请求错误', () => {
    const error = ApiError.badRequest('参数错误');
    
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.INVALID_REQUEST);
    expect(error.errorType).toBe('BAD_REQUEST');
    expect(error.message).toBe('参数错误');
  });
  
  it('应该创建一个未授权错误', () => {
    const error = ApiError.unauthorized('未授权访问');
    
    expect(error.statusCode).toBe(401);
    expect(error.errorCode).toBe(ERROR_CODES.UNAUTHORIZED);
    expect(error.errorType).toBe('UNAUTHORIZED');
    expect(error.message).toBe('未授权访问');
  });
  
  it('应该创建一个禁止访问错误', () => {
    const error = ApiError.forbidden('禁止访问');
    
    expect(error.statusCode).toBe(403);
    expect(error.errorCode).toBe(ERROR_CODES.FORBIDDEN);
    expect(error.errorType).toBe('FORBIDDEN');
    expect(error.message).toBe('禁止访问');
  });
  
  it('应该创建一个资源不存在错误', () => {
    const error = ApiError.notFound('资源不存在');
    
    expect(error.statusCode).toBe(404);
    expect(error.errorCode).toBe(ERROR_CODES.RESOURCE_NOT_FOUND);
    expect(error.errorType).toBe('NOT_FOUND');
    expect(error.message).toBe('资源不存在');
  });
  
  it('应该创建一个资源冲突错误', () => {
    const error = ApiError.conflict('资源已存在');
    
    expect(error.statusCode).toBe(409);
    expect(error.errorCode).toBe(ERROR_CODES.CONFLICT);
    expect(error.errorType).toBe('CONFLICT');
    expect(error.message).toBe('资源已存在');
  });
  
  it('应该创建一个请求过于频繁错误', () => {
    const error = ApiError.tooManyRequests('请求过于频繁');
    
    expect(error.statusCode).toBe(429);
    expect(error.errorCode).toBe(ERROR_CODES.TOO_MANY_REQUESTS);
    expect(error.errorType).toBe('TOO_MANY_REQUESTS');
    expect(error.message).toBe('请求过于频繁');
  });
  
  it('应该创建一个内部服务器错误', () => {
    const error = ApiError.internal('服务器内部错误');
    
    expect(error.statusCode).toBe(500);
    expect(error.errorCode).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR);
    expect(error.errorType).toBe('INTERNAL_SERVER_ERROR');
    expect(error.message).toBe('服务器内部错误');
  });
  
  it('应该在错误中添加详细信息', () => {
    const details = { field: 'email', issue: 'invalid format' };
    const error = ApiError.badRequest('参数错误', details);
    
    expect(error.details).toEqual(details);
  });
  
  it('应该支持链式方法调用', () => {
    const error = ApiError.badRequest('参数错误')
      .setPath('/api/users')
      .setRequestId('test-request-id')
      .addDetails({ field: 'email' });
    
    expect(error.path).toBe('/api/users');
    expect(error.requestId).toBe('test-request-id');
    expect(error.details).toEqual({ field: 'email' });
  });
  
  it('应该有正确的响应格式', () => {
    const error = ApiError.badRequest('参数错误')
      .setPath('/api/users')
      .setRequestId('test-request-id');
    
    const response = error.toResponse();
    
    expect(response).toEqual({
      statusCode: 400,
      error: 'BAD_REQUEST',
      message: '参数错误',
      code: ERROR_CODES.INVALID_REQUEST,
      timestamp: mockTimestamp.toISOString(),
      path: '/api/users'
    });
  });
});