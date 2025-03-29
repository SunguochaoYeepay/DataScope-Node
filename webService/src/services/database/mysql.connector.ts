import mysql from 'mysql2/promise';
import {
  DatabaseConnector,
  QueryResult,
  ColumnInfo,
  PrimaryKeyInfo,
  ForeignKeyInfo,
  IndexInfo,
  TableInfo
} from './dbInterface';
import { DataSourceConnectionError, QueryExecutionError } from '../../utils/error';
import logger from '../../utils/logger';

/**
 * MySQL连接器
 * 实现DatabaseConnector接口，提供MySQL数据库的连接和查询功能
 */
export class MySQLConnector implements DatabaseConnector {
  private _dataSourceId: string;
  private pool: mysql.Pool;
  private config: mysql.PoolOptions;
  
  /**
   * 构造函数
   * @param dataSourceId 数据源ID
   * @param config 连接配置对象
   */
  constructor(
    dataSourceId: string, 
    config: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    }
  );
  
  /**
   * 重载构造函数，支持传递单独的参数
   * @param dataSourceId 数据源ID
   * @param host 主机名
   * @param port 端口号
   * @param username 用户名
   * @param password 密码
   * @param database 数据库名
   */
  constructor(
    dataSourceId: string,
    hostOrConfig: string | { host: string; port: number; user: string; password: string; database: string },
    port?: number,
    username?: string,
    password?: string,
    database?: string
  ) {
    this._dataSourceId = dataSourceId;
    
    // 根据传入参数的类型构建配置
    if (typeof hostOrConfig === 'string') {
      // 使用独立参数模式
      if (!port || !username || !password || !database) {
        throw new Error('使用单独参数模式时，所有参数都必须提供');
      }
      
      this.config = {
        host: hostOrConfig,
        port: port,
        user: username,
        password: password,
        database: database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
    } else {
      // 使用配置对象模式
      this.config = {
        host: hostOrConfig.host,
        port: hostOrConfig.port,
        user: hostOrConfig.user,
        password: hostOrConfig.password,
        database: hostOrConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
    }
    
    // 创建连接池
    this.pool = mysql.createPool(this.config);
    
    logger.info('MySQL连接器已创建', { 
      dataSourceId, 
      host: this.config.host, 
      port: this.config.port, 
      database: this.config.database 
    });
  }
  
  // 公开getter以便访问dataSourceId
  get dataSourceId(): string {
    return this._dataSourceId;
  }
  
  /**
   * 测试数据库连接
   */
  async testConnection(): Promise<boolean> {
    let connection;
    try {
      // 尝试获取连接
      connection = await this.pool.getConnection();
      // 执行简单查询
      await connection.query('SELECT 1');
      return true;
    } catch (error: any) {
      logger.error('测试MySQL连接失败', { 
        error: error?.message || '未知错误', 
        dataSourceId: this._dataSourceId 
      });
      throw new DataSourceConnectionError(
        `测试MySQL连接失败: ${error?.message || '未知错误'}`, 
        this._dataSourceId
      );
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  
  /**
   * 执行SQL查询
   */
  async executeQuery(sql: string, params: any[] = []): Promise<QueryResult> {
    let connection;
    try {
      connection = await this.pool.getConnection();
      
      const startTime = Date.now();
      const [rows, fields] = await connection.query(sql, params);
      const endTime = Date.now();
      
      logger.info('MySQL查询执行成功', {
        dataSourceId: this._dataSourceId,
        executionTime: endTime - startTime,
        rowCount: Array.isArray(rows) ? rows.length : 0
      });
      
      // 处理不同类型的查询结果
      if (Array.isArray(rows)) {
        // SELECT 查询
        return {
          fields: fields as any[],
          rows: rows as any[],
          rowCount: rows.length
        };
      } else {
        // INSERT, UPDATE, DELETE 等
        const result = rows as mysql.ResultSetHeader;
        return {
          fields: [],
          rows: [],
          rowCount: 0,
          affectedRows: result.affectedRows,
          lastInsertId: result.insertId
        };
      }
    } catch (error: any) {
      logger.error('执行MySQL查询失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        sql
      });
      throw new QueryExecutionError(
        `执行MySQL查询失败: ${error?.message || '未知错误'}`,
        this._dataSourceId,
        sql
      );
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  
  /**
   * 获取数据库架构列表
   * 在MySQL中，数据库名称相当于schema
   */
  async getSchemas(): Promise<string[]> {
    try {
      const query = `
        SELECT schema_name AS \`database\`
        FROM information_schema.schemata
        WHERE schema_name NOT IN (
          'information_schema', 'mysql', 'performance_schema', 'sys'
        )
        ORDER BY schema_name
      `;
      
      const result = await this.executeQuery(query);
      return result.rows.map(row => row.database);
    } catch (error: any) {
      logger.error('获取MySQL数据库列表失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId
      });
      throw error;
    }
  }
  
  /**
   * 获取表列表
   */
  async getTables(schema?: string): Promise<TableInfo[]> {
    try {
      const databaseName = schema || this.config.database;
      
      const query = `
        SELECT 
          table_name AS name,
          table_type AS type,
          table_schema AS \`schema\`,
          table_comment AS description,
          create_time AS createTime,
          update_time AS updateTime
        FROM information_schema.tables
        WHERE table_schema = ?
        ORDER BY table_name
      `;
      
      const result = await this.executeQuery(query, [databaseName]);
      
      return result.rows.map(row => ({
        name: row.name,
        type: row.type === 'BASE TABLE' ? 'table' : row.type.toLowerCase(),
        schema: row.schema,
        description: row.description,
        createTime: row.createTime,
        updateTime: row.updateTime
      }));
    } catch (error: any) {
      logger.error('获取MySQL表列表失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema: schema || this.config.database
      });
      throw error;
    }
  }
  
  /**
   * 获取列信息
   */
  async getColumns(schema: string, table: string): Promise<ColumnInfo[]> {
    try {
      const databaseName = schema || this.config.database;
      
      const query = `
        SELECT 
          column_name AS name,
          ordinal_position AS position,
          column_default AS defaultValue,
          is_nullable AS nullable,
          data_type AS dataType,
          column_type AS columnType,
          character_maximum_length AS maxLength,
          numeric_precision AS precision,
          numeric_scale AS scale,
          column_key AS columnKey,
          extra AS extra,
          column_comment AS description
        FROM information_schema.columns
        WHERE table_schema = ? AND table_name = ?
        ORDER BY ordinal_position
      `;
      
      const result = await this.executeQuery(query, [databaseName, table]);
      
      return result.rows.map(row => ({
        name: row.name,
        dataType: row.dataType,
        columnType: row.columnType,
        position: row.position,
        isNullable: row.nullable === 'YES',
        isPrimaryKey: row.columnKey === 'PRI',
        isUnique: row.columnKey === 'UNI',
        isAutoIncrement: row.extra.includes('auto_increment'),
        defaultValue: row.defaultValue,
        description: row.description,
        maxLength: row.maxLength,
        precision: row.precision,
        scale: row.scale
      }));
    } catch (error: any) {
      logger.error('获取MySQL列信息失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema: schema || this.config.database,
        table
      });
      throw error;
    }
  }
  
  /**
   * 获取主键信息
   */
  async getPrimaryKeys(schema: string, table: string): Promise<PrimaryKeyInfo[]> {
    try {
      const databaseName = schema || this.config.database;
      
      const query = `
        SELECT 
          tc.constraint_name AS constraintName,
          kcu.column_name AS columnName,
          kcu.ordinal_position AS position
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = ?
          AND tc.table_name = ?
        ORDER BY kcu.ordinal_position
      `;
      
      const result = await this.executeQuery(query, [databaseName, table]);
      
      return result.rows.map(row => ({
        constraintName: row.constraintName,
        columnName: row.columnName,
        position: row.position
      }));
    } catch (error: any) {
      logger.error('获取MySQL主键信息失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema: schema || this.config.database,
        table
      });
      throw error;
    }
  }
  
  /**
   * 获取外键信息
   */
  async getForeignKeys(schema: string, table: string): Promise<ForeignKeyInfo[]> {
    try {
      const databaseName = schema || this.config.database;
      
      const query = `
        SELECT 
          kcu.constraint_name AS constraintName,
          kcu.column_name AS columnName,
          kcu.ordinal_position AS position,
          kcu.referenced_table_schema AS referencedSchema,
          kcu.referenced_table_name AS referencedTable,
          kcu.referenced_column_name AS referencedColumn,
          rc.update_rule AS updateRule,
          rc.delete_rule AS deleteRule
        FROM information_schema.key_column_usage kcu
        JOIN information_schema.referential_constraints rc
          ON kcu.constraint_name = rc.constraint_name
          AND kcu.constraint_schema = rc.constraint_schema
        WHERE kcu.table_schema = ?
          AND kcu.table_name = ?
          AND kcu.referenced_table_schema IS NOT NULL
        ORDER BY kcu.constraint_name, kcu.ordinal_position
      `;
      
      const result = await this.executeQuery(query, [databaseName, table]);
      
      return result.rows.map(row => ({
        constraintName: row.constraintName,
        columnName: row.columnName,
        position: row.position,
        referencedSchema: row.referencedSchema,
        referencedTable: row.referencedTable,
        referencedColumn: row.referencedColumn,
        updateRule: row.updateRule,
        deleteRule: row.deleteRule
      }));
    } catch (error: any) {
      logger.error('获取MySQL外键信息失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema: schema || this.config.database,
        table
      });
      throw error;
    }
  }
  
  /**
   * 获取索引信息
   */
  async getIndexes(schema: string, table: string): Promise<IndexInfo[]> {
    try {
      const databaseName = schema || this.config.database;
      
      const query = `
        SELECT 
          index_name AS indexName,
          column_name AS columnName,
          non_unique AS nonUnique,
          seq_in_index AS sequenceInIndex,
          index_type AS indexType
        FROM information_schema.statistics
        WHERE table_schema = ?
          AND table_name = ?
        ORDER BY index_name, seq_in_index
      `;
      
      const result = await this.executeQuery(query, [databaseName, table]);
      
      return result.rows.map(row => ({
        indexName: row.indexName,
        columnName: row.columnName,
        nonUnique: Boolean(row.nonUnique),
        sequenceInIndex: row.sequenceInIndex,
        indexType: row.indexType
      }));
    } catch (error: any) {
      logger.error('获取MySQL索引信息失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema: schema || this.config.database,
        table
      });
      throw error;
    }
  }
  
  /**
   * 预览表数据
   */
  async previewTableData(schema: string, table: string, limit: number = 100): Promise<QueryResult> {
    try {
      const databaseName = schema || this.config.database;
      
      // 使用反引号包裹数据库和表名，防止SQL注入
      const query = `
        SELECT * FROM \`${databaseName}\`.\`${table}\` LIMIT ?
      `;
      
      return await this.executeQuery(query, [limit]);
    } catch (error: any) {
      logger.error('预览MySQL表数据失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema: schema || this.config.database,
        table
      });
      throw error;
    }
  }
  
  /**
   * 关闭连接池
   */
  async close(): Promise<void> {
    try {
      await this.pool.end();
      logger.info('MySQL连接池已关闭', { dataSourceId: this._dataSourceId });
    } catch (error: any) {
      logger.error('关闭MySQL连接池失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId
      });
    }
  }
}