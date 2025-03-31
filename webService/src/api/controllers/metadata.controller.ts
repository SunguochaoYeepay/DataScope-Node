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
      const { limit, offset } = req.query;
      
      const result = await metadataService.getSyncHistory(
      dataSourceId,
        Number(limit) || 10,
        Number(offset) || 0
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
      
      logger.info(`成功获取数据源 ${dataSourceId} 的表列表，共 ${tables.length} 张表`);
      
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
            rows,
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
}

export default new MetadataController();