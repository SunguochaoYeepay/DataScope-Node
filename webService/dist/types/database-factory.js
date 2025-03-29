"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectorFactory = void 0;
const enhanced_mysql_connector_1 = require("../services/database/enhanced-mysql.connector");
const error_1 = require("../utils/error");
const logger_1 = __importDefault(require("../utils/logger"));
// 缓存连接器实例
const connectorCache = {};
/**
 * 数据库连接器工厂类
 * 用于创建不同类型数据库的连接器实例
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
        // 检查缓存中是否已存在连接器实例
        const cacheKey = `${dataSourceId}`;
        if (connectorCache[cacheKey]) {
            return connectorCache[cacheKey];
        }
        // 根据数据库类型创建对应的连接器
        let connector;
        const lowerType = type.toLowerCase();
        switch (lowerType) {
            case 'mysql':
                connector = new enhanced_mysql_connector_1.EnhancedMySQLConnector(dataSourceId, config);
                break;
            case 'postgresql':
                // 目前使用MySQL连接器做临时替代
                logger_1.default.warn('PostgreSQL连接器尚未实现，临时使用MySQL连接器代替');
                connector = new enhanced_mysql_connector_1.EnhancedMySQLConnector(dataSourceId, config);
                break;
            case 'sqlserver':
                // 目前使用MySQL连接器做临时替代
                logger_1.default.warn('SQL Server连接器尚未实现，临时使用MySQL连接器代替');
                connector = new enhanced_mysql_connector_1.EnhancedMySQLConnector(dataSourceId, config);
                break;
            case 'oracle':
                // 目前使用MySQL连接器做临时替代
                logger_1.default.warn('Oracle连接器尚未实现，临时使用MySQL连接器代替');
                connector = new enhanced_mysql_connector_1.EnhancedMySQLConnector(dataSourceId, config);
                break;
            case 'mongodb':
                // 目前使用MySQL连接器做临时替代
                logger_1.default.warn('MongoDB连接器尚未实现，临时使用MySQL连接器代替');
                connector = new enhanced_mysql_connector_1.EnhancedMySQLConnector(dataSourceId, config);
                break;
            case 'elasticsearch':
                // 目前使用MySQL连接器做临时替代
                logger_1.default.warn('Elasticsearch连接器尚未实现，临时使用MySQL连接器代替');
                connector = new enhanced_mysql_connector_1.EnhancedMySQLConnector(dataSourceId, config);
                break;
            default:
                logger_1.default.error(`不支持的数据库类型: ${type}`);
                throw new error_1.ApiError(`不支持的数据库类型: ${type}`, 400);
        }
        // 缓存连接器实例
        connectorCache[cacheKey] = connector;
        return connector;
    }
    /**
     * 从缓存中获取连接器
     * @param dataSourceId 数据源ID
     * @returns 数据库连接器实例或undefined
     */
    static getConnectorFromCache(dataSourceId) {
        return connectorCache[dataSourceId];
    }
    /**
     * 从缓存中移除连接器
     * @param dataSourceId 数据源ID
     */
    static removeConnectorFromCache(dataSourceId) {
        delete connectorCache[dataSourceId];
    }
}
exports.DatabaseConnectorFactory = DatabaseConnectorFactory;
//# sourceMappingURL=database-factory.js.map