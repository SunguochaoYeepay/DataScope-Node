import { ApiError } from './errors/types/api-error';
import logger from './logger';
import mysql, { Pool, FieldPacket, QueryResult } from 'mysql2/promise';
import {  Client } from 'pg';
import { ERROR_CODES } from './errors/error-codes';

// 数据库类型枚举
export enum DatabaseType {
  MYSQL = 'mysql',
  POSTGRESQL = 'postgresql',
  ORACLE = 'oracle',
  SQLITE = 'sqlite',
  MONGODB = 'mongodb',
  REDSHIFT = 'redshift',
  SNOWFLAKE = 'snowflake',
  BIGQUERY = 'bigquery',
  SQL_SERVER = 'sqlserver'
}

/**
 * 数据库连接器接口
 */
export interface DatabaseConnector {
  connect(): Promise<any>;
  disconnect(): Promise<void>;
  close?(): Promise<void>;
  testConnection(): Promise<boolean>;
  getTables(): Promise<any[]>;
  getTableStructure(tableName: string): Promise<any>;
  getColumns?(tableName: string): Promise<any[]>;
  executeQuery(query: string): Promise<any>;
  getDatabaseSize?(): Promise<string>;
}

/**
 * MySQL数据库连接器
 */
export class MySQLConnector implements DatabaseConnector {
  private connection: Pool | null = null;
  
  constructor(
    private host: string,
    private port: number,
    private user: string,
    private password: string,
    private database: string,
    private options: any = {}
  ) {}
  
  /**
   * 连接MySQL数据库
   */
  async connect(): Promise<Pool> {
    try {
      logger.debug('创建数据库连接', {
        host: this.host,
        port: this.port,
        user: this.user,
        database: this.database
      });
      
      this.connection = await mysql.createPool({
        host: this.host,
        port: this.port,
        user: this.user,
        password: this.password,
        database: this.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ...this.options
      });
      
      // 测试连接
      await this.testConnection();
      
      logger.debug('已成功连接到MySQL数据库');
      return this.connection;
    } catch (error: any) {
      logger.error('MySQL数据库连接失败', { error });
      throw new Error(`MySQL数据库连接失败: ${error.message}`);
    }
  }
  
