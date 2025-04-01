import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { ApiError } from '../../utils/errors/types/api-error';
import { ERROR_CODES } from '../../utils/errors/error-codes';
import folderService from '../../services/folder.service';
import logger from '../../utils/logger';
import { getPaginationParams } from '../../utils/api.utils';

export class FolderController {
  /**
   * 获取文件夹列表
   */
  async getFolders(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentId } = req.query;
      const pagination = getPaginationParams(req);
      
      const result = await folderService.getFolders({
        parentId: parentId ? String(parentId) : undefined,
        page: pagination.page,
        size: pagination.size
      });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      logger.error('获取文件夹列表失败', { error });
      next(error);
    }
  }
  
  /**
   * 创建文件夹
   */
  async createFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '请求参数错误',
          errors: errors.array()
        });
      }
      
      const { name, description, parentId } = req.body;
      
      const folder = await folderService.createFolder({
        name,
        description,
        parentId
      });
      
      res.status(201).json({
        success: true,
        data: folder,
        message: '文件夹创建成功'
      });
    } catch (error: any) {
      logger.error('创建文件夹失败', { error });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode || 500).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode
        });
      }
      
      next(error);
    }
  }
  
  /**
   * 更新文件夹
   */
  async updateFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '请求参数错误',
          errors: errors.array()
        });
      }
      
      const { id } = req.params;
      const { name, description, parentId } = req.body;
      
      const folder = await folderService.updateFolder(id, {
        name,
        description,
        parentId
      });
      
      res.status(200).json({
        success: true,
        data: folder,
        message: '文件夹更新成功'
      });
    } catch (error: any) {
      logger.error(`更新文件夹失败 ID: ${req.params.id}`, { error });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode || 500).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode
        });
      }
      
      next(error);
    }
  }
  
  /**
   * 删除文件夹
   */
  async deleteFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const result = await folderService.deleteFolder(id);
      
      res.status(200).json({
        success: true,
        message: '文件夹删除成功'
      });
    } catch (error: any) {
      logger.error(`删除文件夹失败 ID: ${req.params.id}`, { error });
      
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          return res.status(404).json({
            success: false,
            message: '文件夹不存在',
            errorCode: error.errorCode || ERROR_CODES.RESOURCE_NOT_FOUND
          });
        }
        
        if (error.statusCode === 400) {
          return res.status(400).json({
            success: false,
            message: error.message,
            errorCode: error.errorCode
          });
        }
        
        return res.status(error.statusCode || 500).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode
        });
      }
      
      next(error);
    }
  }
  
  /**
   * 获取文件夹详情
   */
  async getFolderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const folder = await folderService.getFolderById(id);
      
      res.status(200).json({
        success: true,
        data: folder
      });
    } catch (error: any) {
      logger.error(`获取文件夹详情失败 ID: ${req.params.id}`, { error });
      
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          return res.status(404).json({
            success: false,
            message: '文件夹不存在',
            errorCode: error.errorCode || ERROR_CODES.RESOURCE_NOT_FOUND
          });
        }
        
        return res.status(error.statusCode || 500).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode
        });
      }
      
      next(error);
    }
  }
  
  /**
   * 验证创建文件夹参数
   */
  validateCreateFolder() {
    return [
      check('name').not().isEmpty().withMessage('文件夹名称不能为空'),
      check('description').optional(),
      check('parentId').optional()
    ];
  }
  
  /**
   * 验证更新文件夹参数
   */
  validateUpdateFolder() {
    return [
      check('name').optional(),
      check('description').optional(),
      check('parentId').optional()
    ];
  }
}

// 创建单例实例导出
const folderController = new FolderController();
export default folderController; 