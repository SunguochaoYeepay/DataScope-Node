import { Request, Response, NextFunction } from 'express';
export declare class MetadataController {
    /**
     * 同步数据源元数据
     */
    syncMetadata(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取数据源的元数据结构
     */
    getMetadataStructure(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取同步历史记录
     */
    getSyncHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取表数据预览
     */
    previewTableData(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 验证同步元数据请求
     */
    validateSyncMetadata(): import("express-validator").ValidationChain[];
    /**
     * 验证预览表数据请求
     */
    validatePreviewTableData(): import("express-validator").ValidationChain[];
}
declare const _default: MetadataController;
export default _default;
