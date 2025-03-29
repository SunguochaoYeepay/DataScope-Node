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
     * 比较两个查询计划
     * @param req 请求对象
     * @param res 响应对象
     */
    comparePlans(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 计算性能改进百分比
     * @param planA 原始计划
     * @param planB 优化后计划
     * @returns 改进百分比
     */
    private calculateImprovement;
    /**
     * 生成比较要点
     * @param planA 原始计划
     * @param planB 优化后计划
     * @returns 比较要点列表
     */
    private generateComparisonPoints;
    /**
     * 保存查询计划到数据库
     * @param plan 查询计划
     * @param dataSourceId 数据源ID
     * @param userId 用户ID
     * @returns 保存的查询计划记录
     */
    private saveQueryPlan;
    /**
     * 获取查询计划历史
     * @param req 请求对象
     * @param res 响应对象
     */
    getQueryPlanHistory(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 保存查询执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    savePlan(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 获取所有保存的查询执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    getAllSavedPlans(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 获取特定的查询执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    getSavedPlan(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 删除查询执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    deletePlan(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 获取优化后的SQL查询
     * @param req 请求对象
     * @param res 响应对象
     */
    getOptimizedQuery(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export {};
