/**
 * 数据库连接器接口
 * 定义所有支持的数据库类型必须实现的接口方法
 */
import { QueryPlan, QueryPlanNode, PerformanceConcern } from '../../types/query-plan';
export { QueryPlan, QueryPlanNode, PerformanceConcern };
export interface ColumnInfo {
    name: string;
    dataType: string;
    columnType: string;
    position: number;
    isNullable: boolean;
    isPrimaryKey: boolean;
    isUnique: boolean;
    isAutoIncrement: boolean;
    defaultValue: string | null;
    description: string | null;
    maxLength: number | null;
    precision: number | null;
    scale: number | null;
}
export interface PrimaryKeyInfo {
    constraintName: string;
    columnName: string;
    position: number;
}
export interface ForeignKeyInfo {
    constraintName: string;
    columnName: string;
    position: number;
    referencedSchema: string;
    referencedTable: string;
    referencedColumn: string;
    updateRule: string;
    deleteRule: string;
}
export interface IndexInfo {
    indexName: string;
    columnName: string;
    nonUnique: boolean;
    sequenceInIndex: number;
    indexType: string;
}
export interface TableInfo {
    name: string;
    type: string;
    schema: string | null;
    description: string | null;
    createTime: Date | null;
    updateTime: Date | null;
}
export interface QueryOptions {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    offset?: number;
    sort?: string;
    order?: string;
}
export interface QueryResult {
    fields: Array<{
        name: string;
        type: string;
        table?: string;
        schema?: string;
    }>;
    rows: any[];
    rowCount: number;
    totalCount?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
    affectedRows?: number;
    lastInsertId?: number | string;
}
export interface DatabaseConnector {
    /**
     * 测试数据库连接
     */
    testConnection(): Promise<boolean>;
    /**
     * 执行查询
     */
    executeQuery(sql: string, params?: any[], queryId?: string, options?: QueryOptions): Promise<QueryResult>;
    /**
     * 取消正在执行的查询
     * @param queryId 查询ID
     * @returns 是否成功取消
     */
    cancelQuery(queryId: string): Promise<boolean>;
    /**
     * 获取查询执行计划
     * @param sql 查询语句
     * @param params 查询参数
     * @returns 执行计划
     */
    explainQuery(sql: string, params?: any[]): Promise<QueryPlan>;
    /**
     * 获取查询计划（直接返回结构化数据）
     * @param sql 查询语句
     * @param params 查询参数
     * @returns 执行计划
     */
    getQueryPlan?(sql: string, params?: any[]): Promise<QueryPlan>;
    /**
     * 是否支持JSON格式的EXPLAIN
     */
    isJsonExplainSupported?: boolean;
    /**
     * 获取架构列表
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
export type IDatabaseConnector = DatabaseConnector;
export interface TableRelationship {
    name: string;
    sourceTable: string;
    targetTable: string;
    sourceColumn: string;
    targetColumn: string;
    type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
}
export interface TableMeta {
    name: string;
    description: string | null;
    columns: ColumnInfo[];
}
export interface QueryResulMeta {
    columns: Array<{
        name: string;
        type: string;
    }>;
    rowCount: number;
}
