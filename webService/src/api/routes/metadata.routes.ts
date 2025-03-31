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
 *           example:
 *             syncType: "FULL"
 *             schemaPattern: "public"
 *             tablePattern: "users%"
 *     responses:
 *       200:
 *         description: 同步成功
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
 *                 syncId: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
 *                 dataSourceId: "123e4567-e89b-12d3-a456-426614174000",
 *                 syncType: "FULL",
 *                 startTime: "2023-06-15T08:30:00.000Z",
 *                 endTime: "2023-06-15T08:31:05.432Z",
 *                 status: "COMPLETED",
 *                 schemaCount: 3,
 *                 tableCount: 15,
 *                 columnCount: 86
 *               }
 *       400:
 *         description: 参数错误
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
 *                   field: "syncType",
 *                   message: "同步类型必须为FULL或INCREMENTAL"
 *                 }]
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
 *                 schemas: [
 *                   {
 *                     name: "public",
 *                     tables: [
 *                       {
 *                         name: "users",
 *                         type: "TABLE",
 *                         comment: "用户表",
 *                         columns: [
 *                           {
 *                             name: "id",
 *                             type: "int",
 *                             nullable: false,
 *                             primaryKey: true,
 *                             defaultValue: null,
 *                             comment: "用户ID"
 *                           },
 *                           {
 *                             name: "username",
 *                             type: "varchar(50)",
 *                             nullable: false,
 *                             primaryKey: false,
 *                             defaultValue: null,
 *                             comment: "用户名"
 *                           },
 *                           {
 *                             name: "email",
 *                             type: "varchar(100)",
 *                             nullable: false,
 *                             primaryKey: false,
 *                             defaultValue: null,
 *                             comment: "电子邮箱"
 *                           },
 *                           {
 *                             name: "status",
 *                             type: "varchar(20)",
 *                             nullable: false,
 *                             primaryKey: false,
 *                             defaultValue: "'active'",
 *                             comment: "用户状态"
 *                           }
 *                         ],
 *                         indexes: [
 *                           {
 *                             name: "PRIMARY",
 *                             columns: ["id"],
 *                             unique: true
 *                           },
 *                           {
 *                             name: "idx_email",
 *                             columns: ["email"],
 *                             unique: true
 *                           },
 *                           {
 *                             name: "idx_status",
 *                             columns: ["status"],
 *                             unique: false
 *                           }
 *                         ],
 *                         foreignKeys: []
 *                       },
 *                       {
 *                         name: "orders",
 *                         type: "TABLE",
 *                         comment: "订单表",
 *                         columns: [
 *                           {
 *                             name: "id",
 *                             type: "int",
 *                             nullable: false,
 *                             primaryKey: true,
 *                             defaultValue: null,
 *                             comment: "订单ID"
 *                           },
 *                           {
 *                             name: "user_id",
 *                             type: "int",
 *                             nullable: false,
 *                             primaryKey: false,
 *                             defaultValue: null,
 *                             comment: "用户ID"
 *                           }
 *                         ],
 *                         indexes: [
 *                           {
 *                             name: "PRIMARY",
 *                             columns: ["id"],
 *                             unique: true
 *                           },
 *                           {
 *                             name: "idx_user_id",
 *                             columns: ["user_id"],
 *                             unique: false
 *                           }
 *                         ],
 *                         foreignKeys: [
 *                           {
 *                             name: "fk_orders_user",
 *                             columns: ["user_id"],
 *                             referencedTable: "users",
 *                             referencedColumns: ["id"],
 *                             onUpdate: "CASCADE",
 *                             onDelete: "RESTRICT"
 *                           }
 *                         ]
 *                       }
 *                     ]
 *                   }
 *                 ],
 *                 lastSyncAt: "2023-06-15T08:31:05.432Z",
 *                 relationships: [
 *                   {
 *                     name: "fk_orders_user",
 *                     sourceTable: "orders",
 *                     sourceSchema: "public",
 *                     sourceColumns: ["user_id"],
 *                     targetTable: "users",
 *                     targetSchema: "public",
 *                     targetColumns: ["id"],
 *                     relationType: "MANY_TO_ONE"
 *                   }
 *                 ]
 *               }
 *       404:
 *         description: 数据源不存在或元数据未同步
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
 *                 message: "元数据不存在",
 *                 code: 40402,
 *                 details: "数据源的元数据尚未同步，请先执行同步操作"
 *               }
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
 *                 history: [
 *                   {
 *                     id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
 *                     dataSourceId: "123e4567-e89b-12d3-a456-426614174000",
 *                     syncType: "FULL",
 *                     startTime: "2023-06-15T08:30:00.000Z",
 *                     endTime: "2023-06-15T08:31:05.432Z",
 *                     status: "COMPLETED",
 *                     schemaCount: 3,
 *                     tableCount: 15,
 *                     columnCount: 86,
 *                     details: {
 *                       errors: [],
 *                       warnings: [
 *                         "表 'temp_logs' 已经过期，建议删除"
 *                       ]
 *                     }
 *                   },
 *                   {
 *                     id: "b2c3d4e5-f6a7-8901-bcde-2345678901fg",
 *                     dataSourceId: "123e4567-e89b-12d3-a456-426614174000",
 *                     syncType: "INCREMENTAL",
 *                     startTime: "2023-06-14T10:30:00.000Z",
 *                     endTime: "2023-06-14T10:30:45.123Z",
 *                     status: "COMPLETED",
 *                     schemaCount: 1,
 *                     tableCount: 2,
 *                     columnCount: 8,
 *                     details: {
 *                       errors: [],
 *                       warnings: []
 *                     }
 *                   }
 *                 ],
 *                 pagination: {
 *                   total: 5,
 *                   limit: 10,
 *                   offset: 0,
 *                   hasMore: false
 *                 }
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
 *                     created_at: "2023-06-01T12:00:00.000Z"
 *                   },
 *                   {
 *                     id: 2,
 *                     username: "jane_smith",
 *                     email: "jane@example.com",
 *                     status: "active",
 *                     created_at: "2023-06-02T14:30:00.000Z"
 *                   },
 *                   {
 *                     id: 3,
 *                     username: "bob_johnson",
 *                     email: "bob@example.com",
 *                     status: "inactive",
 *                     created_at: "2023-06-03T09:15:00.000Z"
 *                   }
 *                 ],
 *                 pagination: {
 *                   total: 1250,
 *                   limit: 100,
 *                   hasMore: true
 *                 },
 *                 tableInfo: {
 *                   schema: "public",
 *                   table: "users",
 *                   totalRows: 1250,
 *                   size: "2.3 MB"
 *                 }
 *               }
 *       404:
 *         description: 数据源、架构或表不存在
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
 *                 message: "表不存在",
 *                 code: 40403,
 *                 details: "指定的表 'users' 在架构 'public' 中不存在"
 *               }
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
 *                 basicInfo: {
 *                   name: "status",
 *                   type: "varchar(20)",
 *                   nullable: false,
 *                   defaultValue: "'active'",
 *                   tableName: "users",
 *                   schemaName: "public"
 *                 },
 *                 statistics: {
 *                   distinctValues: 3,
 *                   nullCount: 0,
 *                   minValue: "active",
 *                   maxValue: "suspended",
 *                   mostFrequentValues: [
 *                     {
 *                       value: "active",
 *                       count: 987,
 *                       percentage: 78.96
 *                     },
 *                     {
 *                       value: "inactive",
 *                       count: 215,
 *                       percentage: 17.2
 *                     },
 *                     {
 *                       value: "suspended",
 *                       count: 48,
 *                       percentage: 3.84
 *                     }
 *                   ],
 *                   cardinality: "LOW",
 *                   uniqueness: 0.0024,
 *                   valueDistribution: [
 *                     {
 *                       bucket: "active",
 *                       count: 987
 *                     },
 *                     {
 *                       bucket: "inactive",
 *                       count: 215
 *                     },
 *                     {
 *                       bucket: "suspended",
 *                       count: 48
 *                     }
 *                   ]
 *                 },
 *                 indexInfo: {
 *                   isIndexed: true,
 *                   indexes: [
 *                     {
 *                       name: "idx_status",
 *                       type: "BTREE",
 *                       columns: ["status"],
 *                       isUnique: false
 *                     }
 *                   ]
 *                 },
 *                 recommendations: {
 *                   indexRecommendation: "KEEP_EXISTING",
 *                   reasonCode: "FREQUENTLY_QUERIED_LOW_CARDINALITY",
 *                   reason: "该列基数低但查询频繁，现有索引有助于提高查询性能"
 *                 }
 *               }
 *       404:
 *         description: 数据源、架构、表或列不存在
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
 *                 message: "列不存在",
 *                 code: 40404,
 *                 details: "指定的列 'status' 在表 'users' 中不存在"
 *               }
 */
