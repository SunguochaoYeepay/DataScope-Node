import { Router } from 'express';
import { check } from 'express-validator';
import queryController from '../controllers/query.controller';
import { Request, Response, NextFunction } from 'express';
import { QueryPlanController } from '../controllers/query-plan.controller';
import planVisualizationController from '../controllers/plan-visualization.controller';
import { validate } from '../../utils/validate';
import { authenticate } from '../../middleware/auth';

const router = Router();
const queryPlanController = new QueryPlanController();

/**
 * @swagger
 * /queries/history:
 *   get:
 *     summary: 获取查询历史
 *     tags: [Queries]
 *     parameters:
 *       - in: query
 *         name: dataSourceId
 *         schema:
 *           type: string
 *         description: 数据源ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: 返回记录数量限制
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: 查询偏移量
 *     responses:
 *       200:
 *         description: 查询历史记录
 */
router.get('/history', queryController.getQueryHistory);

/**
 * @swagger
 * /queries/execute:
 *   post:
 *     summary: 执行SQL查询
 *     tags: [Queries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataSourceId:
 *                 type: string
 *                 description: 数据源ID
 *               sql:
 *                 type: string
 *                 description: SQL语句
 *               params:
 *                 type: array
 *                 description: 查询参数
 *               page:
 *                 type: integer
 *                 description: 页码(从1开始)
 *               pageSize:
 *                 type: integer
 *                 description: 每页记录数
 *               offset:
 *                 type: integer
 *                 description: 偏移量(可替代page)
 *               limit:
 *                 type: integer
 *                 description: 限制数量(可替代pageSize)
 *               sort:
 *                 type: string
 *                 description: 排序字段
 *               order:
 *                 type: string
 *                 enum: [asc, desc]
 *                 description: 排序方向
 *             required:
 *               - dataSourceId
 *               - sql
 *           example:
 *             dataSourceId: "123e4567-e89b-12d3-a456-426614174000"
 *             sql: "SELECT * FROM users WHERE status = ? LIMIT 10"
 *             params: ["active"]
 *             limit: 10
 *             sort: "created_at"
 *             order: "desc"
 *     responses:
 *       200:
 *         description: 查询执行结果
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
 *                     columns:
 *                       type: array
 *                       items:
 *                         type: object
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                     metadata:
 *                       type: object
 *             example:
 *               success: true
 *               data: {
 *                 columns: [
 *                   {
 *                     name: "id",
 *                     type: "int"
 *                   },
 *                   {
 *                     name: "username",
 *                     type: "varchar"
 *                   },
 *                   {
 *                     name: "email",
 *                     type: "varchar"
 *                   },
 *                   {
 *                     name: "status",
 *                     type: "varchar"
 *                   },
 *                   {
 *                     name: "created_at",
 *                     type: "timestamp"
 *                   }
 *                 ],
 *                 rows: [
 *                   {
 *                     id: 1,
 *                     username: "john_doe",
 *                     email: "john@example.com",
 *                     status: "active",
 *                     created_at: "2023-06-15T10:30:00.000Z"
 *                   },
 *                   {
 *                     id: 2,
 *                     username: "jane_smith",
 *                     email: "jane@example.com",
 *                     status: "active",
 *                     created_at: "2023-06-14T08:15:00.000Z"
 *                   }
 *                 ],
 *                 metadata: {
 *                   executionTime: 45.32,
 *                   rowCount: 2,
 *                   totalRows: 987,
 *                   dataSourceId: "123e4567-e89b-12d3-a456-426614174000",
 *                   dataSourceName: "开发环境MySQL",
 *                   queryId: "f1e2d3c4-b5a6-7890-cdef-123456789012"
 *                 }
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
 *                 details: [{
 *                   field: "sql",
 *                   message: "SQL语句不能为空"
 *                 }]
 *               }
 */
router.post(
  '/execute',
  [
    check('dataSourceId').not().isEmpty().withMessage('数据源ID不能为空'),
    check('sql').not().isEmpty().withMessage('SQL语句不能为空'),
  ],
  queryController.executeQuery
);

/**
 * @swagger
 * /queries:
 *   post:
 *     summary: 保存查询
 *     tags: [Queries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuerySave'
 *     responses:
 *       201:
 *         description: 查询保存成功
 *       400:
 *         description: 请求参数错误
 */
router.post(
  '/',
  [
    check('name').not().isEmpty().withMessage('查询名称不能为空'),
    check('dataSourceId').not().isEmpty().withMessage('数据源ID不能为空'),
    check('sql').not().isEmpty().withMessage('SQL语句不能为空'),
  ],
  queryController.saveQuery
);

/**
 * @swagger
 * /queries:
 *   get:
 *     summary: 获取查询列表
 *     tags: [Queries]
 *     parameters:
 *       - in: query
 *         name: dataSourceId
 *         schema:
 *           type: string
 *         description: 数据源ID
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: 标签过滤
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: boolean
 *         description: 是否公开
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *     responses:
 *       200:
 *         description: 查询列表
 */
router.get('/', queryController.getQueries);

/**
 * @swagger
 * /queries/{id}:
 *   get:
 *     summary: 获取指定ID的查询
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 查询详情
 *       404:
 *         description: 查询不存在
 */
router.get('/:id', queryController.getQueryById);

