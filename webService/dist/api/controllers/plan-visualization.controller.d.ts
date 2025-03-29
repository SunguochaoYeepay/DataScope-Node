import { Request, Response, NextFunction } from 'express';
/**
 * 查询计划可视化控制器
 * 提供查询计划分析和可视化功能
 */
export declare class PlanVisualizationController {
    /**
     * 获取查询执行计划的可视化数据
     * @param req 请求对象
     * @param res 响应对象
     * @param next 下一个中间件
     */
    getVisualizationData(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 比较两个查询计划
     * @param req 请求对象
     * @param res 响应对象
     * @param next 下一个中间件
     */
    comparePlans(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 保存查询计划分析注释
     * @param req 请求对象
     * @param res 响应对象
     * @param next 下一个中间件
     */
    saveAnalysisNotes(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 生成优化后的SQL查询
     * @param req 请求对象
     * @param res 响应对象
     * @param next 下一个中间件
     */
    generateOptimizedQuery(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 将查询计划转换为可视化格式
     * @param planData 查询计划数据
     * @returns 可视化格式数据
     */
    private transformToVisualizationFormat;
    /**
     * 计算节点成本
     * @param node 查询计划节点
     * @param totalCost 总成本
     * @returns 节点成本
     */
    private calculateNodeCost;
    /**
     * 判断节点是否为瓶颈
     * @param node 查询计划节点
     * @returns 是否为瓶颈
     */
    private isNodeBottleneck;
    /**
     * 比较两个查询计划
     * @param plan1 第一个查询计划
     * @param plan2 第二个查询计划
     * @returns 比较结果
     */
    private comparePlanData;
    /**
     * 计算查询计划中的瓶颈数量
     * @param plan 查询计划
     * @returns 瓶颈数量
     */
    private countBottlenecks;
    /**
     * 判断访问类型变化是否是改进
     * @param fromType 原访问类型
     * @param toType 新访问类型
     * @returns 是否改进
     */
    private isAccessTypeImprovement;
    /**
     * 根据优化建议生成优化后的SQL
     * @param originalSql 原始SQL
     * @param planData 查询计划数据
     * @returns 优化后的SQL
     */
    private generateOptimizedSql;
}
declare const _default: PlanVisualizationController;
export default _default;
