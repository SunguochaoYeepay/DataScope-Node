import { Router } from 'express';
import mockQueryPlanController from '../controllers/mock-query-plan.controller';

const router = Router();

/**
 * @swagger
 * /mock-plan:
 *   get:
 *     summary: 获取模拟的查询计划
 *     description: 返回预设的模拟查询计划
 *     tags: [Mock]
 *     responses:
 *       200:
 *         description: 成功获取模拟计划
 *       500:
 *         description: 服务器错误
 */
router.get('/', mockQueryPlanController.getMockPlan);

/**
 * @swagger
 * /mock-plan:
 *   post:
 *     summary: 保存模拟的查询计划
 *     description: 保存查询计划数据用于测试
 *     tags: [Mock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planData:
 *                 type: object
 *     responses:
 *       200:
 *         description: 成功保存模拟计划
 *       400:
 *         description: 请求参数错误
 *       500:
 *         description: 服务器错误
 */
router.post('/', mockQueryPlanController.saveMockQueryPlan);

export default router; 