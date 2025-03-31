import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import metadataService from '../services/metadata.service';
import datasourceService from '../services/datasource.service';
import ApiError from '../utils/apiError';

/**
 * 元数据控制器，处理与数据源元数据相关的请求
 */
class MetadataController {
  /**
   * 获取数据源的表列表
   * @param req 请求对象，包含数据源ID
   * @param res 响应对象
   */
  async getTables(req: Request, res: Response): Promise<void> {
    try {
      const { dataSourceId } = req.params;
      logger.info(`获取数据源 ${dataSourceId} 的表列表`);

      // 验证数据源是否存在
      const dataSource = await datasourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, StatusCodes.NOT_FOUND);
      }

      const tables = await metadataService.getTables(dataSourceId);
      
      res.status(StatusCodes.OK).json({
        success: true,
        data: tables
      });
    } catch (error: any) {
      logger.error('获取表列表失败', { error });
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || '获取表列表时发生内部错误'
        });
      }
    }
  }

  /**
   * 获取表的列信息
   * @param req 请求对象，包含数据源ID和表名
   * @param res 响应对象
   */
  async getColumns(req: Request, res: Response): Promise<void> {
    try {
      const { dataSourceId, tableName } = req.params;
      logger.info(`获取数据源 ${dataSourceId} 表 ${tableName} 的列信息`);

      // 验证数据源是否存在
      const dataSource = await datasourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, StatusCodes.NOT_FOUND);
      }

      const columns = await metadataService.getColumns(dataSourceId, tableName);
      
      res.status(StatusCodes.OK).json({
        success: true,
        data: columns
      });
    } catch (error: any) {
      logger.error('获取列信息失败', { error });
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || '获取列信息时发生内部错误'
        });
      }
    }
  }

  /**
   * 获取数据源的元数据结构
   * @param req 请求对象，包含数据源ID
   * @param res 响应对象
   */
  async getStructure(req: Request, res: Response): Promise<void> {
    try {
      const { dataSourceId } = req.params;
      logger.info(`获取数据源 ${dataSourceId} 的元数据结构`);

      // 验证数据源是否存在
      const dataSource = await datasourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, StatusCodes.NOT_FOUND);
      }

      const structure = await metadataService.getStructure(dataSourceId);
      
      res.status(StatusCodes.OK).json({
        success: true,
        data: structure
      });
    } catch (error: any) {
      logger.error('获取元数据结构失败', { error });
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || '获取元数据结构时发生内部错误'
        });
      }
    }
  }

  /**
   * 同步数据源的元数据
   * @param req 请求对象，包含数据源ID
   * @param res 响应对象
   */
  async syncMetadata(req: Request, res: Response): Promise<void> {
    try {
      const { dataSourceId } = req.params;
      logger.info(`同步数据源 ${dataSourceId} 的元数据`);

      // 验证数据源是否存在
      const dataSource = await datasourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, StatusCodes.NOT_FOUND);
      }

      const syncResult = await metadataService.syncMetadata(dataSourceId);
      
      res.status(StatusCodes.OK).json({
        success: true,
        data: syncResult
      });
    } catch (error: any) {
      logger.error('同步元数据失败', { error });
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || '同步元数据时发生内部错误'
        });
      }
    }
  }

  /**
   * 获取数据源的统计信息
   * @param req 请求对象，包含数据源ID
   * @param res 响应对象
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { dataSourceId } = req.params;
      logger.info(`获取数据源 ${dataSourceId} 的统计信息`);

      // 验证数据源是否存在
      const dataSource = await datasourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, StatusCodes.NOT_FOUND);
      }

      const stats = await metadataService.getStats(dataSourceId);
      
      res.status(StatusCodes.OK).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      logger.error('获取统计信息失败', { error });
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || '获取统计信息时发生内部错误'
        });
      }
    }
  }

  /**
   * 获取表的数据预览
   * @param req 请求对象，包含数据源ID、表名、分页与排序参数
   * @param res 响应对象
   */
  async getTableData(req: Request, res: Response): Promise<void> {
    try {
      const { dataSourceId, tableName } = req.params;
      
      // 获取查询参数
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const sort = req.query.sort as string;
      const order = (req.query.order as string || 'asc').toLowerCase();
      
      // 计算偏移量
      const offset = (page - 1) * size;
      
      logger.info(`获取数据源 ${dataSourceId} 表 ${tableName} 的数据预览，页码=${page}, 每页记录数=${size}`);

      // 验证数据源是否存在
      const dataSource = await datasourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, StatusCodes.NOT_FOUND);
      }

      // 获取数据源连接器
      const connector = await datasourceService.getConnector(dataSourceId);
      
      // 构建过滤条件
      const filters: Record<string, string> = {};
      for (const key in req.query) {
        if (key.startsWith('filter[') && key.endsWith(']')) {
          const columnName = key.slice(7, -1); // 提取列名
          filters[columnName] = req.query[key] as string;
        }
      }
      
      // 构建查询语句
      let sql = `SELECT * FROM \`${tableName}\``;
      const params: any[] = [];
      
      // 添加过滤条件
      if (Object.keys(filters).length > 0) {
        const whereConditions = [];
        
        for (const [column, value] of Object.entries(filters)) {
          // 使用参数化查询防止SQL注入
          whereConditions.push(`\`${column}\` = ?`);
          params.push(value);
        }
        
        if (whereConditions.length > 0) {
          sql += ` WHERE ${whereConditions.join(' AND ')}`;
        }
      }
      
      // 添加排序
      if (sort) {
        const sortDirection = order === 'desc' ? 'DESC' : 'ASC';
        sql += ` ORDER BY \`${sort}\` ${sortDirection}`;
      }
      
      // 添加分页
      sql += ` LIMIT ${offset}, ${size}`;
      
      // 执行查询
      const result = await connector.executeQuery(sql, params);
      
      // 获取总记录数
      const countSql = `SELECT COUNT(*) as total FROM \`${tableName}\``;
      const countResult = await connector.executeQuery(countSql);
      const total = parseInt(countResult.rows[0].total, 10);
      
      const totalPages = Math.ceil(total / size);

      // 构造响应数据
      const responseData = {
        rows: result.rows,
        columns: result.fields ? result.fields.map((field: any) => ({
          name: field.name,
          type: field.type
        })) : [],
        pagination: {
          page,
          size,
          total,
          totalPages,
          hasMore: page < totalPages
        },
        tableInfo: {
          tableName,
          totalRows: total
        }
      };
      
      res.status(StatusCodes.OK).json({
        success: true,
        data: responseData
      });
    } catch (error: any) {
      logger.error('获取表数据预览失败', { error });
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || '获取表数据预览时发生内部错误'
        });
      }
    }
  }
}

export default new MetadataController(); 