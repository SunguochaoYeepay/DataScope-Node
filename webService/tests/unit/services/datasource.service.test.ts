import { DataSourceService } from '../../../src/services/datasource.service';
import { ApiError } from '../../../src/utils/error';
import { PrismaClient } from '@prisma/client';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

// 模拟Prisma客户端
const mockPrismaClient = {
  dataSource: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// 模拟数据
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
  };
});

// 模拟加密函数
jest.mock('../../../src/utils/crypto', () => {
  return {
    encryptPassword: jest.fn().mockReturnValue({ hash: 'encrypted-password', salt: 'test-salt' }),
    comparePassword: jest.fn().mockReturnValue(true),
  };
});

describe('DataSourceService', () => {
  let dataSourceService: DataSourceService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    dataSourceService = new DataSourceService();
  });
  
  describe('getAllDataSources', () => {
    it('should return all data sources from database', async () => {
      // 设置模拟返回值
      const mockDataSources = [
        {
          id: '1',
          name: 'Test MySQL',
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'test',
          passwordEncrypted: 'encrypted',
          passwordSalt: 'salt',
          databaseName: 'testdb',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          description: 'Test database',
          connectionParams: {},
          createdBy: 'user1',
          updatedBy: 'user1'
        }
      ];
      
      mockPrismaClient.dataSource.findMany.mockResolvedValue(mockDataSources);
      
      const result = await dataSourceService.getAllDataSources();
      
      expect(mockPrismaClient.dataSource.findMany).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('type');
    });
  });
  
  describe('getDataSourceById', () => {
    it('should return a data source by id', async () => {
      // 设置模拟返回值
      const mockDataSource = {
        id: '1',
        name: 'Test MySQL',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'test',
        passwordEncrypted: 'encrypted',
        passwordSalt: 'salt',
        databaseName: 'testdb',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Test database',
        connectionParams: {},
        createdBy: 'user1',
        updatedBy: 'user1'
      };
      
      mockPrismaClient.dataSource.findUnique.mockResolvedValue(mockDataSource);
      
      const result = await dataSourceService.getDataSourceById('1');
      
      expect(mockPrismaClient.dataSource.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('type');
    });
    
    it('should throw an error for non-existent id', async () => {
      // 设置模拟返回值为null（未找到数据）
      mockPrismaClient.dataSource.findUnique.mockResolvedValue(null);
      
      await expect(dataSourceService.getDataSourceById('999')).rejects.toThrow(ApiError);
    });
  });
  
  describe('createDataSource', () => {
    it('should create a new data source', async () => {
      // 设置模拟返回值
      const mockCreatedDataSource = {
        id: 'new-id',
        name: 'Test Database',
        description: 'Test Description',
        type: 'MYSQL',
        host: 'localhost',
        port: 3306,
        username: 'test_user',
        passwordEncrypted: 'encrypted-password',
        passwordSalt: 'test-salt',
        databaseName: 'test_db',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionParams: {},
        createdBy: 'system',
        updatedBy: 'system'
      };
      
      mockPrismaClient.dataSource.create.mockResolvedValue(mockCreatedDataSource);
      
      const newDataSource = {
        name: 'Test Database',
        description: 'Test Description',
        type: 'MYSQL',
        host: 'localhost',
        port: 3306,
        username: 'test_user',
        password: 'test_password',
        database: 'test_db',
      };
      
      const result = await dataSourceService.createDataSource(newDataSource);
      
      expect(mockPrismaClient.dataSource.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Test Database');
      expect(result).toHaveProperty('type', 'MYSQL');
    });
  });
  
  describe('updateDataSource', () => {
    it('should update an existing data source', async () => {
      // 设置findUnique的模拟返回值（确认数据源存在）
      const existingDataSource = {
        id: '1',
        name: 'Original Name',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'original_user',
        passwordEncrypted: 'encrypted',
        passwordSalt: 'salt',
        databaseName: 'original_db',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Original description',
        connectionParams: {},
        createdBy: 'user1',
        updatedBy: 'user1'
      };
      
      // 设置update的模拟返回值
      const updatedDataSource = {
        ...existingDataSource,
        name: 'Updated Name',
        description: 'Updated description',
        updatedAt: new Date()
      };
      
      mockPrismaClient.dataSource.findUnique.mockResolvedValue(existingDataSource);
      mockPrismaClient.dataSource.update.mockResolvedValue(updatedDataSource);
      
      const updateData = {
        name: 'Updated Name',
        description: 'Updated description'
      };
      
      const result = await dataSourceService.updateDataSource('1', updateData);
      
      expect(mockPrismaClient.dataSource.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(mockPrismaClient.dataSource.update).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('name', 'Updated Name');
      expect(result).toHaveProperty('description', 'Updated description');
    });
    
    it('should throw an error for non-existent id', async () => {
      // 设置模拟返回值为null（未找到数据）
      mockPrismaClient.dataSource.findUnique.mockResolvedValue(null);
      
      await expect(dataSourceService.updateDataSource('999', { name: 'New Name' })).rejects.toThrow(ApiError);
    });
  });
  
  describe('deleteDataSource', () => {
    it('should delete an existing data source', async () => {
      // 设置findUnique的模拟返回值（确认数据源存在）
      const existingDataSource = {
        id: '1',
        name: 'Test MySQL',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'test',
        passwordEncrypted: 'encrypted',
        passwordSalt: 'salt',
        databaseName: 'testdb',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Test database',
        connectionParams: {},
        createdBy: 'user1',
        updatedBy: 'user1'
      };
      
      mockPrismaClient.dataSource.findUnique.mockResolvedValue(existingDataSource);
      mockPrismaClient.dataSource.delete.mockResolvedValue(existingDataSource);
      
      await dataSourceService.deleteDataSource('1');
      
      expect(mockPrismaClient.dataSource.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(mockPrismaClient.dataSource.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });
    
    it('should throw an error for non-existent id', async () => {
      // 设置模拟返回值为null（未找到数据）
      mockPrismaClient.dataSource.findUnique.mockResolvedValue(null);
      
      await expect(dataSourceService.deleteDataSource('999')).rejects.toThrow(ApiError);
    });
  });
}); 