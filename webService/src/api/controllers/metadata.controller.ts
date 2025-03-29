import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import metadataService from '../../services/metadata.service';
import columnAnalyzer from '../../services/metadata/column-analyzer';
import { ApiError } from '../../utils/error';
import logger from '../../utils/logger';
import { DataSourceService } from '../../services/datasource.service';
import config from '../../config';

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
  public previewTableData = [
    param('dataSourceId').isString().notEmpty().withMessage('数据源ID不能为空'),
    param('schemaName').isString().withMessage('模式名称不能为空'),
    param('tableName').isString().withMessage('表名不能为空'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 验证输入
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new ApiError('验证错误', 400, { errors: errors.array() });
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
        throw new ApiError('获取数据库结构失败', 500, { message: (err as Error).message });
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
}

export default new MetadataController();