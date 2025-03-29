import { Request, Response, NextFunction } from 'express';
export declare class QueryController {
    /**
     * 获取查询执行计划
     */
    explainQuery(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取查询计划的优化建议
     */
    getQueryOptimizationTips(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取查询计划历史记录
     */
    getQueryPlanHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 取消查询执行
     */
    cancelQuery(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 执行SQL查询
     */
    executeQuery(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 保存查询
     */
    saveQuery(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取所有保存的查询
     */
    getQueries(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取单个查询
     */
    getQueryById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 更新保存的查询
     */
    updateQuery(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 删除保存的查询
     */
    deleteQuery(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取查询历史记录
     */
    getQueryHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 验证执行查询请求
     */
    validateExecuteQuery(): import("express-validator").ValidationChain[];
    /**
     * 验证保存查询请求
     */
    validateSaveQuery(): import("express-validator").ValidationChain[];
    /**
     * 验证更新查询请求
     */
    validateUpdateQuery(): import("express-validator").ValidationChain[];
}
declare const _default: QueryController;
export default _default;
