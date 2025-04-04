import mysql from 'mysql2/promise';
import {
  DatabaseConnector,
  QueryResult,
  ColumnInfo,
  PrimaryKeyInfo,
  ForeignKeyInfo,
  IndexInfo,
  TableInfo,
  QueryOptions,
  QueryPlan as DBQueryPlan,
  QueryPlanNode as DBQueryPlanNode
} from './dbInterface';
import { DataSourceConnectionError, QueryExecutionError, ApiError } from '../../utils/error';
import { QueryPlan, QueryPlanNode } from '../../types/query-plan';
import { MySQLQueryPlanConverter } from './query-plan-conversion/mysql-query-plan-converter';
import logger from '../../utils/logger';

/**
 * 增强的MySQL连接器
 * 实现DatabaseConnector接口，提供MySQL数据库的连接和查询功能，并修复类型兼容性问题
 */
export class EnhancedMySQLConnector implements DatabaseConnector {
  private _dataSourceId: string;
  private pool: mysql.Pool;
  private config: mysql.PoolOptions;
  private activeQueries: Map<string, number> = new Map(); // queryId -> connectionId
  
  /**
   * 构造函数
   * @param dataSourceId 数据源ID
   * @param host 主机名
   * @param port 端口号
   * @param username 用户名
   * @param password 密码
   * @param database 数据库名
   */
  constructor(
    dataSourceId: string,
    hostOrConfig: string | { host: string; port: number; user: string; password: string; database: string; username?: string; [key: string]: any },
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
      // 优先使用username字段，如果不存在则使用user字段
      const effectiveUsername = hostOrConfig.username || hostOrConfig.user;
      
      // 记录连接器配置 - 原始对象
      logger.debug('MySQL连接器配置 - 原始对象', {
        dataSourceId,
        configType: typeof hostOrConfig,
        configKeys: Object.keys(hostOrConfig),
        configValues: {
          host: hostOrConfig.host,
          port: hostOrConfig.port,
          user: hostOrConfig.user,
          username: hostOrConfig.username,
          database: hostOrConfig.database
        }
      });
      
      logger.debug('MySQL连接器配置', {
        dataSourceId,
        host: hostOrConfig.host,
        port: hostOrConfig.port,
        user: hostOrConfig.user,
        username: hostOrConfig.username,
        effectiveUsername: effectiveUsername,
        database: hostOrConfig.database,
        configKeys: Object.keys(hostOrConfig),
        configString: JSON.stringify({
          host: hostOrConfig.host,
          port: hostOrConfig.port,
          user: hostOrConfig.user,
          username: hostOrConfig.username,
          database: hostOrConfig.database
        })
      });
      
      this.config = {
        host: hostOrConfig.host,
        port: hostOrConfig.port,
        user: effectiveUsername, // 使用有效的用户名
        password: hostOrConfig.password,
        database: hostOrConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
    }
    
    // 记录最终配置（不包含密码）
    const configDebug = {
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      database: this.config.database
    };
    
    // 创建连接池
    this.pool = mysql.createPool(this.config);
    
    logger.info('MySQL连接器已创建', { 
      dataSourceId, 
      host: this.config.host, 
      port: this.config.port, 
      user: this.config.user,
      database: this.config.database,
      config: JSON.stringify(configDebug)
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
        dataSourceId: this._dataSourceId,
        host: this.config.host,
        user: this.config.user,
        database: this.config.database
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
   * @param sql SQL查询语句
   * @param params 参数数组
   * @param queryId 查询ID
   * @param options 查询选项
   * @returns 查询结果
   */
  async executeQuery(sql: string, params: any[] = [], queryId?: string, options?: QueryOptions): Promise<QueryResult> {
    let connection;
    let directConnection;
    const startTime = Date.now();
    let internalQueryId = queryId;
    
    try {
      // 添加更多日志记录连接器状态
      logger.debug('MySQL连接器executeQuery状态', {
        dataSourceId: this._dataSourceId,
        configUser: this.config.user,
        configDatabase: this.config.database,
        host: this.config.host,
        port: this.config.port,
        allConfigKeys: Object.keys(this.config)
      });
      
      // 修改连接池配置
      try {
        // @ts-ignore - 尝试直接修改连接池配置
        if (this.pool.config && this.pool.config.connectionConfig) {
          // @ts-ignore
          const poolConfig = this.pool.config.connectionConfig;
          
          logger.debug('连接池配置状态 - 修改前', {
            poolUser: poolConfig.user,
            poolDatabase: poolConfig.database,
            configUser: this.config.user,
            configDatabase: this.config.database,
            // @ts-ignore - 记录所有属性
            poolConfigKeys: Object.keys(poolConfig)
          });
          
          // @ts-ignore - 强制设置用户名和数据库名
          poolConfig.user = this.config.user;
          // @ts-ignore
          poolConfig.database = this.config.database;
          // @ts-ignore
          poolConfig.password = this.config.password;
          
          logger.info('强制修改连接池配置', {
            user: this.config.user,
            database: this.config.database
          });
        }
      } catch (poolFixError) {
        logger.warn('修改连接池配置失败', { error: poolFixError });
      }
      
      // 记录连接配置
      logger.info('执行查询配置信息', {
        user: this.config.user || '<空>',
        database: this.config.database || '<空>',
        host: this.config.host,
        port: this.config.port,
        hasPassword: !!this.config.password,
        dataSourceId: this._dataSourceId
      });
      
      try {
        // 创建一个直接连接，尝试避开pool可能的问题
        directConnection = await mysql.createConnection({
          host: this.config.host,
          port: this.config.port,
          user: this.config.user,
          password: this.config.password,
          database: this.config.database
        });
        
        logger.info('创建直接数据库连接成功', {
          host: this.config.host,
          port: this.config.port,
          user: this.config.user,
          database: this.config.database
        });
        
        // 验证直接连接的用户和数据库名
        try {
          const [directInfoResult] = await directConnection.query('SELECT USER() as currentUser, DATABASE() as currentDb') as [any[], mysql.FieldPacket[]];
          if (Array.isArray(directInfoResult) && directInfoResult.length > 0) {
            logger.info('直接连接信息', {
              currentUser: directInfoResult[0].currentUser,
              currentDatabase: directInfoResult[0].currentDb,
              configuredUser: this.config.user,
              configuredDatabase: this.config.database
            });
          }
        } catch (directInfoError) {
          logger.warn('无法获取直接连接信息', { error: directInfoError });
        }
        
        // 使用直接连接执行查询
        // 执行查询(可能已修改为分页查询)
        const [directRows, directFields] = await directConnection.query(sql, params) as [any, mysql.FieldPacket[]];
        const directEndTime = Date.now();
        
        logger.info('使用直接连接执行SQL查询成功', {
          dataSourceId: this._dataSourceId,
          executionTime: directEndTime - startTime,
          rowCount: Array.isArray(directRows) ? directRows.length : 0
        });
        
        // 处理不同类型的查询结果
        if (Array.isArray(directRows)) {
          // SELECT 查询
          const queryResult: QueryResult = {
            fields: directFields.map(f => ({
              name: f.name,
              type: f.type ? f.type.toString() : 'unknown',
              table: f.table,
              schema: f.db
            })),
            rows: directRows,
            rowCount: directRows.length
          };
          
          // 添加分页信息（如果有的话）
          if (options) {
            const page = options.pageNumber || (options as any).page || 1;
            const pageSize = options.pageSize || (options as any).limit || 50;
            
            queryResult.page = page;
            queryResult.pageSize = pageSize;
          }
          
          // 使用直接连接成功，不需要尝试池连接
          return queryResult;
        } else {
          // INSERT, UPDATE, DELETE 等
          const result = directRows as mysql.ResultSetHeader;
          return {
            fields: [],
            rows: [],
            rowCount: 0,
            affectedRows: result.affectedRows,
            lastInsertId: result.insertId
          };
        }
      } catch (directConnError: any) {
        logger.warn('使用直接连接执行查询失败，尝试使用连接池', {
          error: directConnError?.message,
          code: directConnError?.code,
          sqlState: directConnError?.sqlState
        });
        
        // 直接连接失败，尝试使用连接池
      }
      
      // 获取连接池连接
      logger.info('尝试使用连接池连接');
      connection = await this.pool.getConnection();
      
      // 修改连接配置
      try {
        // @ts-ignore - 检查并修改连接配置
        if (connection.connection && connection.connection.config) {
          // @ts-ignore
          const connectionConfig = connection.connection.config;
          // @ts-ignore - 记录当前连接配置状态
          logger.debug('连接池连接配置状态 - 修改前', {
            connectionUser: connectionConfig.user,
            connectionDatabase: connectionConfig.database,
            configUser: this.config.user,
            configDatabase: this.config.database
          });
          
          // @ts-ignore - 强制设置用户名和数据库名
          connectionConfig.user = this.config.user;
          // @ts-ignore
          connectionConfig.database = this.config.database;
          // @ts-ignore
          connectionConfig.password = this.config.password;
          
          logger.info('强制设置连接池连接配置', {
            user: this.config.user,
            database: this.config.database
          });
        }
      } catch (fixError) {
        logger.warn('无法修改连接池连接配置', { error: fixError });
      }
      
      // 验证连接信息，确保我们使用正确的用户和数据库
      try {
        const [infoResult] = await connection.query('SELECT USER() as currentUser, DATABASE() as currentDb') as [any[], mysql.FieldPacket[]];
        if (Array.isArray(infoResult) && infoResult.length > 0) {
          logger.info('连接池连接信息', {
            currentUser: infoResult[0].currentUser,
            currentDatabase: infoResult[0].currentDb,
            configuredUser: this.config.user,
            configuredDatabase: this.config.database
          });
        }
      } catch (infoError) {
        logger.warn('无法获取连接池连接信息', { error: infoError });
      }
      
      // 如果提供了queryId，则记录连接ID用于查询取消
      if (!internalQueryId) {
        internalQueryId = `query-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      }
      
      // 安全类型处理
      const [threadIdResult] = await connection.query('SELECT CONNECTION_ID() as connectionId') as any;
      if (Array.isArray(threadIdResult) && threadIdResult.length > 0 && threadIdResult[0].connectionId) {
        const connectionId = threadIdResult[0].connectionId;
        this.activeQueries.set(internalQueryId, connectionId);
        logger.info('记录活动查询', { queryId: internalQueryId, connectionId, dataSourceId: this._dataSourceId });
      }
      
      // 记录SQL执行
      logger.debug('执行SQL: ' + sql);
      
      // 处理分页查询
      let originalSql = sql;
      let modifiedSql = sql;
      let totalCount: number | undefined;
      
      if (options) {
        // 统一分页参数处理
        const page = options.pageNumber || (options as any).page || 1;
        const pageSize = options.pageSize || (options as any).limit || 50;
        const offset = (options as any).offset !== undefined ? 
                        (options as any).offset : 
                        (page - 1) * pageSize;
        const limit = (options as any).limit || options.pageSize || 50;
        
        // 添加排序
        const sortBy = options.sortBy || (options as any).sort;
        if (sortBy) {
          const sortDirection = options.sortDirection || (options as any).order || 'asc';
          const sortOrder = sortDirection === 'desc' ? 'DESC' : 'ASC';
          
          // 使用子查询包装原始SQL，避免排序冲突
          modifiedSql = `SELECT * FROM (${originalSql}) AS subquery ORDER BY ${sortBy} ${sortOrder}`;
        }
        
        // 添加分页限制
        if (offset > 0) {
          modifiedSql = `${modifiedSql} LIMIT ${offset}, ${limit}`;
        } else {
          modifiedSql = `${modifiedSql} LIMIT ${limit}`;
        }
        
        // 计算总记录数
        try {
          const countSql = `SELECT COUNT(*) AS total FROM (${originalSql}) AS count_query`;
          const [countResult] = await connection.query(countSql, params) as any;
          
          if (Array.isArray(countResult) && countResult.length > 0 && countResult[0].total !== undefined) {
            totalCount = countResult[0].total;
          }
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
      logger.info('使用连接池连接执行SQL查询', { sql: modifiedSql, paramsCount: params.length });
      const [rows, fields] = await connection.query(modifiedSql, params) as [any, mysql.FieldPacket[]];
      const endTime = Date.now();
      
      logger.info('使用连接池连接执行SQL查询成功', {
        dataSourceId: this._dataSourceId,
        executionTime: endTime - startTime,
        rowCount: Array.isArray(rows) ? rows.length : 0
      });
      
      // 处理不同类型的查询结果
      if (Array.isArray(rows)) {
        // SELECT 查询
        const queryResult: QueryResult = {
          fields: fields.map(f => ({
            name: f.name,
            type: f.type ? f.type.toString() : 'unknown',
            table: f.table,
            schema: f.db
          })),
          rows: rows,
          rowCount: rows.length
        };
        
        // 添加分页信息（如果有的话）
        if (options) {
          const page = options.pageNumber || (options as any).page || 1;
          const pageSize = options.pageSize || (options as any).limit || 50;
          
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
      logger.error('数据库查询失败', { 
        error, 
        errorCode: error?.code,
        errorMessage: error?.message,
        sqlState: error?.sqlState,
        configUser: this.config.user,
        configDatabase: this.config.database,
        dataSourceId: this._dataSourceId
      });
      
      if (error instanceof QueryExecutionError) {
        throw error;
      }
      
      throw new QueryExecutionError(
        `执行MySQL查询失败: ${error?.message || '未知错误'}`,
        this._dataSourceId,
        sql
      );
    } finally {
      // 如果提供了queryId，清理活动查询记录
      if (internalQueryId && this.activeQueries.has(internalQueryId)) {
        this.activeQueries.delete(internalQueryId);
        logger.debug('删除活动查询记录', { queryId: internalQueryId, dataSourceId: this._dataSourceId });
      }
      
      // 释放连接池连接
      if (connection) {
        connection.release();
      }
      
      // 关闭直接连接
      if (directConnection) {
        try {
          await directConnection.end();
        } catch (closeError) {
          logger.warn('关闭直接连接失败', { error: closeError });
        }
      }
    }
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
        if (jsonRows && jsonRows.length > 0 && jsonRows[0].EXPLAIN) {
          jsonData = JSON.parse(jsonRows[0].EXPLAIN);
        }
      } catch (jsonError: any) {
        logger.warn('获取JSON格式执行计划失败，使用传统格式', {
          error: jsonError?.message || '未知错误',
          dataSourceId: this._dataSourceId
        });
      }
      
      // 将执行计划转换为统一格式
      const queryPlan = this.convertToQueryPlan(traditionalRows, jsonData, sql);
      
      // 生成优化建议 - 如果查询计划转换器未生成优化建议，则使用内部方法生成
      if (!queryPlan.optimizationTips || queryPlan.optimizationTips.length === 0) {
        queryPlan.optimizationTips = this.generateOptimizationTips(queryPlan);
      }
      
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
   * 将MySQL执行计划转换为统一格式
   */
  private convertToQueryPlan(traditionalRows: any[], jsonData: any, originalQuery: string): QueryPlan {
    // 使用专用转换器进行处理
    return MySQLQueryPlanConverter.convert(traditionalRows, jsonData, originalQuery);
  }
  
  /**
   * 分析执行计划并生成优化建议
   * 注意：这个方法已迁移到 MySQLQueryPlanConverter
   */
  private generateOptimizationTips(plan: QueryPlan): string[] {
    return MySQLQueryPlanConverter.generateOptimizationTips(plan);
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
      
      const [rows] = await this.pool.query(query) as [any[], mysql.FieldPacket[]];
      return rows.map(row => row.database);
    } catch (error: any) {
      logger.error('获取MySQL架构列表失败', { 
        error: error?.message || '未知错误', 
        dataSourceId: this._dataSourceId 
      });
      throw new QueryExecutionError(
        `获取MySQL架构列表失败: ${error?.message || '未知错误'}`,
        this._dataSourceId,
        '获取架构列表'
      );
    }
  }
  
  /**
   * 获取表列表
   * @param schema 数据库名称，默认使用连接配置中的数据库
   */
  async getTables(schema?: string): Promise<TableInfo[]> {
    try {
      const databaseName = schema || this.config.database;
      
      if (!databaseName) {
        throw new Error('未指定数据库名称');
      }
      
      const query = `
        SELECT 
          table_name as name,
          table_type as type,
          table_schema as \`schema\`,
          table_comment as description,
          create_time as createTime,
          update_time as updateTime
        FROM 
          information_schema.tables
        WHERE 
          table_schema = ?
        ORDER BY
          table_name
      `;
      
      const [rows] = await this.pool.query(query, [databaseName]) as [any[], mysql.FieldPacket[]];
      
      return rows.map(row => ({
        name: row.name,
        type: row.type === 'BASE TABLE' ? 'TABLE' : row.type,
        schema: row.schema,
        description: row.description || null,
        createTime: row.createTime ? new Date(row.createTime) : null,
        updateTime: row.updateTime ? new Date(row.updateTime) : null
      }));
    } catch (error: any) {
      logger.error('获取MySQL表列表失败', { 
        error: error?.message || '未知错误', 
        dataSourceId: this._dataSourceId,
        schema 
      });
      throw new QueryExecutionError(
        `获取MySQL表列表失败: ${error?.message || '未知错误'}`,
        this._dataSourceId,
        '获取表列表'
      );
    }
  }
  
  // 其余方法实现...
  
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
  
  // 实现其他必要的接口方法
  async getColumns(schema: string, table: string): Promise<ColumnInfo[]> {
    // 实现获取列信息的逻辑
    return [];
  }
  
  async getPrimaryKeys(schema: string, table: string): Promise<PrimaryKeyInfo[]> {
    // 实现获取主键信息的逻辑
    return [];
  }
  
  async getForeignKeys(schema: string, table: string): Promise<ForeignKeyInfo[]> {
    // 实现获取外键信息的逻辑
    return [];
  }
  
  async getIndexes(schema: string, table: string): Promise<IndexInfo[]> {
    // 实现获取索引信息的逻辑
    return [];
  }
  
  async previewTableData(schema: string, table: string, limit: number = 100): Promise<QueryResult> {
    // 实现预览表数据的逻辑
    return this.executeQuery(`SELECT * FROM \`${schema}\`.\`${table}\` LIMIT ${limit}`);
  }
}