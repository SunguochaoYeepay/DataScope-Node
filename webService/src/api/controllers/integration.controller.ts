import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { IntegrationService } from '../../services/integration.service';
import ApiError from '../../utils/apiError';
import logger from '../../utils/logger';
import { QueryService } from '../../services/query.service';

// 扩展Request类型，添加user属性
interface Request extends ExpressRequest {
  user?: {
    id: string;
    [key: string]: any;
  };
}

/**
 * 集成控制器类
 * 处理所有与系统集成相关的API请求
 */
export class IntegrationController {
  private integrationService: IntegrationService;

  constructor() {
    const queryService = new QueryService();
    this.integrationService = new IntegrationService(queryService);
  }

  /**
   * 获取所有集成
   */
  getIntegrations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const integrations = await this.integrationService.getIntegrations();
      res.json({
        success: true,
        data: integrations
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取单个集成
   */
  getIntegrationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      logger.info(`获取集成详情: ${id}`);

      const integration = await this.integrationService.getIntegrationById(id);
      res.json({
        success: true,
        data: integration
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 创建集成
   */
  createIntegration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      
      // 记录创建者信息
      if (req.user) {
        data.createdBy = req.user.id;
        data.updatedBy = req.user.id;
      }
      
      logger.info('创建集成', { data });
      
      // 创建集成
      const integration = await this.integrationService.createIntegration(data);
      
      res.status(201).json({
        success: true,
        data: integration
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新集成
   */
  updateIntegration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      
      // 记录更新者信息
      if (req.user) {
        data.updatedBy = req.user.id;
      }
      
      logger.info(`更新集成: ${id}`, { data });
      
      // 更新集成
      const integration = await this.integrationService.updateIntegration(id, data);
      
      res.json({
        success: true,
        data: integration
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 删除集成
   */
  deleteIntegration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      logger.info(`删除集成: ${id}`);
      
      await this.integrationService.deleteIntegration(id);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取API配置
   */
  getIntegrationConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      logger.info(`获取集成API配置: ${id}`);
      
      const config = await this.integrationService.getIntegrationConfig(id);
      
      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 测试集成
   */
  testIntegration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const testParams = req.body;
      
      logger.info(`测试集成: ${id}`, { testParams });
      
      const result = await this.integrationService.testIntegration(id, testParams);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 执行查询
   */
  executeQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { integrationId, params, pagination, sorting } = req.body;
      
      logger.info(`执行集成查询: ${integrationId}`, { params, pagination, sorting });
      
      const result = await this.integrationService.executeQuery(
        integrationId,
        params,
        pagination,
        sorting
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}