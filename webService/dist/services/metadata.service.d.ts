export declare class MetadataService {
    /**
     * 同步数据源元数据
     *
     * @param dataSourceId 数据源ID
     * @param options 同步选项
     * @returns 同步结果
     */
    syncMetadata(dataSourceId: string, options?: {
        syncType?: 'FULL' | 'INCREMENTAL';
        schemaPattern?: string;
        tablePattern?: string;
    }): Promise<{
        tablesCount: number;
        viewsCount: number;
        syncHistoryId: string;
    }>;
    /**
     * 获取数据源的元数据结构
     *
     * @param dataSourceId 数据源ID
     * @returns 元数据结构
     */
    getMetadataStructure(dataSourceId: string): Promise<any>;
    /**
     * 获取同步历史记录
     *
     * @param dataSourceId 数据源ID
     * @param limit 限制返回数量
     * @param offset 偏移量
     * @returns 同步历史记录
     */
    getSyncHistory(dataSourceId: string, limit?: number, offset?: number): Promise<{
        history: any[];
        total: number;
        limit: number;
        offset: number;
    }>;
    /**
     * 获取表数据预览
     *
     * @param dataSourceId 数据源ID
     * @param schemaName 架构名称
     * @param tableName 表名称
     * @param limit 限制返回行数
     * @returns 表数据预览
     */
    previewTableData(dataSourceId: string, schemaName: string, tableName: string, limit?: number): Promise<any>;
}
declare const _default: MetadataService;
export default _default;
