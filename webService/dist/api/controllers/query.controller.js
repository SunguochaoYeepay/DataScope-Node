"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryController = void 0;
const express_validator_1 = require("express-validator");
const query_service_1 = __importDefault(require("../../services/query.service"));
const api_error_1 = require("../../utils/errors/types/api-error");
const error_codes_1 = require("../../utils/errors/error-codes");
const datasource_service_1 = __importDefault(require("../../services/datasource.service"));
class QueryController {
    /**
     * 获取查询执行计划
     */
    async explainQuery(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new api_error_1.ApiError('验证错误', error_codes_1.ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
            }
            const { dataSourceId, sql, params, includeAnalysis = true } = req.body;
            const plan = await query_service_1.default.explainQuery(dataSourceId, sql, params);
            // 根据客户端请求决定是否返回完整分析结果
            if (!includeAnalysis && plan.performanceAnalysis) {
                // 缓存原始分析结果但不返回
                plan._performanceAnalysis = plan.performanceAnalysis;
                delete plan.performanceAnalysis;
            }
            res.status(200).json({
                success: true,
                data: plan
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 获取查询计划的优化建议
     */
    async getQueryOptimizationTips(req, res, next) {
        try {
            const { id } = req.params;
            // 从历史记录中获取查询计划
            const planHistory = await query_service_1.default.getQueryPlanById(id);
            if (!planHistory) {
                throw api_error_1.ApiError.notFound('查询计划不存在');
            }
            // 获取优化建议
            const plan = JSON.parse(planHistory.planData);
            res.status(200).json({
                success: true,
                data: {
                    sql: planHistory.sql,
                    optimizationTips: plan.optimizationTips || [],
                    performanceAnalysis: plan.performanceAnalysis || {}
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 获取查询计划历史记录
     */
    async getQueryPlanHistory(req, res, next) {
        try {
            const { dataSourceId, limit, offset } = req.query;
            const result = await query_service_1.default.getQueryPlanHistory(dataSourceId, limit ? Number(limit) : 20, offset ? Number(offset) : 0);
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 取消查询执行
     */
    async cancelQuery(req, res, next) {
        try {
            const { id } = req.params;
            const success = await query_service_1.default.cancelQuery(id);
            if (success) {
                res.status(200).json({
                    success: true,
                    message: '查询已成功取消'
                });
            }
            else {
                res.status(200).json({
                    success: false,
                    message: '无法取消查询，查询可能已完成或已取消'
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 执行SQL查询
     */
    async executeQuery(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new api_error_1.ApiError('验证错误', error_codes_1.ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
            }
            const { dataSourceId, sql, params, page, pageSize, offset, limit, sort, order } = req.body;
            // 检查是否为特殊命令
            const isSpecialCommand = this.isSpecialCommand(sql);
            // 对于特殊命令，不传递分页参数
            let queryOptions = isSpecialCommand ? {} : {
                page, pageSize, offset, limit, sort, order
            };
            const result = await query_service_1.default.executeQuery(dataSourceId, sql, params, queryOptions);
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 检查SQL是否为特殊命令（如SHOW, DESCRIBE等），这些命令不支持LIMIT子句
     */
    isSpecialCommand(sql) {
        if (!sql)
            return false;
        const trimmedSql = sql.trim().toLowerCase();
        return (trimmedSql.startsWith('show ') ||
            trimmedSql.startsWith('describe ') ||
            trimmedSql.startsWith('desc ') ||
            trimmedSql === 'show databases;' ||
            trimmedSql === 'show tables;' ||
            trimmedSql === 'show databases' ||
            trimmedSql === 'show tables' ||
            trimmedSql.startsWith('show columns ') ||
            trimmedSql.startsWith('show index ') ||
            trimmedSql.startsWith('show create ') ||
            trimmedSql.startsWith('show grants ') ||
            trimmedSql.startsWith('show triggers ') ||
            trimmedSql.startsWith('show procedure ') ||
            trimmedSql.startsWith('show function ') ||
            trimmedSql.startsWith('show variables ') ||
            trimmedSql.startsWith('show status ') ||
            trimmedSql.startsWith('show engine ') ||
            trimmedSql.startsWith('set ') ||
            trimmedSql.startsWith('use '));
    }
    /**
     * 保存查询
     */
    async saveQuery(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new api_error_1.ApiError('验证错误', error_codes_1.ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
            }
            const { dataSourceId, name, description, sql, tags, isPublic } = req.body;
            const savedQuery = await query_service_1.default.saveQuery({
                dataSourceId,
                name,
                description,
                sql,
                tags,
                isPublic
            });
            res.status(201).json({
                success: true,
                data: savedQuery
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 获取所有保存的查询
     */
    async getQueries(req, res, next) {
        try {
            const { dataSourceId, tag, isPublic, search } = req.query;
            const queries = await query_service_1.default.getQueries({
                dataSourceId: dataSourceId,
                tag: tag,
                isPublic: isPublic === 'true',
                search: search
            });
            res.status(200).json({
                success: true,
                data: queries
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 获取单个查询
     */
    async getQueryById(req, res, next) {
        try {
            const { id } = req.params;
            const query = await query_service_1.default.getQueryById(id);
            res.status(200).json({
                success: true,
                data: query
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 更新保存的查询
     */
    async updateQuery(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new api_error_1.ApiError('验证错误', error_codes_1.ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
            }
            const { id } = req.params;
            const updateData = req.body;
            const updatedQuery = await query_service_1.default.updateQuery(id, updateData);
            res.status(200).json({
                success: true,
                data: updatedQuery
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 删除保存的查询
     */
    async deleteQuery(req, res, next) {
        try {
            const { id } = req.params;
            await query_service_1.default.deleteQuery(id);
            res.status(200).json({
                success: true,
                message: '查询已成功删除'
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 获取查询历史记录
     */
    async getQueryHistory(req, res, next) {
        try {
            const { dataSourceId, limit, offset } = req.query;
            const history = await query_service_1.default.getQueryHistory(dataSourceId, limit ? Number(limit) : 50, offset ? Number(offset) : 0);
            res.status(200).json({
                success: true,
                data: history
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 验证执行查询请求
     */
    validateExecuteQuery() {
        return [
            (0, express_validator_1.check)('dataSourceId')
                .not().isEmpty().withMessage('数据源ID不能为空')
                .isString().withMessage('数据源ID必须是字符串')
                .custom(async (dataSourceId) => {
                try {
                    // 检查数据源是否存在
                    const dataSource = await datasource_service_1.default.getDataSourceById(dataSourceId);
                    if (!dataSource) {
                        throw new Error('数据源不存在');
                    }
                    return true;
                }
                catch (error) {
                    throw new Error('无效的数据源ID');
                }
            }),
            (0, express_validator_1.check)('sql')
                .not().isEmpty().withMessage('SQL查询不能为空')
                .isString().withMessage('SQL查询必须是字符串')
        ];
    }
    /**
     * 验证保存查询请求
     */
    validateSaveQuery() {
        return [
            (0, express_validator_1.check)('dataSourceId').not().isEmpty().withMessage('数据源ID不能为空'),
            (0, express_validator_1.check)('name').not().isEmpty().withMessage('名称不能为空'),
            (0, express_validator_1.check)('sql').not().isEmpty().withMessage('SQL查询语句不能为空'),
        ];
    }
    /**
     * 验证更新查询请求
     */
    validateUpdateQuery() {
        return [
            (0, express_validator_1.check)('id').not().isEmpty().withMessage('查询ID不能为空'),
        ];
    }
}
exports.QueryController = QueryController;
exports.default = new QueryController();
//# sourceMappingURL=query.controller.js.map