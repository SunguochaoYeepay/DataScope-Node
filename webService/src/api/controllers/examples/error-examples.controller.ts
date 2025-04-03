/**
 * 错误示例控制器，用于演示不同类型的错误和错误处理
 */

import { Request, Response } from 'express';
import { ApiError } from '../../../utils/errors/types/api-error';
import { DatabaseError } from '../../../utils/errors/types/database-error';
import { AppError } from '../../../utils/errors/app-error';
import { ValidationError } from '../../../utils/errors/types/validation-error';
import { ERROR_CODES } from '../../../utils/errors/error-codes';
import logger from '../../../utils/logger';

/**
 * 演示验证错误
 * @param req 请求对象
 * @param res 响应对象
 */
export const demonstrateValidationError = (req: Request, res: Response): void => {
  // 模拟验证错误 - 创建符合测试要求的数组格式
  const details = [
    { field: 'username', message: '用户名不能为空' },
    { field: 'password', message: '密码长度必须至少为8个字符' },
    { field: 'email', message: '邮箱格式不正确' }
  ];
  
  // 创建验证错误
  const error = new ValidationError(
    '请求参数验证失败',
    ERROR_CODES.VALIDATION_ERROR,
    details
  );
  
  // 抛出错误，将由错误处理中间件捕获
  throw error;
};

/**
 * 演示授权错误
 * @param req 请求对象
 * @param res 响应对象
 */
export const demonstrateAuthorizationError = (req: Request, res: Response): void => {
  // 模拟授权错误
  const error = ApiError.forbidden(
    '您没有权限执行此操作'
  );
  
  // 抛出错误，将由错误处理中间件捕获
  throw error;
};

/**
 * 演示认证错误
 * @param req 请求对象
 * @param res 响应对象
 */
export const demonstrateAuthenticationError = (req: Request, res: Response): void => {
  // 模拟认证错误
  const error = ApiError.unauthorized(
    '认证失败，请重新登录'
  );
  
  // 抛出错误，将由错误处理中间件捕获
  throw error;
};

/**
 * 演示数据库错误
 * @param req 请求对象
 * @param res 响应对象
 */
export const demonstrateDatabaseError = (req: Request, res: Response): void => {
  const subtype = req.query.subtype as string;
  
  if (subtype === 'connection') {
    // 模拟数据库连接错误
    const error = DatabaseError.connectionError(
      '无法连接到数据库',
      {
        dbName: 'main',
        host: 'localhost'
      }
    );
    throw error;
  } else if (subtype === 'query') {
    // 模拟数据库查询错误
    const error = DatabaseError.queryError(
      'SQL语法错误',
      {
        sql: 'SELCT * FROM users',
        errorCode: 'ER_PARSE_ERROR'
      }
    );
    throw error;
  } else if (subtype === 'notFound') {
    // 模拟记录未找到错误
    const id = req.query.id as string;
    const error = DatabaseError.recordNotFound(
      '数据库记录不存在',
      {
        table: 'users',
        id: id || 'unknown'
      }
    );
    throw error;
  } else {
    // 默认数据库错误
    const error = new DatabaseError(
      '发生了数据库错误',
      70000
    );
    throw error;
  }
};

/**
 * 演示应用错误
 * @param req 请求对象
 * @param res 响应对象
 */
export const demonstrateAppError = (req: Request, res: Response): void => {
  // 模拟应用错误
  const error = new AppError(
    '应用程序运行时错误',
    50000,
    500,
    'AppError',
    {
      module: 'report-generator',
      operation: 'generatePDF'
    }
  );
  
  // 设置请求路径和ID
  error.path = req.path;
  error.requestId = req.headers['x-request-id'] as string;
  
  // 抛出错误，将由错误处理中间件捕获
  throw error;
};

/**
 * 演示处理成功操作 - 返回正常响应
 * @param req 请求对象
 * @param res 响应对象
 */
export const demonstrateSuccess = (req: Request, res: Response): void => {
  logger.info('处理成功请求');
  
  res.status(200).json({
    success: true,
    message: '操作成功',
    data: {
      id: '12345',
      timestamp: new Date()
    }
  });
};

/**
 * 错误演示API主入口
 * @param req 请求对象
 * @param res 响应对象
 */
export const errorExamplesIndex = (req: Request, res: Response): void => {
  const type = req.query.type as string;
  
  if (!type) {
    res.status(200).json({
      message: '错误演示API',
      availableTypes: [
        'badRequest',
        'unauthorized',
        'forbidden',
        'notFound',
        'conflict',
        'tooManyRequests',
        'internal'
      ],
      usage: '添加?type=错误类型来演示不同的错误响应'
    });
    return;
  }
  
  switch(type) {
    case 'badRequest':
      throw ApiError.badRequest('无效的请求参数');
    case 'unauthorized':
      throw ApiError.unauthorized('身份验证失败');
    case 'forbidden':
      throw ApiError.forbidden('权限不足，禁止访问此资源');
    case 'notFound':
      throw ApiError.notFound('请求的资源不存在');
    case 'conflict':
      throw ApiError.conflict('资源冲突，无法完成请求');
    case 'tooManyRequests':
      throw ApiError.tooManyRequests('请求频率过高，请稍后再试');
    case 'internal':
      throw ApiError.internal('服务器内部错误');
    default:
      throw ApiError.badRequest(`不支持的错误类型: ${type}`);
  }
};