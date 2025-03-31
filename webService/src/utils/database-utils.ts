import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';
import { Pool, PoolClient } from 'pg';
import logger from './logger';
import ApiError from './apiError';

// Prisma客户端实例
const prisma = new PrismaClient();

/**
 * 数据库类型枚举
 */
export enum DatabaseType {
  MYSQL = 'mysql',
  POSTGRES = 'postgres'
}

/**
 * 数据库连接信息
 */
export interface DatabaseConnectionInfo {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

/**
 * 列信息类型
 */
export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue: string | null;
  comment: string | null;
}

/**
 * 查询结果接口
 */
export interface QueryResult {
  rows: any[];
  fields?: any[];
}

/**
 * 数据库连接器接口
 */
interface DatabaseConnector {
  connect(): Promise<void>;
  close(): Promise<void>;
  getTables(): Promise<string[]>;
  getColumns(tableName: string): Promise<any[]>;
  executeQuery(query: string): Promise<any>;
  getDatabaseSize?(): Promise<string>;
}

/**
 * MySQL数据库连接器实现
 */
class MySQLConnector implements DatabaseConnector {
  private config: mysql.ConnectionOptions;
  private connection: mysql.Connection | null = null;
  
  constructor(config: mysql.ConnectionOptions) {
    this.config = config;
  }
  
