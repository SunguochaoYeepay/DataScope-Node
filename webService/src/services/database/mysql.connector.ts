import mysql from 'mysql2/promise';
import {
  DatabaseConnector,
  QueryResult,
  ColumnInfo,
  PrimaryKeyInfo,
  ForeignKeyInfo,
  IndexInfo,
  TableInfo,
  QueryOptions
} from './dbInterface';
import { DataSourceConnectionError, QueryExecutionError } from '../../utils/error';
import { QueryPlan, QueryPlanNode } from '../../types/query-plan';
import logger from '../../utils/logger';
import { MySQLQueryPlanConverter } from '../../database-core/query-plan/mysql-plan-converter';

// 主机名映射，解决localhost/127.0.0.1转换问题
const HOST_ALIASES: Record<string, string> = {
  'localhost': 'host.docker.internal',
  '127.0.0.1': 'host.docker.internal'
};

// 是否在容器内运行，影响主机名解析策略
const IS_INSIDE_CONTAINER = process.env.INSIDE_CONTAINER === 'true';

/**
 * MySQL连接器
 * 实现DatabaseConnector接口，提供MySQL数据库的连接和查询功能
 */
export class MySQLConnector implements DatabaseConnector {
  private _dataSourceId: string;
  private pool: mysql.Pool;
  private config: mysql.PoolOptions;
  private activeQueries: Map<string, number> = new Map(); // queryId -> connectionId
  public isJsonExplainSupported: boolean = false; // 是否支持JSON格式的EXPLAIN
  
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
      
      // 处理主机名映射
      const host = this.resolveHostAlias(hostOrConfig);
      
