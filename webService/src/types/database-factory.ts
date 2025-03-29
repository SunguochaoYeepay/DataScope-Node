import { EnhancedMySQLConnector } from '../services/database/enhanced-mysql.connector';
import { DatabaseType } from './database';
import { ApiError } from '../utils/error';
import logger from '../utils/logger';
import { DatabaseConnector } from './datasource';

// 缓存连接器实例
const connectorCache: Record<string, DatabaseConnector> = {};

/**
 * 数据库连接器工厂类
 * 用于创建不同类型数据库的连接器实例
 */
export class DatabaseConnectorFactory {
  /**
   * 创建数据库连接器
   * @param dataSourceId 数据源ID
   * @param type 数据库类型
   * @param config 连接配置
   * @returns 数据库连接器实例
   */
  static createConnector(
    dataSourceId: string,
    type: DatabaseType,
    config: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      [key: string]: any;
    }
  ): DatabaseConnector {
    // 检查缓存中是否已存在连接器实例
    const cacheKey = `${dataSourceId}`;
    if (connectorCache[cacheKey]) {
      return connectorCache[cacheKey];
    }

    // 根据数据库类型创建对应的连接器
    let connector: DatabaseConnector;
    
    const lowerType = type.toLowerCase() as Lowercase<DatabaseType>;

    switch (lowerType) {
      case 'mysql':
        connector = new EnhancedMySQLConnector(dataSourceId, config);
        break;
      case 'postgresql':
        // 目前使用MySQL连接器做临时替代
        logger.warn('PostgreSQL连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, config);
        break;
      case 'sqlserver':
        // 目前使用MySQL连接器做临时替代
        logger.warn('SQL Server连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, config);
        break;
      case 'oracle':
        // 目前使用MySQL连接器做临时替代
        logger.warn('Oracle连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, config);
        break;
      case 'mongodb':
        // 目前使用MySQL连接器做临时替代
        logger.warn('MongoDB连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, config);
        break;
      case 'elasticsearch':
        // 目前使用MySQL连接器做临时替代
        logger.warn('Elasticsearch连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, config);
        break;
      default:
        logger.error(`不支持的数据库类型: ${type}`);
        throw new ApiError(`不支持的数据库类型: ${type}`, 400);
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
  static getConnectorFromCache(dataSourceId: string): DatabaseConnector | undefined {
    return connectorCache[dataSourceId];
  }

  /**
   * 从缓存中移除连接器
   * @param dataSourceId 数据源ID
   */
  static removeConnectorFromCache(dataSourceId: string): void {
    delete connectorCache[dataSourceId];
  }
}