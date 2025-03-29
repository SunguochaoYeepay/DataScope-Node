import { Router } from 'express';
import metadataController from '../controllers/metadata.controller';

const router = Router();

/**
 * @swagger
 * /metadata/datasources/{dataSourceId}/sync:
 *   post:
 *     summary: 同步数据源元数据
 *     tags: [Metadata]
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               syncType:
 *                 type: string
 *                 enum: [FULL, INCREMENTAL]
 *                 default: FULL
 *               schemaPattern:
 *                 type: string
 *               tablePattern:
 *                 type: string
 *     responses:
 *       200:
 *         description: 同步成功
 *       400:
 *         description: 参数错误
 *       404:
 *         description: 数据源不存在
 */
router.post(
  '/datasources/:dataSourceId/sync',
  metadataController.validateSyncMetadata(),
  metadataController.syncMetadata
);

/**
 * @swagger
 * /metadata/datasources/{dataSourceId}/structure:
 *   get:
 *     summary: 获取数据源的元数据结构
 *     tags: [Metadata]
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 元数据结构
 *       404:
 *         description: 数据源不存在或元数据未同步
 */
router.get(
  '/datasources/:dataSourceId/structure',
  metadataController.getMetadataStructure
);

/**
 * @swagger
 * /metadata/datasources/{dataSourceId}/sync-history:
 *   get:
 *     summary: 获取同步历史记录
 *     tags: [Metadata]
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 返回记录数量限制
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: 偏移量
 *     responses:
 *       200:
 *         description: 同步历史记录
 *       404:
 *         description: 数据源不存在
 */
router.get(
  '/datasources/:dataSourceId/sync-history',
  metadataController.getSyncHistory
);

/**
 * @swagger
 * /metadata/datasources/{dataSourceId}/preview:
 *   get:
 *     summary: 获取表数据预览
 *     tags: [Metadata]
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: schema
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: 返回记录数量限制
 *     responses:
 *       200:
 *         description: 表数据预览
 *       404:
 *         description: 数据源、架构或表不存在
 */
router.get(
  '/datasources/:dataSourceId/preview',
  metadataController.validatePreviewTableData(),
  metadataController.previewTableData
);

/**
 * @swagger
 * /metadata/datasources/{dataSourceId}/columns/analyze:
 *   get:
 *     summary: 分析表列的详细信息
 *     tags: [Metadata]
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: schema
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: column
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 列分析信息
 *       404:
 *         description: 数据源、架构、表或列不存在
 */
router.get(
  '/datasources/:dataSourceId/columns/analyze',
  metadataController.validateColumnAnalysis(),
  metadataController.analyzeColumn
);

export default router;