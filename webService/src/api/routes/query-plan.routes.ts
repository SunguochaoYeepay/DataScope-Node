import { Router } from 'express';
import { param, body } from 'express-validator';
import { QueryPlanController } from '../controllers/query-plan.controller';

const router = Router();
const queryPlanController = new QueryPlanController();

/**
 * @swagger
 * /api/query-plans/datasource/{dataSourceId}:
 *   post:
 *     summary: 获取SQL查询执行计划
 *     description: 根据数据源ID和SQL语句获取查询执行计划
 *     tags: [QueryPlans]
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 数据源ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sql
 *             properties:
 *               sql:
 *                 type: string
 *                 description: SQL查询语句
 *     responses:
 *       200:
 *         description: 成功获取查询执行计划
 *       400:
 *         description: 无效的请求参数
 *       404:
 *         description: 数据源不存在
 *       500:
 *         description: 服务器错误
 */
router.post(
  '/datasource/:dataSourceId',
  [
    param('dataSourceId').isUUID().withMessage('数据源ID必须是有效的UUID'),
    body('sql').isString().notEmpty().withMessage('SQL查询不能为空')
  ],
  queryPlanController.getQueryPlan
);

/**
 * @swagger
 * /api/query-plans/query/{queryId}/save:
 *   post:
 *     summary: 保存查询执行计划
 *     description: 将查询执行计划保存到数据库
 *     tags: [QueryPlans]
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan
 *             properties:
 *               plan:
 *                 type: object
 *                 description: 查询执行计划对象
 *               sql:
 *                 type: string
 *                 description: SQL查询语句（可选）
 *     responses:
 *       201:
 *         description: 成功保存查询执行计划
 *       400:
 *         description: 无效的请求参数
 *       404:
 *         description: 查询不存在
 *       500:
 *         description: 服务器错误
 */
router.post(
  '/query/:queryId/save',
  [
    param('queryId').isUUID().withMessage('查询ID必须是有效的UUID'),
    body('plan').isObject().withMessage('plan必须是有效的对象')
  ],
  queryPlanController.saveQueryPlan
);

/**
 * @swagger
 * /api/query-plans/query/{queryId}/history:
 *   get:
 *     summary: 获取查询执行计划历史记录
 *     description: 获取指定查询的所有执行计划历史记录
 *     tags: [QueryPlans]
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询ID
 *     responses:
 *       200:
 *         description: 成功获取查询执行计划历史记录
 *       400:
 *         description: 无效的请求参数
 *       404:
 *         description: 查询不存在
 *       500:
 *         description: 服务器错误
 */
router.get(
  '/query/:queryId/history',
  [
    param('queryId').isUUID().withMessage('查询ID必须是有效的UUID')
  ],
  queryPlanController.getQueryPlanHistory
);

/**
 * @swagger
 * /api/query-plans/{planId}:
 *   get:
 *     summary: 获取查询执行计划详情
 *     description: 根据计划ID获取查询执行计划详情
 *     tags: [QueryPlans]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 执行计划ID
 *     responses:
 *       200:
 *         description: 成功获取查询执行计划详情
 *       400:
 *         description: 无效的请求参数
 *       404:
 *         description: 执行计划不存在
 *       500:
 *         description: 服务器错误
 */
router.get(
  '/:planId',
  [
    param('planId').isUUID().withMessage('计划ID必须是有效的UUID')
  ],
  queryPlanController.getQueryPlanById
);

/**
 * @swagger
 * /api/query-plans/{planId}:
 *   delete:
 *     summary: 删除查询执行计划
 *     description: 根据计划ID删除查询执行计划
 *     tags: [QueryPlans]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 执行计划ID
 *     responses:
 *       200:
 *         description: 成功删除查询执行计划
 *       400:
 *         description: 无效的请求参数
 *       404:
 *         description: 执行计划不存在
 *       500:
 *         description: 服务器错误
 */
router.delete(
  '/:planId',
  [
    param('planId').isUUID().withMessage('计划ID必须是有效的UUID')
  ],
  queryPlanController.deleteQueryPlan
);

export default router;