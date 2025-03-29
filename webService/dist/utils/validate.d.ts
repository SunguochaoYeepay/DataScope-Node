import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
/**
 * 请求验证中间件
 */
export declare const validate: (validations: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
