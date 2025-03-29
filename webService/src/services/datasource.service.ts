import { PrismaClient, DataSource } from '@prisma/client';
import { MySQLConnector } from './database/mysql.connector';
import { DatabaseConnector } from '../types/datasource';
import { ApiError } from '../utils/error';
import logger from '../utils/logger';
import config from '../config/env';
import { encrypt, decrypt, generateSalt } from '../utils/crypto';

const prisma = new PrismaClient();

export class DataSourceService {
  private connectors: Map<string, DatabaseConnector> = new Map();
  
  /**
   * 创建数据源
   */
  async createDataSource(data: {
    name: string;
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    description?: string;
    active?: boolean;
    tags?: string[];
  }): Promise<Omit<DataSource, 'passwordEncrypted' | 'passwordSalt'>> {
    try {
      // 使用真实的加密逻辑处理密码
      const salt = generateSalt();
      const { encrypted: encryptedPassword } = encrypt(data.password, salt);
      
      // 创建数据源记录
      const createdDataSource = await prisma.dataSource.create({
        data: {
          name: data.name,
          type: data.type,
          host: data.host,
          port: data.port,
          username: data.username,
          passwordEncrypted: encryptedPassword,
          passwordSalt: salt,
          databaseName: data.database,
          description: data.description || '',
          status: data.active !== undefined ? (data.active ? 'ACTIVE' : 'INACTIVE') : 'ACTIVE',
          syncFrequency: 'MANUAL',
          connectionParams: {},
        },
      });
      
      // 尝试测试连接
      try {
        const connector = this.createConnector(
          createdDataSource.id,
          data.type,
          {
            host: data.host,
            port: data.port,
            user: data.username,
            password: data.password,
            database: data.database,
          }
        );
        
        await connector.testConnection();
      } catch (error: any) {
        // 如果连接测试失败，删除数据源记录
        await prisma.dataSource.delete({
          where: { id: createdDataSource.id },
        });
        
        throw new ApiError('数据源连接测试失败', 400, { message: error?.message || '未知错误' });
      }
      
      // 不返回敏感信息
      const { passwordEncrypted, passwordSalt, ...safeDataSource } = createdDataSource;
      return safeDataSource;
    } catch (error: any) {
      logger.error('创建数据源失败', { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('创建数据源失败', 500, { message: error?.message || '未知错误' });
    }
  }
  
  /**
   * 获取所有数据源
   */
  async getAllDataSources(): Promise<Omit<DataSource, 'passwordEncrypted' | 'passwordSalt'>[]> {
    try {
      const dataSources = await prisma.dataSource.findMany({
        where: { status: 'ACTIVE' }
      });
      
      // 不返回敏感信息
      return dataSources.map(ds => {
        const { passwordEncrypted, passwordSalt, ...safeDs } = ds;
        return safeDs;
      });
    } catch (error: any) {
      logger.error('获取数据源列表失败', { error });
      throw new ApiError('获取数据源列表失败', 500, { message: error?.message || '未知错误' });
    }
  }
  
  /**
   * 根据ID获取数据源
   */
  async getDataSourceById(id: string): Promise<Omit<DataSource, 'passwordEncrypted' | 'passwordSalt'>> {
    try {
      const dataSource = await prisma.dataSource.findUnique({
        where: { id },
      });
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 不返回敏感信息
      const { passwordEncrypted, passwordSalt, ...safeDataSource } = dataSource;
      return safeDataSource;
    } catch (error: any) {
      logger.error('获取数据源详情失败', { error, id });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取数据源详情失败', 500, { message: error?.message || '未知错误' });
    }
  }
  
  /**
   * 更新数据源
   */
  async updateDataSource(id: string, data: {
    name?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
    description?: string;
    active?: boolean;
    tags?: string[];
  }): Promise<Omit<DataSource, 'passwordEncrypted' | 'passwordSalt'>> {
    try {
      // 首先检查数据源是否存在
      const existingDataSource = await prisma.dataSource.findUnique({
        where: { id },
      });
      
      if (!existingDataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 准备更新数据
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.host !== undefined) updateData.host = data.host;
      if (data.port !== undefined) updateData.port = data.port;
      if (data.username !== undefined) updateData.username = data.username;
      if (data.database !== undefined) updateData.databaseName = data.database;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.active !== undefined) {
        updateData.status = data.active ? 'ACTIVE' : 'INACTIVE';
      }
      
      // 密码单独处理，使用加密工具加密存储
      if (data.password) {
        const salt = generateSalt();
        const { encrypted: encryptedPassword } = encrypt(data.password, salt);
        
        updateData.passwordEncrypted = encryptedPassword;
        updateData.passwordSalt = salt;
      }
      
      // 更新数据源
      const updatedDataSource = await prisma.dataSource.update({
        where: { id },
        data: updateData,
      });
      
      // 如果更新了连接相关信息，需要重新测试连接
      if (
        data.host !== undefined ||
        data.port !== undefined ||
        data.username !== undefined ||
        data.password !== undefined ||
        data.database !== undefined
      ) {
        // 移除现有连接器
        this.connectors.delete(id);
        
        // 尝试测试连接
        try {
          const connector = this.createConnector(
            id,
            existingDataSource.type,
            {
              host: data.host || existingDataSource.host,
              port: data.port || existingDataSource.port,
              user: data.username || existingDataSource.username,
              password: data.password || '', // 这里需要客户端传入完整密码
              database: data.database || existingDataSource.databaseName,
            }
          );
          
          await connector.testConnection();
        } catch (error: any) {
          throw new ApiError('数据源连接测试失败', 400, { message: error?.message || '未知错误' });
        }
      }
      
      // 不返回敏感信息
      const { passwordEncrypted, passwordSalt, ...safeDataSource } = updatedDataSource;
      return safeDataSource;
    } catch (error: any) {
      logger.error('更新数据源失败', { error, id });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('更新数据源失败', 500, { message: error?.message || '未知错误' });
    }
  }
  
  /**
   * 删除数据源
   */
  async deleteDataSource(id: string): Promise<void> {
    try {
      // 先检查数据源是否存在
      const dataSource = await prisma.dataSource.findUnique({
        where: { id },
      });
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 移除连接器
      this.connectors.delete(id);
      
      // 删除数据源
      await prisma.dataSource.delete({
        where: { id },
      });
    } catch (error: any) {
      logger.error('删除数据源失败', { error, id });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('删除数据源失败', 500, { message: error?.message || '未知错误' });
    }
  }
  
  /**
   * 测试数据源连接
   */
  async testConnection(data: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const connector = this.createConnector(
        'temp', // 临时ID
        data.type,
        {
          host: data.host,
          port: data.port,
          user: data.username,
          password: data.password,
          database: data.database,
        }
      );
      
      await connector.testConnection();
      
      return {
        success: true,
        message: '连接成功',
      };
    } catch (error: any) {
      logger.error('测试连接失败', { error, data });
      return {
        success: false,
        message: error?.message || '连接失败',
      };
    }
  }
  