  /**
   * 断开MySQL数据库连接
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      logger.debug('已关闭MySQL数据库连接');
    }
  }
  
  /**
   * 测试MySQL数据库连接
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      if (this.connection) {
        const [result] = await this.connection.query('SELECT 1');
        return Array.isArray(result) && result.length > 0;
      }
      
      return false;
    } catch (error: any) {
      logger.error('MySQL数据库连接测试失败', { error });
      throw new Error(`MySQL数据库连接测试失败: ${error.message}`);
    }
  }
  
  /**
   * 获取MySQL数据库表列表
   */
  async getTables(): Promise<any[]> {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      if (!this.connection) {
        throw new Error('数据库连接失败');
      }
      
      const [rows] = await this.connection.query(
        'SELECT TABLE_NAME as name, TABLE_TYPE as type, TABLE_COMMENT as comment FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?',
        [this.database]
      );
      
      return Array.isArray(rows) ? rows : [];
    } catch (error: any) {
      logger.error('获取MySQL数据库表列表失败', { error });
      throw new Error(`获取MySQL数据库表列表失败: ${error.message}`);
    }
  }
  
  /**
   * 获取MySQL数据库表结构
   * @param tableName 表名
   */
  async getTableStructure(tableName: string): Promise<any> {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      if (!this.connection) {
        throw new Error('数据库连接失败');
      }
      
      // 获取列信息
      const [columns] = await this.connection.query(
        'SELECT COLUMN_NAME as name, DATA_TYPE as type, IS_NULLABLE as nullable, COLUMN_KEY as keyType, COLUMN_DEFAULT as defaultValue, EXTRA as extra, COLUMN_COMMENT as comment FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION',
        [this.database, tableName]
      );
      
      // 获取索引信息
      const [indexes] = await this.connection.query(
        'SELECT INDEX_NAME as name, COLUMN_NAME as column_name, NON_UNIQUE as non_unique FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY INDEX_NAME, SEQ_IN_INDEX',
        [this.database, tableName]
      );
      
      // 处理索引信息
      const indexMap = new Map();
      if (Array.isArray(indexes)) {
        for (const index of indexes as any[]) {
          if (!indexMap.has(index.name)) {
            indexMap.set(index.name, {
              name: index.name,
              columns: [],
              unique: index.non_unique === 0
            });
          }
          indexMap.get(index.name).columns.push(index.column_name);
        }
      }
      
      return {
        tableName,
        columns: Array.isArray(columns) ? columns : [],
        indexes: Array.from(indexMap.values())
      };
    } catch (error: any) {
      logger.error(`获取MySQL数据库表结构失败: ${tableName}`, { error });
      throw new Error(`获取MySQL数据库表结构失败: ${error.message}`);
    }
  }
  
  /**
   * 执行MySQL查询
   * @param query 查询语句
   */
  async executeQuery(query: string): Promise<any> {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      if (!this.connection) {
        throw new Error('数据库连接失败');
      }
      
      const [rows, fields] = await this.connection.query(query);
      return { rows, fields };
    } catch (error: any) {
      logger.error(`执行MySQL查询失败: ${query}`, { error });
      throw new Error(`执行MySQL查询失败: ${error.message}`);
    }
  }
  
  /**
   * 获取MySQL数据库大小
   */
  async getDatabaseSize(): Promise<string> {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      if (!this.connection) {
        throw new Error('数据库连接失败');
      }
      
      const [result] = await this.connection.query(
        `SELECT 
          ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'size_in_mb'
        FROM information_schema.TABLES
        WHERE table_schema = ?`,
        [this.database]
      );
      
      if (Array.isArray(result) && result.length > 0) {
        const resultRow = result[0] as any;
        const size = resultRow.size_in_mb;
        if (size >= 1024) {
          return `${(size / 1024).toFixed(2)} GB`;
        } else {
          return `${size} MB`;
        }
      }
      
      return '0 MB';
    } catch (error: any) {
      logger.error('获取MySQL数据库大小失败', { error });
      throw new Error(`获取MySQL数据库大小失败: ${error.message}`);
    }
  }
  
  /**
   * 关闭连接 - 别名方法，调用disconnect
   */
  async close(): Promise<void> {
    return this.disconnect();
  }
  
  /**
   * 获取表字段信息
   * @param tableName 表名
   */
  async getColumns(tableName: string): Promise<any[]> {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      if (!this.connection) {
        throw new Error('数据库连接失败');
      }
      
      const [columns] = await this.connection.query(
        'SELECT COLUMN_NAME as name, DATA_TYPE as type, IS_NULLABLE as nullable, COLUMN_KEY as keyType, COLUMN_DEFAULT as defaultValue, EXTRA as extra, COLUMN_COMMENT as comment FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION',
        [this.database, tableName]
      );
      
      return Array.isArray(columns) ? columns : [];
    } catch (error: any) {
      logger.error(`获取表 ${tableName} 的列定义失败`, { error });
      throw new Error(`获取表列定义失败: ${error.message}`);
    }
  }
}

/**
 * PostgreSQL数据库连接器
 */
export class PostgresConnector implements DatabaseConnector {
  private client: Client | null = null;
  
  constructor(
    private host: string,
    private port: number,
    private user: string,
    private password: string,
    private database: string,
    private options: any = {}
  ) {}
  
  /**
   * 连接PostgreSQL数据库
   */
  async connect(): Promise<Client> {
    try {
      logger.debug('创建PostgreSQL数据库连接', {
        host: this.host,
        port: this.port,
        user: this.user,
        database: this.database
      });
      
      this.client = new Client({
        host: this.host,
        port: this.port,
        user: this.user,
        password: this.password,
        database: this.database,
        ...this.options
      });
      
      await this.client.connect();
      logger.debug('已成功连接到PostgreSQL数据库');
      return this.client;
    } catch (error: any) {
      logger.error('PostgreSQL数据库连接失败', { error });
      throw new Error(`PostgreSQL数据库连接失败: ${error.message}`);
    }
  }
  
