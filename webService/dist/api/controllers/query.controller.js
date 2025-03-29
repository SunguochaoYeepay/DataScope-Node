"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryController = void 0;
const express_validator_1 = require("express-validator");
const query_service_1 = __importDefault(require("../../services/query.service"));
const error_1 = require("../../utils/error");
class QueryController {
    /**
     * 获取查询执行计划
     */
    async explainQuery(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
            }
            const { dataSourceId, sql, params } = req.body;
            const plan = await query_service_1.default.explainQuery(dataSourceId, sql, params);
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
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
            }
            const { dataSourceId, sql, params, page, pageSize, offset, limit, sort, order } = req.body;
            const result = await query_service_1.default.executeQuery(dataSourceId, sql, params, {
                page, pageSize, offset, limit, sort, order
            });
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
     * 保存查询
     */
    async saveQuery(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
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
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
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
            (0, express_validator_1.body)('dataSourceId').notEmpty().withMessage('数据源ID不能为空'),
            (0, express_validator_1.body)('sql').notEmpty().withMessage('SQL查询语句不能为空'),
        ];
    }
    /**
     * 验证保存查询请求
     */
    validateSaveQuery() {
        return [
            (0, express_validator_1.body)('dataSourceId').notEmpty().withMessage('数据源ID不能为空'),
            (0, express_validator_1.body)('name').notEmpty().withMessage('名称不能为空'),
            (0, express_validator_1.body)('sql').notEmpty().withMessage('SQL查询语句不能为空'),
        ];
    }
    /**
     * 验证更新查询请求
     */
    validateUpdateQuery() {
        return [
            (0, express_validator_1.param)('id').notEmpty().withMessage('查询ID不能为空'),
        ];
    }
}
exports.QueryController = QueryController;
exports.default = new QueryController();
//# sourceMappingURL=query.controller.js.map