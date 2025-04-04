import { Router } from 'express';
import { check, param } from 'express-validator';
import dataSourceController from '../controllers/datasource.controller';
import metadataController from '../controllers/metadata.controller';

const router = Router();

/**
 * @swagger
 * /api/datasources:
 *   post:
 *     summary: 创建新数据源
 *     tags: [DataSources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DataSourceCreate'
 *     responses:
 *       201:
 *         description: 数据源创建成功
 *       400:
 *         description: 请求参数错误
 */
router.post(
  '/',
  [
    check('name').not().isEmpty().withMessage('数据源名称不能为空'),
    check('type').not().isEmpty().withMessage('数据源类型不能为空'),
    check('host').not().isEmpty().withMessage('主机地址不能为空'),
    check('port').isNumeric().withMessage('端口必须为数字'),
    check('username').not().isEmpty().withMessage('用户名不能为空'),
    check('password').not().isEmpty().withMessage('密码不能为空'),
    check('database').not().isEmpty().withMessage('数据库名不能为空'),
  ],
  dataSourceController.createDataSource
);

/**
 * @swagger
 * /api/datasources:
 *   get:
 *     summary: 获取所有数据源
 *     tags: [DataSources]
 *     responses:
 *       200:
 *         description: 数据源列表
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
 *                     $ref: '#/components/schemas/DataSource'
 *             example:
 *               success: true
 *               data:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   name: "开发环境MySQL"
 *                   type: "mysql"
 *                   host: "localhost"
 *                   port: 3306
 *                   username: "admin"
 *                   database: "dev_db"
 *                   createdAt: "2023-06-15T08:30:00.000Z"
 *                   updatedAt: "2023-06-15T08:30:00.000Z"
 *                   isActive: true
 *                 - id: "223e4567-e89b-12d3-a456-426614174001"
 *                   name: "测试环境PostgreSQL"
 *                   type: "postgresql"
 *                   host: "test-server"
 *                   port: 5432
 *                   username: "test_user"
 *                   database: "test_db"
 *                   createdAt: "2023-06-14T10:30:00.000Z"
 *                   updatedAt: "2023-06-14T10:30:00.000Z"
 *                   isActive: true
 */
router.get('/', dataSourceController.getAllDataSources);

/**
 * @swagger
 * /api/datasources/{id}:
 *   get:
 *     summary: 获取指定ID的数据源
 *     tags: [DataSources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 数据源详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DataSource'
 *             example:
 *               success: true
 *               data:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 name: "开发环境MySQL"
 *                 type: "mysql"
 *                 host: "localhost"
 *                 port: 3306
 *                 username: "admin"
 *                 database: "dev_db"
 *                 createdAt: "2023-06-15T08:30:00.000Z"
 *                 updatedAt: "2023-06-15T08:30:00.000Z"
 *                 isActive: true
 *                 metadataStatus: "已同步"
 *                 lastSyncAt: "2023-06-15T09:30:00.000Z"
 *       404:
 *         description: 数据源不存在
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
 *                 statusCode: 404
 *                 error: "NOT_FOUND"
 *                 message: "数据源不存在"
 *                 code: 40004
 *                 timestamp: "2023-06-15T08:30:00.000Z"
 */
router.get('/:id', dataSourceController.getDataSourceById);

/**
 * @swagger
 * /api/datasources/{id}:
 *   put:
 *     summary: 更新指定ID的数据源
 *     tags: [DataSources]
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
 *             $ref: '#/components/schemas/DataSourceUpdate'
 *     responses:
 *       200:
 *         description: 数据源更新成功
 *       404:
 *         description: 数据源不存在
 */
router.put(
  '/:id',
  [
    check('id').isUUID().withMessage('无效的数据源ID'),
  ],
  dataSourceController.updateDataSource
);

/**
 * @swagger
 * /api/datasources/{id}:
 *   delete:
 *     summary: 删除指定ID的数据源
 *     tags: [DataSources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 数据源删除成功
 *       404:
 *         description: 数据源不存在
 */
router.delete(
  '/:id',
  [
    check('id').isUUID().withMessage('无效的数据源ID'),
  ],
  dataSourceController.deleteDataSource
);

