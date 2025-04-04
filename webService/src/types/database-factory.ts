import { EnhancedMySQLConnector } from '../services/database/enhanced-mysql.connector';
import { DatabaseType } from './database';
import { ApiError } from '../utils/error';
import logger from '../utils/logger';
import { DatabaseConnector } from './datasource';
import { DatabaseConnector as DBInterfaceConnector } from '../services/database/dbInterface';
import { PostgreSQLConnector } from '../services/database/postgresql.connector';
import { MSSQLConnector } from '../services/database/mssql.connector';
import { ClickHouseConnector } from '../services/database/clickhouse.connector';
import { MongoDBConnector } from '../services/database/mongodb.connector';

// 缓存连接器实例
const connectorCache: Record<string, DatabaseConnector> = {};

/**
 * 数据源连接配置接口
 */
export interface DataSourceConnectConfig {
  host: string;
  port: number;
  user?: string;
  username?: string;
  password: string;
  database?: string;
  databaseName?: string;
  [key: string]: any;
}

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

    // 处理容器名称
    let resolvedHost = config.host;
    // 检查是否为常见的容器名称，在非容器环境中自动转换为localhost
    const containerNames = ['datascope-mysql', 'mysql', 'mariadb', 'database', 'db', 'datascope-postgres', 'postgres', 'datascope-mariadb'];
    if (containerNames.includes(resolvedHost)) {
      // 判断是否在容器环境中运行
      const isInContainer = process.env.CONTAINER_ENV === 'true';
      if (!isInContainer) {
        // 非容器环境，将容器名称转换为localhost
        logger.info(`将容器名称 ${config.host} 解析为 localhost`);
        resolvedHost = 'localhost';
      }
    }

    // 使用解析后的主机名
    const updatedConfig = {
      ...config,
      host: resolvedHost,
      // 确保username字段存在，用于向连接器传递
      username: config.user
    };
    
    // 准备调试输出
    const debugConfig = {
      host: updatedConfig.host,
      port: updatedConfig.port,
      user: updatedConfig.user,
      username: updatedConfig.username,
      database: updatedConfig.database
    };
    
    // 添加调试日志
    logger.debug('创建数据库连接器', {
      dataSourceId,
      type,
      host: updatedConfig.host,
      user: updatedConfig.user,
      username: updatedConfig.username,
      database: updatedConfig.database,
      hasPassword: !!updatedConfig.password,
      configObject: JSON.stringify(debugConfig)
    });

    // 根据数据库类型创建对应的连接器
    let connector: DatabaseConnector;
    
    const lowerType = type.toLowerCase() as Lowercase<DatabaseType>;

    switch (lowerType) {
      case 'mysql':
        // @ts-ignore
        const effectiveUsername = updatedConfig.username || updatedConfig.user;
        // 确保至少有一个有效的用户名
        if (!effectiveUsername) {
          logger.warn('MySQL配置中缺少有效的用户名', { dataSourceId, configFields: Object.keys(updatedConfig) });
        }
        logger.info('创建MySQL连接器', {
          dataSourceId,
          host: updatedConfig.host,
          port: updatedConfig.port,
          user: updatedConfig.user,
          username: updatedConfig.username,
          effectiveUsername,
          database: updatedConfig.database,
          configKeys: Object.keys(updatedConfig)
        });
        // 增强MySQL配置，确保用户名和数据库名在连接过程中不丢失
        const mysqlConfig = {
          ...updatedConfig,
          // 确保用户名字段都设置，因为不同的代码可能依赖不同的字段
          user: effectiveUsername,
          username: effectiveUsername
        };
        connector = new EnhancedMySQLConnector(dataSourceId, mysqlConfig);
        break;
      case 'postgresql':
        // 目前使用MySQL连接器做临时替代
        logger.warn('PostgreSQL连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, updatedConfig);
        break;
      case 'sqlserver':
        // 目前使用MySQL连接器做临时替代
        logger.warn('SQL Server连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, updatedConfig);
        break;
      case 'oracle':
        // 目前使用MySQL连接器做临时替代
        logger.warn('Oracle连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, updatedConfig);
        break;
      case 'mongodb':
        // 目前使用MySQL连接器做临时替代
        logger.warn('MongoDB连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, updatedConfig);
        break;
      case 'elasticsearch':
        // 目前使用MySQL连接器做临时替代
        logger.warn('Elasticsearch连接器尚未实现，临时使用MySQL连接器代替');
        connector = new EnhancedMySQLConnector(dataSourceId, updatedConfig);
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

  /**
   * 创建MySQL连接器
   */
  private static createMySQLConnector(dataSourceId: string, config: DataSourceConnectConfig): DatabaseConnector {
    // 确保用户名参数正确处理
    // username优先，如果没有则使用user
    const username = config.username || config.user || ''; // 确保不为undefined
    const database = config.database || config.databaseName || ''; // 确保不为undefined
    
    // 记录完整的连接配置
    logger.info('创建MySQL连接器配置', {
      dataSourceId,
      host: config.host,
      port: config.port,
      username,
      user: config.user,
      database,
      databaseName: config.databaseName,
      allConfigKeys: Object.keys(config).join(',')
    });

    // 为MySQLConnector创建统一的配置对象
    const mysqlConfig = {
      host: config.host,
      port: config.port,
      user: username, // 确保使用username
      username: username, // 同时设置username
      password: config.password,
      database: database // 确保使用database
    };

    // 创建并返回MySQL连接器实例
    return new EnhancedMySQLConnector(dataSourceId, mysqlConfig);
  }
}