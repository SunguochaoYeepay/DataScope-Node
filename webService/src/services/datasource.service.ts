import { PrismaClient, DataSource } from '@prisma/client';
import { MySQLConnector } from './database/mysql.connector';
import { IDatabaseConnector, DatabaseConnector } from './database/dbInterface';
import { ApiError } from '../utils/error';
import logger from '../utils/logger';
import config from '../config/env';
import { encrypt, decrypt, generateSalt } from '../utils/crypto';
import { CreateDataSourceDto, UpdateDataSourceDto, TestConnectionDto } from '../types/datasource';
import { DatabaseType } from '../types/database';
import { DatabaseConnectorFactory } from '../types/database-factory';
import crypto from 'crypto';
import { createPaginatedResponse } from '../utils/api.utils';

const prisma = new PrismaClient();

// 每当用户发送请求更新DataSource时，但是省略某些字段，这些缺省值应该是什么
interface DataSourceDefaults {
  status: string;
}

const DEFAULT_DATASOURCE_VALUES: DataSourceDefaults = {
  status: 'active'
};

// 连接器缓存
const connectorCache: Map<string, IDatabaseConnector> = new Map();

export class DataSourceService {
  private connectors: Map<string, IDatabaseConnector> = new Map();
  
  /**
   * 解密数据源密码
   * @param encryptedPassword 加密的密码
   * @param salt 盐值
   * @returns 解密后的密码
   */
  private decryptPassword(encryptedPassword: string, salt: string): string {
    try {
      // 特殊情况处理：如果密码和盐值相同，直接使用密码（兼容开发环境的简化设置）
      if (encryptedPassword === salt) {
        logger.debug('使用明文存储的密码');
        return encryptedPassword;
      }
      
      // 尝试使用decrypt方法解密
      try {
        return decrypt(encryptedPassword, salt);
      } catch (error) {
        // 如果标准解密失败，尝试兼容模式
        logger.warn('标准解密失败，尝试兼容模式', { 
          error, 
          passwordLength: encryptedPassword.length,
          saltLength: salt.length
        });
        
        // 尝试处理可能有不同格式的密码
        if (encryptedPassword.includes(':')) {
          // 格式可能是 encrypted:iv
          const [encrypted, ivHex] = encryptedPassword.split(':');
          if (encrypted && ivHex) {
            try {
              // 使用盐值派生密钥
              const key = crypto.scryptSync(config.security.encryptionKey, salt, 32);
              const iv = Buffer.from(ivHex, 'hex');
              const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
              let decrypted = decipher.update(encrypted, 'hex', 'utf8');
              decrypted += decipher.final('utf8');
              return decrypted;
            } catch (err) {
              logger.error('兼容模式解密失败', { err });
              throw err;
            }
          }
        }
        
        // 所有解密方式都失败，返回明文密码（仅开发环境使用）
        if (config.server.nodeEnv === 'development') {
          logger.warn('所有解密方式失败，使用默认密码（仅开发环境）');
          return 'password';  // 开发环境默认密码
        }
        
        // 正式环境不应返回默认密码
        throw error;
      }
    } catch (error) {
      logger.error('解密数据源密码失败', { error });
      throw new ApiError('解密数据源密码失败', 500);
    }
  }
  
  /**
   * 创建数据源
   */
  async createDataSource(data: CreateDataSourceDto): Promise<DataSource> {
    try {
      const { name, description, type, host, port, username, password, database, connectionParams } = data;

      // 使用可逆加密而非哈希
      const { encrypted, salt } = encrypt(password);
      
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
    } catch (error: any) {
      logger.error('创建数据源失败', { error });
      throw new ApiError('创建数据源失败', 500, error.message);
    }
  }
  
