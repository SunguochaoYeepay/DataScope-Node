import { QueryService } from '../../../src/services/query.service';
import { ApiError } from '../../../src/utils/error';
import { PrismaClient, Query, QueryHistory } from '@prisma/client';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import dataSourceService from '../../../src/services/datasource.service';
import logger from '../../../src/utils/logger';

// 首先定义mockPrismaClient
const mockPrismaClient = {
  queryHistory: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn()
  },
  queryPlan: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn()
  },
  savedQuery: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

// 模拟PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
  };
});

// 模拟数据源服务
jest.mock('../../../src/services/datasource.service', () => {
  return {
    __esModule: true,
    default: {
      getConnector: jest.fn(),
      getDataSourceById: jest.fn()
    }
  };
});

// 模拟日志服务
jest.mock('../../../src/utils/logger', () => {
  return {
    __esModule: true,
    default: {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn()
    }
  };
});

describe('QueryService', () => {
  let queryService: QueryService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    queryService = new QueryService();
  });
  
  describe('executeQuery', () => {
    it('should execute a query and update history', async () => {
      // 模拟数据
      const mockConnector = {
        executeQuery: jest.fn().mockResolvedValue({
          rows: [{ id: 1, name: 'Test' }],
          fields: [{ name: 'id' }, { name: 'name' }]
        })
      };
      
      const mockQueryHistory = {
        id: 'query-history-id',
        dataSourceId: 'data-source-id',
        sqlContent: 'SELECT * FROM test',
        status: 'RUNNING',
        startTime: new Date()
      };
      
      // 设置模拟返回值
      (dataSourceService.getConnector as jest.Mock).mockResolvedValue(mockConnector as any);
      (mockPrismaClient.queryHistory.create as jest.Mock).mockResolvedValue(mockQueryHistory as any);
      (mockPrismaClient.queryHistory.update as jest.Mock).mockResolvedValue({
        ...mockQueryHistory,
        status: 'COMPLETED',
        endTime: new Date(),
        duration: 100,
        rowCount: 1
      } as any);
      
      // 执行测试
      const result = await queryService.executeQuery(
        'data-source-id',
        'SELECT * FROM test'
      );
      
      // 验证结果
      expect(dataSourceService.getConnector).toHaveBeenCalledWith('data-source-id');
      expect(mockPrismaClient.queryHistory.create).toHaveBeenCalled();
      expect(mockConnector.executeQuery).toHaveBeenCalledWith(
        'SELECT * FROM test',
        [],
        'query-history-id',
        undefined
      );
      expect(mockPrismaClient.queryHistory.update).toHaveBeenCalled();
      expect(result).toEqual({
        rows: [{ id: 1, name: 'Test' }],
        fields: [{ name: 'id' }, { name: 'name' }]
      });
    });
    
    it('should handle query execution error', async () => {
      // 模拟数据
      const mockConnector = {
        executeQuery: jest.fn().mockRejectedValue(new Error('Query execution failed') as never)
      };
      
      const mockQueryHistory = {
        id: 'query-history-id',
        dataSourceId: 'data-source-id',
        sqlContent: 'SELECT * FROM test',
        status: 'RUNNING',
        startTime: new Date()
      };
      
      // 设置模拟返回值
      (dataSourceService.getConnector as jest.Mock).mockResolvedValue(mockConnector as any);
      (mockPrismaClient.queryHistory.create as jest.Mock).mockResolvedValue(mockQueryHistory as any);
      
      // 执行测试并期望抛出错误
      await expect(
        queryService.executeQuery('data-source-id', 'SELECT * FROM test')
      ).rejects.toThrow(ApiError);
      
      // 验证
      expect(dataSourceService.getConnector).toHaveBeenCalledWith('data-source-id');
      expect(mockPrismaClient.queryHistory.create).toHaveBeenCalled();
      expect(mockConnector.executeQuery).toHaveBeenCalledWith(
        'SELECT * FROM test',
        [],
        'query-history-id',
        undefined
      );
      expect(mockPrismaClient.queryHistory.update).toHaveBeenCalledWith({
        where: { id: 'query-history-id' },
        data: expect.objectContaining({
          status: 'FAILED',
          errorMessage: 'Query execution failed'
        })
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
  
  describe('getQueryHistory', () => {
    it('should return query history with pagination', async () => {
      // 模拟数据
      const mockHistoryItems = [
        {
          id: 'history-1',
          dataSourceId: 'data-source-id',
          sqlContent: 'SELECT * FROM test1',
          status: 'COMPLETED',
          startTime: new Date(),
          endTime: new Date(),
          duration: 100
        },
        {
          id: 'history-2',
          dataSourceId: 'data-source-id',
          sqlContent: 'SELECT * FROM test2',
          status: 'COMPLETED',
          startTime: new Date(),
          endTime: new Date(),
          duration: 150
        }
      ];
      
      // 设置模拟返回值
      (mockPrismaClient.queryHistory.findMany as jest.Mock).mockResolvedValue(mockHistoryItems as QueryHistory[]);
      (mockPrismaClient.queryHistory.count as jest.Mock).mockResolvedValue(10 as never);
      
      // 执行测试
      const result = await queryService.getQueryHistory('data-source-id', 2, 0);
      
      // 验证结果
      expect(mockPrismaClient.queryHistory.findMany).toHaveBeenCalledWith({
        where: { dataSourceId: 'data-source-id' },
        orderBy: { startTime: 'desc' },
        skip: 0,
        take: 2
      });
      expect(mockPrismaClient.queryHistory.count).toHaveBeenCalledWith({
        where: { dataSourceId: 'data-source-id' }
      });
      expect(result).toEqual({
        history: mockHistoryItems,
        total: 10,
        limit: 2,
        offset: 0
      });
    });
    
    it('should handle errors when fetching query history', async () => {
      // 设置模拟抛出错误
      (mockPrismaClient.queryHistory.findMany as jest.Mock).mockRejectedValue(new Error('Database error') as never);
      
      // 执行测试并期望抛出错误
      await expect(queryService.getQueryHistory('data-source-id')).rejects.toThrow(ApiError);
      
      // 验证
      expect(logger.error).toHaveBeenCalled();
    });
  });
  
  describe('saveQuery', () => {
    it('should save a query', async () => {
      // 模拟数据
      const queryData = {
        name: 'Test Query',
        dataSourceId: 'data-source-id',
        sql: 'SELECT * FROM users',
        description: 'Query Description',
        tags: ['test', 'users'],
        isPublic: true
      };
      
      const savedQuery = {
        id: 'query-id',
        name: 'Test Query',
        dataSourceId: 'data-source-id',
        sqlContent: 'SELECT * FROM users',
        description: 'Query Description',
        tags: 'test,users',
        status: 'PUBLISHED',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // 设置模拟返回值
      (mockPrismaClient.query.create as jest.Mock).mockResolvedValue(savedQuery as Query);
      
      // 执行测试
      const result = await queryService.saveQuery(queryData);
      
      // 验证结果
      expect(mockPrismaClient.query.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Query',
          dataSourceId: 'data-source-id',
          sqlContent: 'SELECT * FROM users',
          description: 'Query Description',
          tags: 'test,users',
          status: 'PUBLISHED',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      });
      expect(result).toEqual(savedQuery);
    });
  });
  
  describe('getQueries', () => {
    it('should return queries with filters', async () => {
      // 模拟数据
      const mockQueries = [
        {
          id: 'query-1',
          name: 'Test Query 1',
          dataSourceId: 'data-source-id',
          sqlContent: 'SELECT * FROM test1',
          description: 'Description 1',
          tags: 'test,query',
          status: 'PUBLISHED',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'query-2',
          name: 'Test Query 2',
          dataSourceId: 'data-source-id',
          sqlContent: 'SELECT * FROM test2',
          description: 'Description 2',
          tags: 'test',
          status: 'PUBLISHED',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // 设置模拟返回值
      (mockPrismaClient.query.findMany as jest.Mock).mockResolvedValue(mockQueries as Query[]);
      
      // 执行测试
      const result = await queryService.getQueries({
        dataSourceId: 'data-source-id',
        isPublic: true,
        tag: 'test',
        search: 'Query'
      });
      
      // 验证结果
      expect(mockPrismaClient.query.findMany).toHaveBeenCalledWith({
        where: {
          dataSourceId: 'data-source-id',
          status: 'PUBLISHED',
          tags: { contains: 'test' },
          OR: [
            { name: { contains: 'Query' } },
            { description: { contains: 'Query' } },
            { sqlContent: { contains: 'Query' } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(mockQueries);
    });
  });
});