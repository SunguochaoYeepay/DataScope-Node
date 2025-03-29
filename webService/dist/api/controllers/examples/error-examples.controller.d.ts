/**
 * 错误示例控制器，用于演示不同类型的错误和错误处理
 */
import { Request, Response } from 'express';
/**
 * 演示验证错误
 * @param req 请求对象
 * @param res 响应对象
 */
export declare const demonstrateValidationError: (req: Request, res: Response) => void;
/**
 * 演示授权错误
 * @param req 请求对象
 * @param res 响应对象
 */
export declare const demonstrateAuthorizationError: (req: Request, res: Response) => void;
/**
 * 演示认证错误
 * @param req 请求对象
 * @param res 响应对象
 */
export declare const demonstrateAuthenticationError: (req: Request, res: Response) => void;
/**
 * 演示数据库错误
 * @param req 请求对象
 * @param res 响应对象
 */
export declare const demonstrateDatabaseError: (req: Request, res: Response) => void;
/**
 * 演示应用错误
 * @param req 请求对象
 * @param res 响应对象
 */
export declare const demonstrateAppError: (req: Request, res: Response) => void;
/**
 * 演示处理成功操作 - 返回正常响应
 * @param req 请求对象
 * @param res 响应对象
 */
export declare const demonstrateSuccess: (req: Request, res: Response) => void;
/**
 * 错误演示API主入口
 * @param req 请求对象
 * @param res 响应对象
 */
export declare const errorExamplesIndex: (req: Request, res: Response) => void;
