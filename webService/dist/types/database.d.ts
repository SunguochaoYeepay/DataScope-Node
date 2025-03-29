/**
 * 数据库类型定义
 */
/**
 * 数据库类型枚举
 */
export declare enum DatabaseType {
    MySQL = "mysql",
    PostgreSQL = "postgresql",
    SQLServer = "sqlserver",
    Oracle = "oracle",
    MongoDB = "mongodb",
    Elasticsearch = "elasticsearch"
}
/**
 * 数据库连接配置
 */
export interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    ssl?: boolean;
    options?: Record<string, any>;
}
/**
 * 数据库查询结果
 */
export interface QueryResult {
    columns: string[];
    rows: any[];
    rowCount: number;
    executionTime: number;
}
/**
 * 数据库连接测试结果
 */
export interface ConnectionTestResult {
    success: boolean;
    message: string;
    details?: any;
}