/**
 * @swagger
 * /queries/explain:
 *   post:
 *     summary: 获取查询执行计划
 *     tags: [Queries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataSourceId:
 *                 type: string
 *                 description: 数据源ID
 *               sql:
 *                 type: string
 *                 description: SQL语句
 *               params:
 *                 type: array
 *                 description: 查询参数
 *             required:
 *               - dataSourceId
 *               - sql
 *     responses:
 *       200:
 *         description: 查询执行计划
 *       400:
 *         description: 请求参数错误
 *       500:
 *         description: 服务器错误
 */
router.post(
  '/explain',
  [
    check('dataSourceId').not().isEmpty().withMessage('数据源ID不能为空'),
    check('sql').not().isEmpty().withMessage('SQL语句不能为空'),
    check('includeAnalysis').optional().isBoolean().withMessage('必须是布尔值'),
  ],
  queryController.explainQuery
);

/**
 * @swagger
 * /queries/plans/{id}/tips:
 *   get:
 *     summary: 获取查询计划的优化建议
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 查询计划优化建议
 *       404:
 *         description: 查询计划不存在
 */
router.get(
  '/plans/:id/tips',
  [
    check('id').isUUID().withMessage('无效的查询计划ID'),
  ],
  queryController.getQueryOptimizationTips
);

/**
 * @swagger
 * /queries/plans:
 *   get:
 *     summary: 获取查询计划历史记录
 *     tags: [Queries]
 *     parameters:
 *       - in: query
 *         name: dataSourceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: 查询计划历史记录列表
 */
router.get(
  '/plans',
  [
    check('dataSourceId').optional(),
    check('limit').optional().isInt({ min: 1, max: 100 }).withMessage('限制数必须是1-100之间的整数'),
    check('offset').optional().isInt({ min: 0 }).withMessage('偏移量必须是非负整数'),
  ],
  queryController.getQueryPlanHistory
);

/**
 * @swagger
 * /queries/{id}/cancel:
 *   post:
 *     summary: 取消正在执行的查询
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 查询取消成功
 *       404:
 *         description: 查询不存在
 */
router.post(
  '/:id/cancel',
  [
    check('id').isUUID().withMessage('无效的查询ID'),
  ],
  queryController.cancelQuery
);

/**
 * @swagger
 * /queries/{id}:
 *   put:
 *     summary: 更新指定ID的查询
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QueryUpdate'
 *     responses:
 *       200:
 *         description: 查询更新成功
 *       404:
 *         description: 查询不存在
 */
router.put(
  '/:id',
  [
    check('id').isUUID().withMessage('无效的查询ID'),
  ],
  queryController.updateQuery
);

/**
 * @swagger
 * /queries/{id}:
 *   delete:
 *     summary: 删除指定ID的查询
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 查询删除成功
 *       404:
 *         description: 查询不存在
 */
router.delete(
  '/:id',
  [
    check('id').isUUID().withMessage('无效的查询ID'),
  ],
  queryController.deleteQuery
);

/**
 * @swagger
 * /queries/{queryId}/execution-plan:
 *   get:
 *     summary: 获取查询执行计划 [兼容路由]
 *     description: 获取指定查询的执行计划数据，用于前端兼容
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询ID
 *     responses:
 *       200:
 *         description: 成功获取执行计划
 *       404:
 *         description: 查询不存在
 */
router.get(
  '/:queryId/execution-plan',
  [
    check('queryId').isUUID().withMessage('无效的查询ID'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 转发到查询计划控制器
      req.params.planId = req.params.queryId; // 适配控制器参数
      await queryPlanController.getQueryPlanById(req as any, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /queries/{queryId}/visualization:
 *   get:
 *     summary: 获取查询执行计划可视化数据 [兼容路由]
 *     description: 获取指定查询的执行计划可视化数据，用于前端兼容
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询ID
 *     responses:
 *       200:
 *         description: 成功获取可视化数据
 *       404:
 *         description: 查询不存在
 */
router.get(
  '/:queryId/visualization',
  [
    check('queryId').isUUID().withMessage('无效的查询ID'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 复制参数，以适配目标控制器
      req.params.planId = req.params.queryId;
      await planVisualizationController.getVisualizationData(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

// 引用查询计划详情的路由
router.get('/plans/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await queryPlanController.getQueryPlanById(req as any, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: '获取查询计划失败',
      error: error.message
    });
  }
});

router.get('/history/:queryId/plans', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 转发到查询计划控制器
    req.params.planId = req.params.queryId; // 适配控制器参数
    await queryPlanController.getQueryPlanById(req as any, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '获取查询计划失败'
    });
  }
});

/**
 * @swagger
 * /queries/favorites:
 *   get:
 *     summary: 获取收藏的查询列表
 *     tags: [Queries]
 *     responses:
 *       200:
 *         description: 查询收藏列表
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
 *                     $ref: '#/components/schemas/QueryFavorite'
 */
router.get('/favorites', queryController.getFavorites);

/**
 * @swagger
 * /queries/{id}/favorite:
 *   post:
 *     summary: 添加查询到收藏夹
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询ID
 *     responses:
 *       200:
 *         description: 收藏成功
 *       404:
 *         description: 查询不存在
 */
router.post('/:id/favorite', queryController.favoriteQuery);

/**
 * @swagger
 * /queries/{id}/favorite:
 *   delete:
 *     summary: 从收藏夹中移除查询
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询ID
 *     responses:
 *       200:
 *         description: 取消收藏成功
 *       404:
 *         description: 查询不存在
 */
router.delete('/:id/favorite', queryController.unfavoriteQuery);

export default router;