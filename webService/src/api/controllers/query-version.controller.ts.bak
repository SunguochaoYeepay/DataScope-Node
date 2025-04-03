/**
 * 查询版本控制接口控制器
 */
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/errors/types/api-error';
import { ERROR_CODES } from '../../utils/errors/error-codes';
import { VERSION_ERROR } from '../../utils/errors/error-codes-version';
import queryVersionService from '../../services/query-version.service';
import { saveQueryWithVersion, updateQueryWithVersion, executeQueryWithVersion, getQueryHistoryWithVersion } from '../../services/query.service.version';
import { QueryVersionStatus, DisableQueryParams } from '../../types/query-version';
import logger from '../../utils/logger';

/**
 * 查询版本控制器
 */
export class QueryVersionController {
  /**
   * 创建查询草稿
   */
  async createQueryDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, dataSourceId, sql, description, tags } = req.body;
      const userId = req.user?.id || 'system';
      
      if (!name || !dataSourceId || !sql) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '名称、数据源和SQL语句不能为空');
      }
      
      const result = await saveQueryWithVersion({
        name,
        dataSourceId,
        sql,
        description,
        tags,
        userId
      });
      
      logger.info('创建查询草稿成功', { queryId: result.query.id, versionId: result.versionId });
      
      return res.status(201).json({
        success: true,
        message: '创建查询草稿成功',
        data: {
          query: result.query,
          versionId: result.versionId
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 更新查询创建新草稿
   */
  async updateQueryDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, sql, description, tags } = req.body;
      const userId = req.user?.id || 'system';
      
      const result = await updateQueryWithVersion({
        queryId: id,
        name,
        sql,
        description,
        tags,
        userId
      });
      
      logger.info('更新查询创建新草稿成功', { queryId: id, versionId: result.versionId });
      
      return res.status(200).json({
        success: true,
        message: '更新查询创建新草稿成功',
        data: {
          query: result.query,
          versionId: result.versionId
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 更新草稿版本
   */
  async updateDraftVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId, versionId } = req.params;
      const { sql, description, parameters } = req.body;
      
      // 验证请求参数
      if (!versionId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '版本ID不能为空');
      }
      
      const updatedVersion = await queryVersionService.updateDraftVersion(versionId, {
        sqlContent: sql,
        description,
        parameters
      });
      
      logger.info('更新草稿版本成功', { queryId, versionId });
      
      return res.status(200).json({
        success: true,
        message: '更新草稿版本成功',
        data: updatedVersion
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 发布版本
   */
  async publishVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId, versionId } = req.params;
      
      // 验证请求参数
      if (!versionId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '版本ID不能为空');
      }
      
      const publishedVersion = await queryVersionService.publishVersion(versionId);
      
      logger.info('发布查询版本成功', { queryId, versionId });
      
      return res.status(200).json({
        success: true,
        message: '发布查询版本成功',
        data: publishedVersion
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 废弃版本
   */
  async deprecateVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId, versionId } = req.params;
      
      // 验证请求参数
      if (!versionId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '版本ID不能为空');
      }
      
      const deprecatedVersion = await queryVersionService.deprecateVersion(versionId);
      
      logger.info('废弃查询版本成功', { queryId, versionId });
      
      return res.status(200).json({
        success: true,
        message: '废弃查询版本成功',
        data: deprecatedVersion
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 设置活跃版本
   */
  async activateVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId, versionId } = req.params;
      
      // 验证请求参数
      if (!versionId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '版本ID不能为空');
      }
      
      const updatedQuery = await queryVersionService.activateVersion(versionId);
      
      logger.info('设置查询活跃版本成功', { queryId, versionId });
      
      return res.status(200).json({
        success: true,
        message: '设置查询活跃版本成功',
        data: updatedQuery
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 获取版本列表
   */
  async getVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId } = req.params;
      
      // 验证请求参数
      if (!queryId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '查询ID不能为空');
      }
      
      const versions = await queryVersionService.getVersions(queryId);
      
      return res.status(200).json({
        success: true,
        message: '获取查询版本列表成功',
        data: versions
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 获取版本详情
   */
  async getVersionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { versionId } = req.params;
      
      // 验证请求参数
      if (!versionId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '版本ID不能为空');
      }
      
      const version = await queryVersionService.getVersionById(versionId);
      
      return res.status(200).json({
        success: true,
        message: '获取查询版本详情成功',
        data: version
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 禁用查询服务
   */
  async disableQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId } = req.params;
      const { reason } = req.body as DisableQueryParams;
      
      // 验证请求参数
      if (!queryId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '查询ID不能为空');
      }
      
      if (!reason) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '禁用原因不能为空');
      }
      
      const disabledQuery = await queryVersionService.disableQuery(queryId, reason);
      
      logger.info('禁用查询服务成功', { queryId, reason });
      
      return res.status(200).json({
        success: true,
        message: '禁用查询服务成功',
        data: disabledQuery
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 启用查询服务
   */
  async enableQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId } = req.params;
      
      // 验证请求参数
      if (!queryId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '查询ID不能为空');
      }
      
      const enabledQuery = await queryVersionService.enableQuery(queryId);
      
      logger.info('启用查询服务成功', { queryId });
      
      return res.status(200).json({
        success: true,
        message: '启用查询服务成功',
        data: enabledQuery
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 获取查询服务状态
   */
  async getQueryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId } = req.params;
      
      // 验证请求参数
      if (!queryId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '查询ID不能为空');
      }
      
      const status = await queryVersionService.getQueryStatus(queryId);
      
      return res.status(200).json({
        success: true,
        message: '获取查询服务状态成功',
        data: status
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 执行查询(版本化)
   */
  async executeQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId } = req.params;
      const { versionId, params, options } = req.body;
      const userId = req.user?.id || 'system';
      
      // 验证请求参数
      if (!queryId) {
        throw new ApiError(ERROR_CODES.INVALID_REQUEST, '查询ID不能为空');
      }
      
      const result = await executeQueryWithVersion({
        queryId,
        versionId,
        params,
        userId,
        options
      });
      
      logger.info('执行查询(版本化)成功', { 
        queryId, 
        versionId, 
        rowCount: result.rowCount,
        executionTime: result.executionTime
      });
      
      return res.status(200).json({
        success: true,
        message: '执行查询成功',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * 获取查询历史(版本化)
   */
  async getQueryHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryId } = req.params;
      const { versionId } = req.query;
      let { page, pageSize } = req.query;
      
      // 处理分页参数
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const pageSizeNum = pageSize ? parseInt(pageSize as string, 10) : 20;
      
      const result = await getQueryHistoryWithVersion({
        queryId,
        versionId: versionId as string,
        page: pageNum,
        pageSize: pageSizeNum
      });
      
      logger.info('获取查询历史(版本化)成功', { 
        queryId, 
        versionId, 
        total: result.total
      });
      
      return res.status(200).json({
        success: true,
        message: '获取查询历史成功',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new QueryVersionController();