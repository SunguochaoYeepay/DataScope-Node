import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import metadataService from '../../services/metadata.service';
import columnAnalyzer from '../../services/metadata/column-analyzer';
import { ApiError } from '../../utils/error';
import logger from '../../utils/logger';
import { DataSourceService } from '../../services/datasource.service';
import config from '../../config';
import { getMockMetadataStructure, getMockTableColumns, getMockTableIndexes, getMockTableForeignKeys } from '../../mocks/metadata.mock';

const dataSourceService = new DataSourceService();

// 扩展Request接口以支持用户信息
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class MetadataController {
  /**
   * 同步数据源元数据
   */
  async syncMetadata(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', 400, { errors: errors.array() });
      }

      const { dataSourceId } = req.params;
      const { syncType, schemaPattern, tablePattern } = req.body;

      const result = await metadataService.syncMetadata(dataSourceId, {
        syncType,
        schemaPattern,
        tablePattern
      });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
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
  async previewTableData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', 400, { errors: errors.array() });
      }

      const { dataSourceId } = req.params;
      const { schema, table, limit } = req.query;
      
      if (!schema || !table) {
        throw new ApiError('缺少必要参数', 400, { message: '必须提供schema和table参数' });
      }
      
      const result = await metadataService.previewTableData(
        dataSourceId,
        schema as string,
        table as string,
        Number(limit) || 100
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
   * 验证同步元数据请求
   */
  validateSyncMetadata() {
    return [
      param('dataSourceId').isUUID().withMessage('无效的数据源ID'),
      body('syncType').optional().isIn(['FULL', 'INCREMENTAL']).withMessage('同步类型必须是 FULL 或 INCREMENTAL'),
      body('schemaPattern').optional().isString().withMessage('架构模式必须是字符串'),
      body('tablePattern').optional().isString().withMessage('表模式必须是字符串'),
    ];
  }

  /**
   * 验证预览表数据请求
   */
  validatePreviewTableData() {
    return [
      param('dataSourceId').isUUID().withMessage('无效的数据源ID'),
      query('schema').isString().withMessage('架构名称必须是字符串'),
      query('table').isString().withMessage('表名称必须是字符串'),
      query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('limit必须是1-1000之间的整数'),
    ];
  }
  
  /**
   * 分析表列详细信息
   */
  async analyzeColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', 400, { errors: errors.array() });
      }

      const { dataSourceId } = req.params;
      const { schema, table, column } = req.query;
      
      if (!schema || !table || !column) {
        throw new ApiError('缺少必要参数', 400, { message: '必须提供schema、table和column参数' });
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
      param('dataSourceId').isUUID().withMessage('无效的数据源ID'),
      query('schema').isString().withMessage('架构名称必须是字符串'),
      query('table').isString().withMessage('表名称必须是字符串'),
      query('column').isString().withMessage('列名称必须是字符串'),
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
      
      // 使用模拟数据
      if (config.development.useMockData) {
        logger.info('使用模拟数据获取数据库结构', { dataSourceId: id });
        
        // 返回模拟数据库结构
        res.status(200).json({
          success: true,
          data: getMockMetadataStructure(id)
        });
        return;
      }
      
      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(id);
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 获取数据库连接
      const connector = await dataSourceService.getConnector(id);
      
      // 获取数据库列表
      const databases = await connector.getDatabases();
      
      // 构建结构对象
      const structure = {
        databases: []
      };
      
      // 遍历数据库
      for (const database of databases) {
        const dbStructure: any = {
          name: database,
          schemas: [],
          tables: []
        };
        
        // 根据数据库类型获取模式或表
        try {
          if (connector.getSchemas) {
            // 支持模式的数据库（如PostgreSQL）
            const schemas = await connector.getSchemas();
            
            for (const schema of schemas) {
              const tables = await connector.getTables(database, schema);
              
              const schemaStructure = {
                name: schema,
                tables: tables.map(table => ({
                  name: table,
                  type: 'TABLE', // 简化处理，实际应根据类型区分表、视图等
                  schema
                }))
              };
              
              dbStructure.schemas.push(schemaStructure);
            }
          } else {
            // 不支持模式的数据库（如MySQL）
            const tables = await connector.getTables(database);
            
            dbStructure.tables = tables.map(table => ({
              name: table,
              type: 'TABLE', // 简化处理
              schema: null
            }));
          }
        } catch (e) {
          logger.warn(`获取数据库 ${database} 结构失败`, { error: e });
          // 继续处理其他数据库
        }
        
        structure.databases.push(dbStructure);
      }
      
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
          message: '获取元数据结构失败',
          error: (error as Error).message
        });
      }
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
      const { database, table, schema } = req.query as { database: string; table: string; schema?: string };
      
      if (!id || !database || !table) {
        throw new ApiError('缺少必要参数', 400);
      }
      
      // 使用模拟数据
      if (config.development.useMockData) {
        logger.info('使用模拟数据获取表详情', { dataSourceId: id, database, table });
        
        // 获取模拟列信息
        const columns = getMockTableColumns(id, database, table);
        
        // 获取模拟索引信息
        const indexes = getMockTableIndexes(id, database, table);
        
        // 获取模拟外键信息
        const foreignKeys = getMockTableForeignKeys(id, database, table);
        
        // 返回模拟表详情
        res.status(200).json({
          success: true,
          data: {
            name: table,
            schema: schema || 'public',
            database,
            columns,
            indexes,
            foreignKeys,
            rowCount: 10000 + Math.floor(Math.random() * 90000)
          }
        });
        return;
      }
      
      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(id);
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 获取数据库连接
      const connector = await dataSourceService.getConnector(id);
      
      // 获取列信息
      const columns = await connector.getColumns(database, table, schema);
      
      // 获取索引信息
      const indexes = await connector.getIndexes(database, table, schema);
      
      // 获取外键信息
      let foreignKeys = [];
      if (connector.getForeignKeys) {
        foreignKeys = await connector.getForeignKeys(database, table, schema);
      }
      
      // 获取主键信息
      let primaryKeys = [];
      if (connector.getPrimaryKeys) {
        primaryKeys = await connector.getPrimaryKeys(database, table, schema);
      } else {
        // 从列信息中提取主键
        primaryKeys = columns
          .filter(column => column.isPrimary)
          .map(column => column.name);
      }
      
      // 获取行数（预览）
      let rowCount = 0;
      if (connector.previewTableData) {
        try {
          const preview = await connector.previewTableData(database, table, schema, 1);
          rowCount = preview.rowCount || 0;
        } catch (e) {
          logger.warn(`获取表 ${table} 行数失败`, { error: e });
          // 忽略错误，继续返回其他信息
        }
      }
      
      res.status(200).json({
        success: true,
        data: {
          name: table,
          schema: schema || null,
          database,
          columns,
          indexes,
          foreignKeys,
          primaryKeys,
          rowCount
        }
      });
    } catch (error) {
      logger.error('获取表详情失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取表详情失败',
          error: (error as Error).message
        });
      }
    }
  }
  
  /**
   * 获取表数据预览
   * @param req 请求对象
   * @param res 响应对象
   */
  public async previewTableData(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { database, table, schema, limit } = req.query as { 
        database: string; 
        table: string; 
        schema?: string;
        limit?: string;
      };
      
      if (!id || !database || !table) {
        throw new ApiError('缺少必要参数', 400);
      }
      
      const rowLimit = limit ? parseInt(limit) : 100;
      
      // 使用模拟数据
      if (config.development.useMockData) {
        logger.info('使用模拟数据获取表预览', { dataSourceId: id, database, table });
        
        // 获取模拟列信息
        const columns = getMockTableColumns(id, database, table);
        const columnNames = columns.map(col => col.name);
        
        // 生成模拟数据行
        const rows = Array(Math.min(rowLimit, 50)).fill(0).map((_, rowIndex) => {
          const row: any = {};
          
          columns.forEach(col => {
            if (col.name === 'id') {
              row[col.name] = rowIndex + 1;
            } else if (col.type.includes('INT')) {
              row[col.name] = Math.floor(Math.random() * 1000);
            } else if (col.type.includes('VARCHAR') || col.type.includes('TEXT')) {
              row[col.name] = `${col.name}_值_${rowIndex + 1}`;
            } else if (col.type.includes('DECIMAL')) {
              row[col.name] = (Math.random() * 1000).toFixed(2);
            } else if (col.type.includes('TIMESTAMP')) {
              row[col.name] = new Date(Date.now() - Math.random() * 10000000000).toISOString();
            } else if (col.type.includes('ENUM')) {
              // 从类型定义中提取枚举值
              const enumValues = col.type.match(/"([^"]+)"/g)?.map(v => v.replace(/"/g, '')) || ['value1', 'value2'];
              row[col.name] = enumValues[Math.floor(Math.random() * enumValues.length)];
            } else {
              row[col.name] = `${col.name}_${rowIndex}`;
            }
          });
          
          return row;
        });
        
        // 返回模拟表数据
        res.status(200).json({
          success: true,
          data: {
            columns: columnNames,
            rows,
            rowCount: rows.length,
            totalRows: 10000 + Math.floor(Math.random() * 90000)
          }
        });
        return;
      }
      
      // 获取数据源
      const dataSource = await dataSourceService.getDataSourceById(id);
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 获取数据库连接
      const connector = await dataSourceService.getConnector(id);
      
      // 生成预览SQL
      const sql = `SELECT * FROM ${schema ? `${schema}.` : ''}${table} LIMIT ${rowLimit}`;
      
      // 执行查询
      const result = await connector.executeQuery(sql);
      
      res.status(200).json({
        success: true,
        data: {
          columns: result.columns,
          rows: result.rows,
          rowCount: result.rows.length,
          totalRows: result.rowCount || result.rows.length
        }
      });
    } catch (error) {
      logger.error('获取表数据预览失败', { error });
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '获取表数据预览失败',
          error: (error as Error).message
        });
      }
    }
  }
}

export default new MetadataController();