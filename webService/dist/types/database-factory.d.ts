import { DatabaseConnector } from './datasource';
import { DatabaseType } from './datasource';
/**
 * 数据库连接器工厂类
 * 负责创建匹配数据库类型的连接器
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
}
