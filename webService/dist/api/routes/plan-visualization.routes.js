"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const plan_visualization_controller_1 = __importDefault(require("../controllers/plan-visualization.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /plan-visualization/{planId}:
 *   get:
 *     summary: 获取查询计划可视化数据
 *     tags: [PlanVisualization]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询计划ID
 *     responses:
 *       200:
 *         description: 成功获取查询计划可视化数据
 *       404:
 *         description: 查询计划不存在
 */
router.get('/:planId', [
    (0, express_validator_1.param)('planId').isUUID().withMessage('无效的查询计划ID'),
], plan_visualization_controller_1.default.getVisualizationData);
/**
 * @swagger
 * /plan-visualization/compare/{planId1}/{planId2}:
 *   get:
 *     summary: 比较两个查询计划
 *     tags: [PlanVisualization]
 *     parameters:
 *       - in: path
 *         name: planId1
 *         required: true
 *         schema:
 *           type: string
 *         description: 第一个查询计划ID
 *       - in: path
 *         name: planId2
 *         required: true
 *         schema:
 *           type: string
 *         description: 第二个查询计划ID
 *     responses:
 *       200:
 *         description: 成功比较两个查询计划
 *       404:
 *         description: 一个或多个查询计划不存在
 */
router.get('/compare/:planId1/:planId2', [
    (0, express_validator_1.param)('planId1').isUUID().withMessage('无效的查询计划ID'),
    (0, express_validator_1.param)('planId2').isUUID().withMessage('无效的查询计划ID'),
], plan_visualization_controller_1.default.comparePlans);
/**
 * @swagger
 * /plan-visualization/{planId}/notes:
 *   post:
 *     summary: 保存查询计划分析注释
 *     tags: [PlanVisualization]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询计划ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: 分析注释内容
 *     responses:
 *       200:
 *         description: 成功保存分析注释
 *       404:
 *         description: 查询计划不存在
 */
router.post('/:planId/notes', [
    (0, express_validator_1.param)('planId').isUUID().withMessage('无效的查询计划ID'),
    (0, express_validator_1.body)('notes').notEmpty().withMessage('注释内容不能为空'),
], plan_visualization_controller_1.default.saveAnalysisNotes);
/**
 * @swagger
 * /plan-visualization/{planId}/optimize:
 *   get:
 *     summary: 生成优化后的SQL查询
 *     tags: [PlanVisualization]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询计划ID
 *     responses:
 *       200:
 *         description: 成功生成优化后的SQL查询
 *       404:
 *         description: 查询计划不存在
 */
router.get('/:planId/optimize', [
    (0, express_validator_1.param)('planId').isUUID().withMessage('无效的查询计划ID'),
], plan_visualization_controller_1.default.generateOptimizedQuery);
exports.default = router;
//# sourceMappingURL=plan-visualization.routes.js.map