  /**
   * 断开PostgreSQL数据库连接
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
      logger.debug('已关闭PostgreSQL数据库连接');
    }
  }
  
  /**
   * 测试PostgreSQL数据库连接
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.client) {
        await this.connect();
      }
      
      if (this.client) {
        const result = await this.client.query('SELECT 1');
        return result.rowCount !== null && result.rowCount > 0;
      }
      
      return false;
    } catch (error: any) {
      logger.error('PostgreSQL数据库连接测试失败', { error });
      throw new Error(`PostgreSQL数据库连接测试失败: ${error.message}`);
    }
  }
  
  /**
   * 获取PostgreSQL数据库表列表
   */
  async getTables(): Promise<any[]> {
    try {
      if (!this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        throw new Error('数据库连接失败');
      }
      
      const result = await this.client.query(`
        SELECT 
          table_name as name,
          CASE 
            WHEN table_type = 'BASE TABLE' THEN 'TABLE'
            ELSE table_type
          END as type,
          obj_description(c.oid) as comment
        FROM 
          information_schema.tables t
        JOIN 
          pg_class c ON c.relname = t.table_name
        JOIN 
          pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
        WHERE 
          table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY 
          table_name
      `);
      
      return result.rows;
    } catch (error: any) {
      logger.error('获取PostgreSQL数据库表列表失败', { error });
      throw new Error(`获取PostgreSQL数据库表列表失败: ${error.message}`);
    }
  }
  
  /**
   * 获取PostgreSQL数据库表结构
   * @param tableName 表名
   */
  async getTableStructure(tableName: string): Promise<any> {
    try {
      if (!this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        throw new Error('数据库连接失败');
      }
      
      // 获取列信息
      const columnsResult = await this.client.query(`
        SELECT 
          column_name as name,
          data_type as type,
          CASE WHEN is_nullable = 'YES' THEN true ELSE false END as nullable,
          column_default as defaultValue,
          CASE WHEN is_identity = 'YES' THEN 'IDENTITY' ELSE '' END as extra,
          col_description(c.oid, a.attnum) as comment
        FROM 
          information_schema.columns ic
        JOIN 
          pg_class c ON c.relname = ic.table_name
        JOIN 
          pg_attribute a ON a.attrelid = c.oid AND a.attname = ic.column_name
        WHERE 
          ic.table_name = $1
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY 
          ordinal_position
      `, [tableName]);
      
      // 获取索引信息
      const indexesResult = await this.client.query(`
        SELECT
          i.relname as name,
          a.attname as column_name,
          ix.indisunique as is_unique
        FROM
          pg_class t,
          pg_class i,
          pg_index ix,
          pg_attribute a
        WHERE
          t.oid = ix.indrelid
          AND i.oid = ix.indexrelid
          AND a.attrelid = t.oid
          AND a.attnum = ANY(ix.indkey)
          AND t.relkind = 'r'
          AND t.relname = $1
        ORDER BY
          i.relname, a.attnum
      `, [tableName]);
      
      // 处理索引信息
      const indexMap = new Map();
      for (const index of indexesResult.rows) {
        if (!indexMap.has(index.name)) {
          indexMap.set(index.name, {
            name: index.name,
            columns: [],
            unique: index.is_unique
          });
        }
        indexMap.get(index.name).columns.push(index.column_name);
      }
      
      return {
        tableName,
        columns: columnsResult.rows,
        indexes: Array.from(indexMap.values())
      };
    } catch (error: any) {
      logger.error(`获取PostgreSQL数据库表结构失败: ${tableName}`, { error });
      throw new Error(`获取PostgreSQL数据库表结构失败: ${error.message}`);
    }
  }
  
  /**
   * 执行PostgreSQL查询
   * @param query 查询语句
   */
  async executeQuery(query: string): Promise<any> {
    try {
      if (!this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        throw new Error('数据库连接失败');
      }
      
      const result = await this.client.query(query);
      return { rows: result.rows, fields: result.fields };
    } catch (error: any) {
      logger.error(`执行PostgreSQL查询失败: ${query}`, { error });
      throw new Error(`执行PostgreSQL查询失败: ${error.message}`);
    }
  }
  
