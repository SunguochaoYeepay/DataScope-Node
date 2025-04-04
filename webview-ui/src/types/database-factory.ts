import { EnhancedMySQLConnector } from '../services/database/enhanced-mysql.connector';
import { DatabaseType } from './database';
import { ApiError } from '../utils/error';
import logger from '../utils/logger';
import { DatabaseConnector } from './datasource';
import { DatabaseConnector as DBInterfaceConnector } from '../services/database/dbInterface';
// 移除未实现的连接器导入
// import { PostgreSQLConnector } from '../services/database/postgresql.connector';
// import { MSSQLConnector } from '../services/database/mssql.connector';
// import { ClickHouseConnector } from '../services/database/clickhouse.connector';
// import { MongoDBConnector } from '../services/database/mongodb.connector';

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

// ... existing code ... 