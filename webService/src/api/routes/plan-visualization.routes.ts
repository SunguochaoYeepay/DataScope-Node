import { Router } from 'express';
import { body, param } from 'express-validator';
import planVisualizationController from '../controllers/plan-visualization.controller';
import { validate } from '../../utils/validate';

const router = Router();

/**
 * @swagger
 * /plan-visualization/{planId}:
 *   get:
 *     summary: 获取查询计划可视化数据
 *     tags: [PlanVisualization]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询计划ID
 *     responses:
 *       200:
 *         description: 成功获取查询计划可视化数据
 *       404:
 *         description: 查询计划不存在
 */
router.get(
  '/:planId',
  [
    param('planId').isUUID().withMessage('无效的查询计划ID'),
  ],
  planVisualizationController.getVisualizationData
);

/**
 * @swagger
 * /plan-visualization/compare/{planId1}/{planId2}:
 *   get:
 *     summary: 比较两个查询计划
 *     tags: [PlanVisualization]
 *     parameters:
 *       - in: path
 *         name: planId1
 *         required: true
 *         schema:
 *           type: string
 *         description: 第一个查询计划ID
 *       - in: path
 *         name: planId2
 *         required: true
 *         schema:
 *           type: string
 *         description: 第二个查询计划ID
 *     responses:
 *       200:
 *         description: 成功比较两个查询计划
 *       404:
 *         description: 一个或多个查询计划不存在
 */
router.get(
  '/compare/:planId1/:planId2',
  [
    param('planId1').isUUID().withMessage('无效的查询计划ID'),
    param('planId2').isUUID().withMessage('无效的查询计划ID'),
  ],
  planVisualizationController.comparePlans
);

/**
 * @swagger
 * /plan-visualization/{planId}/notes:
 *   post:
 *     summary: 保存查询计划分析注释
 *     tags: [PlanVisualization]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询计划ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: 分析注释内容
 *     responses:
 *       200:
 *         description: 成功保存分析注释
 *       404:
 *         description: 查询计划不存在
 */
router.post(
  '/:planId/notes',
  [
    param('planId').isUUID().withMessage('无效的查询计划ID'),
    body('notes').notEmpty().withMessage('注释内容不能为空'),
  ],
  planVisualizationController.saveAnalysisNotes
);

/**
 * @swagger
 * /plan-visualization/{planId}/optimize:
 *   get:
 *     summary: 生成优化后的SQL查询
 *     tags: [PlanVisualization]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询计划ID
 *     responses:
 *       200:
 *         description: 成功生成优化后的SQL查询
 *       404:
 *         description: 查询计划不存在
 */
router.get(
  '/:planId/optimize',
  [
    param('planId').isUUID().withMessage('无效的查询计划ID'),
  ],
  planVisualizationController.generateOptimizedQuery
);

export default router;