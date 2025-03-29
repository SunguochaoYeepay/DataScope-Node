/**
 * 错误处理系统测试
 */
import { 
  AppError, 
  ApiError, 
  DatabaseError, 
  DataSourceError, 
  QueryError, 
  ValidationError, 
  ERROR_CODES 
} from '../../utils/errors';

describe('错误处理系统', () => {
  describe('AppError 基础错误类', () => {
    it('应该正确创建错误对象', () => {
      const error = new AppError('测试错误', ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('测试错误');
      expect(error.errorCode).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR);
      expect(error.statusCode).toBe(500);
      expect(error.timestamp).toBeDefined();
    });
    
    it('应该能设置路径和请求ID', () => {
      const error = new AppError('测试错误', ERROR_CODES.INTERNAL_SERVER_ERROR)
        .setPath('/api/test')
        .setRequestId('test-request-id');
      
      expect(error.path).toBe('/api/test');
      expect(error.requestId).toBe('test-request-id');
    });
    
    it('应该能添加错误详情', () => {
      const details = { field: 'username', reason: 'too_short' };
      const error = new AppError('测试错误', ERROR_CODES.VALIDATION_ERROR)
        .addDetails(details);
      
      expect(error.details).toEqual(details);
    });
    
    it('应该能转换为响应对象', () => {
      const error = new AppError('测试错误', ERROR_CODES.INTERNAL_SERVER_ERROR, 500, 'TestError')
        .setPath('/api/test');
      
      const response = error.toResponse();
      
      expect(response.statusCode).toBe(500);
      expect(response.error).toBe('TestError');
      expect(response.message).toBe('测试错误');
      expect(response.code).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR);
      expect(response.path).toBe('/api/test');
      expect(response.timestamp).toBeDefined();
    });
  });
  
  describe('ApiError 类', () => {
    it('应该正确创建API错误', () => {
      const error = new ApiError('API错误', ERROR_CODES.INVALID_REQUEST, 400);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.errorType).toBe('ApiError');
      expect(error.statusCode).toBe(400);
    });
    
    it('应该能使用静态工厂方法创建错误', () => {
      const errors = [
        ApiError.badRequest('无效请求'),
        ApiError.unauthorized('未授权'),
        ApiError.forbidden('禁止访问'),
        ApiError.notFound('资源不存在'),
        ApiError.conflict('资源冲突'),
        ApiError.tooManyRequests('请求过多'),
        ApiError.internal('服务器错误')
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
      const error = new DatabaseError('数据库错误');
      
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error.errorType).toBe('DatabaseError');
    });
    
    it('应该能使用静态工厂方法创建错误', () => {
      const errors = [
        DatabaseError.connectionError(),
        DatabaseError.queryError(),
        DatabaseError.transactionError(),
        DatabaseError.recordNotFound(),
        DatabaseError.recordExists(),
        DatabaseError.constraintError()
      ];
      
      expect(errors[0].errorCode).toBe(ERROR_CODES.DATABASE_CONNECTION_ERROR);
      expect(errors[3].statusCode).toBe(404);
      expect(errors[4].statusCode).toBe(409);
    });
  });
  
  describe('DataSourceError 类', () => {
    it('应该正确创建数据源错误', () => {
      const error = new DataSourceError('数据源错误');
      
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(DataSourceError);
      expect(error.errorType).toBe('DataSourceError');
    });
    
    it('应该能使用静态工厂方法创建错误', () => {
      const errors = [
        DataSourceError.connectionFailed(),
        DataSourceError.authenticationFailed(),
        DataSourceError.notFound(),
        DataSourceError.invalidConfiguration(),
        DataSourceError.unsupportedType(),
        DataSourceError.timeout()
      ];
      
      expect(errors[0].errorCode).toBe(ERROR_CODES.CONNECTION_FAILED);
      expect(errors[1].statusCode).toBe(401);
      expect(errors[2].statusCode).toBe(404);
      expect(errors[5].statusCode).toBe(408);
    });
  });
  
  describe('QueryError 类', () => {
    it('应该正确创建查询错误', () => {
      const error = new QueryError('查询错误');
      
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(QueryError);
      expect(error.errorType).toBe('QueryError');
    });
    
    it('应该能使用静态工厂方法创建错误', () => {
      const errors = [
        QueryError.syntaxError(),
        QueryError.timeout(),
        QueryError.permissionDenied(),
        QueryError.resourceNotFound(),
        QueryError.tooComplex(),
        QueryError.resultTooLarge()
      ];
      
      expect(errors[0].statusCode).toBe(400);
      expect(errors[1].statusCode).toBe(408);
      expect(errors[2].statusCode).toBe(403);
      expect(errors[5].statusCode).toBe(413);
    });
  });
  
  describe('ValidationError 类', () => {
    it('应该正确创建验证错误', () => {
      const error = new ValidationError('验证错误');
      
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errorType).toBe('ValidationError');
      expect(error.statusCode).toBe(400);
    });
    
    it('应该能从字段错误创建验证错误', () => {
      const fieldErrors = {
        username: '用户名太短',
        password: '密码不符合要求'
      };
      
      const error = ValidationError.fromFieldErrors(fieldErrors);
      
      expect(error.details).toEqual(fieldErrors);
      expect(error.statusCode).toBe(400);
    });
    
    it('应该能使用静态工厂方法创建错误', () => {
      const errors = [
        ValidationError.requiredField('username'),
        ValidationError.invalidType('age', 'number'),
        ValidationError.invalidLength('password', 8, 20),
        ValidationError.invalidFormat('email', 'email@example.com')
      ];
      
      expect(errors[0].message).toContain('username');
      expect(errors[1].details.expected).toBe('number');
      expect(errors[2].details.min).toBe(8);
      expect(errors[2].details.max).toBe(20);
      expect(errors[3].details.format).toBe('email@example.com');
    });
  });
});