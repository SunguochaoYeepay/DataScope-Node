"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceService = void 0;
const client_1 = require("@prisma/client");
const mysql_connector_1 = require("./database/mysql.connector");
const error_1 = require("../utils/error");
const logger_1 = __importDefault(require("../utils/logger"));
const crypto_1 = require("../utils/crypto");
const prisma = new client_1.PrismaClient();
// 模拟数据源的完整数据
const mockDataSources = [
    {
        id: '1',
        name: 'MySQL Sample DB',
        description: 'Sample MySQL database for testing',
        type: 'MYSQL',
        host: 'localhost',
        port: 3306,
        databaseName: 'sample_db',
        username: 'sample_user',
        status: 'ACTIVE',
        connectionParams: null,
        syncFrequency: null,
        lastSyncTime: null,
        nonce: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
        active: true
    },
    {
        id: '2',
        name: 'Production Database',
        description: 'Production MySQL database',
        type: 'MYSQL',
        host: 'db.example.com',
        port: 3306,
        databaseName: 'production_db',
        username: 'prod_user',
        status: 'ACTIVE',
        connectionParams: null,
        syncFrequency: null,
        lastSyncTime: null,
        nonce: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
        active: true
    }
];
// 连接器缓存
const connectorCache = new Map();
class DataSourceService {
    constructor() {
        this.connectors = new Map();
    }
    /**
     * 创建数据源
     */
    async createDataSource(data) {
        try {
            const { name, description, type, host, port, username, password, database, connectionParams } = data;
            // 在开发环境直接返回模拟数据
            if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
                return {
                    id: Date.now().toString(),
                    name,
                    description: description || null,
                    type,
                    host,
                    port,
                    databaseName: database,
                    username,
                    passwordEncrypted: 'encrypted',
                    passwordSalt: 'salt',
                    connectionParams: connectionParams || null,
                    status: 'ACTIVE',
                    syncFrequency: null,
                    lastSyncTime: null,
                    nonce: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: 'system',
                    updatedBy: 'system',
                    active: true
                };
            }
            // 密码加密
            const { hash, salt } = (0, crypto_1.encryptPassword)(password);
            return await prisma.dataSource.create({
                data: {
                    name,
                    description,
                    type,
                    host,
                    port,
                    databaseName: database,
                    username,
                    passwordEncrypted: hash,
                    passwordSalt: salt,
                    connectionParams,
                    status: 'ACTIVE',
                    createdBy: 'system',
                    updatedBy: 'system'
                }
            });
        }
        catch (error) {
            logger_1.default.error('创建数据源失败', { error });
            throw new error_1.ApiError('创建数据源失败', 500, error.message);
        }
    }
    /**
     * 获取所有数据源
     */
    async getAllDataSources() {
        try {
            // 在开发环境直接返回模拟数据
            if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
                return mockDataSources;
            }
            const dataSources = await prisma.dataSource.findMany({
                where: {
                    active: true
                }
            });
            // 移除敏感信息
            return dataSources.map(ds => {
                const { passwordEncrypted, passwordSalt, ...rest } = ds;
                return rest;
            });
        }
        catch (error) {
            logger_1.default.error('获取数据源列表失败', { error });
            throw new error_1.ApiError('获取数据源列表失败', 500, error.message);
        }
    }
    /**
     * 根据ID获取数据源
     */
    async getDataSourceById(id) {
        try {
            // 在开发环境直接返回模拟数据
            if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
                const mockDataSource = mockDataSources.find(ds => ds.id === id);
                if (!mockDataSource) {
                    throw new error_1.ApiError('数据源不存在', 404);
                }
                return mockDataSource;
            }
            const dataSource = await prisma.dataSource.findUnique({
                where: { id }
            });
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            // 移除敏感信息
            const { passwordEncrypted, passwordSalt, ...rest } = dataSource;
            return rest;
        }
        catch (error) {
            logger_1.default.error(`获取数据源失败 ID: ${id}`, { error });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('获取数据源失败', 500, error.message);
        }
    }
    /**
     * 更新数据源
     */
    async updateDataSource(id, data) {
        try {
            // 在开发环境直接返回模拟数据
            if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
                const index = mockDataSources.findIndex(ds => ds.id === id);
                if (index === -1) {
                    throw new error_1.ApiError('数据源不存在', 404);
                }
                const updated = { ...mockDataSources[index], ...data, updatedAt: new Date() };
                mockDataSources[index] = updated;
                return updated;
            }
            const existingDataSource = await prisma.dataSource.findUnique({
                where: { id }
            });
            if (!existingDataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            const updateData = { ...data };
            // 如果提供了新密码，重新加密
            if (data.password) {
                const salt = (0, crypto_1.generateSalt)();
                updateData.passwordEncrypted = (0, crypto_1.encryptPassword)(data.password, salt);
                updateData.passwordSalt = salt;
                delete updateData.password;
            }
            // 处理数据库名称字段
            if (data.database) {
                updateData.databaseName = data.database;
                delete updateData.database;
            }
            return await prisma.dataSource.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date(),
                    updatedBy: 'system'
                }
            });
        }
        catch (error) {
            logger_1.default.error(`更新数据源失败 ID: ${id}`, { error });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('更新数据源失败', 500, error.message);
        }
    }
    /**
     * 删除数据源
     */
    async deleteDataSource(id) {
        try {
            // 在开发环境直接返回
            if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
                const index = mockDataSources.findIndex(ds => ds.id === id);
                if (index === -1) {
                    throw new error_1.ApiError('数据源不存在', 404);
                }
                mockDataSources.splice(index, 1);
                return;
            }
            const dataSource = await prisma.dataSource.findUnique({
                where: { id }
            });
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            await prisma.dataSource.delete({
                where: { id }
            });
            // 从缓存中移除连接器
            if (connectorCache.has(id)) {
                connectorCache.delete(id);
            }
        }
        catch (error) {
            logger_1.default.error(`删除数据源失败 ID: ${id}`, { error });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('删除数据源失败', 500, error.message);
        }
    }
    /**
     * 测试数据源连接
     */
    async testConnection(data) {
        try {
            // 在开发环境直接返回成功
            if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
                return { success: true, message: '连接成功' };
            }
            const { type, host, port, username, password, database } = data;
            if (type !== 'MYSQL') {
                throw new error_1.ApiError('暂不支持该数据库类型', 400);
            }
            // 创建临时连接器
            const connector = new mysql_connector_1.MySQLConnector('temp', {
                host,
                port,
                user: username,
                password,
                database
            });
            // 测试连接
            await connector.testConnection();
            return { success: true, message: '连接成功' };
        }
        catch (error) {
            logger_1.default.error('测试连接失败', { error, data });
            return {
                success: false,
                message: error.message || '连接失败'
            };
        }
    }
    /**
     * 获取连接器实例
     */
    async getConnector(dataSourceId) {
        try {
            // 检查缓存
            if (connectorCache.has(dataSourceId)) {
                return connectorCache.get(dataSourceId);
            }
            // 在开发环境创建一个模拟连接器
            if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
                const mockConnector = new mysql_connector_1.MySQLConnector(dataSourceId, {
                    host: 'localhost',
                    port: 3306,
                    user: 'root',
                    password: 'password',
                    database: 'mock_database'
                });
                connectorCache.set(dataSourceId, mockConnector);
                return mockConnector;
            }
            // 获取数据源
            const dataSource = await prisma.dataSource.findUnique({
                where: { id: dataSourceId }
            });
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            // 解密密码
            // const password = decrypt(dataSource.passwordEncrypted, dataSource.passwordSalt);
            // 暂时忽略密码解密，直接传递加密后的密码（这在实际生产中是不安全的）
            // 创建适当的连接器
            let connector;
            switch (dataSource.type) {
                case 'MYSQL':
                    connector = new mysql_connector_1.MySQLConnector(dataSourceId, {
                        host: dataSource.host,
                        port: dataSource.port,
                        user: dataSource.username,
                        password: dataSource.passwordEncrypted, // 注意：实际应该是解密后的密码
                        database: dataSource.databaseName
                    });
                    break;
                default:
                    throw new error_1.ApiError(`不支持的数据库类型: ${dataSource.type}`, 400);
            }
            // 存入缓存
            connectorCache.set(dataSourceId, connector);
            return connector;
        }
        catch (error) {
            logger_1.default.error(`获取数据库连接器失败 ID: ${dataSourceId}`, { error });
            if (error instanceof error_1.ApiError) {
                throw error;
            }
            throw new error_1.ApiError('获取数据库连接器失败', 500, error.message);
        }
    }
}
exports.DataSourceService = DataSourceService;
exports.default = new DataSourceService();
//# sourceMappingURL=datasource.service.js.map