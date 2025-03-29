"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const query_controller_1 = __importDefault(require("../controllers/query.controller"));
const router = (0, express_1.Router)();
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
router.get('/history', query_controller_1.default.getQueryHistory);
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
router.post('/execute', [
    (0, express_validator_1.body)('dataSourceId').isUUID().withMessage('无效的数据源ID'),
    (0, express_validator_1.body)('sql').notEmpty().withMessage('SQL语句不能为空'),
], query_controller_1.default.executeQuery);
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
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('查询名称不能为空'),
    (0, express_validator_1.body)('dataSourceId').isUUID().withMessage('无效的数据源ID'),
    (0, express_validator_1.body)('sql').notEmpty().withMessage('SQL语句不能为空'),
], query_controller_1.default.saveQuery);
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
router.get('/', query_controller_1.default.getQueries);
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
router.get('/:id', query_controller_1.default.getQueryById);
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
router.post('/explain', [
    (0, express_validator_1.body)('dataSourceId').isUUID().withMessage('无效的数据源ID'),
    (0, express_validator_1.body)('sql').notEmpty().withMessage('SQL语句不能为空'),
], query_controller_1.default.explainQuery);
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
router.post('/:id/cancel', [
    (0, express_validator_1.param)('id').isUUID().withMessage('无效的查询ID'),
], query_controller_1.default.cancelQuery);
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
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID().withMessage('无效的查询ID'),
], query_controller_1.default.updateQuery);
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
router.delete('/:id', [
    (0, express_validator_1.param)('id').isUUID().withMessage('无效的查询ID'),
], query_controller_1.default.deleteQuery);
exports.default = router;
//# sourceMappingURL=query.routes.js.map