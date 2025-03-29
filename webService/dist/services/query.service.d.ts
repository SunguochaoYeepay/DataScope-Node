import { Query, QueryHistory } from '@prisma/client';
export declare class QueryService {
    /**
     * 执行SQL查询
     */
    executeQuery(dataSourceId: string, sql: string, params?: any[], options?: {
        page?: number;
        pageSize?: number;
        offset?: number;
        limit?: number;
        sort?: string;
        order?: 'asc' | 'desc';
    }): Promise<any>;
    /**
     * 获取查询执行计划
     */
    explainQuery(dataSourceId: string, sql: string, params?: any[]): Promise<any>;
    /**
     * 保存查询计划到历史记录
     * @param dataSourceId 数据源ID
     * @param sql SQL查询语句
     * @param plan 执行计划
     */
    private saveQueryPlanToHistory;
    /**
     * 获取查询计划历史记录
     * @param id 查询计划ID
     * @returns 查询计划历史记录
     */
    getQueryPlanById(id: string): Promise<any | null>;
    /**
     * 获取查询计划历史记录列表
     * @param dataSourceId 数据源ID
     * @param limit 每页数量
     * @param offset 偏移量
     * @returns 查询计划历史记录列表
     */
    getQueryPlanHistory(dataSourceId?: string, limit?: number, offset?: number): Promise<{
        history: any[];
        total: number;
        limit: number;
        offset: number;
    }>;
    /**
     * 取消正在执行的查询
     */
    cancelQuery(queryId: string): Promise<boolean>;
    /**
     * 保存查询
     */
    saveQuery(data: {
        name: string;
        dataSourceId: string;
        sql: string;
        description?: string;
        tags?: string[];
        isPublic?: boolean;
    }): Promise<Query>;
    /**
     * 获取已保存的查询列表
     */
    getQueries(options?: {
        dataSourceId?: string;
        tag?: string;
        isPublic?: boolean;
        search?: string;
    }): Promise<Query[]>;
    /**
     * 根据ID获取查询
     */
    getQueryById(id: string): Promise<Query>;
    /**
     * 更新查询
     */
    updateQuery(id: string, data: {
        name?: string;
        sql?: string;
        description?: string;
        tags?: string[];
        isPublic?: boolean;
    }): Promise<Query>;
    /**
     * 删除查询
     */
    deleteQuery(id: string): Promise<void>;
    /**
     * 获取查询历史记录列表
     * @param dataSourceId 数据源ID
     * @param limit 每页数量
     * @param offset 偏移量
     * @returns 查询历史记录列表
     */
    getQueryHistory(dataSourceId?: string, limit?: number, offset?: number): Promise<{
        history: QueryHistory[];
        total: number;
        limit: number;
        offset: number;
    }>;
}
declare const _default: QueryService;
export default _default;