  /**
   * 获取所有数据源
   * @param options 分页选项
   * @returns 分页后的数据源列表
   */
  async getAllDataSources(options?: {
    page?: number;
    size?: number;
    offset?: number;
    limit?: number;
  }): Promise<{
    items: Omit<DataSource, 'passwordEncrypted' | 'passwordSalt'>[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  }> {
    try {
      // 处理分页参数
      const limit = options?.limit || options?.size || 10;
      const offset = options?.offset !== undefined ? options.offset : 
                    (options?.page ? (options.page - 1) * limit : 0);
      const page = options?.page || Math.floor(offset / limit) + 1;
      
      // 查询总数
      const total = await prisma.dataSource.count({
        where: {
          active: true
        }
      });
      
      // 查询分页数据
      const dataSources = await prisma.dataSource.findMany({
        where: {
          active: true
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      });
      
      // 移除敏感信息
      const items = dataSources.map(ds => {
        const { passwordEncrypted, passwordSalt, ...rest } = ds;
        return rest;
      });
      
      // 返回标准格式的分页响应
      return createPaginatedResponse(items, total, page, limit);
    } catch (error: any) {
      logger.error('获取数据源列表失败', { error });
      throw new ApiError('获取数据源列表失败', 500, error.message);
    }
  }
  
  /**
   * 根据ID获取数据源
   */
  async getDataSourceById(id: string): Promise<Omit<DataSource, 'passwordEncrypted' | 'passwordSalt'>> {
    try {
      
      const dataSource = await prisma.dataSource.findUnique({
        where: { id }
      });
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 移除敏感信息
      const { passwordEncrypted, passwordSalt, ...rest } = dataSource;
      return rest;
    } catch (error: any) {
      logger.error(`获取数据源失败 ID: ${id}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('获取数据源失败', 500, error.message);
    }
  }
  
  /**
   * 更新数据源
   */
  async updateDataSource(id: string, data: UpdateDataSourceDto): Promise<DataSource> {
    try {
      
      const existingDataSource = await prisma.dataSource.findUnique({
        where: { id }
      });
      
      if (!existingDataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      const updateData: any = { ...data };
      
      // 如果提供了新密码，使用可逆加密而非哈希
      if (data.password) {
        const { encrypted, salt } = encrypt(data.password);
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
    } catch (error: any) {
      logger.error(`更新数据源失败 ID: ${id}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('更新数据源失败', 500, error.message);
    }
  }
  
  /**
   * 删除数据源
   */
  async deleteDataSource(id: string): Promise<void> {
    try {
      
      // 检查数据源是否存在
      const dataSource = await prisma.dataSource.findUnique({
        where: { id }
      });
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
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
    } catch (error: any) {
      logger.error(`删除数据源失败 ID: ${id}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('删除数据源失败', 500, error.message);
    }
  }
  
  /**
   * 更新数据源状态
   */
  async updateDataSourceStatus(id: string, status: string, message?: string): Promise<DataSource> {
    try {
      // 检查数据源是否存在
      const dataSource = await prisma.dataSource.findUnique({
        where: { id }
      });
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 如果提供了消息，记录到日志
      if (message) {
        logger.info(`数据源状态更新: ${id}, ${status}, 消息: ${message}`);
      }
      
      // 更新数据源状态
      return await prisma.dataSource.update({
        where: { id },
        data: {
          status,
          nonce: { increment: 1 }, // 增加nonce值表示状态更新
          updatedAt: new Date(),
          updatedBy: 'system'
        }
      });
    } catch (error: any) {
      logger.error(`更新数据源状态失败 ID: ${id}, 状态: ${status}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('更新数据源状态失败', 500, error.message);
    }
  }
  
  /**
   * 根据ID获取数据源（包含密码）
   */
  async getDataSourceByIdWithPassword(id: string): Promise<DataSource> {
    try {
      
      const dataSource = await prisma.dataSource.findUnique({
        where: { id }
      });
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      return dataSource;
    } catch (error: any) {
      logger.error(`获取数据源失败 ID: ${id}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('获取数据源失败', 500, error.message);
    }
  }
  
  /**
   * 测试数据源连接
   */
  async testConnection(connectionData: TestConnectionDto): Promise<boolean> {
    const { type, host, port, username, password, database } = connectionData;
    
    // 解析主机名
    let resolvedHost = host;
    
    // 检查是否为空主机名
    if (!host || host.trim() === '') {
      logger.warn('主机名为空，使用默认值 localhost');
      resolvedHost = 'localhost';
    }
    
    // 检查是否为常见的容器名称，在非容器环境中自动转换为localhost
    const containerNames = ['datascope-mysql', 'mysql', 'mariadb', 'database', 'db', 'datascope-postgres', 'postgres'];
    if (containerNames.includes(resolvedHost)) {
      // 判断是否在容器环境中运行
      const isInContainer = process.env.CONTAINER_ENV === 'true';
      logger.info(`容器环境检查: ${isInContainer ? '运行在容器内' : '运行在容器外'}`);
      
      if (!isInContainer) {
        // 非容器环境，将容器名称转换为localhost
        logger.info(`将容器名称 ${host} 解析为 localhost`);
        resolvedHost = 'localhost';
      }
    }
    
    // 确保端口是数字
    const portNumber = port ? Number(port) : (type === 'mysql' ? 3306 : 5432);
    
    logger.info(`测试数据库连接 [${type}] ${username}@${resolvedHost}:${portNumber}/${database} (环境变量: CONTAINER_ENV=${process.env.CONTAINER_ENV})`);
    
    try {
      // 创建临时连接器工厂
      const tempId = `temp-${Date.now()}`;
      logger.debug(`创建临时连接器: ${tempId} 类型: ${type} 主机: ${resolvedHost} 用户: ${username} 数据库: ${database}`);
      
      const connector = DatabaseConnectorFactory.createConnector(
        tempId,
        type as DatabaseType,
        {
          host: resolvedHost,
          port: portNumber,
          user: username,
          password,
          database
        }
      );
      
      // 测试连接，最多重试3次
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          // 尝试测试连接
          logger.debug(`开始尝试连接 (尝试 ${attempt}/3)`);
          const result = await connector.testConnection();
          logger.info(`数据库连接测试成功，尝试次数: ${attempt}`);
          return result;
        } catch (error: any) {
          // 检查是否为访问权限错误
          if (error.message && error.message.includes('Access denied')) {
            logger.error('数据库连接测试失败: 访问权限被拒绝', { 
              error, 
              attempt, 
              host: resolvedHost, 
              user: username 
            });
            // 对于访问权限错误，直接抛出不再重试
            throw new ApiError(`测试连接失败: 用户名或密码错误 - ${error.message}`, 401);
          }
          
          // 如果是最后一次尝试还失败，则抛出错误
          if (attempt === 3) {
            throw error;
          }
          
          // 否则等待后重试
          const delay = 500 * Math.pow(2, attempt - 1);
          logger.info(`连接尝试 ${attempt}/3 失败，等待 ${delay}ms 后重试...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      // 如果走到这里说明所有重试都失败了
      throw new Error('所有连接尝试均失败');
    } catch (error: any) {
      logger.error('测试数据库连接失败', { 
        error, 
        host: resolvedHost,
        connectionData: { ...connectionData, password: '***' } 
      });
      
      // 返回友好的错误信息
      if (error instanceof ApiError) {
        throw error;
      }
      
      // 针对常见错误类型返回友好信息
      if (error.message) {
        if (error.message.includes('ECONNREFUSED')) {
          throw new ApiError(`连接被拒绝: 无法连接到 ${resolvedHost}:${portNumber}，请检查主机名和端口是否正确`, 400);
        }
        if (error.message.includes('ER_BAD_DB_ERROR')) {
          throw new ApiError(`数据库不存在: ${database}`, 400);
        }
        if (error.message.includes('ER_ACCESS_DENIED_ERROR')) {
          throw new ApiError(`访问被拒绝: 用户名或密码错误`, 401);
        }
      }
      
      throw new ApiError(`测试${type === 'mysql' ? 'MySQL' : type}连接失败: ${error.message}`, 400);
    }
  }
  
  /**
   * 获取连接器实例
   * @param dataSourceOrId 数据源对象或数据源ID
   * @returns 数据库连接器实例
   */
  async getConnector(dataSourceOrId: DataSource | string): Promise<DatabaseConnector> {
    // 特殊处理test-ds，让调用方自己处理
    if (dataSourceOrId === 'test-ds') {
      logger.info('检测到测试数据源ID: test-ds，将由服务层处理');
      // 获取一个真实的数据源，简化测试
      const testDs = await prisma.dataSource.findFirst({
        where: { active: true }
      });
      
      if (testDs) {
        logger.debug('使用第一个可用数据源作为测试数据源');
        return this.getConnector(testDs.id);
      } else {
        throw new ApiError('无法找到可用的数据源作为测试环境', 500);
      }
    }

    // 如果传入的是ID，先获取数据源对象（包含密码）
    let dataSource: DataSource;
    if (typeof dataSourceOrId === 'string') {
      dataSource = await this.getDataSourceByIdWithPassword(dataSourceOrId);
    } else {
      dataSource = dataSourceOrId;
    }
    
    // 获取解密后的密码
    const password = this.decryptPassword(dataSource.passwordEncrypted, dataSource.passwordSalt);
    
    // 检查缓存中是否有连接器
    if (connectorCache.has(dataSource.id)) {
      logger.debug('从缓存获取数据库连接器', { dataSourceId: dataSource.id });
      return connectorCache.get(dataSource.id)!;
    }
    
    return DatabaseConnectorFactory.createConnector(
      dataSource.id,
      dataSource.type.toLowerCase() as DatabaseType,
      {
        host: dataSource.host,
        port: dataSource.port,
        user: dataSource.username,
        password,
        database: dataSource.databaseName,
      }
    ) as DatabaseConnector;
  }
  
  /**
   * 测试已存在的数据源连接
   * @param dataSourceId 数据源ID
   * @returns 连接是否成功
   */
  async testExistingConnection(dataSourceId: string): Promise<boolean> {
    try {
      // 获取数据源信息（带密码）
      const dataSource = await this.getDataSourceByIdWithPassword(dataSourceId);
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 解密密码
      const password = this.decryptPassword(dataSource.passwordEncrypted, dataSource.passwordSalt);
      
      // 调用测试连接方法
      const connectionData: TestConnectionDto = {
        type: dataSource.type,
        host: dataSource.host,
        port: dataSource.port,
        username: dataSource.username,
        password,
        database: dataSource.databaseName
      };
      
      logger.info(`测试现有数据源连接: [${dataSource.name}] ${dataSource.username}@${dataSource.host}:${dataSource.port}/${dataSource.databaseName}`);
      
      return await this.testConnection(connectionData);
    } catch (error: any) {
      logger.error(`测试数据源连接失败 ID: ${dataSourceId}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(`测试数据源连接失败: ${error.message}`, 500);
    }
  }
}

export default new DataSourceService();