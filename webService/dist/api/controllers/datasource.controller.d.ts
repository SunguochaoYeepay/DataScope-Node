import { Request, Response, NextFunction } from 'express';
export declare class DataSourceController {
    /**
     * 获取所有数据源
     */
    getAllDataSources(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取单个数据源
     */
    getDataSourceById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 创建数据源
     */
    createDataSource(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 更新数据源
     */
    updateDataSource(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 删除数据源
     */
    deleteDataSource(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 测试数据源连接
     */
    testConnection(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 验证数据源创建请求
     */
    validateCreateDataSource(): import("express-validator").ValidationChain[];
    /**
     * 验证数据源更新请求
     */
    validateUpdateDataSource(): import("express-validator").ValidationChain[];
    /**
     * 验证测试连接请求
     */
    validateTestConnection(): import("express-validator").ValidationChain[];
}
declare const _default: DataSourceController;
export default _default;
