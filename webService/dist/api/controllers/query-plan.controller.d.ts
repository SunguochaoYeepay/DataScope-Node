import { Request, Response, NextFunction } from 'express';
/**
 * 查询执行计划控制器
 * 提供查询执行计划相关的API接口
 */
export declare class QueryPlanController {
    /**
     * 获取SQL查询执行计划
     * @param req Express请求对象
     * @param res Express响应对象
     * @param next Express下一个中间件函数
     */
    getQueryPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 保存查询执行计划
     * @param req Express请求对象
     * @param res Express响应对象
     * @param next Express下一个中间件函数
     */
    saveQueryPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取查询的执行计划历史记录
     * @param req Express请求对象
     * @param res Express响应对象
     * @param next Express下一个中间件函数
     */
    getQueryPlanHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取单个查询执行计划详情
     * @param req Express请求对象
     * @param res Express响应对象
     * @param next Express下一个中间件函数
     */
    getQueryPlanById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 删除查询执行计划
     * @param req Express请求对象
     * @param res Express响应对象
     * @param next Express下一个中间件函数
     */
    deleteQueryPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
}
