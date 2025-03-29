import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import metadataService from '../../services/metadata.service';
import columnAnalyzer from '../../services/metadata/column-analyzer';
import { ApiError } from '../../utils/error';
import logger from '../../utils/logger';

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
}

export default new MetadataController();