"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSyncMetadata = exports.validateDeleteDataSource = exports.validateGetDataSource = exports.validateGetDataSources = exports.validateTestConnection = exports.validateUpdateDataSource = exports.validateCreateDataSource = void 0;
const express_validator_1 = require("express-validator");
// 数据源类型验证
const validDataSourceTypes = ['MYSQL', 'POSTGRESQL', 'ORACLE', 'SQLSERVER', 'MONGODB', 'ELASTICSEARCH'];
const validDataSourceStatuses = ['ACTIVE', 'INACTIVE', 'ERROR', 'SYNCING'];
const validSyncFrequencies = ['MANUAL', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'];
// 创建数据源验证
exports.validateCreateDataSource = [
    (0, express_validator_1.check)('name')
        .not().isEmpty().withMessage('数据源名称不能为空')
        .isString().withMessage('数据源名称必须是字符串')
        .isLength({ min: 1, max: 100 }).withMessage('数据源名称长度必须在1-100字符之间'),
    (0, express_validator_1.check)('type')
        .not().isEmpty().withMessage('数据源类型不能为空')
        .isIn(validDataSourceTypes).withMessage(`数据源类型必须是以下之一: ${validDataSourceTypes.join(', ')}`),
    (0, express_validator_1.check)('host')
        .not().isEmpty().withMessage('主机不能为空')
        .isString().withMessage('主机必须是字符串'),
    (0, express_validator_1.check)('port')
        .not().isEmpty().withMessage('端口不能为空')
        .isInt({ min: 1, max: 65535 }).withMessage('端口必须是1-65535之间的整数'),
    (0, express_validator_1.check)('databaseName')
        .not().isEmpty().withMessage('数据库名称不能为空')
        .isString().withMessage('数据库名称必须是字符串'),
    (0, express_validator_1.check)('username')
        .not().isEmpty().withMessage('用户名不能为空')
        .isString().withMessage('用户名必须是字符串'),
    (0, express_validator_1.check)('password')
        .not().isEmpty().withMessage('密码不能为空')
        .isString().withMessage('密码必须是字符串'),
    (0, express_validator_1.check)('description')
        .optional()
        .isString().withMessage('描述必须是字符串'),
    (0, express_validator_1.check)('syncFrequency')
        .optional()
        .isIn(validSyncFrequencies).withMessage(`同步频率必须是以下之一: ${validSyncFrequencies.join(', ')}`),
    (0, express_validator_1.check)('connectionOptions')
        .optional()
        .isObject().withMessage('连接选项必须是对象')
];
// 更新数据源验证
exports.validateUpdateDataSource = [
    (0, express_validator_1.check)('id')
        .not().isEmpty().withMessage('数据源ID不能为空')
        .isString().withMessage('数据源ID必须是字符串'),
    (0, express_validator_1.check)('name')
        .optional()
        .isString().withMessage('数据源名称必须是字符串')
        .isLength({ min: 1, max: 100 }).withMessage('数据源名称长度必须在1-100字符之间'),
    (0, express_validator_1.check)('host')
        .optional()
        .isString().withMessage('主机必须是字符串'),
    (0, express_validator_1.check)('port')
        .optional()
        .isInt({ min: 1, max: 65535 }).withMessage('端口必须是1-65535之间的整数'),
    (0, express_validator_1.check)('databaseName')
        .optional()
        .isString().withMessage('数据库名称必须是字符串'),
    (0, express_validator_1.check)('username')
        .optional()
        .isString().withMessage('用户名必须是字符串'),
    (0, express_validator_1.check)('password')
        .optional()
        .isString().withMessage('密码必须是字符串'),
    (0, express_validator_1.check)('description')
        .optional()
        .isString().withMessage('描述必须是字符串'),
    (0, express_validator_1.check)('syncFrequency')
        .optional()
        .isIn(validSyncFrequencies).withMessage(`同步频率必须是以下之一: ${validSyncFrequencies.join(', ')}`),
    (0, express_validator_1.check)('connectionOptions')
        .optional()
        .isObject().withMessage('连接选项必须是对象')
];
// 测试连接验证
exports.validateTestConnection = [
    (0, express_validator_1.check)('type')
        .not().isEmpty().withMessage('数据源类型不能为空')
        .isIn(validDataSourceTypes).withMessage(`数据源类型必须是以下之一: ${validDataSourceTypes.join(', ')}`),
    (0, express_validator_1.check)('host')
        .not().isEmpty().withMessage('主机不能为空')
        .isString().withMessage('主机必须是字符串'),
    (0, express_validator_1.check)('port')
        .not().isEmpty().withMessage('端口不能为空')
        .isInt({ min: 1, max: 65535 }).withMessage('端口必须是1-65535之间的整数'),
    (0, express_validator_1.check)('databaseName')
        .not().isEmpty().withMessage('数据库名称不能为空')
        .isString().withMessage('数据库名称必须是字符串'),
    (0, express_validator_1.check)('username')
        .not().isEmpty().withMessage('用户名不能为空')
        .isString().withMessage('用户名必须是字符串'),
    (0, express_validator_1.check)('password')
        .not().isEmpty().withMessage('密码不能为空')
        .isString().withMessage('密码必须是字符串')
];
// 获取数据源列表验证
exports.validateGetDataSources = [
    (0, express_validator_1.check)('page')
        .optional()
        .isInt({ min: 1 }).withMessage('页码必须是大于等于1的整数')
        .toInt(),
    (0, express_validator_1.check)('size')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('每页大小必须是1-100之间的整数')
        .toInt(),
    (0, express_validator_1.check)('name')
        .optional()
        .isString().withMessage('名称必须是字符串'),
    (0, express_validator_1.check)('type')
        .optional()
        .isIn(validDataSourceTypes).withMessage(`数据源类型必须是以下之一: ${validDataSourceTypes.join(', ')}`),
    (0, express_validator_1.check)('status')
        .optional()
        .isIn(validDataSourceStatuses).withMessage(`数据源状态必须是以下之一: ${validDataSourceStatuses.join(', ')}`)
];
// 获取单个数据源验证
exports.validateGetDataSource = [
    (0, express_validator_1.check)('id')
        .not().isEmpty().withMessage('数据源ID不能为空')
        .isString().withMessage('数据源ID必须是字符串')
];
// 删除数据源验证
exports.validateDeleteDataSource = [
    (0, express_validator_1.check)('id')
        .not().isEmpty().withMessage('数据源ID不能为空')
        .isString().withMessage('数据源ID必须是字符串')
];
// 同步元数据验证
exports.validateSyncMetadata = [
    (0, express_validator_1.check)('id')
        .not().isEmpty().withMessage('数据源ID不能为空')
        .isString().withMessage('数据源ID必须是字符串'),
    (0, express_validator_1.check)('filters')
        .optional()
        .isObject().withMessage('过滤条件必须是对象'),
    (0, express_validator_1.check)('filters.includeSchemas')
        .optional()
        .isArray().withMessage('includeSchemas必须是数组'),
    (0, express_validator_1.check)('filters.excludeSchemas')
        .optional()
        .isArray().withMessage('excludeSchemas必须是数组'),
    (0, express_validator_1.check)('filters.includeTables')
        .optional()
        .isArray().withMessage('includeTables必须是数组'),
    (0, express_validator_1.check)('filters.excludeTables')
        .optional()
        .isArray().withMessage('excludeTables必须是数组')
];
//# sourceMappingURL=datasource.validator.js.map