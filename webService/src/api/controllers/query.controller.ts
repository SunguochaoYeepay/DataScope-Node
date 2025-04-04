import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import metadataService from '../../services/metadata.service';
import columnAnalyzer from '../../services/metadata/column-analyzer';
import ApiError from '../../utils/apiError';
import logger from '../../utils/logger';
import { DataSourceService } from '../../services/datasource.service';
import config from '../../config';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import mysql from 'mysql2/promise';
import { getPaginationParams } from '../../utils/api.utils';
import queryService from '../../services/query.service';

const dataSourceService = new DataSourceService();
const prisma = new PrismaClient();

// 扩展Request接口以支持用户信息
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class MetadataController {
  /**
   * 同步数据源元数据
   */
  async syncMetadata(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', 400);
      }

      const { dataSourceId } = req.params;
      
      // 支持两种请求格式：
      // 1. 直接包含syncType, schemaPattern, tablePattern
      // 2. 包含filters对象(前端格式)
      const { syncType, schemaPattern, tablePattern, filters } = req.body;
      
      // 如果请求中包含filters对象，则从中提取相关参数
      let syncOptions = {
        syncType: syncType || 'FULL',
        schemaPattern: schemaPattern,
        tablePattern: tablePattern
      };
      
      if (filters) {
        logger.debug('收到filters格式的元数据同步请求', { filters });
        // 从filters中提取相关参数
        const includeSchemas = filters.includeSchemas || [];
        const includeTables = filters.includeTables || [];
        
        // 构建模式和表名匹配模式
        if (includeSchemas.length > 0) {
          syncOptions.schemaPattern = includeSchemas.join('|');
        }
        
        if (includeTables.length > 0) {
          syncOptions.tablePattern = includeTables.join('|');
        }
      }

      logger.info(`开始同步数据源 ${dataSourceId} 的元数据`, syncOptions);
      const result = await metadataService.syncMetadata(dataSourceId, syncOptions);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      logger.error(`同步数据源元数据失败`, {
        error: error.message,
        dataSourceId: req.params.dataSourceId
      });
      next(error);
    }
  }
  
  /**
   * 获取数据源的元数据结构
   */
  async getMetadataStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId } = req.params;
      const result = await metadataService.getMetadataStructure(dataSourceId);
      
      res.status(200).json({
      success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 获取同步历史记录
   */
  async getSyncHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId } = req.params;
      const pagination = getPaginationParams(req);
      
      const result = await metadataService.getSyncHistory(
        dataSourceId,
        pagination.limit,
        pagination.offset
      );
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 获取表数据预览
   */
  public previewTableData = [
    check('dataSourceId').isString().not().isEmpty().withMessage('数据源ID不能为空'),
    check('schemaName').isString().withMessage('模式名称不能为空'),
    check('tableName').isString().withMessage('表名不能为空'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 验证输入
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new ApiError('验证错误', 400);
        }

        const { dataSourceId, schemaName, tableName } = req.params;
        const limit = parseInt(req.query.limit as string) || 100;
        
        // 获取连接器
        const connector = await dataSourceService.getConnector(dataSourceId);
        
        // 预览表数据
        const data = await connector.previewTableData(schemaName, tableName, limit);
      
      res.status(200).json({
        success: true,
          data
      });
    } catch (error: any) {
      next(error);
    }
  }
  ];

  /**
   * 验证同步元数据请求
   */
  validateSyncMetadata() {
    return [
      // 数据源ID验证
      check('dataSourceId').isString().not().isEmpty().withMessage('无效的数据源ID'),
      
      // 传统格式参数验证
      check('syncType').optional().isIn(['FULL', 'INCREMENTAL']).withMessage('同步类型必须是 FULL 或 INCREMENTAL'),
      check('schemaPattern').optional().isString().withMessage('架构模式必须是字符串'),
      check('tablePattern').optional().isString().withMessage('表模式必须是字符串'),
      
      // 前端格式参数验证（filters对象）
      check('filters').optional().isObject().withMessage('filters必须是一个对象'),
      check('filters.includeSchemas').optional().isArray().withMessage('includeSchemas必须是一个数组'),
      check('filters.excludeSchemas').optional().isArray().withMessage('excludeSchemas必须是一个数组'),
      check('filters.includeTables').optional().isArray().withMessage('includeTables必须是一个数组'),
      check('filters.excludeTables').optional().isArray().withMessage('excludeTables必须是一个数组'),
      
      // 验证通过的处理
      (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            success: false, 
            message: '验证错误', 
            errors: errors.array() 
          });
        }
        next();
      }
    ];
  }

  /**
   * 验证预览表数据请求
   */
  validatePreviewTableData() {
    return [
      check('dataSourceId').isString().not().isEmpty().withMessage('无效的数据源ID'),
      check('schema').isString().withMessage('架构名称必须是字符串'),
      check('table').isString().withMessage('表名称必须是字符串'),
      check('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('limit必须是1-1000之间的整数'),
    ];
  }
  
  /**
   * 分析表列详细信息
   */
  async analyzeColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', 400);
      }

      const { dataSourceId } = req.params;
      const { schema, table, column } = req.query;
      
      if (!schema || !table || !column) {
        throw new ApiError('缺少必要参数：必须提供schema、table和column参数', 400);
      }
      
      const result = await columnAnalyzer.analyzeColumn(
      dataSourceId,
        schema as string,
        table as string,
        column as string
      );
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 验证列分析请求
   */
  validateColumnAnalysis() {
    return [
      check('dataSourceId').isString().not().isEmpty().withMessage('无效的数据源ID'),
      check('schema').isString().withMessage('架构名称必须是字符串'),
      check('table').isString().withMessage('表名称必须是字符串'),
      check('column').isString().withMessage('列名称必须是字符串'),
    ];
  }

  /**
   * 获取数据源数据库结构
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getDatabaseStructure(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new ApiError('缺少数据源ID', 400);
      }
      
      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(id);
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 获取数据库连接
      const connector = await dataSourceService.getConnector(id);
      
      // 构建结构对象
      const structure = {
        databases: [] as any[]
      };
      
      try {
        // 尝试获取schema列表
        const schemas = await connector.getSchemas();
        
        // 对于支持schemas的数据库，获取schemas下的表
        if (schemas && schemas.length > 0) {
          const database = dataSource.databaseName || 'default';
          const dbStructure: any = {
            name: database,
            schemas: [] as any[],
            tables: [] as any[]
          };
          
          for (const schema of schemas) {
            // 获取当前schema下的表
            const tables = await connector.getTables(schema);
            
            const schemaStructure: any = {
              name: schema,
              tables: tables.map((table: any) => ({
                name: typeof table === 'string' ? table : table.name,
                type: 'TABLE',
                schema
              }))
            };
            
            dbStructure.schemas.push(schemaStructure);
          }
          
          structure.databases.push(dbStructure);
        } else {
          // 不支持schema的数据库，直接获取表
          const tables = await connector.getTables();
          
          const dbStructure = {
            name: dataSource.databaseName || 'default',
            schemas: [],
            tables: tables.map((table: any) => ({
              name: typeof table === 'string' ? table : table.name,
              type: 'TABLE',
              schema: null
            }))
          };
          
          structure.databases.push(dbStructure);
        }
      } catch (err) {
        logger.error('获取数据库结构失败', { error: err, dataSourceId: id });
        throw new ApiError(`获取数据库结构失败: ${(err as Error).message}`, 500);
      }
      
      // 返回结构
        res.status(200).json({
          success: true,
        data: structure
      });
    } catch (error) {
      logger.error('获取数据库结构失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取数据库结构时发生错误',
          error: (error as Error).message
        });
      }
    }
  }
  
  /**
   * 获取表的数据示例（预览）
   */
  private async getTablePreviewInternal(connector: any, schemaOrDb: string, tableName: string, limit: number = 1): Promise<any> {
    try {
      if (typeof connector.previewTableData !== 'function') {
        return null;
      }
      
      const preview = await connector.previewTableData(schemaOrDb, tableName, limit);
      if (!preview || !preview.rows || preview.rows.length === 0) {
        return null;
      }
      
      // 从预览中提取第一行数据作为示例
      const sampleRow = preview.rows[0];
      return {
        sampleRow,
        columns: preview.fields ? preview.fields.map((f: any) => f.name) : Object.keys(sampleRow)
      };
    } catch (err) {
      logger.warn('获取表数据预览失败', { error: err, schemaOrDb, tableName });
      return null;
    }
  }

  /**
   * 获取表详细信息
   * @param req 请求对象
   * @param res 响应对象
   */
  public async getTableDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { database, table, schema } = req.query;
      
      if (!id || !database || !table) {
        throw new ApiError('缺少必要参数', 400);
      }
      
      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(id);
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 获取数据库连接
      const connector = await dataSourceService.getConnector(id);
      
      // 获取表信息
      const schemaOrDb = schema as string || database as string;
      const columns = await connector.getColumns(schemaOrDb, table as string);
      const indexes = await connector.getIndexes(schemaOrDb, table as string);
      
      // 获取外键（如果支持）
      let foreignKeys: any[] = [];
      if (typeof connector.getForeignKeys === 'function') {
        foreignKeys = await connector.getForeignKeys(schemaOrDb, table as string);
      }
      
      // 获取主键（如果支持）
      let primaryKeys: any[] = [];
      if (typeof connector.getPrimaryKeys === 'function') {
        primaryKeys = await connector.getPrimaryKeys(schemaOrDb, table as string);
      } else {
        // 从列信息中提取主键
        primaryKeys = columns
          .filter(column => column.isPrimaryKey)
          .map(column => column.name);
      }
      
      // 获取表的数据示例（预览）
      const previewData = await this.getTablePreviewInternal(connector, schemaOrDb, table as string);
      
      // 返回表详情
      res.status(200).json({
              success: true,
        data: {
          name: table,
          schema: schema || null,
          database: database,
          columns,
          indexes,
          foreignKeys,
          primaryKeys,
          preview: previewData
        }
      });
    } catch (error) {
      logger.error('获取表详细信息失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取表详细信息时发生错误',
          error: (error as Error).message
        });
      }
    }
  }

  /**
   * 获取表列表
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  async getTables(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId } = req.params;
      
      logger.info(`获取数据源 ${dataSourceId} 的表列表`);
      
      // 验证数据源是否存在
      const dataSource = await prisma.dataSource.findUnique({
        where: { id: dataSourceId }
      });
      
      if (!dataSource) {
        return next(new ApiError(`数据源 ${dataSourceId} 不存在`, 404));
      }
      
      // 获取数据源的表列表
      const tables = await metadataService.getTables(dataSourceId);
      
      logger.info(`成功获取数据源 ${dataSourceId} 的表列表，共 ${tables.items ? tables.items.length : 0} 张表`);
      
      return res.status(200).json({
      success: true,
        data: tables
      });
          } catch (error) {
      logger.error('获取表列表失败', { error });
      return next(error);
    }
  }
  
  /**
   * 获取表结构
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  async getTableStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId, tableName } = req.params;
      
      if (!dataSourceId || !tableName) {
        throw new ApiError('缺少必要参数', 400);
      }
      
      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 获取表结构
      const structure = await metadataService.getTableStructure(dataSourceId, tableName);
      
      res.status(200).json({
          success: true,
        data: structure
        });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 获取数据源的统计信息
   */
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId } = req.params;
      
      if (!dataSourceId) {
        throw new ApiError('数据源ID不能为空', StatusCodes.BAD_REQUEST);
      }
      
      logger.debug(`获取数据源统计信息: ${dataSourceId}`);
      const stats = await metadataService.getStats(dataSourceId);
    
    res.json({
      success: true,
        data: stats
    });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取表数据预览（带分页、排序和筛选）
   * @param req 请求
   * @param res 响应
   */
  async getTableData(req: Request, res: Response) {
    try {
      // 从params获取id和tableName
      const id = req.params.id || req.params.dataSourceId;
      const { tableName } = req.params;
      
      // 获取分页、排序和筛选参数
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const sort = req.query.sort as string;
      const order = req.query.order as string || 'asc';
      
      // 记录请求参数
      logger.info(`获取表数据预览: ${id}/${tableName}`, { 
        page, size, sort, order, 
        filters: req.query 
      });
      
      // 获取数据源信息
      const dataSource = await prisma.dataSource.findUnique({
        where: { id }
      });
      
      if (!dataSource) {
        return res.status(404).json({
          success: false,
          message: `数据源 ${id} 不存在`
        });
      }
      
      // 解密密码
      let password;
      if (dataSource.passwordEncrypted === dataSource.passwordSalt) {
        // 明文存储 
        password = dataSource.passwordEncrypted;
      } else {
        const crypto = await import('../../utils/crypto');
        password = crypto.decrypt(dataSource.passwordEncrypted, dataSource.passwordSalt);
      }
      
      // 创建MySQL连接
      const connection = await mysql.createConnection({
        host: dataSource.host,
        port: dataSource.port,
        user: dataSource.username,
        password: password,
        database: dataSource.databaseName
      });
      
      try {
        // 计算offset
        const offset = (page - 1) * size;
        
        // 获取总记录数
        const [countResult] = await connection.query(`SELECT COUNT(*) as total FROM ${tableName}`);
        const totalRecords = (countResult as any)[0].total;
        const totalPages = Math.ceil(totalRecords / size);
        
        // 构建查询
        let query = `SELECT * FROM ${tableName}`;
        const params: any[] = [];
        
        // 添加WHERE条件（过滤）
        const whereConditions = [];
        for (const [key, value] of Object.entries(req.query)) {
          if (key.startsWith('filter[') && key.endsWith(']')) {
            const column = key.substring(7, key.length - 1);
            whereConditions.push(`${column} = ?`);
            params.push(value);
          }
        }
        
        if (whereConditions.length > 0) {
          query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        
        // 添加排序
        if (sort) {
          const direction = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
          query += ` ORDER BY ${sort} ${direction}`;
        }
        
        // 添加分页
        query += ` LIMIT ?, ?`;
        params.push(offset, size);
        
        // 执行查询
        const [rows] = await connection.query(query, params);
        
        // 获取列信息
        const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
        
        res.json({
        success: true,
        data: {
            items: rows,
            columns,
            pagination: {
              page,
              size,
              total: totalRecords,
              totalPages,
              hasMore: page < totalPages
            },
            tableInfo: {
              tableName,
              totalRows: totalRecords
            }
          }
        });
      } finally {
        // 确保连接关闭
        await connection.end();
      }
    } catch (error: any) {
      logger.error('获取表数据预览失败', { 
        error: error.message,
        stack: error.stack 
      });
      
      // 返回友好的错误信息
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || '获取表数据失败',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * 获取表的字段信息
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  async getTableColumns(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId, tableName } = req.params;
      
      logger.info(`获取数据源 ${dataSourceId} 表 ${tableName} 的字段信息`);
      
      if (!dataSourceId || !tableName) {
        throw new ApiError('缺少必要参数: dataSourceId或tableName', StatusCodes.BAD_REQUEST);
      }

      // 验证数据源是否存在
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, StatusCodes.NOT_FOUND);
      }

      // 获取连接器
      const connector = await dataSourceService.getConnector(dataSourceId);
      
      // 获取表所在的数据库/schema
      const databaseOrSchema = dataSource.databaseName;
      
      // 尝试两种方式获取字段信息
      let columns = [];
      try {
        // 方式1: 直接使用connector.getColumns
        columns = await connector.getColumns(databaseOrSchema, tableName);
      } catch (err) {
        logger.warn(`直接调用getColumns失败，尝试通过SQL查询获取表结构`, { error: err });
        
        // 方式2: 执行SQL获取列信息
        const describeResult = await connector.executeQuery(`DESCRIBE ${tableName}`);
        if (describeResult && describeResult.rows && Array.isArray(describeResult.rows)) {
          columns = describeResult.rows.map(row => ({
            name: row.Field,
            type: row.Type,
            nullable: row.Null === 'YES',
            defaultValue: row.Default,
            isPrimaryKey: row.Key === 'PRI',
            comment: row.Comment || ''
          }));
        }
      }
      
      // 如果还是没有数据，尝试第三种方式
      if (!columns.length) {
        logger.warn(`前两种方式获取列信息失败，尝试INFORMATION_SCHEMA查询`);
        try {
          const infoSchemaQuery = `
            SELECT 
              COLUMN_NAME as name,
              DATA_TYPE as dataType,
              COLUMN_TYPE as columnType,
              IS_NULLABLE = 'YES' as isNullable,
              COLUMN_KEY = 'PRI' as isPrimaryKey,
              COLUMN_DEFAULT as defaultValue,
              COLUMN_COMMENT as comment
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION
          `;
          const infoSchemaResult = await connector.executeQuery(infoSchemaQuery, [databaseOrSchema, tableName]);
          if (infoSchemaResult && infoSchemaResult.rows && Array.isArray(infoSchemaResult.rows)) {
            columns = infoSchemaResult.rows;
          }
        } catch (err) {
          logger.error(`所有方式获取列信息均失败`, { error: err });
        }
      }
      
      // 返回结果
      res.status(StatusCodes.OK).json({
        success: true,
        data: columns
      });
      
    } catch (error: any) {
      logger.error(`获取表 ${req.params.tableName} 的字段信息失败`, { 
        error: error.message,
        stack: error.stack 
      });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || '获取表字段信息时发生错误'
        });
      }
    }
  }
}