  /**
   * 连接到MySQL数据库
   */
  async connect(): Promise<void> {
    try {
      logger.debug('正在连接MySQL数据库...', { host: this.config.host, database: this.config.database });
      this.connection = await mysql.createConnection(this.config);
      logger.debug('已成功连接到MySQL数据库');
    } catch (error: any) {
      logger.error('MySQL数据库连接失败', { error });
      throw new ApiError(`MySQL数据库连接失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 关闭MySQL数据库连接
   */
  async close(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.end();
        this.connection = null;
        logger.debug('已关闭MySQL数据库连接');
      } catch (error: any) {
        logger.error('关闭MySQL数据库连接失败', { error });
      }
    }
  }
  
  /**
   * 获取MySQL数据库的表列表
   * @returns 表名数组
   */
  async getTables(): Promise<string[]> {
    if (!this.connection) {
      await this.connect();
    }
    
    try {
      const [rows] = await this.connection!.query<any[]>(
        'SELECT table_name FROM information_schema.tables WHERE table_schema = ?',
        [this.config.database]
      );
      
      return rows.map((row: any) => row.table_name || row.TABLE_NAME);
    } catch (error: any) {
      logger.error('获取MySQL表列表失败', { error });
      throw new ApiError(`获取表列表失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 获取MySQL表的列信息
   * @param tableName 表名
   * @returns 列信息数组
   */
  async getColumns(tableName: string): Promise<any[]> {
    if (!this.connection) {
      await this.connect();
    }
    
    try {
      const [rows] = await this.connection!.query<any[]>(
        'SELECT column_name as name, data_type as type, ' +
        'is_nullable as nullable, column_default as defaultValue, ' +
        'column_key as columnKey, extra ' +
        'FROM information_schema.columns ' +
        'WHERE table_schema = ? AND table_name = ?',
        [this.config.database, tableName]
      );
      
      return rows.map((row: any) => ({
        name: row.name || row.NAME,
        type: row.type || row.TYPE,
        nullable: (row.nullable || row.NULLABLE) === 'YES',
        defaultValue: row.defaultValue || row.DEFAULTVALUE,
        isPrimaryKey: (row.columnKey || row.COLUMNKEY) === 'PRI',
        isAutoIncrement: (row.extra || row.EXTRA)?.includes('auto_increment')
      }));
    } catch (error: any) {
      logger.error(`获取MySQL表 ${tableName} 的列信息失败`, { error });
      throw new ApiError(`获取表 ${tableName} 的列信息失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 执行MySQL查询
   * @param query SQL查询语句
   * @returns 查询结果
   */
  async executeQuery(query: string): Promise<any> {
    if (!this.connection) {
      await this.connect();
    }
    
    try {
      const [rows] = await this.connection!.query(query);
      return { rows };
    } catch (error: any) {
      logger.error('执行MySQL查询失败', { error, query });
      throw new ApiError(`执行查询失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 获取MySQL数据库大小
   * @returns 数据库大小（格式化为人类可读的字符串）
   */
  async getDatabaseSize(): Promise<string> {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      const query = `
        SELECT 
          SUM(data_length + index_length) / 1024 / 1024 as size_mb,
          ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as formatted_size
        FROM information_schema.TABLES 
        WHERE table_schema = ?
      `;
      
      const [results]: any[] = await this.connection!.execute(query, [this.config.database]);
      
      if (results && Array.isArray(results) && results.length > 0) {
        const sizeMB = parseFloat(results[0].size_mb);
        if (sizeMB < 1024) {
          return `${results[0].formatted_size} MB`;
        } else {
          const sizeGB = (sizeMB / 1024).toFixed(2);
          return `${sizeGB} GB`;
        }
      }
      
      return '未知';
    } catch (error) {
      logger.error('获取MySQL数据库大小失败', { error });
      return '未知';
    }
  }
}

/**
 * PostgreSQL数据库连接器实现
 */
class PostgresConnector implements DatabaseConnector {
  private config: any;
  private pool: Pool | null = null;
  private client: PoolClient | null = null;
  
  constructor(config: any) {
    this.config = {
      host: config.host,
      port: config.port || 5432,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl === true ? { rejectUnauthorized: false } : false
    };
  }
  
  /**
   * 连接到PostgreSQL数据库
   */
  async connect(): Promise<void> {
    try {
      logger.debug('正在连接PostgreSQL数据库...', { host: this.config.host, database: this.config.database });
      this.pool = new Pool(this.config);
      this.client = await this.pool.connect();
      logger.debug('已成功连接到PostgreSQL数据库');
    } catch (error: any) {
      logger.error('PostgreSQL数据库连接失败', { error });
      throw new ApiError(`PostgreSQL数据库连接失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 关闭PostgreSQL数据库连接
   */
  async close(): Promise<void> {
    if (this.client) {
      try {
        this.client.release();
        this.client = null;
      } catch (error: any) {
        logger.error('释放PostgreSQL客户端失败', { error });
      }
    }
    
    if (this.pool) {
      try {
        await this.pool.end();
        this.pool = null;
        logger.debug('已关闭PostgreSQL数据库连接');
      } catch (error: any) {
        logger.error('关闭PostgreSQL连接池失败', { error });
      }
    }
  }
  
  /**
   * 获取PostgreSQL数据库的表列表
   * @returns 表名数组
   */
  async getTables(): Promise<string[]> {
    if (!this.client) {
      await this.connect();
    }
    
    try {
      const result = await this.client!.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      
      return result.rows.map((row: any) => row.table_name);
    } catch (error: any) {
      logger.error('获取PostgreSQL表列表失败', { error });
      throw new ApiError(`获取表列表失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 获取PostgreSQL表的列信息
   * @param tableName 表名
   * @returns 列信息数组
   */
  async getColumns(tableName: string): Promise<any[]> {
    if (!this.client) {
      await this.connect();
    }
    
    try {
      const result = await this.client!.query(
        `SELECT 
          column_name as name, 
          data_type as type,
          is_nullable as nullable,
          column_default as defaultvalue,
          (SELECT true FROM information_schema.table_constraints tc
           JOIN information_schema.constraint_column_usage ccu 
           ON tc.constraint_name = ccu.constraint_name
           WHERE tc.constraint_type = 'PRIMARY KEY' 
           AND tc.table_name = $1
           AND ccu.column_name = columns.column_name) as isprimarykey
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1`,
        [tableName]
      );
      
      return result.rows.map((row: any) => ({
        name: row.name,
        type: row.type,
        nullable: row.nullable === 'YES',
        defaultValue: row.defaultvalue,
        isPrimaryKey: !!row.isprimarykey
      }));
    } catch (error: any) {
      logger.error(`获取PostgreSQL表 ${tableName} 的列信息失败`, { error });
      throw new ApiError(`获取表 ${tableName} 的列信息失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 执行PostgreSQL查询
   * @param query SQL查询语句
   * @returns 查询结果
   */
  async executeQuery(query: string): Promise<any> {
    if (!this.client) {
      await this.connect();
    }
    
    try {
      const result = await this.client!.query(query);
      return { rows: result.rows };
    } catch (error: any) {
      logger.error('执行PostgreSQL查询失败', { error, query });
      throw new ApiError(`执行查询失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 获取PostgreSQL数据库大小
   * @returns 数据库大小（格式化为人类可读的字符串）
   */
  async getDatabaseSize(): Promise<string> {
    try {
      if (!this.client) {
        await this.connect();
      }
      
      const query = `
        SELECT 
          pg_size_pretty(pg_database_size($1)) as size
      `;
      
      const result = await this.client!.query(query, [this.config.database]);
      
      if (result && result.rows && result.rows.length > 0) {
        return result.rows[0].size;
      }
      
      return '未知';
    } catch (error) {
      logger.error('获取PostgreSQL数据库大小失败', { error });
      return '未知';
    }
  }
}

/**
 * 数据库连接器工厂类
 */
export class DatabaseConnectorFactory {
  /**
   * 从数据源ID创建连接器
   * @param dataSourceId 数据源ID
   * @returns 数据库连接器实例
   */
  static async createConnectorFromDataSourceId(dataSourceId: string): Promise<DatabaseConnector> {
    try {
      // 获取数据源信息
      const dataSource = await prisma.dataSource.findUnique({
        where: { id: dataSourceId }
      });
      
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, 404);
      }
      
      // 根据数据源类型创建连接器
      const config = {
        host: dataSource.host,
        port: dataSource.port,
        user: dataSource.username,
        password: dataSource.passwordEncrypted, // 假设这里应该是解密后的密码
        database: dataSource.databaseName,
      };
      
      if (dataSource.type === 'mysql') {
        const mysqlConfig = {
          ...config,
          ssl: undefined // 默认不使用SSL
        };
        return new MySQLConnector(mysqlConfig);
      } else if (dataSource.type === 'postgres') {
        return new PostgresConnector(config);
      } else {
        throw new ApiError(`不支持的数据库类型: ${dataSource.type}`, 400);
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('创建数据库连接器失败', { error, dataSourceId });
      throw new ApiError(`创建数据库连接器失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 测试数据源连接
   * @param dataSourceConfig 数据源配置
   * @returns 连接测试结果
   */
  static async testConnection(dataSourceConfig: any): Promise<any> {
    let connector: DatabaseConnector | null = null;
    
    try {
      const config = {
        host: dataSourceConfig.host,
        port: dataSourceConfig.port,
        user: dataSourceConfig.username,
        password: dataSourceConfig.password,
        database: dataSourceConfig.databaseName,
        ssl: dataSourceConfig.ssl || false
      };
      
      if (dataSourceConfig.type === 'mysql') {
        connector = new MySQLConnector(config);
      } else if (dataSourceConfig.type === 'postgres') {
        connector = new PostgresConnector(config);
      } else {
        throw new ApiError(`不支持的数据库类型: ${dataSourceConfig.type}`, 400);
      }
      
      // 测试连接
      await connector.connect();
      
      // 获取基本信息
      const tables = await connector.getTables();
      
      return {
        success: true,
        message: '连接成功',
        data: {
          tablesCount: tables.length,
          tables: tables.slice(0, 5) // 只返回前5个表名作为示例
        }
      };
    } catch (error: any) {
      logger.error('数据库连接测试失败', { error, config: dataSourceConfig });
      return {
        success: false,
        message: `连接失败: ${error.message}`
      };
    } finally {
      if (connector) {
        await connector.close();
      }
    }
  }
} 