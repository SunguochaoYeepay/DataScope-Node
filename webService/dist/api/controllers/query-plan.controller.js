"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPlanController = void 0;
const client_1 = require("@prisma/client");
const error_1 = require("../../utils/error");
const datasource_service_1 = require("../../services/datasource.service");
const query_service_1 = require("../../services/query.service");
const logger_1 = __importDefault(require("../../utils/logger"));
const query_plan_service_1 = require("../../services/query-plan.service");
const database_core_1 = require("../../database-core");
const prisma = new client_1.PrismaClient();
const dataSourceService = new datasource_service_1.DataSourceService();
const queryService = new query_service_1.QueryService();
const queryPlanService = new query_plan_service_1.QueryPlanService();
/**
 * 查询计划控制器
 * 处理查询计划的获取、分析和优化
 */
class QueryPlanController {
    /**
     * 获取查询的执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    async getQueryPlan(req, res) {
        try {
            const { dataSourceId, sql } = req.body;
            if (!dataSourceId || !sql) {
                throw new error_1.ApiError('缺少必要参数', 400);
            }
            // 获取数据源
            const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            // 实际执行逻辑
            // 获取数据库连接
            const connector = await dataSourceService.getConnector(dataSourceId);
            // 获取查询计划
            let planResult;
            if (connector.getQueryPlan) {
                // 使用连接器的getQueryPlan方法
                planResult = await connector.getQueryPlan(sql);
            }
            else if (connector.explainQuery) {
                // 回退到explainQuery方法
                planResult = await connector.explainQuery(sql);
            }
            else {
                throw new error_1.ApiError('数据库连接器不支持查询计划功能', 400);
            }
            // 获取转换器并转换为统一格式
            const converter = (0, database_core_1.getQueryPlanConverter)(dataSource.type);
            let queryPlan;
            if (dataSource.type.toLowerCase() === 'mysql') {
                if (connector.isJsonExplainSupported) {
                    queryPlan = converter.convertJsonExplain(JSON.stringify(planResult), sql);
                }
                else {
                    queryPlan = planResult;
                }
            }
            else {
                queryPlan = planResult;
            }
            // 分析查询计划
            const analyzer = (0, database_core_1.getQueryPlanAnalyzer)(dataSource.type);
            const analyzedPlan = analyzer.analyze(queryPlan);
            // 保存到数据库
            const savedPlan = await this.saveQueryPlan(analyzedPlan, dataSourceId, req.user?.id);
            // 返回分析结果
            res.status(200).json({
                success: true,
                data: {
                    plan: analyzedPlan,
                    id: savedPlan.id
                }
            });
        }
        catch (error) {
            logger_1.default.error('获取查询计划失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取查询计划时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 获取查询的执行计划 (路由别名)
     * @param req 请求对象
     * @param res 响应对象
     */
    async getPlan(req, res) {
        return this.getQueryPlan(req, res);
    }
    /**
     * 获取查询的优化建议
     * @param req 请求对象
     * @param res 响应对象
     */
    async getOptimizationTips(req, res) {
        try {
            const { planId } = req.params;
            if (!planId) {
                throw new error_1.ApiError('缺少查询计划ID', 400);
            }
            // 从数据库获取计划
            const queryPlan = await prisma.queryPlan.findUnique({
                where: { id: planId },
                include: {
                    query: true
                }
            });
            if (!queryPlan) {
                throw new error_1.ApiError('查询计划不存在', 404);
            }
            // 获取相关的数据源
            const dataSource = await dataSourceService.getDataSourceById(queryPlan.dataSourceId);
            // 解析计划数据
            const planData = JSON.parse(queryPlan.planData);
            // 获取优化器
            const optimizer = (0, database_core_1.getQueryOptimizer)(dataSource.type);
            // 获取优化建议
            const suggestions = optimizer.analyzeSql(planData, queryPlan.sql);
            // 生成优化后的SQL
            const optimizedSql = optimizer.generateOptimizedSql(queryPlan.sql, suggestions);
            // 更新优化提示到数据库
            await prisma.queryPlan.update({
                where: { id: planId },
                data: {
                    optimizationTips: JSON.stringify(suggestions)
                }
            });
            // 返回优化建议
            res.status(200).json({
                success: true,
                data: {
                    suggestions,
                    optimizedSql
                }
            });
        }
        catch (error) {
            logger_1.default.error('获取优化建议失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取优化建议时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 保存查询计划到数据库
     * @param plan 查询计划
     * @param dataSourceId 数据源ID
     * @param userId 用户ID
     * @returns 保存的计划对象
     */
    async saveQueryPlan(plan, dataSourceId, userId) {
        try {
            const planJson = JSON.stringify(plan);
            // 创建查询计划记录
            return await prisma.queryPlan.create({
                data: {
                    dataSourceId,
                    sql: plan.query || '',
                    planData: planJson,
                    createdBy: userId || 'system',
                }
            });
        }
        catch (error) {
            logger_1.default.error('保存查询计划失败', { error });
            // 仅记录错误，不中断流程
            return { id: `error-${Date.now()}` };
        }
    }
    /**
     * 比较两个查询计划
     * @param req 请求对象
     * @param res 响应对象
     */
    async comparePlans(req, res) {
        try {
            const { planAId, planBId } = req.body;
            if (!planAId || !planBId) {
                throw new error_1.ApiError('缺少必要参数', 400);
            }
            // 获取两个计划的数据
            const [planA, planB] = await Promise.all([
                prisma.queryPlan.findUnique({
                    where: { id: planAId }
                }),
                prisma.queryPlan.findUnique({
                    where: { id: planBId }
                })
            ]);
            if (!planA || !planB) {
                throw new error_1.ApiError('一个或多个查询计划不存在', 404);
            }
            // 解析计划数据
            const planAData = JSON.parse(planA.planData);
            const planBData = JSON.parse(planB.planData);
            // 获取数据源类型
            const dataSource = await dataSourceService.getDataSourceById(planA.dataSourceId);
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            // 计算性能改进
            const costA = planAData.estimatedCost || planAData.estimatedRows || 0;
            const costB = planBData.estimatedCost || planBData.estimatedRows || 0;
            const improvement = costA > 0 ? Math.max(0, Math.round(((costA - costB) / costA) * 100)) : 0;
            // 生成比较数据
            const comparisonData = {
                costDifference: (planBData.estimatedCost || 0) - (planAData.estimatedCost || 0),
                costImprovement: improvement,
                planAWarnings: planAData.warnings?.length || 0,
                planBWarnings: planBData.warnings?.length || 0,
                planANodes: planAData.planNodes?.length || 0,
                planBNodes: planBData.planNodes?.length || 0
            };
            // 返回比较结果
            res.status(200).json({
                success: true,
                data: comparisonData
            });
        }
        catch (error) {
            logger_1.default.error('比较查询计划失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '比较查询计划时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 获取查询计划历史记录
     * @param req 请求对象
     * @param res 响应对象
     */
    async getQueryPlanHistory(req, res) {
        try {
            const dataSourceId = req.query.dataSourceId;
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            // 获取查询计划历史
            const result = await queryService.getQueryPlanHistory(dataSourceId, limit, offset);
            // 返回历史记录
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            logger_1.default.error('获取查询计划历史记录失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取查询计划历史记录时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 获取特定的查询计划
     * @param req 请求对象
     * @param res 响应对象
     */
    async getQueryPlanById(req, res) {
        try {
            const { planId } = req.params;
            if (!planId) {
                throw new error_1.ApiError('缺少查询计划ID', 400);
            }
            // 获取查询计划
            const queryPlan = await queryService.getQueryPlanById(planId);
            if (!queryPlan) {
                throw new error_1.ApiError('查询计划不存在', 404);
            }
            // 解析计划数据
            const planData = JSON.parse(queryPlan.planData);
            // 返回查询计划
            res.status(200).json({
                success: true,
                data: {
                    id: queryPlan.id,
                    sql: queryPlan.sql,
                    dataSourceId: queryPlan.dataSourceId,
                    createdAt: queryPlan.createdAt,
                    plan: planData
                }
            });
        }
        catch (error) {
            logger_1.default.error('获取查询计划失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取查询计划时发生错误',
                    error: error.message
                });
            }
        }
    }
}
exports.QueryPlanController = QueryPlanController;
//# sourceMappingURL=query-plan.controller.js.map