import { Router } from 'express';
import { body, param } from 'express-validator';
import dataSourceController from '../controllers/datasource.controller';

const router = Router();

/**
 * @swagger
 * /datasources:
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
    body('name').notEmpty().withMessage('数据源名称不能为空'),
    body('type').notEmpty().withMessage('数据源类型不能为空'),
    body('host').notEmpty().withMessage('主机地址不能为空'),
    body('port').isNumeric().withMessage('端口必须为数字'),
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
    body('database').notEmpty().withMessage('数据库名不能为空'),
  ],
  dataSourceController.createDataSource
);

/**
 * @swagger
 * /datasources:
 *   get:
 *     summary: 获取所有数据源
 *     tags: [DataSources]
 *     responses:
 *       200:
 *         description: 数据源列表
 */
router.get('/', dataSourceController.getAllDataSources);

/**
 * @swagger
 * /datasources/{id}:
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
 *       404:
 *         description: 数据源不存在
 */
router.get('/:id', dataSourceController.getDataSourceById);

/**
 * @swagger
 * /datasources/{id}:
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
    param('id').isUUID().withMessage('无效的数据源ID'),
  ],
  dataSourceController.updateDataSource
);

/**
 * @swagger
 * /datasources/{id}:
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
    param('id').isUUID().withMessage('无效的数据源ID'),
  ],
  dataSourceController.deleteDataSource
);

/**
 * @swagger
 * /datasources/test-connection:
 *   post:
 *     summary: 测试数据源连接
 *     tags: [DataSources]
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
  '/test-connection',
  [
    body('type').notEmpty().withMessage('数据源类型不能为空'),
    body('host').notEmpty().withMessage('主机地址不能为空'),
    body('port').isNumeric().withMessage('端口必须为数字'),
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
    body('database').notEmpty().withMessage('数据库名不能为空'),
  ],
  dataSourceController.testConnection
);

export default router;