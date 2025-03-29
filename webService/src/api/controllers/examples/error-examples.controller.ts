/**
 * 错误处理示例控制器
 * 展示不同类型错误的使用方法
 */
import { Request, Response, NextFunction } from 'express';
import { 
  ApiError, 
  ValidationError, 
  DatabaseError, 
  DataSourceError,
  QueryError,
  ERROR_CODES
} from '../../../utils/errors';

/**
 * 展示API错误的各种用法
 */
export const demonstrateApiErrors = (req: Request, res: Response, next: NextFunction) => {
  const errorType = req.query.type as string;
  
  switch (errorType) {
    case 'badRequest':
      throw ApiError.badRequest('无效的请求参数', { field: 'username', issue: '长度必须大于3个字符' });
    
    case 'unauthorized':
      throw ApiError.unauthorized('用户未登录或会话已过期');
    
    case 'forbidden':
      throw ApiError.forbidden('没有权限访问此资源');
    
    case 'notFound':
      throw ApiError.notFound('请求的资源不存在');
    
    case 'conflict':
      throw ApiError.conflict('资源已存在', { resource: 'user', identifier: req.query.id });
    
    case 'tooManyRequests':
      throw ApiError.tooManyRequests('请求频率过高，请稍后再试');
    
    case 'internal':
      throw ApiError.internal('服务器内部错误', { context: '处理用户请求时发生未知错误' });
    
    default:
      // 正常响应
      return res.json({ 
        message: '错误演示API',
        description: '使用?type=xxx查询参数测试不同类型的错误',
        availableTypes: [
          'badRequest', 'unauthorized', 'forbidden', 'notFound', 
          'conflict', 'tooManyRequests', 'internal', 'validation',
          'database', 'dataSource', 'query'
        ]
      });
  }
};

/**
 * 展示验证错误用法
 */
export const demonstrateValidationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = [
    { field: 'username', message: '用户名不能为空' },
    { field: 'password', message: '密码必须包含字母和数字' },
    { field: 'email', message: '邮箱格式不正确' }
  ];
  
  throw ValidationError.validationFailed('表单验证失败', errors);
};

/**
 * 展示数据库错误用法
 */
export const demonstrateDatabaseError = (req: Request, res: Response, next: NextFunction) => {
  const errorType = req.query.subtype as string;
  
  switch (errorType) {
    case 'connection':
      throw DatabaseError.connectionError('无法连接到数据库', { 
        dbName: 'main', 
        host: 'localhost' 
      });
    
    case 'query':
      throw DatabaseError.queryError('SQL查询执行失败', { 
        sql: 'SELECT * FROM non_existent_table' 
      });
    
    case 'transaction':
      throw DatabaseError.transactionError('事务执行失败', { 
        operation: '创建用户和关联资料' 
      });
    
    case 'notFound':
      throw DatabaseError.recordNotFound('数据库记录不存在', { 
        table: 'users', 
        id: req.query.id 
      });
    
    default:
      throw DatabaseError.databaseError('数据库操作错误');
  }
};

/**
 * 展示数据源错误用法
 */
export const demonstrateDataSourceError = (req: Request, res: Response, next: NextFunction) => {
  const errorType = req.query.subtype as string;
  
  switch (errorType) {
    case 'connection':
      throw DataSourceError.connectionFailed('无法连接到数据源', { 
        source: 'MySQL', 
        host: 'db.example.com' 
      });
    
    case 'authentication':
      throw DataSourceError.authenticationFailed('数据源认证失败', { 
        source: 'PostgreSQL'
      });
    
    case 'notFound':
      throw DataSourceError.notFound('数据源不存在', { 
        id: req.query.id 
      });
    
    default:
      throw DataSourceError.datasourceError('数据源操作错误');
  }
};

/**
 * 展示查询错误用法
 */
export const demonstrateQueryError = (req: Request, res: Response, next: NextFunction) => {
  const errorType = req.query.subtype as string;
  
  switch (errorType) {
    case 'syntax':
      throw QueryError.syntaxError('SQL语法错误', { 
        sql: 'SELECT * FORM users',
        position: 7
      });
    
    case 'timeout':
      throw QueryError.timeout('查询执行超时', { 
        sql: 'SELECT * FROM large_table', 
        executionTime: '30s',
        timeout: '15s'
      });
    
    case 'permission':
      throw QueryError.permissionDenied('无权执行此查询', { 
        table: 'sensitive_data', 
        operation: 'SELECT'
      });
    
    default:
      throw QueryError.executionFailed('查询执行失败');
  }
};