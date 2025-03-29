/**
 * 错误处理示例控制器
 * 展示不同类型错误的使用方法
 */
import { Request, Response, NextFunction } from 'express';
/**
 * 展示API错误的各种用法
 */
export declare const demonstrateApiErrors: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * 展示验证错误用法
 */
export declare const demonstrateValidationError: (req: Request, res: Response, next: NextFunction) => never;
/**
 * 展示数据库错误用法
 */
export declare const demonstrateDatabaseError: (req: Request, res: Response, next: NextFunction) => never;
/**
 * 展示数据源错误用法
 */
export declare const demonstrateDataSourceError: (req: Request, res: Response, next: NextFunction) => never;
/**
 * 展示查询错误用法
 */
export declare const demonstrateQueryError: (req: Request, res: Response, next: NextFunction) => never;