class QueryController {
  /**
   * 验证保存查询请求
   */
  validateSaveQuery() {
    return [
      check('name').isString().isLength({ min: 1, max: 255 }).withMessage('名称长度应在1-255之间'),
      check('dataSourceId').isString().not().isEmpty().withMessage('数据源ID不能为空'),
      check('sql').isString().not().isEmpty().withMessage('SQL语句不能为空'),
      check('description').optional().isString().withMessage('描述必须是字符串'),
      check('tags').optional().isArray().withMessage('标签必须是数组'),
      check('isPublic').optional().isBoolean().withMessage('isPublic必须是布尔值'),
      (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
        success: false,
            message: '请求参数验证失败',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }

  /**
   * 验证更新查询请求
   */
  validateUpdateQuery() {
    return [
      check('name').optional().isString().isLength({ min: 1, max: 255 }).withMessage('名称长度应在1-255之间'),
      check('sql').optional().isString().withMessage('SQL语句必须是字符串'),
      check('description').optional().isString().withMessage('描述必须是字符串'),
      check('tags').optional().isArray().withMessage('标签必须是数组'),
      check('isPublic').optional().isBoolean().withMessage('isPublic必须是布尔值'),
      check('dataSourceId').optional().isString().withMessage('数据源ID必须是字符串'),
      check('status').optional().isString().withMessage('状态必须是字符串'),
      check('serviceStatus').optional().isString().withMessage('服务状态必须是字符串'),
      (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: '请求参数验证失败',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }

  /**
   * 执行查询
   */
  async executeQuery(req: Request, res: Response) {
    try {
      logger.debug('收到执行查询请求', { body: req.body, params: req.params });

      // 检查是否是通过ID执行查询
      const { id } = req.params;
      let dataSourceId, sql, params = [];

      if (id) {
        // 如果是通过ID执行，先获取查询详情
        logger.info(`通过ID执行查询: ${id}`);
        try {
          const query = await queryService.getQueryById(id);
          if (!query) {
            return res.status(404).json({
              success: false,
              message: `查询不存在: ${id}`
            });
          }
          
          dataSourceId = query.dataSourceId;
          sql = query.sqlContent;
          params = req.body.params || [];
          
          logger.info(`成功获取查询: ${id}`, { 
            queryName: query.name,
            dataSourceId
          });
        } catch (error: any) {
          logger.error(`获取查询失败: ${id}`, { error });
          return res.status(404).json({
            success: false,
            message: `获取查询失败: ${error.message}`
          });
        }
      } else {
        // 直接执行方式
        ({ dataSourceId, sql, params = [] } = req.body);
      }
      
      // 验证必要参数
      if (!dataSourceId || !sql) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数：dataSourceId 和 sql 为必填项'
        });
      }

      // 获取分页和排序参数
      const page = req.body.page || 1;
      const pageSize = req.body.pageSize || req.body.limit || 100;
      const offset = req.body.offset || (page - 1) * pageSize;
      const limit = pageSize;
      const sort = req.body.sort;
      const order = req.body.order;

      // 如果是执行计划请求
      const explainQuery = req.body.explainQuery;
      if (explainQuery === true) {
        const plan = await queryService.explainQuery(dataSourceId, sql, params);
        return res.status(200).json({
          success: true,
          data: plan
        });
      }

      // 构建查询选项
      const options = {
        page,
        pageSize,
        offset,
        limit,
        sort,
        order,
        queryId: id || req.body.queryId,
        createHistory: req.body.createHistory !== false // 默认创建历史记录
      };

      // 执行查询
      const result = await queryService.executeQuery(dataSourceId, sql, params, options);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      logger.error('执行查询失败', { error });
      
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || '执行查询失败',
        error: error.details || error.message
      });
    }
  }

  /**
   * 获取查询列表
   */
  async getQueries(req: Request, res: Response) {
    try {
      const { dataSourceId, tag, isPublic, search, includeDrafts, status } = req.query;
      const pagination = getPaginationParams(req);
      const sortBy = req.query.sortBy as string;
      const sortDir = req.query.sortDir as 'asc' | 'desc';
      
      const queries = await queryService.getQueries({
        dataSourceId: dataSourceId as string,
        tag: tag as string,
        isPublic: isPublic ? isPublic === 'true' : undefined,
        search: search as string,
        page: pagination.page,
        limit: pagination.limit,
        offset: pagination.offset,
        includeDrafts: includeDrafts as string,
        sortBy,
        sortDir,
        status: status as string
      });
      
      res.status(200).json({
        success: true,
        data: queries
      });
    } catch (error: any) {
      logger.error('获取查询列表失败', { error });
      
      res.status(error.statusCode || 500).json({
            success: false,
        message: error.message || '获取查询列表失败'
      });
    }
  }

  /**
   * 保存查询
   */
  async saveQuery(req: Request, res: Response) {
    try {
      const { id, name, dataSourceId, sql, description, tags, isPublic } = req.body;
      
      if (!name || !dataSourceId || !sql) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数：name, dataSourceId 和 sql 为必填项'
        });
      }
      
      const savedQuery = await queryService.saveQuery({
        id,
        name,
        dataSourceId,
        sql,
        description,
        tags,
        isPublic
      });
      
      res.status(200).json({
        success: true,
        data: savedQuery
      });
    } catch (error: any) {
      logger.error('保存查询失败', { error });
      
      res.status(error.statusCode || 500).json({
            success: false,
        message: error.message || '保存查询失败'
      });
    }
  }

  /**
   * 发布查询
   */
  async publishQuery(req: Request, res: Response) {
    try {
      const { id, name, dataSourceId, sql, description, tags } = req.body;
      
      if (!name || !dataSourceId || !sql) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数：name, dataSourceId 和 sql 为必填项'
        });
      }
      
      // 保存查询，并设置为已发布状态
      const publishedQuery = await queryService.saveQuery({
        id,
        name,
        dataSourceId,
        sql,
        description,
        tags,
        isPublic: true
      });
      
      res.status(200).json({
        success: true,
        data: publishedQuery
      });
    } catch (error: any) {
      logger.error('发布查询失败', { error });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || '发布查询失败'
      });
    }
  }

  /**
   * 根据ID获取查询
   */
  async getQueryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: '查询ID不能为空'
        });
      }
      
      const query = await queryService.getQueryById(id);
      
      res.status(200).json({
        success: true,
        data: query
      });
    } catch (error: any) {
      logger.error('获取查询失败', { error, id: req.params.id });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || '获取查询失败'
      });
    }
  }

  /**
   * 更新查询
   */
  async updateQuery(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // 兼容处理不同的参数名
      const {
        name,
        sql, sqlContent, 
        description,
        tags,
        isPublic,
        dataSourceId,
        status,
        serviceStatus
      } = req.body;

      // 添加ID格式调试信息
      console.log(`[调试] 接收到更新请求: ID=${id}`, {
        idLength: id.length,
        isUUID: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id),
        params: req.params,
        route: req.route,
        path: req.path,
        originalUrl: req.originalUrl,
        bodyKeys: Object.keys(req.body || {})
      });
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: '查询ID不能为空'
        });
      }
      
      // 获取用户ID，如果不存在则使用system
      const userId = (req as any).user?.id || 'system';
      
      // 处理SQL字段的兼容性问题
      const finalSql = sql || sqlContent;
      
        const updatedQuery = await queryService.updateQuery(id, {
          name,
        sql: finalSql,
          description,
        tags: Array.isArray(tags) ? tags : (tags ? [tags] : undefined),
          isPublic,
          dataSourceId,
          status,
        serviceStatus,
        updatedBy: userId
        });

      res.status(200).json({
          success: true,
          data: updatedQuery
        });
      } catch (error: any) {
      logger.error('更新查询失败', { error, id: req.params.id });
      
      res.status(error.statusCode || 500).json({
          success: false,
        message: error.message || '更新查询失败'
      });
    }
  }

  /**
   * 删除查询
   */
  async deleteQuery(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: '查询ID不能为空'
        });
      }
      
      await queryService.deleteQuery(id);
      
      res.status(200).json({
        success: true,
        message: '查询已成功删除'
      });
    } catch (error: any) {
      logger.error('删除查询失败', { error, id: req.params.id });
      
      res.status(error.statusCode || 500).json({
            success: false,
        message: error.message || '删除查询失败'
      });
    }
  }

  /**
   * 获取查询历史记录
   */
  async getQueryHistory(req: Request, res: Response) {
    try {
      const { dataSourceId } = req.query;
      const pagination = getPaginationParams(req);
      
      const history = await queryService.getQueryHistory(
        dataSourceId as string,
        pagination.limit,
        pagination.offset
      );
      
      res.status(200).json({
          success: true,
        data: history
        });
    } catch (error: any) {
      logger.error('获取查询历史记录失败', { error });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || '获取查询历史记录失败'
      });
    }
  }

  /**
   * 根据ID获取查询历史记录
   */
  async getQueryHistoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: '查询历史记录ID不能为空'
        });
      }
      
      const historyRecord = await queryService.getQueryHistoryById(id);
      
      res.status(200).json({
        success: true,
        data: historyRecord
      });
    } catch (error: any) {
      logger.error('获取查询历史记录失败', { error, id: req.params.id });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || '获取查询历史记录失败'
      });
    }
  }

  /**
   * 删除查询历史记录
   */
  async deleteQueryHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
            success: false,
          message: '查询历史记录ID不能为空'
        });
      }
      
      await queryService.deleteQueryHistory(id);
      
      res.status(200).json({
        success: true,
        message: '查询历史记录已成功删除'
      });
    } catch (error: any) {
      logger.error('删除查询历史记录失败', { error, id: req.params.id });
      
      res.status(error.statusCode || 500).json({
          success: false,
        message: error.message || '删除查询历史记录失败'
      });
    }
  }

  /**
   * 清除临时查询历史记录
   */
  async clearTemporaryQueryHistory(req: Request, res: Response) {
    try {
      const { dataSourceId } = req.query;
      
      const deletedCount = await queryService.clearTemporaryQueryHistory(dataSourceId as string);
      
      res.status(200).json({
        success: true,
        message: `已成功清空临时查询历史记录，共删除${deletedCount}条记录`,
        data: {
          deletedCount
        }
      });
    } catch (error: any) {
      logger.error('清除临时查询历史记录失败', { error });
      
      res.status(error.statusCode || 500).json({
          success: false,
        message: error.message || '清除临时查询历史记录失败'
      });
    }
  }

  /**
   * 取消正在执行的查询
   */
  async cancelQuery(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: '查询ID不能为空'
        });
      }
      
      const result = await queryService.cancelQuery(id);
      
      res.status(200).json({
        success: true,
        message: result ? '查询已成功取消' : '查询取消失败',
        data: { cancelled: result }
      });
    } catch (error: any) {
      logger.error('取消查询失败', { error, id: req.params.id });
      
      res.status(error.statusCode || 500).json({
            success: false,
        message: error.message || '取消查询失败'
      });
    }
  }

  /**
   * 获取查询优化提示
   */
  async getQueryOptimizationTips(req: Request, res: Response) {
    try {
      const { sql, dataSourceId } = req.query;
      
      if (!sql || !dataSourceId) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数：sql 和 dataSourceId 为必填项'
        });
      }
      
      // 这里我们暂时返回一个空数组作为占位符
      // 实际实现中应该分析查询并返回优化建议
      
      res.status(200).json({
        success: true,
        data: {
          tips: [
            {
              type: "performance",
              message: "功能暂时禁用",
              level: "info"
            }
          ]
        }
      });
    } catch (error: any) {
      logger.error('获取查询优化提示失败', { error });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || '获取查询优化提示失败'
      });
    }
  }

  /**
   * 获取查询执行计划历史
   */
  async getQueryPlanHistory(req: Request, res: Response) {
    try {
      const { dataSourceId } = req.query;
      const pagination = getPaginationParams(req);
      
      const planHistory = await queryService.getQueryPlanHistory(
        dataSourceId as string,
        pagination.limit,
        pagination.offset
      );
      
      res.status(200).json({
        success: true,
        data: planHistory
      });
    } catch (error: any) {
      logger.error('获取查询执行计划历史失败', { error });
      
      res.status(error.statusCode || 500).json({
          success: false,
        message: error.message || '获取查询执行计划历史失败'
      });
    }
  }

  /**
   * 解释查询（获取执行计划）
   */
  async explainQuery(req: Request, res: Response) {
    try {
      const { dataSourceId, sql, params = [] } = req.body;
      
      if (!dataSourceId || !sql) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数：dataSourceId 和 sql 为必填项'
        });
      }
      
      const plan = await queryService.explainQuery(dataSourceId, sql, params);
      
      res.status(200).json({
        success: true,
        data: plan
      });
    } catch (error: any) {
      logger.error('解释查询失败', { error });
      
      res.status(error.statusCode || 500).json({
            success: false,
        message: error.message || '解释查询失败'
      });
    }
  }

  /**
   * 收藏查询
   */
  async favoriteQuery(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as AuthenticatedRequest).user?.id || 'anonymous';
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: '查询ID不能为空'
        });
      }
      
      const result = await queryService.favoriteQuery(id, userId);
      
      res.status(200).json({
        success: true,
        message: '查询已成功收藏',
        data: result
      });
    } catch (error: any) {
      logger.error('收藏查询失败', { error, queryId: req.params.id });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || '收藏查询失败'
      });
    }
  }

  /**
   * 取消收藏查询
   */
  async unfavoriteQuery(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as AuthenticatedRequest).user?.id || 'anonymous';
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: '查询ID不能为空'
        });
      }
      
      await queryService.unfavoriteQuery(id, userId);
      
      res.status(200).json({
        success: true,
        message: '已成功取消收藏'
      });
    } catch (error: any) {
      logger.error('取消收藏查询失败', { error, queryId: req.params.id });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || '取消收藏查询失败'
      });
    }
  }

  /**
   * 获取收藏的查询列表
   */
  async getFavorites(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id || 'anonymous';
      const pagination = getPaginationParams(req);
      
      const favorites = await queryService.getFavorites(userId, {
        page: pagination.page,
        limit: pagination.limit,
        offset: pagination.offset
      });
      
      res.status(200).json({
        success: true,
        data: favorites
      });
    } catch (error: any) {
      logger.error('获取收藏查询列表失败', { error });
      
      res.status(error.statusCode || 500).json({
          success: false,
        message: error.message || '获取收藏查询列表失败'
      });
    }
  }

  /**
   * 获取查询的参数列表
   * @param req 请求对象
   * @param res 响应对象
   */
  async getQueryParameters(req: Request, res: Response) {
    try {
      const { id } = req.params;
      logger.info(`获取查询参数: ${id}`);

      // 1. 获取查询详情
      const query = await prisma.query.findUnique({
        where: { id }
      });

      if (!query) {
        return res.status(404).json({
          success: false,
          message: `查询ID为 ${id} 的记录不存在`
        });
      }

      // 2. 获取当前版本的SQL内容
      let sqlContent = query.sqlContent;
      
      // 如果存在当前版本ID，则优先使用当前版本的SQL
      if (query.currentVersionId) {
        const currentVersion = await prisma.queryVersion.findUnique({
          where: { id: query.currentVersionId }
        });
        
        if (currentVersion) {
          sqlContent = currentVersion.sqlContent;
        }
      }

      // 3. 分析SQL中的参数 - 查找:paramName格式的参数
      const paramRegex = /:[a-zA-Z][a-zA-Z0-9_]*/g;
      const matches = sqlContent.match(paramRegex) || [];
      const uniqueParams = [...new Set(matches)];

      // 4. 构建参数列表
      const parameters = uniqueParams.map(param => {
        // 去掉参数名前面的冒号
        const paramName = param.substring(1);
        
        // 判断参数类型 (基于简单的名称规则推断)
        let paramType = 'string';
        let paramFormat = 'string';
        
        if (paramName.toLowerCase().includes('date')) {
          paramType = 'date';
          paramFormat = 'date';
        } else if (paramName.toLowerCase().includes('time')) {
          paramType = 'date';
          paramFormat = 'date-time';
        } else if (
          paramName.toLowerCase().includes('count') ||
          paramName.toLowerCase().includes('id') ||
          paramName.toLowerCase().includes('number')
        ) {
          paramType = 'number';
          paramFormat = 'int';
        } else if (
          paramName.toLowerCase().includes('amount') ||
          paramName.toLowerCase().includes('price') ||
          paramName.toLowerCase().includes('cost')
        ) {
          paramType = 'number';
          paramFormat = 'decimal';
        } else if (
          paramName.toLowerCase().includes('is') ||
          paramName.toLowerCase().includes('has') ||
          paramName.toLowerCase().includes('enable')
        ) {
          paramType = 'boolean';
          paramFormat = 'boolean';
        } else if (
          paramName.toLowerCase().includes('status') ||
          paramName.toLowerCase().includes('type') ||
          paramName.toLowerCase().includes('category')
        ) {
          paramType = 'string';
          paramFormat = 'enum';
        }
        
        return {
          name: paramName,
          type: paramType,
          format: paramFormat,
          formType: paramType === 'date' ? 'date' : 
                    paramFormat === 'enum' ? 'select' : 'text',
          required: true, // 默认所有参数都是必需的
          description: `${paramName.charAt(0).toUpperCase() + paramName.slice(1).replace(/([A-Z])/g, ' $1')}`,
          isNewParam: false,
          defaultValue: paramType === 'date' ? new Date().toISOString().split('T')[0] :
                        paramType === 'number' ? 0 :
                        paramType === 'boolean' ? false : '',
          displayOrder: 0
        };
      });

      return res.json({
        success: true,
        data: parameters
      });
    } catch (error) {
      logger.error('获取查询参数失败', error);
      return res.status(500).json({
        success: false,
        message: '获取查询参数失败'
      });
    }
  }
}

export default new QueryController();