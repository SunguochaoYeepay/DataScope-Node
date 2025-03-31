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
}

export default new MetadataController(); 