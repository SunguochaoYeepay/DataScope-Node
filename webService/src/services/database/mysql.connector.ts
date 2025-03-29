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
  private activeQueries: Map<string, number> = new Map(); // queryId -> connectionId
  
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
  async executeQuery(sql: string, params: any[] = [], queryId?: string, options?: QueryOptions): Promise<QueryResult> {
    let connection;
    try {
      connection = await this.pool.getConnection();
      
      // 如果提供了queryId，则记录连接ID用于查询取消
      if (queryId) {
        const [threadIdResult] = await connection.query('SELECT CONNECTION_ID() as connectionId');
        const connectionId = threadIdResult[0].connectionId;
        this.activeQueries.set(queryId, connectionId);
        
        logger.info('记录活动查询', { queryId, connectionId, dataSourceId: this._dataSourceId });
      }
      
      const startTime = Date.now();
      
      // 处理分页查询
      let originalSql = sql;
      let modifiedSql = sql;
      let totalCount: number | undefined;
      
      if (options && (options.page !== undefined || options.offset !== undefined)) {
        // 计算分页参数
        const page = options.page || 1;
        const pageSize = options.pageSize || options.limit || 50;
        const offset = options.offset !== undefined ? options.offset : (page - 1) * pageSize;
        const limit = options.limit || options.pageSize || 50;
        
        // 添加排序
        if (options.sort) {
          const sortOrder = options.order === 'desc' ? 'DESC' : 'ASC';
          // 使用子查询包装原始SQL，避免排序冲突
          modifiedSql = `SELECT * FROM (${originalSql}) AS subquery ORDER BY ${options.sort} ${sortOrder}`;
        }
        
        // 添加分页限制
        modifiedSql = `${modifiedSql} LIMIT ${offset}, ${limit}`;
        
        // 计算总记录数
        try {
          const countSql = `SELECT COUNT(*) AS total FROM (${originalSql}) AS count_query`;
          const [countResult] = await connection.query(countSql, params);
          totalCount = countResult[0].total;
        } catch (countError) {
          logger.warn('计算总记录数失败', {
            error: countError?.message || '未知错误',
            sql: originalSql,
            dataSourceId: this._dataSourceId
          });
          // 给予宽容，如果计算总记录数失败，继续执行查询
        }
      }
      
      // 执行查询(可能已修改为分页查询)
      const [rows, fields] = await connection.query(modifiedSql, params);
      const endTime = Date.now();
      
      logger.info('MySQL查询执行成功', {
        dataSourceId: this._dataSourceId,
        executionTime: endTime - startTime,
        rowCount: Array.isArray(rows) ? rows.length : 0
      });
      
      // 处理不同类型的查询结果
      if (Array.isArray(rows)) {
        // SELECT 查询
        const queryResult: QueryResult = {
          fields: fields as any[],
          rows: rows as any[],
          rowCount: rows.length
        };
        
        // 添加分页信息（如果有的话）
        if (options && (options.page !== undefined || options.offset !== undefined)) {
          const page = options.page || 1;
          const pageSize = options.pageSize || options.limit || 50;
          
          queryResult.page = page;
          queryResult.pageSize = pageSize;
          
          if (totalCount !== undefined) {
            queryResult.totalCount = totalCount;
            queryResult.totalPages = Math.ceil(totalCount / pageSize);
          }
        }
        
        return queryResult;
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
      // 如果提供了queryId，清理活动查询记录
      if (queryId) {
        this.activeQueries.delete(queryId);
        logger.debug('删除活动查询记录', { queryId, dataSourceId: this._dataSourceId });
      }
      
      if (connection) {
        connection.release();
      }
    }
  }

  /**
   * 取消正在执行的查询
   * @param queryId 查询ID
   * @returns 是否成功取消
   */
  async cancelQuery(queryId: string): Promise<boolean> {
    if (!this.activeQueries.has(queryId)) {
      logger.warn('无法取消查询，查询不存在或已完成', { queryId, dataSourceId: this._dataSourceId });
      return false; // 查询不存在或已完成
    }

    const connectionId = this.activeQueries.get(queryId);
    
    // 使用管理连接执行KILL QUERY命令
    let adminConnection;
    try {
      adminConnection = await this.pool.getConnection();
      await adminConnection.query(`KILL QUERY ${connectionId}`);
      
      logger.info('成功取消MySQL查询', { queryId, connectionId, dataSourceId: this._dataSourceId });
      
      // 从活动查询中移除
      this.activeQueries.delete(queryId);
      return true;
    } catch (error: any) {
      logger.error('取消MySQL查询失败', { 
        error: error?.message || '未知错误', 
        queryId, 
        connectionId,
        dataSourceId: this._dataSourceId
      });
      return false;
    } finally {
      if (adminConnection) {
        adminConnection.release();
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
      logger.error('获取数据库架构列表失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId
      });
      throw new DataSourceConnectionError(
        `获取数据库架构列表失败: ${error?.message || '未知错误'}`,
        this._dataSourceId
      );
    }
  }
  
  /**
   * 获取表列表
   */
  async getTables(schema: string = this.config.database): Promise<TableInfo[]> {
    try {
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
      
      const result = await this.executeQuery(query, [schema]);
      
      return result.rows.map(row => ({
        name: row.name,
        type: row.type === 'BASE TABLE' ? 'TABLE' : row.type,
        schema: row.schema,
        description: row.description,
        createTime: row.createTime,
        updateTime: row.updateTime
      }));
    } catch (error: any) {
      logger.error('获取表列表失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema
      });
      throw new DataSourceConnectionError(
        `获取表列表失败: ${error?.message || '未知错误'}`,
        this._dataSourceId
      );
    }
  }
  
  /**
   * 获取列信息
   */
  async getColumns(schema: string, table: string): Promise<ColumnInfo[]> {
    try {
      const query = `
        SELECT 
          column_name AS name,
          data_type AS dataType,
          column_type AS columnType,
          ordinal_position AS position,
          is_nullable = 'YES' AS isNullable,
          column_key = 'PRI' AS isPrimaryKey,
          column_key = 'UNI' AS isUnique,
          extra = 'auto_increment' AS isAutoIncrement,
          column_default AS defaultValue,
          column_comment AS description,
          character_maximum_length AS maxLength,
          numeric_precision AS precision,
          numeric_scale AS scale
        FROM information_schema.columns
        WHERE table_schema = ? AND table_name = ?
        ORDER BY ordinal_position
      `;
      
      const result = await this.executeQuery(query, [schema, table]);
      
      return result.rows.map(row => ({
        name: row.name,
        dataType: row.dataType,
        columnType: row.columnType,
        position: row.position,
        isNullable: Boolean(row.isNullable),
        isPrimaryKey: Boolean(row.isPrimaryKey),
        isUnique: Boolean(row.isUnique),
        isAutoIncrement: Boolean(row.isAutoIncrement),
        defaultValue: row.defaultValue,
        description: row.description,
        maxLength: row.maxLength,
        precision: row.precision,
        scale: row.scale
      }));
    } catch (error: any) {
      logger.error('获取列信息失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema,
        table
      });
      throw new DataSourceConnectionError(
        `获取列信息失败: ${error?.message || '未知错误'}`,
        this._dataSourceId
      );
    }
  }
  
  /**
   * 获取主键信息
   */
  async getPrimaryKeys(schema: string, table: string): Promise<PrimaryKeyInfo[]> {
    try {
      const query = `
        SELECT 
          constraint_name AS constraintName,
          column_name AS columnName,
          ordinal_position AS position
        FROM information_schema.key_column_usage
        WHERE 
          table_schema = ? 
          AND table_name = ?
          AND constraint_name = 'PRIMARY'
        ORDER BY ordinal_position
      `;
      
      const result = await this.executeQuery(query, [schema, table]);
      
      return result.rows.map(row => ({
        constraintName: row.constraintName,
        columnName: row.columnName,
        position: row.position
      }));
    } catch (error: any) {
      logger.error('获取主键信息失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema,
        table
      });
      throw new DataSourceConnectionError(
        `获取主键信息失败: ${error?.message || '未知错误'}`,
        this._dataSourceId
      );
    }
  }
  
  /**
   * 获取外键信息
   */
  async getForeignKeys(schema: string, table: string): Promise<ForeignKeyInfo[]> {
    try {
      const query = `
        SELECT 
          k.constraint_name AS constraintName,
          k.column_name AS columnName,
          k.ordinal_position AS position,
          k.referenced_table_schema AS referencedSchema,
          k.referenced_table_name AS referencedTable,
          k.referenced_column_name AS referencedColumn,
          r.update_rule AS updateRule,
          r.delete_rule AS deleteRule
        FROM 
          information_schema.key_column_usage k
        JOIN 
          information_schema.referential_constraints r
          ON k.constraint_name = r.constraint_name
          AND k.table_schema = r.constraint_schema
        WHERE 
          k.table_schema = ?
          AND k.table_name = ?
          AND k.referenced_table_name IS NOT NULL
        ORDER BY 
          k.constraint_name, k.ordinal_position
      `;
      
      const result = await this.executeQuery(query, [schema, table]);
      
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
      logger.error('获取外键信息失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema,
        table
      });
      throw new DataSourceConnectionError(
        `获取外键信息失败: ${error?.message || '未知错误'}`,
        this._dataSourceId
      );
    }
  }
  
  /**
   * 获取索引信息
   */
  async getIndexes(schema: string, table: string): Promise<IndexInfo[]> {
    try {
      const query = `
        SELECT 
          index_name AS indexName,
          column_name AS columnName,
          non_unique AS nonUnique,
          seq_in_index AS sequenceInIndex,
          index_type AS indexType
        FROM 
          information_schema.statistics
        WHERE 
          table_schema = ?
          AND table_name = ?
        ORDER BY 
          index_name, seq_in_index
      `;
      
      const result = await this.executeQuery(query, [schema, table]);
      
      return result.rows.map(row => ({
        indexName: row.indexName,
        columnName: row.columnName,
        nonUnique: Boolean(row.nonUnique),
        sequenceInIndex: row.sequenceInIndex,
        indexType: row.indexType
      }));
    } catch (error: any) {
      logger.error('获取索引信息失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema,
        table
      });
      throw new DataSourceConnectionError(
        `获取索引信息失败: ${error?.message || '未知错误'}`,
        this._dataSourceId
      );
    }
  }
  
  /**
   * 预览表数据
   */
  async previewTableData(schema: string, table: string, limit: number = 100): Promise<QueryResult> {
    try {
      const sql = `SELECT * FROM \`${schema}\`.\`${table}\` LIMIT ?`;
      
      return await this.executeQuery(sql, [limit]);
    } catch (error: any) {
      logger.error('预览表数据失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        schema,
        table
      });
      throw new QueryExecutionError(
        `预览表数据失败: ${error?.message || '未知错误'}`,
        this._dataSourceId,
        `SELECT * FROM ${schema}.${table} LIMIT ${limit}`
      );
    }
  }
  
  /**
   * 关闭连接
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