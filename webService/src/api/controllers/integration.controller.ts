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
 * @swagger
 * tags:
 *   name: Integrations
 *   description: 系统集成管理API
 */
export class IntegrationController {
  private integrationService: IntegrationService;

  constructor() {
    const queryService = new QueryService();
    this.integrationService = new IntegrationService(queryService);
  }

  /**
   * 获取所有集成
   * @swagger
   * /api/low-code/apis:
   *   get:
   *     summary: 获取所有集成配置
   *     tags: [Integrations]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 成功获取集成列表
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Integration'
   *       401:
   *         description: 未授权
   *       500:
   *         description: 服务器错误
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
   * @swagger
   * /api/low-code/apis/{id}:
   *   get:
   *     summary: 获取单个集成配置
   *     tags: [Integrations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 集成ID
   *     responses:
   *       200:
   *         description: 成功获取集成
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Integration'
   *       404:
   *         description: 集成不存在
   *       401:
   *         description: 未授权
   *       500:
   *         description: 服务器错误
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
   * @swagger
   * /api/low-code/apis:
   *   post:
   *     summary: 创建集成配置
   *     tags: [Integrations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - queryId
   *               - type
   *               - config
   *             properties:
   *               name:
   *                 type: string
   *                 description: 集成名称
   *               description:
   *                 type: string
   *                 description: 集成描述
   *               queryId:
   *                 type: string
   *                 format: uuid
   *                 description: 关联的查询ID
   *               type:
   *                 type: string
   *                 enum: [FORM, TABLE, CHART]
   *                 description: 集成类型
   *               config:
   *                 type: object
   *                 description: 集成配置
   *               status:
   *                 type: string
   *                 enum: [DRAFT, ACTIVE, INACTIVE]
   *                 default: DRAFT
   *                 description: 集成状态
   *     responses:
   *       201:
   *         description: 成功创建集成
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Integration'
   *       400:
   *         description: 请求参数错误
   *       401:
   *         description: 未授权
   *       500:
   *         description: 服务器错误
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
   * @swagger
   * /low-code/apis/{id}:
   *   put:
   *     summary: 更新集成配置
   *     tags: [Integrations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 集成ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: 集成名称
   *               description:
   *                 type: string
   *                 description: 集成描述
   *               queryId:
   *                 type: string
   *                 format: uuid
   *                 description: 关联的查询ID
   *               type:
   *                 type: string
   *                 enum: [FORM, TABLE, CHART]
   *                 description: 集成类型
   *               config:
   *                 type: object
   *                 description: 集成配置
   *               status:
   *                 type: string
   *                 enum: [DRAFT, ACTIVE, INACTIVE]
   *                 description: 集成状态
   *     responses:
   *       200:
   *         description: 成功更新集成
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Integration'
   *       400:
   *         description: 请求参数错误
   *       404:
   *         description: 集成不存在
   *       401:
   *         description: 未授权
   *       500:
   *         description: 服务器错误
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
   * @swagger
   * /low-code/apis/{id}:
   *   delete:
   *     summary: 删除集成配置
   *     tags: [Integrations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 集成ID
   *     responses:
   *       204:
   *         description: 成功删除集成
   *       404:
   *         description: 集成不存在
   *       401:
   *         description: 未授权
   *       500:
   *         description: 服务器错误
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
   * @swagger
   * /api/low-code/apis/{id}/config:
   *   get:
   *     summary: 获取集成API配置
   *     tags: [Integrations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 集成ID
   *     responses:
   *       200:
   *         description: 成功获取API配置
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     apiEndpoint:
   *                       type: string
   *                     method:
   *                       type: string
   *                     requestFormat:
   *                       type: object
   *                     responseFormat:
   *                       type: object
   *                     parameterDocs:
   *                       type: array
   *       404:
   *         description: 集成不存在
   *       401:
   *         description: 未授权
   *       500:
   *         description: 服务器错误
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
   * @swagger
   * /low-code/apis/{id}/test:
   *   post:
   *     summary: 测试集成配置
   *     tags: [Integrations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 集成ID
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               params:
   *                 type: object
   *                 description: 测试参数
   *               pagination:
   *                 type: object
   *                 properties:
   *                   page:
   *                     type: number
   *                   pageSize:
   *                     type: number
   *               sorting:
   *                 type: object
   *                 properties:
   *                   field:
   *                     type: string
   *                   order:
   *                     type: string
   *                     enum: [asc, desc]
   *     responses:
   *       200:
   *         description: 测试成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *       400:
   *         description: 请求参数错误
   *       404:
   *         description: 集成不存在
   *       401:
   *         description: 未授权
   *       500:
   *         description: 服务器错误
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
   * @swagger
   * /data-service/query:
   *   post:
   *     summary: 执行集成查询
   *     tags: [Integrations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - integrationId
   *             properties:
   *               integrationId:
   *                 type: string
   *                 format: uuid
   *                 description: 集成ID
   *               params:
   *                 type: object
   *                 description: 查询参数
   *               pagination:
   *                 type: object
   *                 properties:
   *                   page:
   *                     type: number
   *                     description: 页码
   *                   pageSize:
   *                     type: number
   *                     description: 每页大小
   *               sorting:
   *                 type: object
   *                 properties:
   *                   field:
   *                     type: string
   *                     description: 排序字段
   *                   order:
   *                     type: string
   *                     enum: [asc, desc]
   *                     description: 排序方向
   *     responses:
   *       200:
   *         description: 查询成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     records:
   *                       type: array
   *                     total:
   *                       type: number
   *                     page:
   *                       type: number
   *                     pageSize:
   *                       type: number
   *                     totalPages:
   *                       type: number
   *       400:
   *         description: 请求参数错误
   *       404:
   *         description: 集成不存在
   *       500:
   *         description: 服务器错误
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