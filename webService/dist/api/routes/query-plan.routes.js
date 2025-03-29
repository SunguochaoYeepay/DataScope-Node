"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 查询执行计划相关路由
 */
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../../middleware/auth");
const query_plan_controller_1 = require("../controllers/query-plan.controller");
const router = (0, express_1.Router)();
const queryPlanController = new query_plan_controller_1.QueryPlanController();
/**
 * @api {post} /api/query-plans/analyze 分析SQL查询执行计划
 * @apiName AnalyzeSqlQueryPlan
 * @apiGroup QueryPlan
 * @apiDescription 分析SQL查询的执行计划并提供优化建议
 *
 * @apiHeader {String} Authorization 用户认证token
 *
 * @apiParam {String} dataSourceId 数据源ID
 * @apiParam {String} sql SQL查询语句
 *
 * @apiSuccess {Boolean} success 请求是否成功
 * @apiSuccess {Object} data 执行计划数据
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {
 *         "planNodes": [
 *           {
 *             "id": 1,
 *             "selectType": "SIMPLE",
 *             "table": "users",
 *             "type": "ALL",
 *             "possibleKeys": null,
 *             "key": null,
 *             "keyLen": null,
 *             "ref": null,
 *             "rows": 1000,
 *             "filtered": 100,
 *             "extra": null
 *           }
 *         ],
 *         "warnings": [
 *           "表 users 正在进行全表扫描，扫描了 1000 行"
 *         ],
 *         "optimizationTips": [
 *           "考虑为表 users 添加索引，覆盖常用的查询条件"
 *         ],
 *         "estimatedCost": 1000,
 *         "estimatedRows": 1000
 *       }
 *     }
 *
 * @apiError {String} message 错误信息
 * @apiError {Object} details 错误详情
 */
router.post('/analyze', auth_1.authenticate, [
    (0, express_validator_1.body)('dataSourceId').isString().notEmpty().withMessage('数据源ID不能为空'),
    (0, express_validator_1.body)('sql').isString().notEmpty().withMessage('SQL查询语句不能为空')
], queryPlanController.getPlan);
/**
 * @api {post} /api/query-plans/save 保存查询执行计划
 * @apiName SaveQueryPlan
 * @apiGroup QueryPlan
 * @apiDescription 保存查询执行计划以便后续查看和比较
 *
 * @apiHeader {String} Authorization 用户认证token
 *
 * @apiParam {String} dataSourceId 数据源ID
 * @apiParam {String} name 执行计划名称
 * @apiParam {String} sql SQL查询语句
 * @apiParam {Object} planData 执行计划数据
 *
 * @apiSuccess {Boolean} success 请求是否成功
 * @apiSuccess {Object} data 保存的执行计划
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "success": true,
 *       "data": {
 *         "id": "123e4567-e89b-12d3-a456-426614174000",
 *         "dataSourceId": "123e4567-e89b-12d3-a456-426614174001",
 *         "name": "用户查询执行计划",
 *         "sql": "SELECT * FROM users WHERE status = 'active'",
 *         "planData": "...",
 *         "estimatedCost": 1000,
 *         "optimizationTips": "...",
 *         "createdAt": "2023-01-01T00:00:00.000Z",
 *         "updatedAt": "2023-01-01T00:00:00.000Z"
 *       }
 *     }
 */
router.post('/save', auth_1.authenticate, [
    (0, express_validator_1.body)('dataSourceId').isString().notEmpty().withMessage('数据源ID不能为空'),
    (0, express_validator_1.body)('name').isString().notEmpty().withMessage('执行计划名称不能为空'),
    (0, express_validator_1.body)('sql').isString().notEmpty().withMessage('SQL查询语句不能为空'),
    (0, express_validator_1.body)('planData').isObject().notEmpty().withMessage('执行计划数据不能为空')
], queryPlanController.savePlan);
/**
 * @api {get} /api/query-plans 获取所有保存的查询执行计划
 * @apiName GetAllQueryPlans
 * @apiGroup QueryPlan
 * @apiDescription 获取用户保存的所有查询执行计划
 *
 * @apiHeader {String} Authorization 用户认证token
 *
 * @apiParam {String} [dataSourceId] 数据源ID（可选，用于筛选）
 *
 * @apiSuccess {Boolean} success 请求是否成功
 * @apiSuccess {Array} data 执行计划列表
 */
router.get('/', auth_1.authenticate, queryPlanController.getAllSavedPlans);
/**
 * @api {get} /api/query-plans/:id 获取特定的查询执行计划
 * @apiName GetQueryPlan
 * @apiGroup QueryPlan
 * @apiDescription 获取特定ID的查询执行计划详情
 *
 * @apiHeader {String} Authorization 用户认证token
 *
 * @apiParam {String} id 执行计划ID
 *
 * @apiSuccess {Boolean} success 请求是否成功
 * @apiSuccess {Object} data 执行计划数据
 */
router.get('/:id', auth_1.authenticate, [
    (0, express_validator_1.param)('id').isUUID().withMessage('执行计划ID无效')
], queryPlanController.getSavedPlan);
/**
 * @api {post} /api/query-plans/compare 比较两个查询执行计划
 * @apiName CompareQueryPlans
 * @apiGroup QueryPlan
 * @apiDescription 比较两个查询执行计划的差异并分析性能差异
 *
 * @apiHeader {String} Authorization 用户认证token
 *
 * @apiParam {String} planAId 第一个执行计划ID
 * @apiParam {String} planBId 第二个执行计划ID
 *
 * @apiSuccess {Boolean} success 请求是否成功
 * @apiSuccess {Object} data 比较结果
 */
router.post('/compare', auth_1.authenticate, [
    (0, express_validator_1.body)('planAId').isUUID().withMessage('第一个执行计划ID无效'),
    (0, express_validator_1.body)('planBId').isUUID().withMessage('第二个执行计划ID无效')
], queryPlanController.comparePlans);
/**
 * @api {delete} /api/query-plans/:id 删除查询执行计划
 * @apiName DeleteQueryPlan
 * @apiGroup QueryPlan
 * @apiDescription 删除特定ID的查询执行计划
 *
 * @apiHeader {String} Authorization 用户认证token
 *
 * @apiParam {String} id 执行计划ID
 *
 * @apiSuccess {Boolean} success 请求是否成功
 * @apiSuccess {String} message 成功消息
 */
router.delete('/:id', auth_1.authenticate, [
    (0, express_validator_1.param)('id').isUUID().withMessage('执行计划ID无效')
], queryPlanController.deletePlan);
exports.default = router;
//# sourceMappingURL=query-plan.routes.js.map