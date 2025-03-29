import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
/**
 * 查询计划控制器
 * 处理查询计划的获取、分析和优化
 */
export declare class QueryPlanController {
    /**
     * 获取查询的执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    getQueryPlan(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 获取查询的执行计划 (路由别名)
     * @param req 请求对象
     * @param res 响应对象
     */
    getPlan(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 获取查询的优化建议
     * @param req 请求对象
     * @param res 响应对象
     */
    getOptimizationTips(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 保存查询计划到数据库
     * @param plan 查询计划
     * @param dataSourceId 数据源ID
     * @param userId 用户ID
     * @returns 保存的计划对象
     */
    private saveQueryPlan;
    /**
     * 比较两个查询计划
     * @param req 请求对象
     * @param res 响应对象
     */
    comparePlans(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 获取查询计划历史记录
     * @param req 请求对象
     * @param res 响应对象
     */
    getQueryPlanHistory(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 获取特定的查询计划
     * @param req 请求对象
     * @param res 响应对象
     */
    getQueryPlanById(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export {};
