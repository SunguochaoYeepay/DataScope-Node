import { DatabaseType } from './database';
import { DatabaseConnector } from './datasource';
/**
 * 数据库连接器工厂类
 * 用于创建不同类型数据库的连接器实例
 */
export declare class DatabaseConnectorFactory {
    /**
     * 创建数据库连接器
     * @param dataSourceId 数据源ID
     * @param type 数据库类型
     * @param config 连接配置
     * @returns 数据库连接器实例
     */
    static createConnector(dataSourceId: string, type: DatabaseType, config: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        [key: string]: any;
    }): DatabaseConnector;
    /**
     * 从缓存中获取连接器
     * @param dataSourceId 数据源ID
     * @returns 数据库连接器实例或undefined
     */
    static getConnectorFromCache(dataSourceId: string): DatabaseConnector | undefined;
    /**
     * 从缓存中移除连接器
     * @param dataSourceId 数据源ID
     */
    static removeConnectorFromCache(dataSourceId: string): void;
}