      this.config = {
        host: host,
        port: port,
        user: username,
        password: password,
        database: database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        // 增加连接池健康检查配置
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000, // 10秒
        dateStrings: true, // 日期以字符串形式返回，而不是JS Date对象
        // 默认忽略SSL连接要求, 简化本地开发
        ssl: {
          rejectUnauthorized: false
        }
      };
    } else {
      // 使用配置对象模式
      // 处理主机名映射
      const host = this.resolveHostAlias(hostOrConfig.host);
      
      this.config = {
        host: host,
        port: hostOrConfig.port,
        user: hostOrConfig.user,
        password: hostOrConfig.password,
        database: hostOrConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        // 增加连接池健康检查配置
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000, // 10秒
        dateStrings: true, // 日期以字符串形式返回，而不是JS Date对象
        // 默认忽略SSL连接要求, 简化本地开发
        ssl: {
          rejectUnauthorized: false
        }
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
  
  /**
   * 解析主机名别名
   * @param host 原始主机名
   * @returns 解析后的主机名
   */
  private resolveHostAlias(host: string): string {
    // 如果配置了直接使用容器名称作为主机名
    if (host === 'datascope-mysql') {
      // 如果不在容器内，则将datascope-mysql映射为localhost
      if (!IS_INSIDE_CONTAINER) {
        logger.info(`将容器名 ${host} 映射为 localhost`);
        return '127.0.0.1';
      }
      return host;
    }
    
    // 检查是否有主机名映射
    if (HOST_ALIASES[host] && IS_INSIDE_CONTAINER) {
      logger.info(`将主机名 ${host} 映射为 ${HOST_ALIASES[host]}`);
      return HOST_ALIASES[host];
    }
    
    // 默认情况保持原样
    return host;
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
   * 获取查询计划（直接返回结构化数据）
   * @param sql 查询语句
   * @param params 查询参数
   * @returns 执行计划
   */
  async getQueryPlan(sql: string, params: any[] = []): Promise<QueryPlan> {
    return this.explainQuery(sql, params);
  }

  /**
   * 获取查询执行计划
   * @param sql 查询语句
   * @param params 查询参数
   * @returns 执行计划
   */
  async explainQuery(sql: string, params: any[] = []): Promise<QueryPlan> {
    // 验证SQL语句是否为SELECT查询
    if (!this.isSelectQuery(sql)) {
      throw new QueryExecutionError(
        '只有SELECT查询可以获取执行计划',
        this._dataSourceId,
        sql
      );
    }
    
    let connection;
    try {
      connection = await this.pool.getConnection();
      
      // 获取传统格式的执行计划
      const [traditionalRows] = await connection.query(`EXPLAIN ${sql}`, params) as [any[], mysql.FieldPacket[]];
      
      // 尝试获取JSON格式的执行计划（更详细）
      let jsonData: any = null;
      try {
        const [jsonRows] = await connection.query(`EXPLAIN FORMAT=JSON ${sql}`, params) as [any[], mysql.FieldPacket[]];
        if (jsonRows && jsonRows[0] && jsonRows[0].EXPLAIN) {
          jsonData = JSON.parse(jsonRows[0].EXPLAIN);
          this.isJsonExplainSupported = true;
        }
      } catch (jsonError: any) {
        this.isJsonExplainSupported = false;
        logger.warn('获取JSON格式执行计划失败，使用传统格式', {
          error: jsonError?.message || '未知错误',
          dataSourceId: this._dataSourceId
        });
      }
      
      // 使用转换器将执行计划转换为统一格式
      const queryPlan = MySQLQueryPlanConverter.convertToQueryPlan(traditionalRows, jsonData, sql);
      
      // 生成优化建议
      queryPlan.optimizationTips = MySQLQueryPlanConverter.generateOptimizationTips(queryPlan);
      
      return queryPlan;
    } catch (error: any) {
      logger.error('获取查询执行计划失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId,
        sql
      });
      throw new QueryExecutionError(
        `获取查询执行计划失败: ${error?.message || '未知错误'}`,
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
   * 检查SQL是否为SELECT查询
   */
  private isSelectQuery(sql: string): boolean {
    const trimmedSql = sql.trim().toLowerCase();
    return trimmedSql.startsWith('select');
  }
  
  /**
   * 检查SQL是否为特殊命令（如SHOW, DESCRIBE等），这些命令不支持LIMIT子句
   */
  private isSpecialCommand(sql: string): boolean {
    const trimmedSql = sql.trim().toLowerCase();
    return (
      trimmedSql.startsWith('show ') || 
      trimmedSql.startsWith('describe ') || 
      trimmedSql.startsWith('desc ') ||
      trimmedSql === 'show databases;' ||
      trimmedSql === 'show tables;' ||
      trimmedSql === 'show databases' ||
      trimmedSql === 'show tables' ||
      trimmedSql.startsWith('show columns ') ||
      trimmedSql.startsWith('show index ') ||
      trimmedSql.startsWith('show create ') ||
      trimmedSql.startsWith('show grants ') ||
      trimmedSql.startsWith('show triggers ') ||
      trimmedSql.startsWith('show procedure ') ||
      trimmedSql.startsWith('show function ') ||
      trimmedSql.startsWith('show variables ') ||
      trimmedSql.startsWith('show status ') ||
      trimmedSql.startsWith('show engine ') ||
      trimmedSql.startsWith('set ') ||
      trimmedSql.startsWith('use ')
    );
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
    let connection;
    try {
      connection = await this.pool.getConnection();
      
      // 执行查询获取所有数据库
      const [rows] = await connection.query('SHOW DATABASES') as [any[], mysql.FieldPacket[]];
      
      // 处理结果
      const schemas = rows.map(row => row.Database);
      
      return schemas;
    } catch (error: any) {
      logger.error('获取MySQL数据库列表失败', {
        error: error?.message || '未知错误',
        dataSourceId: this._dataSourceId
      });
      throw new Error(`获取MySQL数据库列表失败: ${error?.message || '未知错误'}`);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  
  /**
   * 获取表列表
   * @param schema 架构名称，默认为当前连接的数据库
   * @returns 表信息数组
   */
  async getTables(schema?: string): Promise<TableInfo[]> {
    const targetSchema = schema || this.config.database;
    if (!targetSchema) {
      throw new Error('未指定数据库名称');
    }
    
    let connection;
    try {
      connection = await this.pool.getConnection();
      
      // 查询表列表
      const [rows] = await connection.query(
        `SELECT 
          TABLE_NAME AS name,
          TABLE_TYPE AS type,
          TABLE_SCHEMA AS \`schema\`,
          TABLE_COMMENT AS description,
          CREATE_TIME AS createTime,
          UPDATE_TIME AS updateTime
        FROM 
          INFORMATION_SCHEMA.TABLES 
        WHERE 
          TABLE_SCHEMA = ?
        ORDER BY
          TABLE_NAME`,
        [targetSchema]
      ) as [any[], mysql.FieldPacket[]];
      
      // 处理结果
      const tables: TableInfo[] = rows.map(row => ({
        name: row.name,
        type: row.type === 'BASE TABLE' ? 'table' : row.type.toLowerCase(),
        schema: row.schema,
        description: row.description || null,
        createTime: row.createTime,
        updateTime: row.updateTime
      }));
      
      return tables;
    } catch (error: any) {
      logger.error('获取MySQL表列表失败', {
        error: error?.message || '未知错误',
        schema: targetSchema,
        dataSourceId: this._dataSourceId
      });
      throw new Error(`获取MySQL表列表失败: ${error?.message || '未知错误'}`);
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
      logger.info('MySQL连接器开始执行查询', { 
        dataSourceId: this._dataSourceId, 
        sql, 
        hasParams: params && params.length > 0,
        queryId: queryId || 'none'
      });
      
      logger.debug('准备创建数据库连接', { 
        host: this.config.host, 
        port: this.config.port, 
        database: this.config.database 
      });
      connection = await this.pool.getConnection();
      logger.debug('数据库连接创建成功');
      
      // 如果提供了queryId，则记录连接ID用于查询取消
      if (queryId) {
        const [threadIdResult] = await connection.query('SELECT CONNECTION_ID() as connectionId') as any[];
        const connectionId = threadIdResult[0].connectionId;
        this.activeQueries.set(queryId, connectionId);
        
        logger.info('记录活动查询', { queryId, connectionId, dataSourceId: this._dataSourceId });
      }
      
      const startTime = Date.now();
      
      // 处理分页查询
      let originalSql = sql;
      let modifiedSql = sql;
      let totalCount: number | undefined;
      
      // 检查是否为特殊命令，如SHOW DATABASES等，这些不支持分页
      const isSpecial = this.isSpecialCommand(sql);
      logger.debug('SQL类型检查', { isSpecialCommand: isSpecial, sql });
      
      if (!isSpecial && options && (options.page !== undefined || options.offset !== undefined)) {
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
          const [countResult] = await connection.query(countSql, params) as any[];
          totalCount = countResult[0].total;
        } catch (countError: any) {
          logger.warn('计算总记录数失败', {
            error: countError?.message || '未知错误',
            sql: originalSql,
            dataSourceId: this._dataSourceId
          });
          // 给予宽容，如果计算总记录数失败，继续执行查询
        }
      }
      
      // 执行查询(可能已修改为分页查询)
      logger.debug('即将执行SQL', { sql: modifiedSql });
      const [rows, fields] = await connection.query(modifiedSql, params) as [any[], mysql.FieldPacket[]];
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
        
        // 添加分页信息（如果有的话，且不是特殊命令）
        if (!isSpecial && options && (options.page !== undefined || options.offset !== undefined)) {
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
        stack: error?.stack,
        dataSourceId: this._dataSourceId,
        sql,
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user
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
        logger.debug('删除活动查询记录', { 
          queryId,
          dataSourceId: this._dataSourceId
        });
      }
      
      if (connection) {
        try {
          connection.release();
          logger.debug('数据库连接已释放');
        } catch (releaseError) {
          logger.warn('释放数据库连接时发生错误', { 
            error: releaseError,
            dataSourceId: this._dataSourceId
          });
        }
      }
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