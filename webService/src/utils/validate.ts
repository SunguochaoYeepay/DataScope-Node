import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from './error';

/**
 * 请求验证中间件
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 执行所有验证
    await Promise.all(validations.map(validation => validation.run(req)));

    // 检查是否有验证错误
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // 将验证错误格式化为更友好的格式
    const formattedErrors = errors.array().map(error => ({
      param: error.param,
      value: error.value,
      message: error.msg
    }));

    // 抛出API验证错误
    throw ApiError.badRequest('输入验证失败', 3000, formattedErrors);
  };
};