"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryService = void 0;
const client_1 = require("@prisma/client");
const error_1 = require("../utils/error");
const datasource_service_1 = __importDefault(require("./datasource.service"));
const logger_1 = __importDefault(require("../utils/logger"));
const query_plan_service_1 = require("../database-core/query-plan/query-plan-service");
const prisma = new client_1.PrismaClient();
class QueryService {
    /**
     * 执行SQL查询
     */
    async executeQuery(dataSourceId, sql, params = [], options) {
        try {
            // 获取数据源连接器
            const connector = await datasource_service_1.default.getConnector(dataSourceId);
            // 记录查询开始
            const startTime = new Date();
            let queryHistoryId = null;
            try {
                // 创建查询历史记录
                const queryHistory = await prisma.queryHistory.create({
                    data: {
                        dataSourceId,
                        sqlContent: sql,
                        status: 'RUNNING',
                        startTime,
                    }
                });
                queryHistoryId = queryHistory.id;
                // 执行查询 - 传递queryHistoryId作为queryId以支持取消功能
                const result = await connector.executeQuery(sql, params, queryHistoryId, options);
                // 更新查询历史为成功
                const endTime = new Date();
                const duration = endTime.getTime() - startTime.getTime();
                await prisma.queryHistory.update({
                    where: { id: queryHistoryId },
                    data: {
                        status: 'COMPLETED',
                        endTime,
                        duration,
                        rowCount: result.rows.length,
                    }
                });
                return result;
            }
            catch (error) {
                // 更新查询历史为失败
                if (queryHistoryId) {
                    const endTime = new Date();
                    const duration = endTime.getTime() - startTime.getTime();
                    await prisma.queryHistory.update({
                        where: { id: queryHistoryId },
                        data: {
                            status: 'FAILED',
                            endTime,
                            duration,
                            errorMessage: error?.message || '未知错误',
                        }
                    });
                }
                logger_1.default.error('执行查询失败', { error, dataSourceId, sql });
                if (error instanceof error_1.ApiError) {
                    throw error;
                }
                throw new error_1.ApiError('执行查询失败', 500, error?.message || '未知错误');
            }
        }
        catch (error) {
            logger_1.default.error('执行查询失败', { error, dataSourceId, sql });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('执行查询失败', 500, error?.message || '未知错误');
        }
    }
    /**
     * 获取查询执行计划
     */
    async explainQuery(dataSourceId, sql, params = []) {
        try {
            // 获取数据源连接器和数据源信息
            const connector = await datasource_service_1.default.getConnector(dataSourceId);
            const dataSource = await datasource_service_1.default.getDataSourceById(dataSourceId);
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            // 实例化查询计划服务
            const queryPlanService = new query_plan_service_1.QueryPlanService();
            // 利用查询计划服务获取并增强执行计划
            const plan = await queryPlanService.getQueryPlan(connector, dataSource.type, sql, params);
            // 记录查询计划到历史记录
            await this.saveQueryPlanToHistory(dataSourceId, sql, plan);
            return plan;
        }
        catch (error) {
            logger_1.default.error('获取查询执行计划失败', { error, dataSourceId, sql });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('获取查询执行计划失败', 500, error?.message || '未知错误');
        }
    }
    /**
     * 保存查询计划到历史记录
     * @param dataSourceId 数据源ID
     * @param sql SQL查询语句
     * @param plan 执行计划
     */
    async saveQueryPlanToHistory(dataSourceId, sql, plan) {
        try {
            // 将执行计划转为JSON字符串
            const planJson = JSON.stringify(plan);
            // 创建记录
            await prisma.queryPlanHistory.create({
                data: {
                    dataSourceId,
                    sql,
                    planData: planJson,
                    createdAt: new Date()
                }
            });
            logger_1.default.info('查询计划已保存到历史记录', { dataSourceId, sql });
        }
        catch (error) {
            // 仅记录日志，不抛出异常，确保主流程不受影响
            logger_1.default.error('保存查询计划到历史记录失败', { error, dataSourceId, sql });
        }
    }
    /**
     * 获取查询计划历史记录
     * @param id 查询计划ID
     * @returns 查询计划历史记录
     */
    async getQueryPlanById(id) {
        try {
            return await prisma.queryPlanHistory.findUnique({
                where: { id }
            });
        }
        catch (error) {
            logger_1.default.error('获取查询计划历史记录失败', { error, id });
            return null;
        }
    }
    /**
     * 获取查询计划历史记录列表
     * @param dataSourceId 数据源ID
     * @param limit 每页数量
     * @param offset 偏移量
     * @returns 查询计划历史记录列表
     */
    async getQueryPlanHistory(dataSourceId, limit = 20, offset = 0) {
        try {
            const where = dataSourceId ? { dataSourceId } : {};
            const [history, total] = await Promise.all([
                prisma.queryPlanHistory.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    skip: offset,
                    take: limit
                }),
                prisma.queryPlanHistory.count({ where })
            ]);
            return {
                history,
                total,
                limit,
                offset
            };
        }
        catch (error) {
            logger_1.default.error('获取查询计划历史记录列表失败', { error, dataSourceId });
            throw new error_1.ApiError('获取查询计划历史记录列表失败', 500);
        }
    }
    /**
     * 取消正在执行的查询
     */
    async cancelQuery(queryId) {
        try {
            // 首先查找查询执行记录
            const queryExecution = await prisma.queryHistory.findUnique({
                where: { id: queryId }
            });
            if (!queryExecution) {
                throw new error_1.ApiError('查询不存在', 404);
            }
            if (queryExecution.status !== 'RUNNING') {
                logger_1.default.warn('无法取消查询，查询未在运行中', {
                    queryId,
                    status: queryExecution.status
                });
                return false; // 查询已经完成或已取消
            }
            // 获取数据源连接器
            const connector = await datasource_service_1.default.getConnector(queryExecution.dataSourceId);
            // 取消查询
            const success = await connector.cancelQuery(queryId);
            if (success) {
                // 更新查询历史状态
                await prisma.queryHistory.update({
                    where: { id: queryId },
                    data: {
                        status: 'CANCELLED',
                        endTime: new Date(),
                        duration: new Date().getTime() - new Date(queryExecution.startTime).getTime(),
                        errorMessage: '查询已取消'
                    }
                });
                logger_1.default.info('查询已成功取消', { queryId });
            }
            else {
                logger_1.default.warn('取消查询请求已发送，但无法确认取消状态', { queryId });
            }
            return success;
        }
        catch (error) {
            logger_1.default.error('取消查询失败', { error, queryId });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('取消查询失败', 500, error?.message || '未知错误');
        }
    }
    /**
     * 保存查询
     */
    async saveQuery(data) {
        try {
            const query = await prisma.query.create({
                data: {
                    name: data.name,
                    dataSourceId: data.dataSourceId,
                    sqlContent: data.sql,
                    description: data.description || '',
                    tags: data.tags?.join(',') || '',
                    status: data.isPublic ? 'PUBLISHED' : 'DRAFT',
                },
            });
            return query;
        }
        catch (error) {
            logger_1.default.error('保存查询失败', { error, query: data });
            throw new error_1.ApiError('保存查询失败', 500, error?.message || '未知错误');
        }
    }
    /**
     * 获取查询列表
     */
    async getQueries(options = {}) {
        try {
            const where = {};
            if (options.dataSourceId) {
                where.dataSourceId = options.dataSourceId;
            }
            if (options.isPublic !== undefined) {
                where.status = options.isPublic ? 'PUBLISHED' : 'DRAFT';
            }
            if (options.tag) {
                where.tags = {
                    contains: options.tag,
                };
            }
            if (options.search) {
                where.OR = [
                    {
                        name: {
                            contains: options.search,
                        },
                    },
                    {
                        description: {
                            contains: options.search,
                        },
                    },
                    {
                        sqlContent: {
                            contains: options.search,
                        },
                    },
                ];
            }
            return await prisma.query.findMany({
                where,
                orderBy: {
                    updatedAt: 'desc',
                },
            });
        }
        catch (error) {
            logger_1.default.error('获取查询列表失败', { error, options });
            throw new error_1.ApiError('获取查询列表失败', 500, error?.message || '未知错误');
        }
    }
    /**
     * 获取查询详情
     */
    async getQueryById(id) {
        try {
            const query = await prisma.query.findUnique({
                where: { id },
            });
            if (!query) {
                throw new error_1.ApiError('查询不存在', 404);
            }
            return query;
        }
        catch (error) {
            logger_1.default.error('获取查询详情失败', { error, id });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('获取查询详情失败', 500, error?.message || '未知错误');
        }
    }
    /**
     * 更新查询
     */
    async updateQuery(id, data) {
        try {
            // 首先检查查询是否存在
            const existingQuery = await prisma.query.findUnique({
                where: { id },
            });
            if (!existingQuery) {
                throw new error_1.ApiError('查询不存在', 404);
            }
            // 准备更新数据
            const updateData = {};
            if (data.name !== undefined)
                updateData.name = data.name;
            if (data.sql !== undefined)
                updateData.sqlContent = data.sql;
            if (data.description !== undefined)
                updateData.description = data.description;
            if (data.isPublic !== undefined)
                updateData.status = data.isPublic ? 'PUBLISHED' : 'DRAFT';
            if (data.tags !== undefined)
                updateData.tags = data.tags.join(',');
            // 更新查询
            return await prisma.query.update({
                where: { id },
                data: updateData,
            });
        }
        catch (error) {
            logger_1.default.error('更新查询失败', { error, id, data });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('更新查询失败', 500, error?.message || '未知错误');
        }
    }
    /**
     * 删除查询
     */
    async deleteQuery(id) {
        try {
            // 首先检查查询是否存在
            const existingQuery = await prisma.query.findUnique({
                where: { id },
            });
            if (!existingQuery) {
                throw new error_1.ApiError('查询不存在', 404);
            }
            // 删除查询
            await prisma.query.delete({
                where: { id },
            });
        }
        catch (error) {
            logger_1.default.error('删除查询失败', { error, id });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('删除查询失败', 500, error?.message || '未知错误');
        }
    }
    /**
     * 获取查询历史记录
     */
    async getQueryHistory(dataSourceId, limit = 50, offset = 0) {
        try {
            const where = {};
            if (dataSourceId) {
                where.dataSourceId = dataSourceId;
            }
            const [history, total] = await Promise.all([
                prisma.queryHistory.findMany({
                    where,
                    orderBy: {
                        startTime: 'desc',
                    },
                    take: limit,
                    skip: offset,
                }),
                prisma.queryHistory.count({ where }),
            ]);
            return {
                history,
                total,
                limit,
                offset,
            };
        }
        catch (error) {
            logger_1.default.error('获取查询历史失败', { error, dataSourceId });
            throw new error_1.ApiError('获取查询历史失败', 500, error?.message || '未知错误');
        }
    }
}
exports.QueryService = QueryService;
exports.default = new QueryService();
//# sourceMappingURL=query.service.js.map