router.get(
  '/datasources/:dataSourceId/columns/analyze',
  metadataController.validateColumnAnalysis(),
  metadataController.analyzeColumn
);

/**
 * @swagger
 * /metadata/datasources/{dataSourceId}/tables:
 *   get:
 *     summary: 获取数据源的表列表
 *     tags: [Metadata]
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 表列表
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
 *                     properties:
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       schema:
 *                         type: string
 *             example:
 *               success: true
 *               data: [
 *                 {
 *                   name: "users",
 *                   type: "TABLE",
 *                   schema: "public"
 *                 },
 *                 {
 *                   name: "orders",
 *                   type: "TABLE",
 *                   schema: "public"
 *                 }
 *               ]
 */
router.get('/datasources/:dataSourceId/tables', metadataController.getTables);

/**
 * @swagger
 * /metadata/datasources/{dataSourceId}/tables/{tableName}:
 *   get:
 *     summary: 获取表结构
 *     tags: [Metadata]
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 表结构
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
 *                     name:
 *                       type: string
 *                     columns:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get('/datasources/:dataSourceId/tables/:tableName', metadataController.getTableStructure);

/**
 * @swagger
 * /metadata/datasources/{dataSourceId}/stats:
 *   get:
 *     summary: 获取数据源的统计信息
 *     tags: [Metadata]
 *     parameters:
 *       - in: path
 *         name: dataSourceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 数据源统计信息
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
 *                 tableCount: 15,
 *                 viewCount: 3,
 *                 totalSize: "1.2 GB",
 *                 lastSyncAt: "2023-06-15T08:31:05.432Z"
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
router.get(
  '/datasources/:dataSourceId/stats',
  metadataController.getStats
);

// 支持另一种API路径格式 - 为前端兼容性
router.get(
  '/:dataSourceId/stats',
  metadataController.getStats
);

// 添加简化版API路径格式
router.get(
  '/:dataSourceId/tables',
  metadataController.getTables
);

// 添加简化版表结构API路径格式
router.get(
  '/:dataSourceId/tables/:tableName',
  metadataController.getTableStructure
);

export default router;