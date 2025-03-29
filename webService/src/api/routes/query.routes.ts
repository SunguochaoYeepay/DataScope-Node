import { Router } from 'express';
import { body, param, query } from 'express-validator';
import queryController from '../controllers/query.controller';

const router = Router();

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
 *     responses:
 *       200:
 *         description: 查询执行结果
 *       400:
 *         description: 请求参数错误
 */
router.post(
  '/execute',
  [
    body('dataSourceId').isUUID().withMessage('无效的数据源ID'),
    body('sql').notEmpty().withMessage('SQL语句不能为空'),
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
    body('name').notEmpty().withMessage('查询名称不能为空'),
    body('dataSourceId').isUUID().withMessage('无效的数据源ID'),
    body('sql').notEmpty().withMessage('SQL语句不能为空'),
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
    body('dataSourceId').isUUID().withMessage('无效的数据源ID'),
    body('sql').notEmpty().withMessage('SQL语句不能为空'),
    body('includeAnalysis').optional().isBoolean().withMessage('必须是布尔值'),
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
    param('id').isUUID().withMessage('无效的查询计划ID'),
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
    query('dataSourceId').optional().isUUID().withMessage('无效的数据源ID'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('限制数必须是1-100之间的整数'),
    query('offset').optional().isInt({ min: 0 }).withMessage('偏移量必须是非负整数'),
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
    param('id').isUUID().withMessage('无效的查询ID'),
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
    param('id').isUUID().withMessage('无效的查询ID'),
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
    param('id').isUUID().withMessage('无效的查询ID'),
  ],
  queryController.deleteQuery
);

export default router;