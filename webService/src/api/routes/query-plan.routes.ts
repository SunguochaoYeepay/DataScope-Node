/**
 * 查询执行计划相关路由
 */
import { Router } from 'express';
import { param, body } from 'express-validator';
import { authenticate } from '../../middleware/auth';
import { QueryPlanController } from '../controllers/query-plan.controller';

const router = Router();
const queryPlanController = new QueryPlanController();

/**
 * @swagger
 * /query-plans/analyze:
 *   post:
 *     summary: 分析SQL查询执行计划
 *     description: 分析SQL查询的执行计划并提供优化建议
 *     tags: [QueryPlans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dataSourceId
 *               - sql
 *             properties:
 *               dataSourceId:
 *                 type: string
 *                 description: 数据源ID
 *               sql:
 *                 type: string
 *                 description: SQL查询语句
 *           example:
 *             dataSourceId: "123e4567-e89b-12d3-a456-426614174000"
 *             sql: "SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE users.status = 'active'"
 *     responses:
 *       200:
 *         description: 成功获取执行计划数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     plan:
 *                       type: object
 *                     id:
 *                       type: string
 *             example:
 *               success: true
 *               data:
 *                 plan:
 *                   sql: "SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE users.status = 'active'"
 *                   estimatedCost: 123.45
 *                   estimatedRows: 1000
 *                   planNodes:
 *                     - id: 1
 *                       type: "ALL"
 *                       table: "users"
 *                       rows: 5000
 *                       filtered: 20
 *                       extra: "Using where"
 *                       key: null
 *                       possible_keys: null
 *                     - id: 2
 *                       type: "ref"
 *                       table: "orders"
 *                       rows: 200
 *                       filtered: 100
 *                       extra: "Using index"
 *                       key: "user_id_idx"
 *                       possible_keys: "user_id_idx"
 *                   warnings:
 *                     - "表 users 使用全表扫描，扫描了 5000 行记录"
 *                     - "WHERE 子句中的 status 字段没有索引"
 *                   optimizationTips:
 *                     - "为 users 表的 status 字段创建索引"
 *                     - "考虑添加覆盖索引包含常用的查询字段"
 *                 id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 */
router.post('/analyze',
  authenticate,
  [
    body('dataSourceId').isString().notEmpty().withMessage('数据源ID不能为空'),
    body('sql').isString().notEmpty().withMessage('SQL查询语句不能为空')
  ],
  queryPlanController.getQueryPlan.bind(queryPlanController)
);

/**
 * @swagger
 * /query-plans/{planId}/optimize:
 *   get:
 *     summary: 获取查询执行计划的优化建议
 *     description: 根据查询计划ID获取SQL优化建议和优化后的SQL语句
 *     tags: [QueryPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询计划ID
 *     responses:
 *       200:
 *         description: 成功获取优化建议
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                     optimizedSql:
 *                       type: string
 *             example:
 *               success: true
 *               data:
 *                 suggestions:
 *                   - type: "INDEX"
 *                     description: "缺少索引: users.status 字段应创建索引"
 *                     impact: "HIGH"
 *                     fix: "CREATE INDEX idx_users_status ON users(status)"
 *                 optimizedSql: "SELECT * FROM users FORCE INDEX(idx_users_status) JOIN orders ON users.id = orders.user_id WHERE users.status = 'active'"
 */
router.get('/:planId/optimize',
  authenticate,
  [
    param('planId').isString().notEmpty().withMessage('查询计划ID不能为空')
  ],
  queryPlanController.getOptimizationTips.bind(queryPlanController)
);

/**
 * @swagger
 * /query-plans/compare:
 *   post:
 *     summary: 比较两个查询执行计划
 *     description: 比较两个执行计划的差异和性能改进
 *     tags: [QueryPlans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planAId
 *               - planBId
 *             properties:
 *               planAId:
 *                 type: string
 *                 description: 原始执行计划ID
 *               planBId:
 *                 type: string
 *                 description: 对比执行计划ID
 *           example:
 *             planAId: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *             planBId: "b2c3d4e5-f6a7-8901-bcde-2345678901fg"
 *     responses:
 *       200:
 *         description: 成功获取比较结果
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
 *                 costDifference: -50.25
 *                 costImprovement: 40
 *                 planAWarnings: 2
 *                 planBWarnings: 0
 *                 planANodes: 3
 *                 planBNodes: 2
 *                 comparisonPoints:
 *                   - key: "reduced_rows"
 *                     description: "优化后扫描行数减少了 3000 行"
 *                   - key: "reduced_cost"
 *                     description: "优化后估算成本降低了 40%"
 */
router.post('/compare',
  authenticate,
  [
    body('planAId').isString().notEmpty().withMessage('原始执行计划ID不能为空'),
    body('planBId').isString().notEmpty().withMessage('对比执行计划ID不能为空')
  ],
  queryPlanController.comparePlans.bind(queryPlanController)
);

/**
 * @swagger
 * /query-plans/history:
 *   get:
 *     summary: 获取查询计划历史记录
 *     description: 获取查询计划历史记录列表
 *     tags: [QueryPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataSourceId
 *         schema:
 *           type: string
 *         description: 数据源ID（可选，用于筛选）
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 返回结果数量限制
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: 结果偏移量（用于分页）
 *     responses:
 *       200:
 *         description: 成功获取查询计划历史记录
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *             example:
 *               success: true
 *               data:
 *                 history:
 *                   - id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                     sql: "SELECT * FROM users WHERE status = 'active'"
 *                     dataSourceId: "123e4567-e89b-12d3-a456-426614174000"
 *                     createdAt: "2023-06-14T08:30:00.000Z"
 *                   - id: "b2c3d4e5-f6a7-8901-bcde-2345678901fg"
 *                     sql: "SELECT u.id, u.name FROM users u WHERE u.status = 'active'"
 *                     dataSourceId: "123e4567-e89b-12d3-a456-426614174000"
 *                     createdAt: "2023-06-13T10:15:00.000Z"
 *                 total: 42
 *                 limit: 20
 *                 offset: 0
 */
router.get('/history',
  authenticate,
  queryPlanController.getQueryPlanHistory.bind(queryPlanController)
);

/**
 * @swagger
 * /query-plans/{planId}:
 *   get:
 *     summary: 获取特定查询计划
 *     description: 根据ID获取查询计划详情
 *     tags: [QueryPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询计划ID
 *     responses:
 *       200:
 *         description: 成功获取查询计划
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
 *                 id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                 sql: "SELECT * FROM users WHERE status = 'active'"
 *                 dataSourceId: "123e4567-e89b-12d3-a456-426614174000"
 *                 createdAt: "2023-06-14T08:30:00.000Z"
 *                 plan:
 *                   estimatedCost: 123.45
 *                   estimatedRows: 1000
 *                   planNodes:
 *                     - id: 1
 *                       type: "range"
 *                       table: "users"
 *                       rows: 1000
 *                       filtered: 100
 *                       key: "idx_status"
 */
router.get('/:planId',
  authenticate,
  [
    param('planId').isString().notEmpty().withMessage('查询计划ID不能为空')
  ],
  queryPlanController.getQueryPlanById.bind(queryPlanController)
);

export default router;