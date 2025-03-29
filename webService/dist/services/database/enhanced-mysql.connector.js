"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedMySQLConnector = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const error_1 = require("../../utils/error");
const mysql_query_plan_converter_1 = require("./query-plan-conversion/mysql-query-plan-converter");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * 增强的MySQL连接器
 * 实现DatabaseConnector接口，提供MySQL数据库的连接和查询功能，并修复类型兼容性问题
 */
class EnhancedMySQLConnector {
    /**
     * 重载构造函数，支持传递单独的参数
     * @param dataSourceId 数据源ID
     * @param host 主机名
     * @param port 端口号
     * @param username 用户名
     * @param password 密码
     * @param database 数据库名
     */
    constructor(dataSourceId, hostOrConfig, port, username, password, database) {
        this.activeQueries = new Map(); // queryId -> connectionId
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
        }
        else {
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
        this.pool = promise_1.default.createPool(this.config);
        logger_1.default.info('MySQL连接器已创建', {
            dataSourceId,
            host: this.config.host,
            port: this.config.port,
            database: this.config.database
        });
    }
    // 公开getter以便访问dataSourceId
    get dataSourceId() {
        return this._dataSourceId;
    }
    /**
     * 测试数据库连接
     */
    async testConnection() {
        let connection;
        try {
            // 尝试获取连接
            connection = await this.pool.getConnection();
            // 执行简单查询
            await connection.query('SELECT 1');
            return true;
        }
        catch (error) {
            logger_1.default.error('测试MySQL连接失败', {
                error: error?.message || '未知错误',
                dataSourceId: this._dataSourceId
            });
            throw new error_1.DataSourceConnectionError(`测试MySQL连接失败: ${error?.message || '未知错误'}`, this._dataSourceId);
        }
        finally {
            if (connection) {
                connection.release();
            }
        }
    }
    /**
     * 执行SQL查询
     */
    async executeQuery(sql, params = [], queryId, options) {
        let connection;
        try {
            connection = await this.pool.getConnection();
            // 如果提供了queryId，则记录连接ID用于查询取消
            if (queryId) {
                // 安全类型处理
                const [threadIdResult] = await connection.query('SELECT CONNECTION_ID() as connectionId');
                if (Array.isArray(threadIdResult) && threadIdResult.length > 0 && threadIdResult[0].connectionId) {
                    const connectionId = threadIdResult[0].connectionId;
                    this.activeQueries.set(queryId, connectionId);
                    logger_1.default.info('记录活动查询', { queryId, connectionId, dataSourceId: this._dataSourceId });
                }
            }
            const startTime = Date.now();
            // 处理分页查询
            let originalSql = sql;
            let modifiedSql = sql;
            let totalCount;
            if (options) {
                // 统一分页参数处理
                const page = options.pageNumber || options.page || 1;
                const pageSize = options.pageSize || options.limit || 50;
                const offset = options.offset !== undefined ?
                    options.offset :
                    (page - 1) * pageSize;
                const limit = options.limit || options.pageSize || 50;
                // 添加排序
                const sortBy = options.sortBy || options.sort;
                if (sortBy) {
                    const sortDirection = options.sortDirection || options.order || 'asc';
                    const sortOrder = sortDirection === 'desc' ? 'DESC' : 'ASC';
                    // 使用子查询包装原始SQL，避免排序冲突
                    modifiedSql = `SELECT * FROM (${originalSql}) AS subquery ORDER BY ${sortBy} ${sortOrder}`;
                }
                // 添加分页限制
                modifiedSql = `${modifiedSql} LIMIT ${offset}, ${limit}`;
                // 计算总记录数
                try {
                    const countSql = `SELECT COUNT(*) AS total FROM (${originalSql}) AS count_query`;
                    const [countResult] = await connection.query(countSql, params);
                    if (Array.isArray(countResult) && countResult.length > 0 && countResult[0].total !== undefined) {
                        totalCount = countResult[0].total;
                    }
                }
                catch (countError) {
                    logger_1.default.warn('计算总记录数失败', {
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
            logger_1.default.info('MySQL查询执行成功', {
                dataSourceId: this._dataSourceId,
                executionTime: endTime - startTime,
                rowCount: Array.isArray(rows) ? rows.length : 0
            });
            // 处理不同类型的查询结果
            if (Array.isArray(rows)) {
                // SELECT 查询
                const queryResult = {
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
                    const page = options.pageNumber || options.page || 1;
                    const pageSize = options.pageSize || options.limit || 50;
                    queryResult.page = page;
                    queryResult.pageSize = pageSize;
                    if (totalCount !== undefined) {
                        queryResult.totalCount = totalCount;
                        queryResult.totalPages = Math.ceil(totalCount / pageSize);
                    }
                }
                return queryResult;
            }
            else {
                // INSERT, UPDATE, DELETE 等
                const result = rows;
                return {
                    fields: [],
                    rows: [],
                    rowCount: 0,
                    affectedRows: result.affectedRows,
                    lastInsertId: result.insertId
                };
            }
        }
        catch (error) {
            logger_1.default.error('执行MySQL查询失败', {
                error: error?.message || '未知错误',
                dataSourceId: this._dataSourceId,
                sql
            });
            throw new error_1.QueryExecutionError(`执行MySQL查询失败: ${error?.message || '未知错误'}`, this._dataSourceId, sql);
        }
        finally {
            // 如果提供了queryId，清理活动查询记录
            if (queryId) {
                this.activeQueries.delete(queryId);
                logger_1.default.debug('删除活动查询记录', { queryId, dataSourceId: this._dataSourceId });
            }
            if (connection) {
                connection.release();
            }
        }
    }
    /**
     * 获取查询执行计划
     * @param sql 查询语句
     * @param params 查询参数
     * @returns 执行计划
     */
    async explainQuery(sql, params = []) {
        // 验证SQL语句是否为SELECT查询
        if (!this.isSelectQuery(sql)) {
            throw new error_1.QueryExecutionError('只有SELECT查询可以获取执行计划', this._dataSourceId, sql);
        }
        let connection;
        try {
            connection = await this.pool.getConnection();
            // 获取传统格式的执行计划
            const [traditionalRows] = await connection.query(`EXPLAIN ${sql}`, params);
            // 尝试获取JSON格式的执行计划（更详细）
            let jsonData = null;
            try {
                const [jsonRows] = await connection.query(`EXPLAIN FORMAT=JSON ${sql}`, params);
                if (jsonRows && jsonRows.length > 0 && jsonRows[0].EXPLAIN) {
                    jsonData = JSON.parse(jsonRows[0].EXPLAIN);
                }
            }
            catch (jsonError) {
                logger_1.default.warn('获取JSON格式执行计划失败，使用传统格式', {
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
        }
        catch (error) {
            logger_1.default.error('获取查询执行计划失败', {
                error: error?.message || '未知错误',
                dataSourceId: this._dataSourceId,
                sql
            });
            throw new error_1.QueryExecutionError(`获取查询执行计划失败: ${error?.message || '未知错误'}`, this._dataSourceId, sql);
        }
        finally {
            if (connection) {
                connection.release();
            }
        }
    }
    /**
     * 检查SQL是否为SELECT查询
     */
    isSelectQuery(sql) {
        const trimmedSql = sql.trim().toLowerCase();
        return trimmedSql.startsWith('select');
    }
    /**
     * 将MySQL执行计划转换为统一格式
     */
    convertToQueryPlan(traditionalRows, jsonData, originalQuery) {
        // 使用专用转换器进行处理
        return mysql_query_plan_converter_1.MySQLQueryPlanConverter.convert(traditionalRows, jsonData, originalQuery);
    }
    /**
     * 分析执行计划并生成优化建议
     * 注意：这个方法已迁移到 MySQLQueryPlanConverter
     */
    generateOptimizationTips(plan) {
        return mysql_query_plan_converter_1.MySQLQueryPlanConverter.generateOptimizationTips(plan);
    }
    /**
     * 取消正在执行的查询
     * @param queryId 查询ID
     * @returns 是否成功取消
     */
    async cancelQuery(queryId) {
        if (!this.activeQueries.has(queryId)) {
            logger_1.default.warn('无法取消查询，查询不存在或已完成', { queryId, dataSourceId: this._dataSourceId });
            return false; // 查询不存在或已完成
        }
        const connectionId = this.activeQueries.get(queryId);
        // 使用管理连接执行KILL QUERY命令
        let adminConnection;
        try {
            adminConnection = await this.pool.getConnection();
            await adminConnection.query(`KILL QUERY ${connectionId}`);
            logger_1.default.info('成功取消MySQL查询', { queryId, connectionId, dataSourceId: this._dataSourceId });
            // 从活动查询中移除
            this.activeQueries.delete(queryId);
            return true;
        }
        catch (error) {
            logger_1.default.error('取消MySQL查询失败', {
                error: error?.message || '未知错误',
                queryId,
                connectionId,
                dataSourceId: this._dataSourceId
            });
            return false;
        }
        finally {
            if (adminConnection) {
                adminConnection.release();
            }
        }
    }
    /**
     * 获取数据库架构列表
     * 在MySQL中，数据库名称相当于schema
     */
    async getSchemas() {
        try {
            const query = `
        SELECT schema_name AS \`database\`
        FROM information_schema.schemata
        WHERE schema_name NOT IN (
          'information_schema', 'mysql', 'performance_schema', 'sys'
        )
        ORDER BY schema_name
      `;
            const [rows] = await this.pool.query(query);
            return rows.map(row => row.database);
        }
        catch (error) {
            logger_1.default.error('获取MySQL架构列表失败', {
                error: error?.message || '未知错误',
                dataSourceId: this._dataSourceId
            });
            throw new error_1.QueryExecutionError(`获取MySQL架构列表失败: ${error?.message || '未知错误'}`, this._dataSourceId, '获取架构列表');
        }
    }
    /**
     * 获取表列表
     * @param schema 数据库名称，默认使用连接配置中的数据库
     */
    async getTables(schema) {
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
            const [rows] = await this.pool.query(query, [databaseName]);
            return rows.map(row => ({
                name: row.name,
                type: row.type === 'BASE TABLE' ? 'TABLE' : row.type,
                schema: row.schema,
                description: row.description || null,
                createTime: row.createTime ? new Date(row.createTime) : null,
                updateTime: row.updateTime ? new Date(row.updateTime) : null
            }));
        }
        catch (error) {
            logger_1.default.error('获取MySQL表列表失败', {
                error: error?.message || '未知错误',
                dataSourceId: this._dataSourceId,
                schema
            });
            throw new error_1.QueryExecutionError(`获取MySQL表列表失败: ${error?.message || '未知错误'}`, this._dataSourceId, '获取表列表');
        }
    }
    // 其余方法实现...
    /**
     * 关闭连接池
     */
    async close() {
        try {
            await this.pool.end();
            logger_1.default.info('MySQL连接池已关闭', { dataSourceId: this._dataSourceId });
        }
        catch (error) {
            logger_1.default.error('关闭MySQL连接池失败', {
                error: error?.message || '未知错误',
                dataSourceId: this._dataSourceId
            });
        }
    }
    // 实现其他必要的接口方法
    async getColumns(schema, table) {
        // 实现获取列信息的逻辑
        return [];
    }
    async getPrimaryKeys(schema, table) {
        // 实现获取主键信息的逻辑
        return [];
    }
    async getForeignKeys(schema, table) {
        // 实现获取外键信息的逻辑
        return [];
    }
    async getIndexes(schema, table) {
        // 实现获取索引信息的逻辑
        return [];
    }
    async previewTableData(schema, table, limit = 100) {
        // 实现预览表数据的逻辑
        return this.executeQuery(`SELECT * FROM \`${schema}\`.\`${table}\` LIMIT ${limit}`);
    }
}
exports.EnhancedMySQLConnector = EnhancedMySQLConnector;
//# sourceMappingURL=enhanced-mysql.connector.js.map