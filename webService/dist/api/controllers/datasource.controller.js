"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceController = void 0;
const express_validator_1 = require("express-validator");
const datasource_service_1 = __importDefault(require("../../services/datasource.service"));
const api_error_1 = require("../../utils/errors/types/api-error");
const error_codes_1 = require("../../utils/errors/error-codes");
class DataSourceController {
    /**
     * 获取所有数据源
     */
    async getAllDataSources(req, res, next) {
        try {
            const dataSources = await datasource_service_1.default.getAllDataSources();
            res.status(200).json({
                success: true,
                data: dataSources,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 获取单个数据源
     */
    async getDataSourceById(req, res, next) {
        try {
            const { id } = req.params;
            const dataSource = await datasource_service_1.default.getDataSourceById(id);
            res.status(200).json({
                success: true,
                data: dataSource,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 创建数据源
     */
    async createDataSource(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new api_error_1.ApiError('验证错误', error_codes_1.ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
            }
            const dataSourceData = {
                name: req.body.name,
                type: req.body.type,
                host: req.body.host,
                port: parseInt(req.body.port, 10),
                username: req.body.username,
                password: req.body.password,
                database: req.body.database,
                description: req.body.description,
                active: req.body.active !== undefined ? req.body.active : true,
                tags: req.body.tags,
            };
            const newDataSource = await datasource_service_1.default.createDataSource(dataSourceData);
            res.status(201).json({
                success: true,
                data: newDataSource,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 更新数据源
     */
    async updateDataSource(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new api_error_1.ApiError('验证错误', error_codes_1.ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
            }
            const { id } = req.params;
            const updateData = {};
            if (req.body.name !== undefined)
                updateData.name = req.body.name;
            if (req.body.host !== undefined)
                updateData.host = req.body.host;
            if (req.body.port !== undefined)
                updateData.port = parseInt(req.body.port, 10);
            if (req.body.username !== undefined)
                updateData.username = req.body.username;
            if (req.body.password !== undefined)
                updateData.password = req.body.password;
            if (req.body.database !== undefined)
                updateData.database = req.body.database;
            if (req.body.description !== undefined)
                updateData.description = req.body.description;
            if (req.body.active !== undefined)
                updateData.active = req.body.active;
            if (req.body.tags !== undefined)
                updateData.tags = req.body.tags;
            const updatedDataSource = await datasource_service_1.default.updateDataSource(id, updateData);
            res.status(200).json({
                success: true,
                data: updatedDataSource,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 删除数据源
     */
    async deleteDataSource(req, res, next) {
        try {
            const { id } = req.params;
            await datasource_service_1.default.deleteDataSource(id);
            res.status(200).json({
                success: true,
                message: '数据源已成功删除',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 测试数据源连接
     */
    async testConnection(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new api_error_1.ApiError('验证错误', error_codes_1.ERROR_CODES.INVALID_REQUEST, 400, 'BAD_REQUEST', errors.array());
            }
            const connectionData = {
                type: req.body.type,
                host: req.body.host,
                port: parseInt(req.body.port, 10),
                username: req.body.username,
                password: req.body.password,
                database: req.body.database,
            };
            const result = await datasource_service_1.default.testConnection(connectionData);
            res.status(200).json({
                success: result,
                message: result ? '连接成功' : '连接失败',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 验证数据源创建请求
     */
    validateCreateDataSource() {
        return [
            (0, express_validator_1.check)('name').not().isEmpty().withMessage('名称不能为空'),
            (0, express_validator_1.check)('type').not().isEmpty().withMessage('类型不能为空'),
            (0, express_validator_1.check)('host').not().isEmpty().withMessage('主机不能为空'),
            (0, express_validator_1.check)('port').isInt({ min: 1, max: 65535 }).withMessage('端口号必须是1-65535之间的整数'),
            (0, express_validator_1.check)('username').not().isEmpty().withMessage('用户名不能为空'),
            (0, express_validator_1.check)('password').not().isEmpty().withMessage('密码不能为空'),
            (0, express_validator_1.check)('database').not().isEmpty().withMessage('数据库名不能为空'),
        ];
    }
    /**
     * 验证数据源更新请求
     */
    validateUpdateDataSource() {
        return [
            (0, express_validator_1.check)('id').not().isEmpty().withMessage('ID不能为空'),
            (0, express_validator_1.check)('port').optional().isInt({ min: 1, max: 65535 }).withMessage('端口号必须是1-65535之间的整数'),
        ];
    }
    /**
     * 验证测试连接请求
     */
    validateTestConnection() {
        return [
            (0, express_validator_1.check)('type').not().isEmpty().withMessage('类型不能为空'),
            (0, express_validator_1.check)('host').not().isEmpty().withMessage('主机不能为空'),
            (0, express_validator_1.check)('port').isInt({ min: 1, max: 65535 }).withMessage('端口号必须是1-65535之间的整数'),
            (0, express_validator_1.check)('username').not().isEmpty().withMessage('用户名不能为空'),
            (0, express_validator_1.check)('password').not().isEmpty().withMessage('密码不能为空'),
            (0, express_validator_1.check)('database').not().isEmpty().withMessage('数据库名不能为空'),
        ];
    }
}
exports.DataSourceController = DataSourceController;
exports.default = new DataSourceController();
//# sourceMappingURL=datasource.controller.js.map