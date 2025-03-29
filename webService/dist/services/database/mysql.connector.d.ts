import { DatabaseConnector, QueryResult, ColumnInfo, PrimaryKeyInfo, ForeignKeyInfo, IndexInfo, TableInfo, QueryOptions } from './dbInterface';
/**
 * MySQL连接器
 * 实现DatabaseConnector接口，提供MySQL数据库的连接和查询功能
 */
export declare class MySQLConnector implements DatabaseConnector {
    private _dataSourceId;
    private pool;
    private config;
    private activeQueries;
    /**
     * 构造函数
     * @param dataSourceId 数据源ID
     * @param config 连接配置对象
     */
    constructor(dataSourceId: string, config: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    });
    get dataSourceId(): string;
    /**
     * 测试数据库连接
     */
    testConnection(): Promise<boolean>;
    /**
     * 执行SQL查询
     */
    executeQuery(sql: string, params?: any[], queryId?: string, options?: QueryOptions): Promise<QueryResult>;
    /**
     * 获取查询执行计划
     * @param sql 查询语句
     * @param params 查询参数
     * @returns 执行计划
     */
    explainQuery(sql: string, params?: any[]): Promise<any>;
    /**
     * 检查SQL是否为SELECT查询
     */
    private isSelectQuery;
    /**
     * 将MySQL执行计划转换为统一格式
     */
    private convertToQueryPlan;
    /**
     * 分析执行计划并生成优化建议
     */
    private generateOptimizationTips;
    /**
     * 取消正在执行的查询
     * @param queryId 查询ID
     * @returns 是否成功取消
     */
    cancelQuery(queryId: string): Promise<boolean>;
    /**
     * 获取数据库架构列表
     * 在MySQL中，数据库名称相当于schema
     */
    getSchemas(): Promise<string[]>;
    /**
     * 获取表列表
     */
    getTables(schema?: string): Promise<TableInfo[]>;
    /**
     * 获取列信息
     */
    getColumns(schema: string, table: string): Promise<ColumnInfo[]>;
    /**
     * 获取主键信息
     */
    getPrimaryKeys(schema: string, table: string): Promise<PrimaryKeyInfo[]>;
    /**
     * 获取外键信息
     */
    getForeignKeys(schema: string, table: string): Promise<ForeignKeyInfo[]>;
    /**
     * 获取索引信息
     */
    getIndexes(schema: string, table: string): Promise<IndexInfo[]>;
    /**
     * 预览表数据
     */
    previewTableData(schema: string, table: string, limit?: number): Promise<QueryResult>;
    /**
     * 关闭连接
     */
    close(): Promise<void>;
}
