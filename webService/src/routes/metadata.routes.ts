import express from 'express';
import metadataController from '../controllers/metadata.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { validateDataSourceId } from '../middlewares/validationMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/metadata/datasources/{dataSourceId}/tables:
 *   get:
 *     summary: 获取数据源的表列表
 *     description: 返回指定数据源的所有表
 *     tags: [Metadata]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 数据源ID
 *     responses:
 *       200:
 *         description: 成功获取表列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: users
 *                       type:
 *                         type: string
 *                         example: TABLE
 *                       schema:
 *                         type: string
 *                         example: public
 *       401:
 *         description: 未授权
 *       404:
 *         description: 数据源不存在
 *       500:
 *         description: 服务器错误
 */
router.get(
  '/:dataSourceId/tables',
  authMiddleware.authenticate,
  validateDataSourceId,
  metadataController.getTables
);

router.get(
  '/datasources/:dataSourceId/tables',
  authMiddleware.authenticate,
  validateDataSourceId,
  metadataController.getTables
);

/**
 * @swagger
 * /api/metadata/datasources/{dataSourceId}/tables/{tableName}/columns:
 *   get:
 *     summary: 获取表的列信息
 *     description: 返回指定数据源中特定表的列信息
 *     tags: [Metadata]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 数据源ID
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema:
 *           type: string
 *         description: 表名
 *     responses:
 *       200:
 *         description: 成功获取列信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: id
 *                       type:
 *                         type: string
 *                         example: INTEGER
 *                       nullable:
 *                         type: boolean
 *                         example: false
 *                       defaultValue:
 *                         type: string
 *                         nullable: true
 *                       isPrimaryKey:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: 未授权
 *       404:
 *         description: 数据源或表不存在
 *       500:
 *         description: 服务器错误
 */
router.get(
  '/:dataSourceId/tables/:tableName/columns',
  authMiddleware.authenticate,
  validateDataSourceId,
  metadataController.getColumns
);

router.get(
  '/datasources/:dataSourceId/tables/:tableName/columns',
  authMiddleware.authenticate,
  validateDataSourceId,
  metadataController.getColumns
);

/**
 * @swagger
 * /api/metadata/datasources/{dataSourceId}/structure:
 *   get:
 *     summary: 获取数据源的元数据结构
 *     description: 返回指定数据源的完整元数据结构，包括所有表和列
 *     tags: [Metadata]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 数据源ID
 *     responses:
 *       200:
 *         description: 成功获取元数据结构
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     databaseName:
 *                       type: string
 *                       example: mydb
 *                     tables:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: users
 *                           columns:
 *                             type: array
 *                             items:
 *                               $ref: '#/components/schemas/Column'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 数据源不存在
 *       500:
 *         description: 服务器错误
 */
router.get(
  '/datasources/:dataSourceId/structure',
  authMiddleware.authenticate,
  validateDataSourceId,
  metadataController.getStructure
);

/**
 * @swagger
 * /api/metadata/datasources/{dataSourceId}/sync:
 *   post:
 *     summary: 同步数据源的元数据
 *     description: 从数据库中更新指定数据源的元数据结构
 *     tags: [Metadata]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 数据源ID
 *     responses:
 *       200:
 *         description: 元数据同步成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     dataSourceId:
 *                       type: string
 *                     tablesCount:
 *                       type: integer
 *                       example: 10
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: 未授权
 *       404:
 *         description: 数据源不存在
 *       500:
 *         description: 服务器错误
 */
router.post(
  '/datasources/:dataSourceId/sync',
  authMiddleware.authenticate,
  validateDataSourceId,
  metadataController.syncMetadata
);

/**
 * @swagger
 * /api/metadata/datasources/{dataSourceId}/stats:
 *   get:
 *     summary: 获取数据源的统计信息
 *     description: 返回指定数据源的统计信息，包括表数量、表行数等
 *     tags: [Metadata]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 数据源ID
 *     responses:
 *       200:
 *         description: 成功获取统计信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     tableCount:
 *                       type: integer
 *                       example: 25
 *                     tables:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: users
 *                           rowCount:
 *                             type: integer
 *                             example: 1500
 *                           columnCount:
 *                             type: integer
 *                             example: 8
 *                     databaseSize:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         pretty:
 *                           type: string
 *                           example: 25 MB
 *                         bytes:
 *                           type: integer
 *                           example: 26214400
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *       401:
 *         description: 未授权
 *       404:
 *         description: 数据源不存在
 *       500:
 *         description: 服务器错误
 */
router.get(
  '/:dataSourceId/stats',
  authMiddleware.authenticate,
  validateDataSourceId,
  metadataController.getStats
);

router.get(
  '/datasources/:dataSourceId/stats',
  authMiddleware.authenticate,
  validateDataSourceId,
  metadataController.getStats
);

export default router; 