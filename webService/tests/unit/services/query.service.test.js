// 将测试文件从TypeScript转换为JavaScript，以避免类型问题
const { QueryService } = require('../../../src/services/query.service');
const { ApiError } = require('../../../src/utils/error');
const { jest } = require('@jest/globals');

// 模拟PrismaClient
const mockPrismaClient = {
  queryHistory: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn()
  },
  queryPlanHistory: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn()
  },
  query: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

// 模拟Prisma客户端
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

// 获取数据源服务
const dataSourceService = require('../../../src/services/datasource.service').default;

describe('QueryService', () => {
  let queryService;
  
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
      dataSourceService.getConnector.mockResolvedValue(mockConnector);
      mockPrismaClient.queryHistory.create.mockResolvedValue(mockQueryHistory);
      mockPrismaClient.queryHistory.update.mockResolvedValue({
        ...mockQueryHistory,
        status: 'COMPLETED',
        endTime: new Date(),
        duration: 100,
        rowCount: 1
      });
      
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
        executeQuery: jest.fn().mockRejectedValue(new Error('Query execution failed'))
      };
      
      const mockQueryHistory = {
        id: 'query-history-id',
        dataSourceId: 'data-source-id',
        sqlContent: 'SELECT * FROM test',
        status: 'RUNNING',
        startTime: new Date()
      };
      
      // 设置模拟返回值
      dataSourceService.getConnector.mockResolvedValue(mockConnector);
      mockPrismaClient.queryHistory.create.mockResolvedValue(mockQueryHistory);
      
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
      expect(require('../../../src/utils/logger').default.error).toHaveBeenCalled();
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
      mockPrismaClient.queryHistory.findMany.mockResolvedValue(mockHistoryItems);
      mockPrismaClient.queryHistory.count.mockResolvedValue(10);
      
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
      mockPrismaClient.queryHistory.findMany.mockRejectedValue(new Error('Database error'));
      
      // 执行测试并期望抛出错误
      await expect(queryService.getQueryHistory('data-source-id')).rejects.toThrow(ApiError);
      
      // 验证
      expect(require('../../../src/utils/logger').default.error).toHaveBeenCalled();
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
      mockPrismaClient.query.create.mockResolvedValue(savedQuery);
      
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
      mockPrismaClient.query.findMany.mockResolvedValue(mockQueries);
      
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