  /**
   * 获取连接器实例
   */
  async getConnector(dataSourceId: string): Promise<DatabaseConnector> {
    // 如果已有连接器实例，直接返回
    if (this.connectors.has(dataSourceId)) {
      return this.connectors.get(dataSourceId)!;
    }
    
    // 获取数据源信息
    const dataSource = await prisma.dataSource.findUnique({
      where: { id: dataSourceId },
    });
    
    if (!dataSource) {
      throw new ApiError('数据源不存在', 404);
    }
    
    if (dataSource.status !== 'ACTIVE') {
      throw new ApiError('数据源未激活', 400);
    }
    
    // 使用加密工具解密密码
    const password = decrypt(dataSource.passwordEncrypted, dataSource.passwordSalt);
    
    // 创建对应类型的连接器
    const connector = this.createConnector(
      dataSourceId,
      dataSource.type,
      {
        host: dataSource.host,
        port: dataSource.port,
        user: dataSource.username,
        password: password,
        database: dataSource.databaseName,
      }
    );
    
    // 缓存连接器实例
    this.connectors.set(dataSourceId, connector);
    
    return connector;
  }
  
  /**
   * 根据类型创建连接器
   */
  private createConnector(
    id: string,
    type: string,
    config: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    }
  ): DatabaseConnector {
    // 根据类型创建对应的连接器
    switch (type.toLowerCase()) {
      case 'mysql':
        return new MySQLConnector(id, config);
      default:
        throw new ApiError(`不支持的数据源类型: ${type}`, 400);
    }
  }
}

export default new DataSourceService();