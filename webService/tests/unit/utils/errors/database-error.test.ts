/**
 * DatabaseError 类测试
 */
import { DatabaseError, ERROR_CODES } from '../../../../src/utils/errors';

describe('DatabaseError', () => {
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
  
  it('应该创建一个数据库连接错误', () => {
    const error = DatabaseError.connectionError('无法连接到数据库', { host: 'localhost' });
    
    expect(error.statusCode).toBe(500);
    expect(error.errorCode).toBe(ERROR_CODES.DATABASE_CONNECTION_ERROR);
    expect(error.errorType).toBe('DatabaseError');
    expect(error.message).toBe('无法连接到数据库');
    expect(error.details).toEqual({ host: 'localhost' });
  });
  
  it('应该创建一个查询错误', () => {
    const error = DatabaseError.queryError('SQL查询执行失败', { sql: 'SELECT * FROM users' });
    
    expect(error.statusCode).toBe(500);
    expect(error.errorCode).toBe(ERROR_CODES.DATABASE_QUERY_ERROR);
    expect(error.errorType).toBe('DatabaseError');
    expect(error.message).toBe('SQL查询执行失败');
    expect(error.details).toEqual({ sql: 'SELECT * FROM users' });
  });
  
  it('应该创建一个事务错误', () => {
    const error = DatabaseError.transactionError('事务执行失败');
    
    expect(error.statusCode).toBe(500);
    expect(error.errorCode).toBe(ERROR_CODES.DATABASE_TRANSACTION_ERROR);
    expect(error.errorType).toBe('DatabaseError');
    expect(error.message).toBe('事务执行失败');
  });
  
  it('应该创建一个记录不存在错误', () => {
    const error = DatabaseError.recordNotFound('用户记录不存在', { id: 123 });
    
    expect(error.statusCode).toBe(404);
    expect(error.errorCode).toBe(ERROR_CODES.DATABASE_RECORD_NOT_FOUND);
    expect(error.errorType).toBe('DatabaseError');
    expect(error.message).toBe('用户记录不存在');
    expect(error.details).toEqual({ id: 123 });
  });
  
  it('应该创建一个记录已存在错误', () => {
    const error = DatabaseError.recordExists('用户邮箱已存在', { email: 'test@example.com' });
    
    expect(error.statusCode).toBe(409);
    expect(error.errorCode).toBe(ERROR_CODES.DATABASE_RECORD_EXISTS);
    expect(error.errorType).toBe('DatabaseError');
    expect(error.message).toBe('用户邮箱已存在');
    expect(error.details).toEqual({ email: 'test@example.com' });
  });
  
  it('应该创建一个约束错误', () => {
    const error = DatabaseError.constraintError('违反唯一约束', { field: 'email' });
    
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe(ERROR_CODES.DATABASE_CONSTRAINT_ERROR);
    expect(error.errorType).toBe('DatabaseError');
    expect(error.message).toBe('违反唯一约束');
    expect(error.details).toEqual({ field: 'email' });
  });
  
  it('应该支持链式方法调用', () => {
    const error = DatabaseError.connectionError('数据库操作失败')
      .setPath('/api/users')
      .setRequestId('test-request-id')
      .addDetails({ action: 'create' });
    
    expect(error.path).toBe('/api/users');
    expect(error.requestId).toBe('test-request-id');
    expect(error.details).toEqual({ action: 'create' });
  });
  
  it('应该有正确的响应格式', () => {
    const error = DatabaseError.connectionError('数据库操作失败')
      .setPath('/api/users')
      .setRequestId('test-request-id');
    
    const response = error.toResponse();
    
    expect(response).toEqual({
      statusCode: 500,
      error: 'DatabaseError',
      message: '数据库操作失败',
      code: ERROR_CODES.DATABASE_CONNECTION_ERROR,
      timestamp: mockTimestamp.toISOString(),
      path: '/api/users'
    });
  });
});