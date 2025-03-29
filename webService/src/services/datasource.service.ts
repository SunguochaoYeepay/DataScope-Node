import { PrismaClient, DataSource } from '@prisma/client';
import { MySQLConnector } from './database/mysql.connector';
import { IDatabaseConnector, DatabaseConnector } from './database/dbInterface';
import { ApiError } from '../utils/error';
import logger from '../utils/logger';
import config from '../config/env';
import { encrypt, decrypt, generateSalt, encryptPassword, comparePassword, verifyPassword } from '../utils/crypto';
import { CreateDataSourceDto, UpdateDataSourceDto, TestConnectionDto } from '../types/datasource';
import { DatabaseType } from '../types/database';
import { DatabaseConnectorFactory } from '../types/database-factory';
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
      // 尝试使用decrypt方法解密
      return decrypt(encryptedPassword, salt);
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

      // 密码加密
      const { hash, salt } = encryptPassword(password);
      
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
    } catch (error: any) {
      logger.error('创建数据源失败', { error });
      throw new ApiError('创建数据源失败', 500, error.message);
    }
  }
  
  /**
   * 获取所有数据源
   */
  async getAllDataSources(): Promise<Omit<DataSource, 'passwordEncrypted' | 'passwordSalt'>[]> {
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
      
      // 如果提供了新密码，重新加密
      if (data.password) {
        const salt = generateSalt();
        updateData.passwordEncrypted = encryptPassword(data.password, salt);
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
    
    // 创建临时连接器
    const connector = DatabaseConnectorFactory.createConnector(
      'temp',
      type.toLowerCase() as DatabaseType,
      {
        host,
        port,
        user: username,
        password,
        database,
      }
    );

    return connector.testConnection();
  }
  
  /**
   * 获取连接器实例
   * @param dataSourceOrId 数据源对象或数据源ID
   * @returns 数据库连接器实例
   */
  async getConnector(dataSourceOrId: DataSource | string): Promise<DatabaseConnector> {
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
}

export default new DataSourceService();