  /**
   * 获取PostgreSQL数据库大小
   */
  async getDatabaseSize(): Promise<string> {
    try {
      if (!this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        throw new Error('数据库连接失败');
      }
      
      const result = await this.client.query(`
        SELECT pg_size_pretty(pg_database_size($1)) as size
      `, [this.database]);
      
      if (result.rows.length > 0) {
        return result.rows[0].size;
      }
      
      return '0 MB';
    } catch (error: any) {
      logger.error('获取PostgreSQL数据库大小失败', { error });
      throw new Error(`获取PostgreSQL数据库大小失败: ${error.message}`);
    }
  }
  
  /**
   * 关闭连接 - 别名方法，调用disconnect
   */
  async close(): Promise<void> {
    return this.disconnect();
  }
  
  /**
   * 获取表字段信息
   * @param tableName 表名
   */
  async getColumns(tableName: string): Promise<any[]> {
    try {
      if (!this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        throw new Error('数据库连接失败');
      }
      
      const result = await this.client.query(`
        SELECT 
          column_name as name,
          data_type as type,
          CASE WHEN is_nullable = 'YES' THEN true ELSE false END as nullable,
          column_default as defaultValue,
          CASE WHEN is_identity = 'YES' THEN 'IDENTITY' ELSE '' END as extra,
          col_description(c.oid, a.attnum) as comment
        FROM 
          information_schema.columns ic
        JOIN 
          pg_class c ON c.relname = ic.table_name
        JOIN 
          pg_attribute a ON a.attrelid = c.oid AND a.attname = ic.column_name
        WHERE 
          ic.table_name = $1
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY 
          ordinal_position
      `, [tableName]);
      
      return result.rows;
    } catch (error: any) {
      logger.error(`获取表 ${tableName} 的列定义失败`, { error });
      throw new Error(`获取表列定义失败: ${error.message}`);
    }
  }
}

/**
 * 数据库连接器工厂类
 */
export class DatabaseConnectorFactory {
  /**
   * 创建数据库连接器
   * @param type 数据库类型
   * @param config 数据库配置
   */
  static createConnector(type: string, config: any): DatabaseConnector {
    switch (type.toLowerCase()) {
      case DatabaseType.MYSQL:
        return new MySQLConnector(
          config.host,
          config.port,
          config.user || config.username,
          config.password,
          config.database || config.databaseName,
          config.options
        );
      case DatabaseType.POSTGRESQL:
        return new PostgresConnector(
          config.host,
          config.port,
          config.user || config.username,
          config.password,
          config.database || config.databaseName,
          config.options
        );
      default:
        throw new ApiError(`不支持的数据库类型: ${type}`, ERROR_CODES.BAD_REQUEST);
    }
  }
  
  /**
   * 从数据源ID创建连接器
   * @param dataSourceId 数据源ID
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
      
      // 解密密码
      let password;
      
      // 特殊情况处理：如果密码和盐值相同，直接使用密码（兼容开发环境的简化设置）
      if (dataSource.passwordEncrypted === dataSource.passwordSalt) {
        logger.debug('使用明文存储的密码');
        password = dataSource.passwordEncrypted;
      } else {
        // 正常的解密流程
        try {
          // 导入解密工具
          const cryptoUtils = await import('./crypto');
          
          // 解密密码
          password = cryptoUtils.decrypt(
            dataSource.passwordEncrypted,
            dataSource.passwordSalt
          );
        } catch (err) {
          logger.error('密码解密失败', err);
          throw new Error('解密失败');
        }
      }
      
      // 预处理主机名 - 处理容器名称
      let host = dataSource.host;
      let options = {};
      
      // 如果是Docker环境，替换主机名
      if (process.env.DOCKER_ENV === 'true' && host.endsWith('.docker.local')) {
        host = host.replace('.docker.local', '');
        logger.debug(`Docker环境替换主机名: ${dataSource.host} -> ${host}`);
      }
      
      // 创建连接器
      return DatabaseConnectorFactory.createConnector(
        dataSource.type,
        {
          host,
          port: dataSource.port,
          username: dataSource.username,
          password,
          databaseName: dataSource.databaseName,
          options
        }
      );
    } catch (error) {
      logger.error(`创建数据库连接器失败: ${error}`);
      throw error;
    }
  }
}

// 导入Prisma客户端
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 