/**
 * @swagger
 * /api/datasources/test-connection:
 *   post:
 *     summary: 测试数据源连接
 *     tags: [DataSources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DataSourceConnection'
 *           example:
 *             type: "mysql"
 *             host: "localhost"
 *             port: 3306
 *             username: "test_user"
 *             password: "test_password"
 *             database: "test_db"
 *     responses:
 *       200:
 *         description: 测试结果
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
 *                     connected:
 *                       type: boolean
 *                     message:
 *                       type: string
 *                     details:
 *                       type: object
 *             examples:
 *               success:
 *                 summary: 连接成功
 *                 value:
 *                   success: true
 *                   data:
 *                     connected: true
 *                     message: "数据源连接成功"
 *                     details:
 *                       serverVersion: "MySQL 8.0.28"
 *                       connectionId: 12345
 *                       connectTime: "10ms"
 *               failure:
 *                 summary: 连接失败
 *                 value:
 *                   success: false
 *                   error:
 *                     statusCode: 400
 *                     error: "CONNECTION_ERROR"
 *                     message: "无法连接到数据源"
 *                     code: 70001
 *                     details:
 *                       errorCode: "ECONNREFUSED"
 *                       host: "localhost"
 *                       port: 3306
 */
router.post(
  '/test-connection',
  [
    check('type').not().isEmpty().withMessage('数据源类型不能为空'),
    check('host').not().isEmpty().withMessage('主机地址不能为空'),
    check('port').isNumeric().withMessage('端口必须为数字'),
    check('username').not().isEmpty().withMessage('用户名不能为空'),
    check('password').not().isEmpty().withMessage('密码不能为空'),
    check('database').not().isEmpty().withMessage('数据库名不能为空'),
  ],
  dataSourceController.testConnection
);

/**
 * @swagger
 * /api/datasources/test:
 *   post:
 *     summary: 测试数据源连接（别名）
 *     tags: [DataSources]
 *     description: 与 /test-connection 接口功能相同，提供别名以支持旧客户端
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DataSourceConnection'
 *     responses:
 *       200:
 *         description: 测试结果
 */
router.post(
  '/test',
  [
    check('type').not().isEmpty().withMessage('数据源类型不能为空'),
    check('host').not().isEmpty().withMessage('主机地址不能为空'),
    check('port').isNumeric().withMessage('端口必须为数字'),
    check('username').not().isEmpty().withMessage('用户名不能为空'),
    check('password').not().isEmpty().withMessage('密码不能为空'),
    check('database').not().isEmpty().withMessage('数据库名不能为空'),
  ],
  dataSourceController.testConnection
);

/**
 * @swagger
 * /api/datasources/{id}/stats:
 *   get:
 *     summary: 获取数据源的统计信息
 *     tags: [DataSources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 数据源的统计信息
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
 *                     tableCount:
 *                       type: integer
 *                     tables:
 *                       type: array
 *                       items:
 *                         type: object
 *                     databaseSize:
 *                       type: object
 *                     lastUpdated:
 *                       type: string
 *             example:
 *               success: true
 *               data: {
 *                 tableCount: 15,
 *                 tables: [
 *                   {
 *                     name: "users",
 *                     rowCount: 1250,
 *                     columnCount: 5
 *                   },
 *                   {
 *                     name: "orders",
 *                     rowCount: 5432,
 *                     columnCount: 8
 *                   }
 *                 ],
 *                 databaseSize: {
 *                   pretty: "56 MB",
 *                   bytes: 58720256
 *                 },
 *                 lastUpdated: "2023-06-15T08:31:05.432Z"
 *               }
 *       404:
 *         description: 数据源不存在
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
 *                 message: "数据源不存在",
 *                 code: 40401,
 *                 details: "未找到ID为123e4567-e89b-12d3-a456-426614174000的数据源"
 *               }
 */
router.get('/:id/stats', metadataController.getStats);

/**
 * @swagger
 * /api/datasources/{id}/test:
 *   post:
 *     summary: 测试特定数据源的连接
 *     tags: [DataSources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 连接测试结果
 */
router.post('/:id/test', dataSourceController.testExistingConnection);

/**
 * @swagger
 * /api/datasources/{id}/check-status:
 *   post:
 *     summary: 检查数据源连接状态
 *     description: 触发检查指定数据源的连接状态，并更新状态信息
 *     tags: [DataSources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 数据源ID
 *     responses:
 *       200:
 *         description: 成功检查数据源状态
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     active:
 *                       type: boolean
 *       404:
 *         description: 数据源不存在
 */
router.post('/:id/check-status', dataSourceController.checkDataSourceStatus);

export default router;