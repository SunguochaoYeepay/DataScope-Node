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
            // 获取数据库连接
            const connector = await dataSourceService.getConnector(dataSourceId);
            // 解析和获取查询计划
            if (!connector.getQueryPlan) {
                throw new error_1.ApiError('数据库连接器不支持查询计划功能', 400);
            }
            const planResult = await connector.getQueryPlan(sql);
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
            // 获取两个计划
            const [planA, planB] = await Promise.all([
                prisma.queryPlan.findUnique({ where: { id: planAId } }),
                prisma.queryPlan.findUnique({ where: { id: planBId } })
            ]);
            if (!planA || !planB) {
                throw new error_1.ApiError('一个或多个查询计划不存在', 404);
            }
            // 解析计划数据
            const planAData = JSON.parse(planA.planData);
            const planBData = JSON.parse(planB.planData);
            // 计算性能改进
            const improvement = this.calculateImprovement(planAData, planBData);
            // 生成比较数据
            const comparisonData = {
                costDifference: (planBData.estimatedCost || 0) - (planAData.estimatedCost || 0),
                costImprovement: improvement,
                planAWarnings: planAData.warnings.length || 0,
                planBWarnings: planBData.warnings.length || 0,
                planANodes: planAData.planNodes.length || 0,
                planBNodes: planBData.planNodes.length || 0,
                comparisonPoints: this.generateComparisonPoints(planAData, planBData)
            };
            // 保存比较结果到数据库
            const comparison = await prisma.queryPlanComparison.create({
                data: {
                    planAId,
                    planBId,
                    comparisonData: JSON.stringify(comparisonData),
                    improvement,
                    createdBy: req.user?.id
                }
            });
            // 返回比较结果
            res.status(200).json({
                success: true,
                data: {
                    comparison: comparisonData,
                    id: comparison.id
                }
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
     * 计算性能改进百分比
     * @param planA 原始计划
     * @param planB 优化后计划
     * @returns 改进百分比
     */
    calculateImprovement(planA, planB) {
        // 如果没有成本估算，使用行数估算
        const costA = planA.estimatedCost || planA.estimatedRows || 0;
        const costB = planB.estimatedCost || planB.estimatedRows || 0;
        if (costA === 0)
            return 0;
        // 计算改进百分比
        const improvement = ((costA - costB) / costA) * 100;
        // 返回改进百分比（最小0%，不计算负改进）
        return Math.max(0, Math.round(improvement));
    }
    /**
     * 生成比较要点
     * @param planA 原始计划
     * @param planB 优化后计划
     * @returns 比较要点列表
     */
    generateComparisonPoints(planA, planB) {
        const points = [];
        // 比较扫描行数
        if ((planA.estimatedRows || 0) > (planB.estimatedRows || 0)) {
            points.push({
                key: 'reduced_rows',
                description: `优化后扫描行数减少了 ${((planA.estimatedRows || 0) - (planB.estimatedRows || 0)).toLocaleString()} 行`
            });
        }
        // 比较成本
        if ((planA.estimatedCost || 0) > (planB.estimatedCost || 0)) {
            points.push({
                key: 'reduced_cost',
                description: `优化后估算成本降低了 ${Math.round(((planA.estimatedCost || 0) - (planB.estimatedCost || 0)) / (planA.estimatedCost || 1) * 100)}%`
            });
        }
        // 比较临时表使用
        const tempTablesA = planA.planNodes?.filter(n => n.extra?.includes('Using temporary')).length || 0;
        const tempTablesB = planB.planNodes?.filter(n => n.extra?.includes('Using temporary')).length || 0;
        if (tempTablesA > tempTablesB) {
            points.push({
                key: 'reduced_temp_tables',
                description: `优化后减少了 ${tempTablesA - tempTablesB} 个临时表的使用`
            });
        }
        // 比较文件排序
        const filesortsA = planA.planNodes?.filter(n => n.extra?.includes('Using filesort')).length || 0;
        const filesortsB = planB.planNodes?.filter(n => n.extra?.includes('Using filesort')).length || 0;
        if (filesortsA > filesortsB) {
            points.push({
                key: 'reduced_filesorts',
                description: `优化后减少了 ${filesortsA - filesortsB} 个文件排序操作`
            });
        }
        // 全表扫描比较
        const fullScansA = planA.planNodes?.filter(n => n.type === 'ALL').length || 0;
        const fullScansB = planB.planNodes?.filter(n => n.type === 'ALL').length || 0;
        if (fullScansA > fullScansB) {
            points.push({
                key: 'reduced_full_scans',
                description: `优化后减少了 ${fullScansA - fullScansB} 个全表扫描`
            });
        }
        return points;
    }
    /**
     * 保存查询计划到数据库
     * @param plan 查询计划
     * @param dataSourceId 数据源ID
     * @param userId 用户ID
     * @returns 保存的查询计划记录
     */
    async saveQueryPlan(plan, dataSourceId, userId) {
        try {
            // 查找或创建查询记录
            let queryId;
            // 检查是否有关联的查询
            const existingQuery = await prisma.query.findFirst({
                where: {
                    sqlContent: plan.query,
                    dataSourceId
                }
            });
            if (existingQuery) {
                queryId = existingQuery.id;
            }
            else {
                // 创建新查询
                const newQuery = await prisma.query.create({
                    data: {
                        name: `Query ${new Date().toISOString()}`,
                        sqlContent: plan.query,
                        dataSourceId,
                        createdBy: userId
                    }
                });
                queryId = newQuery.id;
            }
            // 创建查询计划记录
            const queryPlan = await prisma.queryPlan.create({
                data: {
                    queryId,
                    dataSourceId,
                    name: `Plan ${new Date().toISOString()}`,
                    sql: plan.query,
                    planData: JSON.stringify(plan),
                    estimatedCost: plan.estimatedCost,
                    optimizationTips: JSON.stringify(plan.optimizationTips || []),
                    isAnalyzed: true,
                    createdBy: userId
                }
            });
            return queryPlan;
        }
        catch (error) {
            logger_1.default.error('保存查询计划失败', { error });
            throw error;
        }
    }
    /**
     * 获取查询计划历史
     * @param req 请求对象
     * @param res 响应对象
     */
    async getQueryPlanHistory(req, res) {
        try {
            const { queryId } = req.params;
            if (!queryId) {
                throw new error_1.ApiError('缺少查询ID', 400);
            }
            // 获取查询的所有执行计划
            const plans = await prisma.queryPlan.findMany({
                where: { queryId },
                orderBy: { createdAt: 'desc' }
            });
            res.status(200).json({
                success: true,
                data: plans
            });
        }
        catch (error) {
            logger_1.default.error('获取查询计划历史失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取查询计划历史时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 保存查询执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    async savePlan(req, res) {
        try {
            const { dataSourceId, name, sql, planData } = req.body;
            const userId = req.user?.id || 'system';
            // 解析计划数据
            const plan = typeof planData === 'string' ? JSON.parse(planData) : planData;
            // 保存到数据库
            const savedPlan = await prisma.queryPlan.create({
                data: {
                    dataSourceId,
                    name,
                    sql,
                    planData: typeof planData === 'string' ? planData : JSON.stringify(planData),
                    estimatedCost: plan.estimatedCost,
                    optimizationTips: plan.optimizationTips ? JSON.stringify(plan.optimizationTips) : null,
                    isAnalyzed: true,
                    createdBy: userId
                }
            });
            res.status(201).json({
                success: true,
                data: savedPlan
            });
        }
        catch (error) {
            logger_1.default.error('保存查询计划失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '保存查询计划时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 获取所有保存的查询执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    async getAllSavedPlans(req, res) {
        try {
            const { dataSourceId } = req.query;
            const userId = req.user?.id;
            // 构建查询条件
            const where = {
                createdBy: userId
            };
            if (dataSourceId) {
                where.dataSourceId = dataSourceId;
            }
            // 获取所有保存的计划
            const plans = await prisma.queryPlan.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                }
            });
            res.status(200).json({
                success: true,
                data: plans
            });
        }
        catch (error) {
            logger_1.default.error('获取查询计划列表失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取查询计划列表时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 获取特定的查询执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    async getSavedPlan(req, res) {
        try {
            const { id } = req.params;
            // 获取计划
            const plan = await prisma.queryPlan.findUnique({
                where: { id }
            });
            if (!plan) {
                throw new error_1.ApiError('查询计划不存在', 404);
            }
            res.status(200).json({
                success: true,
                data: plan
            });
        }
        catch (error) {
            logger_1.default.error('获取查询计划详情失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取查询计划详情时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 删除查询执行计划
     * @param req 请求对象
     * @param res 响应对象
     */
    async deletePlan(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            // 获取计划
            const plan = await prisma.queryPlan.findUnique({
                where: { id }
            });
            if (!plan) {
                throw new error_1.ApiError('查询计划不存在', 404);
            }
            // 检查权限
            if (plan.createdBy !== userId && req.user?.role !== 'admin') {
                throw new error_1.ApiError('没有权限删除此查询计划', 403);
            }
            // 删除计划
            await prisma.queryPlan.delete({
                where: { id }
            });
            res.status(200).json({
                success: true,
                message: '查询计划已成功删除'
            });
        }
        catch (error) {
            logger_1.default.error('删除查询计划失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '删除查询计划时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 获取优化后的SQL查询
     * @param req 请求对象
     * @param res 响应对象
     */
    async getOptimizedQuery(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ApiError('缺少查询计划ID', 400);
            }
            // 获取查询计划
            const queryPlan = await prisma.queryPlan.findUnique({
                where: { id }
            });
            if (!queryPlan) {
                throw new error_1.ApiError('查询计划不存在', 404);
            }
            // 获取数据源
            const dataSource = await dataSourceService.getDataSourceById(queryPlan.dataSourceId);
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            // 解析计划数据
            let planData;
            try {
                planData = JSON.parse(queryPlan.planData);
            }
            catch (e) {
                throw new error_1.ApiError('无法解析查询计划数据', 500);
            }
            // 获取优化器
            const optimizer = (0, database_core_1.getQueryOptimizer)(dataSource.type);
            // 分析SQL并生成优化建议
            const suggestions = optimizer.analyzeSql(planData, queryPlan.sql);
            // 生成优化后的SQL
            const optimizedSql = optimizer.generateOptimizedSql(queryPlan.sql, suggestions);
            // 返回结果
            res.status(200).json({
                success: true,
                data: {
                    originalSql: queryPlan.sql,
                    optimizedSql: optimizedSql,
                    suggestions: suggestions
                }
            });
        }
        catch (error) {
            logger_1.default.error('获取优化后SQL查询失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取优化后SQL查询失败',
                    error: error.message || '未知错误'
                });
            }
        }
    }
}
exports.QueryPlanController = QueryPlanController;
//# sourceMappingURL=query-plan.controller.js.map