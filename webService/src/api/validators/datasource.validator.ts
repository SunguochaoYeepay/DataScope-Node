import { body, param, query } from 'express-validator';

// 数据源类型验证
const validDataSourceTypes = ['MYSQL', 'POSTGRESQL', 'ORACLE', 'SQLSERVER', 'MONGODB', 'ELASTICSEARCH'];
const validDataSourceStatuses = ['ACTIVE', 'INACTIVE', 'ERROR', 'SYNCING'];
const validSyncFrequencies = ['MANUAL', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'];

// 创建数据源验证
export const validateCreateDataSource = [
  body('name')
    .notEmpty().withMessage('数据源名称不能为空')
    .isString().withMessage('数据源名称必须是字符串')
    .isLength({ min: 1, max: 100 }).withMessage('数据源名称长度必须在1-100字符之间'),
  
  body('type')
    .notEmpty().withMessage('数据源类型不能为空')
    .isIn(validDataSourceTypes).withMessage(`数据源类型必须是以下之一: ${validDataSourceTypes.join(', ')}`),
  
  body('host')
    .notEmpty().withMessage('主机不能为空')
    .isString().withMessage('主机必须是字符串'),
  
  body('port')
    .notEmpty().withMessage('端口不能为空')
    .isInt({ min: 1, max: 65535 }).withMessage('端口必须是1-65535之间的整数'),
  
  body('databaseName')
    .notEmpty().withMessage('数据库名称不能为空')
    .isString().withMessage('数据库名称必须是字符串'),
  
  body('username')
    .notEmpty().withMessage('用户名不能为空')
    .isString().withMessage('用户名必须是字符串'),
  
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isString().withMessage('密码必须是字符串'),
  
  body('description')
    .optional()
    .isString().withMessage('描述必须是字符串'),
  
  body('syncFrequency')
    .optional()
    .isIn(validSyncFrequencies).withMessage(`同步频率必须是以下之一: ${validSyncFrequencies.join(', ')}`),
  
  body('connectionOptions')
    .optional()
    .isObject().withMessage('连接选项必须是对象')
];

// 更新数据源验证
export const validateUpdateDataSource = [
  param('id')
    .notEmpty().withMessage('数据源ID不能为空')
    .isUUID().withMessage('数据源ID必须是有效的UUID'),
  
  body('name')
    .optional()
    .isString().withMessage('数据源名称必须是字符串')
    .isLength({ min: 1, max: 100 }).withMessage('数据源名称长度必须在1-100字符之间'),
  
  body('host')
    .optional()
    .isString().withMessage('主机必须是字符串'),
  
  body('port')
    .optional()
    .isInt({ min: 1, max: 65535 }).withMessage('端口必须是1-65535之间的整数'),
  
  body('databaseName')
    .optional()
    .isString().withMessage('数据库名称必须是字符串'),
  
  body('username')
    .optional()
    .isString().withMessage('用户名必须是字符串'),
  
  body('password')
    .optional()
    .isString().withMessage('密码必须是字符串'),
  
  body('description')
    .optional()
    .isString().withMessage('描述必须是字符串'),
  
  body('syncFrequency')
    .optional()
    .isIn(validSyncFrequencies).withMessage(`同步频率必须是以下之一: ${validSyncFrequencies.join(', ')}`),
  
  body('connectionOptions')
    .optional()
    .isObject().withMessage('连接选项必须是对象')
];

// 测试连接验证
export const validateTestConnection = [
  body('type')
    .notEmpty().withMessage('数据源类型不能为空')
    .isIn(validDataSourceTypes).withMessage(`数据源类型必须是以下之一: ${validDataSourceTypes.join(', ')}`),
  
  body('host')
    .notEmpty().withMessage('主机不能为空')
    .isString().withMessage('主机必须是字符串'),
  
  body('port')
    .notEmpty().withMessage('端口不能为空')
    .isInt({ min: 1, max: 65535 }).withMessage('端口必须是1-65535之间的整数'),
  
  body('databaseName')
    .notEmpty().withMessage('数据库名称不能为空')
    .isString().withMessage('数据库名称必须是字符串'),
  
  body('username')
    .notEmpty().withMessage('用户名不能为空')
    .isString().withMessage('用户名必须是字符串'),
  
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isString().withMessage('密码必须是字符串')
];

// 获取数据源列表验证
export const validateGetDataSources = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('页码必须是大于等于1的整数')
    .toInt(),
  
  query('size')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('每页大小必须是1-100之间的整数')
    .toInt(),
  
  query('name')
    .optional()
    .isString().withMessage('名称必须是字符串'),
  
  query('type')
    .optional()
    .isIn(validDataSourceTypes).withMessage(`数据源类型必须是以下之一: ${validDataSourceTypes.join(', ')}`),
  
  query('status')
    .optional()
    .isIn(validDataSourceStatuses).withMessage(`数据源状态必须是以下之一: ${validDataSourceStatuses.join(', ')}`)
];

// 获取单个数据源验证
export const validateGetDataSource = [
  param('id')
    .notEmpty().withMessage('数据源ID不能为空')
    .isUUID().withMessage('数据源ID必须是有效的UUID')
];

// 删除数据源验证
export const validateDeleteDataSource = [
  param('id')
    .notEmpty().withMessage('数据源ID不能为空')
    .isUUID().withMessage('数据源ID必须是有效的UUID')
];

// 同步元数据验证
export const validateSyncMetadata = [
  param('id')
    .notEmpty().withMessage('数据源ID不能为空')
    .isUUID().withMessage('数据源ID必须是有效的UUID'),
  
  body('filters')
    .optional()
    .isObject().withMessage('过滤条件必须是对象'),
  
  body('filters.includeSchemas')
    .optional()
    .isArray().withMessage('includeSchemas必须是数组'),
  
  body('filters.excludeSchemas')
    .optional()
    .isArray().withMessage('excludeSchemas必须是数组'),
  
  body('filters.includeTables')
    .optional()
    .isArray().withMessage('includeTables必须是数组'),
  
  body('filters.excludeTables')
    .optional()
    .isArray().withMessage('excludeTables必须是数组')
];