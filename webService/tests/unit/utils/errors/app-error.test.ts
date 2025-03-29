/**
 * AppError 类测试
 */
import { AppError, ERROR_CODES } from '../../../../src/utils/errors';

describe('AppError', () => {
  const mockTimestamp = new Date('2025-01-01T00:00:00.000Z');
  const realDateNow = Date.now;
  const realToISOString = Date.prototype.toISOString;
  
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
  
  it('应该正确创建 AppError 实例', () => {
    const error = new AppError(
      '错误的请求',
      ERROR_CODES.INVALID_REQUEST,
      400,
      'BAD_REQUEST'
    );
    
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.INVALID_REQUEST);
    expect(error.errorType).toBe('BAD_REQUEST');
    expect(error.message).toBe('错误的请求');
    expect(error.timestamp).toBe(mockTimestamp.toISOString());
  });
  
  it('应该设置请求路径', () => {
    const error = new AppError(
      '错误的请求',
      ERROR_CODES.INVALID_REQUEST,
      400,
      'BAD_REQUEST'
    );
    
    const result = error.setPath('/api/test');
    
    expect(result).toBe(error); // 返回自身以支持链式调用
    expect(error.path).toBe('/api/test');
  });
  
  it('应该设置请求ID', () => {
    const error = new AppError(
      '错误的请求',
      ERROR_CODES.INVALID_REQUEST,
      400,
      'BAD_REQUEST'
    );
    
    const requestId = '123e4567-e89b-12d3-a456-426614174000';
    const result = error.setRequestId(requestId);
    
    expect(result).toBe(error); // 返回自身以支持链式调用
    expect(error.requestId).toBe(requestId);
  });
  
  it('应该添加错误详情', () => {
    const error = new AppError(
      '错误的请求',
      ERROR_CODES.INVALID_REQUEST,
      400,
      'BAD_REQUEST'
    );
    
    const details = { field: 'username', issue: 'required' };
    const result = error.addDetails(details);
    
    expect(result).toBe(error); // 返回自身以支持链式调用
    expect(error.details).toEqual(details);
  });
  
  it('应该转换为响应对象', () => {
    const error = new AppError(
      '错误的请求',
      ERROR_CODES.INVALID_REQUEST,
      400,
      'BAD_REQUEST'
    );
    
    error.setPath('/api/test');
    error.setRequestId('123e4567-e89b-12d3-a456-426614174000');
    error.addDetails({ field: 'username', issue: 'required' });
    
    const response = error.toResponse();
    
    expect(response).toEqual({
      statusCode: 400,
      error: 'BAD_REQUEST',
      message: '错误的请求',
      code: ERROR_CODES.INVALID_REQUEST,
      timestamp: mockTimestamp.toISOString(),
      path: '/api/test',
      details: {
        field: 'username',
        issue: 'required'
      }
    });
  });
  
  it('应该转换为JSON对象', () => {
    const error = new AppError(
      '错误的请求',
      ERROR_CODES.INVALID_REQUEST,
      400,
      'BAD_REQUEST'
    );
    
    error.setPath('/api/test');
    error.setRequestId('123e4567-e89b-12d3-a456-426614174000');
    
    const json = error.toJSON();
    
    expect(json).toEqual({
      statusCode: 400,
      error: 'BAD_REQUEST',
      message: '错误的请求',
      code: ERROR_CODES.INVALID_REQUEST,
      timestamp: mockTimestamp.toISOString(),
      path: '/api/test'
    });
  });
});