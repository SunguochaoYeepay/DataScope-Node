import { Router } from 'express';
import { check } from 'express-validator';
import planVisualizationController from '../controllers/plan-visualization.controller';
import { validate } from '../../utils/validate';
import { authenticate } from '../../middleware/auth';

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *             example:
 *               success: true
 *               data:
 *                 nodes:
 *                   - id: "1"
 *                     type: "TABLE_SCAN"
 *                     label: "Table Scan (users)"
 *                     details:
 *                       table: "users"
 *                       rows: 5000
 *                       filtered: 20
 *                       cost: 125.75
 *                       accessType: "ALL"
 *                       key: null
 *                       possibleKeys: ["PRIMARY", "idx_email"]
 *                     metrics:
 *                       cost: 125.75
 *                       rows: 5000
 *                     warning: true
 *                     warningMessage: "Full table scan without index"
 *                   - id: "2"
 *                     type: "JOIN"
 *                     label: "Nested Loop Join"
 *                     details:
 *                       joinType: "INNER JOIN"
 *                       condition: "users.id = orders.user_id"
 *                       rows: 200
 *                       cost: 45.30
 *                     metrics:
 *                       cost: 45.30
 *                       rows: 200
 *                     warning: false
 *                 edges:
 *                   - source: "1"
 *                     target: "2"
 *                     label: "Output"
 *                 summary:
 *                   totalCost: 171.05
 *                   totalRows: 5200
 *                   bottlenecks:
 *                     - nodeId: "1"
 *                       issue: "Full table scan"
 *                       impact: "High"
 *                       suggestion: "Add index on frequently queried columns"
 *                 layout:
 *                   rankdir: "TB"
 *                   marginx: 20
 *                   marginy: 20
 *       404:
 *         description: 查询计划不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *             example:
 *               success: false
 *               error:
 *                 message: "查询计划不存在"
 *                 code: 40401
 *                 details: "未找到ID为{planId}的查询计划"
 */
router.get(
  '/:planId',
  [
    check('planId').isString().not().isEmpty().withMessage('无效的查询计划ID'),
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *             example:
 *               success: true
 *               data:
 *                 planA:
 *                   id: "123e4567-e89b-12d3-a456-426614174000"
 *                   name: "原始查询"
 *                   sql: "SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE users.status = 'active'"
 *                   visualization:
 *                     nodes:
 *                       - id: "a1"
 *                         type: "TABLE_SCAN"
 *                         label: "Table Scan (users)"
 *                         details:
 *                           accessType: "ALL"
 *                           rows: 5000
 *                         metrics:
 *                           cost: 125.75
 *                           rows: 5000
 *                 planB:
 *                   id: "223e4567-e89b-12d3-a456-426614174001"
 *                   name: "优化后查询"
 *                   sql: "SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE users.status = 'active'"
 *                   visualization:
 *                     nodes:
 *                       - id: "b1"
 *                         type: "INDEX_SCAN"
 *                         label: "Index Scan (users)"
 *                         details:
 *                           accessType: "range"
 *                           rows: 1000
 *                         metrics:
 *                           cost: 35.75
 *                           rows: 1000
 *                 comparison:
 *                   performance:
 *                     costDifference: -90.0
 *                     rowsDifference: -4000
 *                     speedupFactor: 3.5
 *                   differences:
 *                     - nodeA: "a1"
 *                       nodeB: "b1"
 *                       changes:
 *                         - property: "accessType"
 *                           before: "ALL"
 *                           after: "range"
 *                           improvement: true
 *                         - property: "rows"
 *                           before: 5000
 *                           after: 1000
 *                           difference: -4000
 *                           percentChange: -80
 *                   recommendations:
 *                     - "用于status字段的索引显著提高了查询效率"
 *                     - "扫描行数减少80%"
 *                     - "总体性能提升约250%"
 *       404:
 *         description: 一个或多个查询计划不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *             example:
 *               success: false
 *               error:
 *                 message: "查询计划不存在"
 *                 code: 40401
 *                 details: "未找到ID为planId1的查询计划"
 */
router.get(
  '/compare/:planId1/:planId2',
  [
    check('planId1').isString().not().isEmpty().withMessage('无效的查询计划ID'),
    check('planId2').isString().not().isEmpty().withMessage('无效的查询计划ID'),
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
 *           example:
 *             notes: "本查询将用户表与订单表连接，并过滤活跃用户。通过增加status字段的索引，测试表明执行时间减少了45%。"
 *     responses:
 *       200:
 *         description: 成功保存分析注释
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *             example:
 *               success: true
 *               data: {
 *                 id: "123e4567-e89b-12d3-a456-426614174000",
 *                 planId: "223e4567-e89b-12d3-a456-426614174001",
 *                 notes: "本查询将用户表与订单表连接，并过滤活跃用户。通过增加status字段的索引，测试表明执行时间减少了45%。",
 *                 createdAt: "2023-06-01T12:34:56.789Z",
 *                 updatedAt: "2023-06-01T12:34:56.789Z"
 *               }
 *       404:
 *         description: 查询计划不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *             example:
 *               success: false
 *               error: {
 *                 message: "查询计划不存在",
 *                 code: 40401,
 *                 details: "未找到ID为{planId}的查询计划"
 *               }
 */
router.post(
  '/:planId/notes',
  [
    check('planId').isUUID().withMessage('无效的查询计划ID'),
    check('notes').not().isEmpty().withMessage('注释内容不能为空'),
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *             example:
 *               success: true
 *               data: {
 *                 originalSql: "SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE users.status = 'active'",
 *                 optimizedSql: "SELECT u.id, u.name, u.email, o.id as order_id, o.amount, o.created_at FROM users u FORCE INDEX (idx_status) JOIN orders o ON u.id = o.user_id WHERE u.status = 'active'",
 *                 optimizations: [
 *                   {
 *                     type: "INDEX_HINT",
 *                     description: "使用FORCE INDEX强制使用status字段的索引"
 *                   },
 *                   {
 *                     type: "COLUMN_SELECTION",
 *                     description: "显式选择需要的列而不是使用SELECT *"
 *                   },
 *                   {
 *                     type: "TABLE_ALIASES",
 *                     description: "使用表别名减少字节数并提高可读性"
 *                   }
 *                 ],
 *                 expectedImprovements: {
 *                   scanRows: { before: 5000, after: 1000, reduction: "80%" },
 *                   executionTime: { before: "250ms", after: "75ms", reduction: "70%" }
 *                 },
 *                 ddlSuggestions: [
 *                   "CREATE INDEX idx_status ON users(status);"
 *                 ]
 *               }
 *       404:
 *         description: 查询计划不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *             example:
 *               success: false
 *               error: {
 *                 message: "查询计划不存在",
 *                 code: 40401,
 *                 details: "未找到ID为{planId}的查询计划"
 *               }
 */
router.get(
  '/:planId/optimize',
  [
    check('planId').isUUID().withMessage('无效的查询计划ID'),
  ],
  planVisualizationController.generateOptimizedQuery
);

export default router;