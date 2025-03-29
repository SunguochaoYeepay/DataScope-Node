import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
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
    /**
     * 分析表列详细信息
     */
    analyzeColumn(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 验证列分析请求
     */
    validateColumnAnalysis(): import("express-validator").ValidationChain[];
    /**
     * 获取数据源数据库结构
     * @param req 请求对象
     * @param res 响应对象
     */
    getDatabaseStructure(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * 获取表的数据示例（预览）
     */
    private getTablePreviewInternal;
    /**
     * 获取表详细信息
     * @param req 请求对象
     * @param res 响应对象
     */
    getTableDetails(req: AuthenticatedRequest, res: Response): Promise<void>;
}
declare const _default: MetadataController;
export default _default;
