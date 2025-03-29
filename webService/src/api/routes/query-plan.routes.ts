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
  queryPlanController.getPlan
);

/**
 * @swagger
 * /query-plans/save:
 *   post:
 *     summary: 保存查询执行计划
 *     description: 保存查询执行计划以便后续查看和比较
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
 *               - name
 *               - sql
 *               - planData
 *             properties:
 *               dataSourceId:
 *                 type: string
 *               name:
 *                 type: string
 *               sql:
 *                 type: string
 *               planData:
 *                 type: object
 *           example:
 *             dataSourceId: "123e4567-e89b-12d3-a456-426614174000"
 *             name: "用户查询优化后"
 *             sql: "SELECT * FROM users WHERE status = 'active'"
 *             planData: {
 *               estimatedRows: 1000,
 *               estimatedCost: 123.45,
 *               planNodes: [
 *                 {
 *                   id: 1,
 *                   type: "range",
 *                   table: "users",
 *                   rows: 1000,
 *                   filtered: 100,
 *                   key: "idx_status"
 *                 }
 *               ]
 *             }
 *     responses:
 *       201:
 *         description: 成功保存执行计划
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
 *                 id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
 *                 name: "用户查询优化后",
 *                 dataSourceId: "123e4567-e89b-12d3-a456-426614174000",
 *                 sql: "SELECT * FROM users WHERE status = 'active'",
 *                 createdAt: "2023-06-15T08:30:00.000Z",
 *                 updatedAt: "2023-06-15T08:30:00.000Z"
 *               }
 *       400:
 *         description: 请求参数错误
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
 *                 statusCode: 400,
 *                 error: "BAD_REQUEST",
 *                 message: "请求参数错误",
 *                 code: 40000,
 *                 details: [
 *                   {
 *                     field: "planData",
 *                     message: "执行计划数据不能为空"
 *                   }
 *                 ]
 *               }
 */
router.post('/save',
  authenticate,
  [
    body('dataSourceId').isString().notEmpty().withMessage('数据源ID不能为空'),
    body('name').isString().notEmpty().withMessage('执行计划名称不能为空'),
    body('sql').isString().notEmpty().withMessage('SQL查询语句不能为空'),
    body('planData').isObject().notEmpty().withMessage('执行计划数据不能为空')
  ],
  queryPlanController.savePlan
);

/**
 * @swagger
 * /query-plans:
 *   get:
 *     summary: 获取所有保存的查询执行计划
 *     description: 获取用户保存的所有查询执行计划
 *     tags: [QueryPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataSourceId
 *         schema:
 *           type: string
 *         description: 数据源ID（可选，用于筛选）
 *     responses:
 *       200:
 *         description: 成功获取执行计划列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *             example:
 *               success: true
 *               data: [
 *                 {
 *                   id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
 *                   name: "原始用户查询",
 *                   dataSourceId: "123e4567-e89b-12d3-a456-426614174000",
 *                   sql: "SELECT * FROM users WHERE status = 'active'",
 *                   createdAt: "2023-06-14T08:30:00.000Z",
 *                   updatedAt: "2023-06-14T08:30:00.000Z",
 *                   dataSourceName: "开发环境MySQL"
 *                 },
 *                 {
 *                   id: "b2c3d4e5-f6a7-8901-bcde-2345678901fg",
 *                   name: "优化后的用户查询",
 *                   dataSourceId: "123e4567-e89b-12d3-a456-426614174000",
 *                   sql: "SELECT u.id, u.name, u.email FROM users u FORCE INDEX(idx_status) WHERE u.status = 'active'",
 *                   createdAt: "2023-06-15T08:30:00.000Z",
 *                   updatedAt: "2023-06-15T08:30:00.000Z",
 *                   dataSourceName: "开发环境MySQL"
 *                 }
 *               ]
 */
router.get('/',
  authenticate,
  queryPlanController.getAllSavedPlans
);

/**
 * @swagger
 * /query-plans/{id}:
 *   get:
 *     summary: 获取特定的查询执行计划
 *     description: 获取特定ID的查询执行计划详情
 *     tags: [QueryPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 执行计划ID
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
 *             example:
 *               success: true
 *               data: {
 *                 id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
 *                 name: "用户查询优化后",
 *                 dataSourceId: "123e4567-e89b-12d3-a456-426614174000",
 *                 sql: "SELECT * FROM users WHERE status = 'active'",
 *                 planData: {
 *                   estimatedRows: 1000,
 *                   estimatedCost: 123.45,
 *                   planNodes: [
 *                     {
 *                       id: 1,
 *                       type: "range",
 *                       table: "users",
 *                       rows: 1000,
 *                       filtered: 100,
 *                       key: "idx_status",
 *                       possible_keys: "idx_status",
 *                       extra: "Using index condition"
 *                     }
 *                   ],
 *                   warnings: [
 *                     "查询返回所有列，可能无法充分利用索引"
 *                   ],
 *                   optimizationTips: [
 *                     "仅选择必要的列可以使用覆盖索引提高查询性能"
 *                   ]
 *                 },
 *                 createdAt: "2023-06-15T08:30:00.000Z",
 *                 updatedAt: "2023-06-15T08:30:00.000Z",
 *                 dataSource: {
 *                   id: "123e4567-e89b-12d3-a456-426614174000",
 *                   name: "开发环境MySQL",
 *                   type: "mysql"
 *                 }
 *               }
 *       404:
 *         description: 执行计划不存在
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
 *                 statusCode: 404,
 *                 error: "NOT_FOUND",
 *                 message: "执行计划不存在",
 *                 code: 40401,
 *                 details: "未找到ID为a1b2c3d4-e5f6-7890-abcd-1234567890ab的执行计划"
 *               }
 */
