"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectorFactory = void 0;
const datasource_1 = require("./datasource");
const enhanced_mysql_connector_1 = require("../services/database/enhanced-mysql.connector");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * 数据库连接器工厂类
 * 负责创建匹配数据库类型的连接器
 */
class DatabaseConnectorFactory {
    /**
     * 创建数据库连接器
     * @param dataSourceId 数据源ID
     * @param type 数据库类型
     * @param config 连接配置
     * @returns 数据库连接器实例
     */
    static createConnector(dataSourceId, type, config) {
        logger_1.default.debug('创建数据库连接器', { dataSourceId, type });
        switch (type) {
            case datasource_1.DatabaseType.MYSQL:
                return new enhanced_mysql_connector_1.EnhancedMySQLConnector(dataSourceId, {
                    host: config.host,
                    port: config.port,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });
            case datasource_1.DatabaseType.POSTGRESQL:
                // 创建PostgreSQL连接器
                throw new Error('PostgreSQL连接器尚未实现');
            case datasource_1.DatabaseType.SQLSERVER:
                // 创建SQL Server连接器
                throw new Error('SQL Server连接器尚未实现');
            case datasource_1.DatabaseType.ORACLE:
                // 创建Oracle连接器
                throw new Error('Oracle连接器尚未实现');
            case datasource_1.DatabaseType.MONGODB:
                // 创建MongoDB连接器
                throw new Error('MongoDB连接器尚未实现');
            case datasource_1.DatabaseType.ELASTICSEARCH:
                // 创建Elasticsearch连接器
                throw new Error('Elasticsearch连接器尚未实现');
            default:
                throw new Error(`不支持的数据库类型: ${type}`);
        }
    }
}
exports.DatabaseConnectorFactory = DatabaseConnectorFactory;
//# sourceMappingURL=database-factory.js.map