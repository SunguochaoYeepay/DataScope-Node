// 将测试文件使用JavaScript编写，避免类型问题
const metadataService = require('../../../src/services/metadata.service').default;
const dataSourceService = require('../../../src/services/datasource.service').default;
const { PrismaClient } = require('@prisma/client');
const { ApiError } = require('../../../src/utils/error');
const { jest } = require('@jest/globals');

// 模拟PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    metadataSync: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn()
    },
    metadataStructure: {
      upsert: jest.fn(),
      findFirst: jest.fn()
    },
    $transaction: jest.fn(callback => callback())
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// 模拟dataSourceService
jest.mock('../../../src/services/datasource.service', () => {
  return {
    __esModule: true,
    default: {
      getDataSourceById: jest.fn(),
      getConnector: jest.fn()
    }
  };
});

describe('MetadataService', () => {
  let mockPrismaClient;
  
  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
    
    // 获取模拟的PrismaClient实例
    mockPrismaClient = new PrismaClient();
  });
  
  describe('syncMetadata', () => {
    it('应当成功同步元数据', async () => {
      // 准备测试数据
      const dataSourceId = 'test-ds-id';
      const mockDataSource = {
        id: dataSourceId,
        name: 'Test DB',
        type: 'mysql'
      };
      
      const mockConnector = {
        getDatabases: jest.fn().mockResolvedValue(['test_db']),
        getTables: jest.fn().mockResolvedValue(['users', 'orders']),
        getColumns: jest.fn().mockResolvedValue([
          { name: 'id', type: 'int', nullable: false, isPrimary: true },
          { name: 'name', type: 'varchar', nullable: true, isPrimary: false }
        ]),
        getIndexes: jest.fn().mockResolvedValue([
          { name: 'PRIMARY', columns: ['id'], unique: true }
        ])
      };
      
      const mockSyncRecord = {
        id: 'sync-id',
        dataSourceId,
        status: 'COMPLETED',
        startTime: new Date(),
        endTime: new Date(),
        objectCount: 3
      };
      
      // 设置模拟返回值
      dataSourceService.getDataSourceById.mockResolvedValue(mockDataSource);
      dataSourceService.getConnector.mockResolvedValue(mockConnector);
      mockPrismaClient.metadataSync.create.mockResolvedValue(mockSyncRecord);
      mockPrismaClient.metadataStructure.upsert.mockResolvedValue({});
      
      // 执行测试
      const result = await metadataService.syncMetadata(dataSourceId);
      
      // 验证
      expect(dataSourceService.getDataSourceById).toHaveBeenCalledWith(dataSourceId);
      expect(dataSourceService.getConnector).toHaveBeenCalledWith(dataSourceId);
      expect(mockConnector.getDatabases).toHaveBeenCalled();
      expect(mockConnector.getTables).toHaveBeenCalled();
      expect(mockConnector.getColumns).toHaveBeenCalled();
      expect(mockPrismaClient.metadataSync.create).toHaveBeenCalled();
      expect(mockPrismaClient.metadataStructure.upsert).toHaveBeenCalled();
      expect(result).toEqual(mockSyncRecord);
    });
    
    it('应当处理数据源不存在的情况', async () => {
      // 设置模拟返回值
      dataSourceService.getDataSourceById.mockResolvedValue(null);
      
      // 执行测试并验证抛出异常
      await expect(metadataService.syncMetadata('invalid-ds-id')).rejects.toThrow(ApiError);
      
      // 验证
      expect(dataSourceService.getDataSourceById).toHaveBeenCalledWith('invalid-ds-id');
      expect(dataSourceService.getConnector).not.toHaveBeenCalled();
      expect(mockPrismaClient.metadataSync.create).not.toHaveBeenCalled();
    });
    
    it('应当处理同步过程中的错误', async () => {
      // 准备测试数据
      const dataSourceId = 'test-ds-id';
      const mockDataSource = {
        id: dataSourceId,
        name: 'Test DB',
        type: 'mysql'
      };
      
      const mockConnector = {
        getDatabases: jest.fn().mockRejectedValue(new Error('Database error'))
      };
      
      const mockSyncRecord = {
        id: 'sync-id',
        dataSourceId,
        status: 'FAILED',
        startTime: new Date(),
        endTime: new Date(),
        errorMessage: 'Database error'
      };
      
      // 设置模拟返回值
      dataSourceService.getDataSourceById.mockResolvedValue(mockDataSource);
      dataSourceService.getConnector.mockResolvedValue(mockConnector);
      mockPrismaClient.metadataSync.create.mockResolvedValue({ id: 'sync-id', status: 'RUNNING' });
      mockPrismaClient.metadataSync.update = jest.fn().mockResolvedValue(mockSyncRecord);
      
      // 执行测试并验证抛出异常
      await expect(metadataService.syncMetadata(dataSourceId)).rejects.toThrow(ApiError);
      
      // 验证
      expect(dataSourceService.getDataSourceById).toHaveBeenCalledWith(dataSourceId);
      expect(dataSourceService.getConnector).toHaveBeenCalledWith(dataSourceId);
      expect(mockConnector.getDatabases).toHaveBeenCalled();
      expect(mockPrismaClient.metadataSync.create).toHaveBeenCalled();
      expect(mockPrismaClient.metadataSync.update).toHaveBeenCalled();
    });
  });
  
  describe('getMetadataStructure', () => {
    it('应当返回数据库元数据结构', async () => {
      // 准备测试数据
      const dataSourceId = 'test-ds-id';
      const mockStructure = {
        id: 'structure-id',
        dataSourceId,
        structure: JSON.stringify({
          schemas: [
            {
              name: 'test_db',
              tables: [
                {
                  name: 'users',
                  columns: [
                    { name: 'id', type: 'int' },
                    { name: 'name', type: 'varchar' }
                  ]
                }
              ]
            }
          ]
        })
      };
      
      // 设置模拟返回值
      mockPrismaClient.metadataStructure.findFirst.mockResolvedValue(mockStructure);
      
      // 执行测试
      const result = await metadataService.getMetadataStructure(dataSourceId);
      
      // 验证
      expect(mockPrismaClient.metadataStructure.findFirst).toHaveBeenCalledWith({
        where: { dataSourceId }
      });
      expect(result).toEqual(JSON.parse(mockStructure.structure));
    });
    
    it('应当处理元数据结构不存在的情况', async () => {
      // 设置模拟返回值
      mockPrismaClient.metadataStructure.findFirst.mockResolvedValue(null);
      
      // 执行测试
      const result = await metadataService.getMetadataStructure('non-existent-ds-id');
      
      // 验证
      expect(mockPrismaClient.metadataStructure.findFirst).toHaveBeenCalled();
      expect(result).toEqual({ schemas: [] });
    });
    
    it('应当处理元数据结构解析错误', async () => {
      // 准备测试数据
      const dataSourceId = 'test-ds-id';
      const mockStructure = {
        id: 'structure-id',
        dataSourceId,
        structure: 'invalid-json'
      };
      
      // 设置模拟返回值
      mockPrismaClient.metadataStructure.findFirst.mockResolvedValue(mockStructure);
      
      // 执行测试并验证抛出异常
      await expect(metadataService.getMetadataStructure(dataSourceId)).rejects.toThrow();
    });
  });
  
  describe('getSyncHistory', () => {
    it('应当返回元数据同步历史记录', async () => {
      // 准备测试数据
      const dataSourceId = 'test-ds-id';
      const limit = 10;
      const offset = 0;
      
      const mockHistory = [
        {
          id: 'sync-1',
          dataSourceId,
          status: 'COMPLETED',
          startTime: new Date(),
          endTime: new Date(),
          objectCount: 10
        },
        {
          id: 'sync-2',
          dataSourceId,
          status: 'FAILED',
          startTime: new Date(),
          endTime: new Date(),
          errorMessage: 'Database error'
        }
      ];
      
      // 设置模拟返回值
      mockPrismaClient.metadataSync.findMany.mockResolvedValue(mockHistory);
      mockPrismaClient.metadataSync.count.mockResolvedValue(2);
      
      // 执行测试
      const result = await metadataService.getSyncHistory(dataSourceId, limit, offset);
      
      // 验证
      expect(mockPrismaClient.metadataSync.findMany).toHaveBeenCalledWith({
        where: { dataSourceId },
        orderBy: { startTime: 'desc' },
        take: limit,
        skip: offset
      });
      expect(mockPrismaClient.metadataSync.count).toHaveBeenCalledWith({
        where: { dataSourceId }
      });
      expect(result).toEqual({
        history: mockHistory,
        total: 2,
        limit,
        offset
      });
    });
    
    it('应当处理查询同步历史记录失败的情况', async () => {
      // 设置模拟抛出错误
      mockPrismaClient.metadataSync.findMany.mockRejectedValue(new Error('Database error'));
      
      // 执行测试并验证抛出异常
      await expect(metadataService.getSyncHistory('test-ds-id')).rejects.toThrow(ApiError);
    });
  });
});