router.get('/:id',
  authenticate,
  [
    param('id').isUUID().withMessage('执行计划ID无效')
  ],
  queryPlanController.getSavedPlan
);

/**
 * @swagger
 * /query-plans/compare:
 *   post:
 *     summary: 比较两个查询执行计划
 *     description: 比较两个查询执行计划的差异并分析性能差异
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
 *               planBId:
 *                 type: string
 *           example:
 *             planAId: "123e4567-e89b-12d3-a456-426614174000"
 *             planBId: "223e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       200:
 *         description: 成功比较执行计划
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
 *                 summary:
 *                   costDifference: -45.67
 *                   rowsDifference: -500
 *                   plan1BottlenecksCount: 2
 *                   plan2BottlenecksCount: 1
 *                 nodeComparison: [
 *                   {
 *                     table: "users",
 *                     rows: {
 *                       plan1: 5000,
 *                       plan2: 5000,
 *                       difference: 0
 *                     },
 *                     filtered: {
 *                       plan1: 20,
 *                       plan2: 20,
 *                       difference: 0
 *                     },
 *                     accessType: {
 *                       plan1: "ALL",
 *                       plan2: "range",
 *                       improved: true
 *                     }
 *                   },
 *                   {
 *                     table: "orders",
 *                     rows: {
 *                       plan1: 200,
 *                       plan2: 150,
 *                       difference: -50
 *                     },
 *                     filtered: {
 *                       plan1: 100,
 *                       plan2: 100,
 *                       difference: 0
 *                     },
 *                     accessType: {
 *                       plan1: "ref",
 *                       plan2: "ref",
 *                       improved: false
 *                     }
 *                   }
 *                 ],
 *                 accessTypeChanges: [
 *                   {
 *                     table: "users",
 *                     from: "ALL",
 *                     to: "range",
 *                     improvement: true
 *                   }
 *                 ],
 *                 indexUsageChanges: [
 *                   {
 *                     table: "users",
 *                     from: "无索引",
 *                     to: "status_idx"
 *                   }
 *                 ]
 */
router.post('/compare',
  authenticate,
  [
    body('planAId').isUUID().withMessage('第一个执行计划ID无效'),
    body('planBId').isUUID().withMessage('第二个执行计划ID无效')
  ],
  queryPlanController.comparePlans
);

/**
 * @swagger
 * /query-plans/{id}:
 *   delete:
 *     summary: 删除查询执行计划
 *     description: 删除特定ID的查询执行计划
 *     tags: [QueryPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 执行计划ID
 *     responses:
 *       200:
 *         description: 成功删除执行计划
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
 *                 id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
 *                 deleted: true
 *               }
 *       404:
 *         description: 执行计划不存在
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
 *                 statusCode: 404,
 *                 error: "NOT_FOUND",
 *                 message: "执行计划不存在",
 *                 code: 40401,
 *                 details: "未找到ID为a1b2c3d4-e5f6-7890-abcd-1234567890ab的执行计划"
 *               }
 */
router.delete('/:id',
  authenticate,
  [
    param('id').isUUID().withMessage('执行计划ID无效')
  ],
  queryPlanController.deletePlan
);

/**
 * @swagger
 * /query-plans/{id}/optimize:
 *   get:
 *     summary: 获取优化后的SQL查询
 *     description: 根据查询执行计划生成优化后的SQL查询和优化建议
 *     tags: [QueryPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 执行计划ID
 *     responses:
 *       200:
 *         description: 成功获取优化结果
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
 *                 originalSql: "SELECT * FROM users WHERE status = 'active'",
 *                 optimizedSql: "SELECT u.id, u.name, u.email FROM users u FORCE INDEX(idx_status) WHERE u.status = 'active'",
 *                 optimizations: [
 *                   {
 *                     type: "COLUMN_SELECTION",
 *                     description: "选择特定列而不是使用SELECT *"
 *                   },
 *                   {
 *                     type: "TABLE_ALIAS",
 *                     description: "使用表别名提高可读性"
 *                   },
 *                   {
 *                     type: "INDEX_HINT",
 *                     description: "添加强制索引提示确保使用索引"
 *                   }
 *                 ],
 *                 performanceEstimate: {
 *                   originalCost: 125.75,
 *                   optimizedCost: 35.25,
 *                   improvement: "72%"
 *                 },
 *                 indexRecommendations: [
 *                   {
 *                     table: "users",
 *                     name: "idx_status_email",
 *                     columns: ["status", "email"],
 *                     type: "COVERING_INDEX",
 *                     ddl: "CREATE INDEX idx_status_email ON users(status, email);"
 *                   }
 *                 ]
 *               }
 *       404:
 *         description: 执行计划不存在
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
 *                 statusCode: 404,
 *                 error: "NOT_FOUND",
 *                 message: "执行计划不存在",
 *                 code: 40401,
 *                 details: "未找到ID为a1b2c3d4-e5f6-7890-abcd-1234567890ab的执行计划"
 *               }
 */
router.get('/:id/optimize',
  authenticate,
  [
    param('id').isUUID().withMessage('执行计划ID无效')
  ],
  queryPlanController.getOptimizedQuery
);

export default router;