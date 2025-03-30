"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceService = void 0;
const client_1 = require("@prisma/client");
const error_1 = require("../utils/error");
const logger_1 = __importDefault(require("../utils/logger"));
const crypto_1 = require("../utils/crypto");
const database_factory_1 = require("../types/database-factory");
const prisma = new client_1.PrismaClient();
const DEFAULT_DATASOURCE_VALUES = {
    status: 'active'
};
// 连接器缓存
const connectorCache = new Map();
class DataSourceService {
    constructor() {
        this.connectors = new Map();
    }
    /**
     * 解密数据源密码
     * @param encryptedPassword 加密的密码
     * @param salt 盐值
     * @returns 解密后的密码
     */
    decryptPassword(encryptedPassword, salt) {
        try {
            // 尝试使用decrypt方法解密
            return (0, crypto_1.decrypt)(encryptedPassword, salt);
        }
        catch (error) {
            logger_1.default.error('解密数据源密码失败', { error });
            throw new error_1.ApiError('解密数据源密码失败', 500);
        }
    }
    /**
     * 创建数据源
     */
    async createDataSource(data) {
        try {
            const { name, description, type, host, port, username, password, database, connectionParams } = data;
            // 使用可逆加密而非哈希
            const { encrypted, salt } = (0, crypto_1.encrypt)(password);
            return await prisma.dataSource.create({
                data: {
                    name,
                    description,
                    type,
                    host,
                    port,
                    databaseName: database,
                    username,
                    passwordEncrypted: encrypted,
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
            const existingDataSource = await prisma.dataSource.findUnique({
                where: { id }
            });
            if (!existingDataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            const updateData = { ...data };
            // 如果提供了新密码，使用可逆加密而非哈希
            if (data.password) {
                const { encrypted, salt } = (0, crypto_1.encrypt)(data.password);
                updateData.passwordEncrypted = encrypted;
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
            // 检查数据源是否存在
            const dataSource = await prisma.dataSource.findUnique({
                where: { id }
            });
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            // 删除数据源
            await prisma.dataSource.update({
                where: { id },
                data: {
                    active: false,
                    updatedAt: new Date(),
                    updatedBy: 'system'
                }
            });
            // 从连接器缓存中移除（如果存在）
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
     * 根据ID获取数据源（包含密码）
     */
    async getDataSourceByIdWithPassword(id) {
        try {
            const dataSource = await prisma.dataSource.findUnique({
                where: { id }
            });
            if (!dataSource) {
                throw new error_1.ApiError('数据源不存在', 404);
            }
            return dataSource;
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
     * 测试数据源连接
     */
    async testConnection(connectionData) {
        const { type, host, port, username, password, database } = connectionData;
        // 创建临时连接器
        const connector = database_factory_1.DatabaseConnectorFactory.createConnector('temp', type.toLowerCase(), {
            host,
            port,
            user: username,
            password,
            database,
        });
        return connector.testConnection();
    }
    /**
     * 获取连接器实例
     * @param dataSourceOrId 数据源对象或数据源ID
     * @returns 数据库连接器实例
     */
    async getConnector(dataSourceOrId) {
        // 如果传入的是ID，先获取数据源对象（包含密码）
        let dataSource;
        if (typeof dataSourceOrId === 'string') {
            dataSource = await this.getDataSourceByIdWithPassword(dataSourceOrId);
        }
        else {
            dataSource = dataSourceOrId;
        }
        // 获取解密后的密码
        const password = this.decryptPassword(dataSource.passwordEncrypted, dataSource.passwordSalt);
        // 检查缓存中是否有连接器
        if (connectorCache.has(dataSource.id)) {
            logger_1.default.debug('从缓存获取数据库连接器', { dataSourceId: dataSource.id });
            return connectorCache.get(dataSource.id);
        }
        return database_factory_1.DatabaseConnectorFactory.createConnector(dataSource.id, dataSource.type.toLowerCase(), {
            host: dataSource.host,
            port: dataSource.port,
            user: dataSource.username,
            password,
            database: dataSource.databaseName,
        });
    }
}
exports.DataSourceService = DataSourceService;
exports.default = new DataSourceService();
//# sourceMappingURL=datasource.service.js.map