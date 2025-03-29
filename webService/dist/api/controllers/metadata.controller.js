"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataController = void 0;
const express_validator_1 = require("express-validator");
const metadata_service_1 = __importDefault(require("../../services/metadata.service"));
const column_analyzer_1 = __importDefault(require("../../services/metadata/column-analyzer"));
const error_1 = require("../../utils/error");
class MetadataController {
    /**
     * 同步数据源元数据
     */
    async syncMetadata(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
            }
            const { dataSourceId } = req.params;
            const { syncType, schemaPattern, tablePattern } = req.body;
            const result = await metadata_service_1.default.syncMetadata(dataSourceId, {
                syncType,
                schemaPattern,
                tablePattern
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
     * 获取数据源的元数据结构
     */
    async getMetadataStructure(req, res, next) {
        try {
            const { dataSourceId } = req.params;
            const result = await metadata_service_1.default.getMetadataStructure(dataSourceId);
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
     * 获取同步历史记录
     */
    async getSyncHistory(req, res, next) {
        try {
            const { dataSourceId } = req.params;
            const { limit, offset } = req.query;
            const result = await metadata_service_1.default.getSyncHistory(dataSourceId, Number(limit) || 10, Number(offset) || 0);
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
     * 获取表数据预览
     */
    async previewTableData(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
            }
            const { dataSourceId } = req.params;
            const { schema, table, limit } = req.query;
            if (!schema || !table) {
                throw new error_1.ApiError('缺少必要参数', 400, { message: '必须提供schema和table参数' });
            }
            const result = await metadata_service_1.default.previewTableData(dataSourceId, schema, table, Number(limit) || 100);
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
     * 验证同步元数据请求
     */
    validateSyncMetadata() {
        return [
            (0, express_validator_1.param)('dataSourceId').isUUID().withMessage('无效的数据源ID'),
            (0, express_validator_1.body)('syncType').optional().isIn(['FULL', 'INCREMENTAL']).withMessage('同步类型必须是 FULL 或 INCREMENTAL'),
            (0, express_validator_1.body)('schemaPattern').optional().isString().withMessage('架构模式必须是字符串'),
            (0, express_validator_1.body)('tablePattern').optional().isString().withMessage('表模式必须是字符串'),
        ];
    }
    /**
     * 验证预览表数据请求
     */
    validatePreviewTableData() {
        return [
            (0, express_validator_1.param)('dataSourceId').isUUID().withMessage('无效的数据源ID'),
            (0, express_validator_1.query)('schema').isString().withMessage('架构名称必须是字符串'),
            (0, express_validator_1.query)('table').isString().withMessage('表名称必须是字符串'),
            (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('limit必须是1-1000之间的整数'),
        ];
    }
    /**
     * 分析表列详细信息
     */
    async analyzeColumn(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
            }
            const { dataSourceId } = req.params;
            const { schema, table, column } = req.query;
            if (!schema || !table || !column) {
                throw new error_1.ApiError('缺少必要参数', 400, { message: '必须提供schema、table和column参数' });
            }
            const result = await column_analyzer_1.default.analyzeColumn(dataSourceId, schema, table, column);
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
     * 验证列分析请求
     */
    validateColumnAnalysis() {
        return [
            (0, express_validator_1.param)('dataSourceId').isUUID().withMessage('无效的数据源ID'),
            (0, express_validator_1.query)('schema').isString().withMessage('架构名称必须是字符串'),
            (0, express_validator_1.query)('table').isString().withMessage('表名称必须是字符串'),
            (0, express_validator_1.query)('column').isString().withMessage('列名称必须是字符串'),
        ];
    }
}
exports.MetadataController = MetadataController;
exports.default = new MetadataController();
//# sourceMappingURL=metadata.controller.js.map