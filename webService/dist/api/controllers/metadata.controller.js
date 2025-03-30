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
const logger_1 = __importDefault(require("../../utils/logger"));
const datasource_service_1 = require("../../services/datasource.service");
const dataSourceService = new datasource_service_1.DataSourceService();
class MetadataController {
    constructor() {
        /**
         * 获取表数据预览
         */
        this.previewTableData = [
            (0, express_validator_1.check)('dataSourceId').isString().not().isEmpty().withMessage('数据源ID不能为空'),
            (0, express_validator_1.check)('schemaName').isString().withMessage('模式名称不能为空'),
            (0, express_validator_1.check)('tableName').isString().withMessage('表名不能为空'),
            async (req, res, next) => {
                try {
                    // 验证输入
                    const errors = (0, express_validator_1.validationResult)(req);
                    if (!errors.isEmpty()) {
                        throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
                    }
                    const { dataSourceId, schemaName, tableName } = req.params;
                    const limit = parseInt(req.query.limit) || 100;
                    // 获取连接器
                    const connector = await dataSourceService.getConnector(dataSourceId);
                    // 预览表数据
                    const data = await connector.previewTableData(schemaName, tableName, limit);
                    res.status(200).json({
                        success: true,
                        data
                    });
                }
                catch (error) {
                    next(error);
                }
            }
        ];
    }
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
     * 验证同步元数据请求
     */
    validateSyncMetadata() {
        return [
            (0, express_validator_1.check)('dataSourceId').isString().not().isEmpty().withMessage('无效的数据源ID'),
            (0, express_validator_1.check)('syncType').optional().isIn(['FULL', 'INCREMENTAL']).withMessage('同步类型必须是 FULL 或 INCREMENTAL'),
            (0, express_validator_1.check)('schemaPattern').optional().isString().withMessage('架构模式必须是字符串'),
            (0, express_validator_1.check)('tablePattern').optional().isString().withMessage('表模式必须是字符串'),
        ];
    }
    /**
     * 验证预览表数据请求
     */
    validatePreviewTableData() {
        return [
            (0, express_validator_1.check)('dataSourceId').isString().not().isEmpty().withMessage('无效的数据源ID'),
            (0, express_validator_1.check)('schema').isString().withMessage('架构名称必须是字符串'),
            (0, express_validator_1.check)('table').isString().withMessage('表名称必须是字符串'),
            (0, express_validator_1.check)('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('limit必须是1-1000之间的整数'),
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
            (0, express_validator_1.check)('dataSourceId').isString().not().isEmpty().withMessage('无效的数据源ID'),
            (0, express_validator_1.check)('schema').isString().withMessage('架构名称必须是字符串'),
            (0, express_validator_1.check)('table').isString().withMessage('表名称必须是字符串'),
            (0, express_validator_1.check)('column').isString().withMessage('列名称必须是字符串'),
        ];
    }
    /**
     * 获取数据源数据库结构
     * @param req 请求对象
     * @param res 响应对象
     */
    async getDatabaseStructure(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ApiError('缺少数据源ID', 400);
            }
            // 获取数据源
            const dataSource = await dataSourceService.getDataSourceById(id);
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            // 获取数据库连接
            const connector = await dataSourceService.getConnector(id);
            // 构建结构对象
            const structure = {
                databases: []
            };
            try {
                // 尝试获取schema列表
                const schemas = await connector.getSchemas();
                // 对于支持schemas的数据库，获取schemas下的表
                if (schemas && schemas.length > 0) {
                    const database = dataSource.databaseName || 'default';
                    const dbStructure = {
                        name: database,
                        schemas: [],
                        tables: []
                    };
                    for (const schema of schemas) {
                        // 获取当前schema下的表
                        const tables = await connector.getTables(schema);
                        const schemaStructure = {
                            name: schema,
                            tables: tables.map((table) => ({
                                name: typeof table === 'string' ? table : table.name,
                                type: 'TABLE',
                                schema
                            }))
                        };
                        dbStructure.schemas.push(schemaStructure);
                    }
                    structure.databases.push(dbStructure);
                }
                else {
                    // 不支持schema的数据库，直接获取表
                    const tables = await connector.getTables();
                    const dbStructure = {
                        name: dataSource.databaseName || 'default',
                        schemas: [],
                        tables: tables.map((table) => ({
                            name: typeof table === 'string' ? table : table.name,
                            type: 'TABLE',
                            schema: null
                        }))
                    };
                    structure.databases.push(dbStructure);
                }
            }
            catch (err) {
                logger_1.default.error('获取数据库结构失败', { error: err, dataSourceId: id });
                throw new error_1.ApiError('获取数据库结构失败', 500, { message: err.message });
            }
            // 返回结构
            res.status(200).json({
                success: true,
                data: structure
            });
        }
        catch (error) {
            logger_1.default.error('获取数据库结构失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取数据库结构时发生错误',
                    error: error.message
                });
            }
        }
    }
    /**
     * 获取表的数据示例（预览）
     */
    async getTablePreviewInternal(connector, schemaOrDb, tableName, limit = 1) {
        try {
            if (typeof connector.previewTableData !== 'function') {
                return null;
            }
            const preview = await connector.previewTableData(schemaOrDb, tableName, limit);
            if (!preview || !preview.rows || preview.rows.length === 0) {
                return null;
            }
            // 从预览中提取第一行数据作为示例
            const sampleRow = preview.rows[0];
            return {
                sampleRow,
                columns: preview.fields ? preview.fields.map((f) => f.name) : Object.keys(sampleRow)
            };
        }
        catch (err) {
            logger_1.default.warn('获取表数据预览失败', { error: err, schemaOrDb, tableName });
            return null;
        }
    }
    /**
     * 获取表详细信息
     * @param req 请求对象
     * @param res 响应对象
     */
    async getTableDetails(req, res) {
        try {
            const { id } = req.params;
            const { database, table, schema } = req.query;
            if (!id || !database || !table) {
                throw new error_1.ApiError('缺少必要参数', 400);
            }
            // 获取数据源
            const dataSource = await dataSourceService.getDataSourceById(id);
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            // 获取数据库连接
            const connector = await dataSourceService.getConnector(id);
            // 获取表信息
            const schemaOrDb = schema || database;
            const columns = await connector.getColumns(schemaOrDb, table);
            const indexes = await connector.getIndexes(schemaOrDb, table);
            // 获取外键（如果支持）
            let foreignKeys = [];
            if (typeof connector.getForeignKeys === 'function') {
                foreignKeys = await connector.getForeignKeys(schemaOrDb, table);
            }
            // 获取主键（如果支持）
            let primaryKeys = [];
            if (typeof connector.getPrimaryKeys === 'function') {
                primaryKeys = await connector.getPrimaryKeys(schemaOrDb, table);
            }
            else {
                // 从列信息中提取主键
                primaryKeys = columns
                    .filter(column => column.isPrimaryKey)
                    .map(column => column.name);
            }
            // 获取表的数据示例（预览）
            const previewData = await this.getTablePreviewInternal(connector, schemaOrDb, table);
            // 返回表详情
            res.status(200).json({
                success: true,
                data: {
                    name: table,
                    schema: schema || null,
                    database: database,
                    columns,
                    indexes,
                    foreignKeys,
                    primaryKeys,
                    preview: previewData
                }
            });
        }
        catch (error) {
            logger_1.default.error('获取表详细信息失败', { error });
            if (error instanceof error_1.ApiError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '获取表详细信息时发生错误',
                    error: error.message
                });
            }
        }
    }
}
exports.MetadataController = MetadataController;
exports.default = new MetadataController();
//# sourceMappingURL=metadata.controller.js.map