// 将测试文件从TypeScript转换为JavaScript，以避免类型问题
const { QueryController } = require('../../../src/api/controllers/query.controller');
const queryService = require('../../../src/services/query.service').default;
const { ApiError } = require('../../../src/utils/error');
const { jest } = require('@jest/globals');
const { validationResult } = require('express-validator');

// 模拟query服务
jest.mock('../../../src/services/query.service', () => {
  return {
    __esModule: true,
    default: {
      executeQuery: jest.fn(),
      getQueryHistory: jest.fn(),
      saveQuery: jest.fn(),
      getQueries: jest.fn(),
      getQueryById: jest.fn(),
      updateQuery: jest.fn(),
      deleteQuery: jest.fn(),
      cancelQuery: jest.fn()
    }
  };
});

// 模拟express-validator
jest.mock('express-validator', () => {
  return {
    validationResult: jest.fn(),
    body: jest.fn().mockReturnThis(),
    param: jest.fn().mockReturnThis(),
    query: jest.fn().mockReturnThis(),
    isUUID: jest.fn().mockReturnThis(),
    isString: jest.fn().mockReturnThis(),
    isInt: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    isIn: jest.fn().mockReturnThis()
  };
});

// 生成mock响应
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('QueryController', () => {
  let queryController;
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    jest.clearAllMocks();
    queryController = new QueryController();
    mockReq = {
      params: {},
      query: {},
      body: {}
    };
    mockRes = mockResponse();
    mockNext = jest.fn();
    
    // 设置validationResult默认返回无错误
    validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    });
  });
  
  describe('executeQuery', () => {
    it('应当执行SQL查询并返回结果', async () => {
      // 准备测试数据
      const mockQueryResult = {
        rows: [
          { id: 1, name: 'Test User 1' },
          { id: 2, name: 'Test User 2' }
        ],
        fields: [
          { name: 'id' },
          { name: 'name' }
        ],
        rowCount: 2
      };
      
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.body = { sql: 'SELECT * FROM users', params: [] };
      
      // 设置服务返回值
      queryService.executeQuery.mockResolvedValue(mockQueryResult);
      
      // 执行测试
      await queryController.executeQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.executeQuery).toHaveBeenCalledWith(
        'test-ds-id',
        'SELECT * FROM users',
        [],
        undefined
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockQueryResult
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('应当处理验证错误', async () => {
      // 设置验证失败
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { msg: '缺少SQL语句', param: 'sql' }
        ])
      });
      
      // 执行测试
      await queryController.executeQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
    
    it('应当处理服务抛出的错误', async () => {
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.body = { sql: 'SELECT * FROM users' };
      
      // 设置服务抛出错误
      const mockError = new ApiError('执行查询失败', 500);
      queryService.executeQuery.mockRejectedValue(mockError);
      
      // 执行测试
      await queryController.executeQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.executeQuery).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('getQueryHistory', () => {
    it('应当返回查询历史记录', async () => {
      // 准备测试数据
      const mockHistory = {
        history: [
          {
            id: 'history-1',
            dataSourceId: 'test-ds-id',
            sqlContent: 'SELECT * FROM users',
            status: 'COMPLETED',
            startTime: new Date(),
            endTime: new Date(),
            duration: 100
          },
          {
            id: 'history-2',
            dataSourceId: 'test-ds-id',
            sqlContent: 'SELECT * FROM orders',
            status: 'COMPLETED',
            startTime: new Date(),
            endTime: new Date(),
            duration: 150
          }
        ],
        total: 2,
        limit: 20,
        offset: 0
      };
      
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.query = { limit: '20', offset: '0' };
      
      // 设置服务返回值
      queryService.getQueryHistory.mockResolvedValue(mockHistory);
      
      // 执行测试
      await queryController.getQueryHistory(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.getQueryHistory).toHaveBeenCalledWith(
        'test-ds-id',
        20,
        0
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockHistory
      });
    });
    
    it('应当使用默认分页参数', async () => {
      // 设置模拟请求参数 - 不提供limit和offset
      mockReq.params = { dataSourceId: 'test-ds-id' };
      
      // 执行测试
      await queryController.getQueryHistory(mockReq, mockRes, mockNext);
      
      // 验证默认值
      expect(queryService.getQueryHistory).toHaveBeenCalledWith(
        'test-ds-id',
        50,
        0
      );
    });
  });
  
  describe('saveQuery', () => {
    it('应当保存查询', async () => {
      // 准备测试数据
      const mockQueryData = {
        name: 'Test Query',
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users',
        description: 'Description',
        tags: ['test', 'users'],
        isPublic: true
      };
      
      const mockSavedQuery = {
        id: 'query-id',
        ...mockQueryData,
        tags: 'test,users',
        status: 'PUBLISHED',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.body = mockQueryData;
      
      // 设置服务返回值
      queryService.saveQuery.mockResolvedValue(mockSavedQuery);
      
      // 执行测试
      await queryController.saveQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.saveQuery).toHaveBeenCalledWith(mockQueryData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockSavedQuery
      });
    });
  });
  
  describe('getQueries', () => {
    it('应当返回查询列表', async () => {
      // 准备测试数据
      const mockQueries = [
        {
          id: 'query-1',
          name: 'Test Query 1',
          dataSourceId: 'test-ds-id',
          sqlContent: 'SELECT * FROM users',
          tags: 'test,users',
          status: 'PUBLISHED',
          createdAt: new Date()
        },
        {
          id: 'query-2',
          name: 'Test Query 2',
          dataSourceId: 'test-ds-id',
          sqlContent: 'SELECT * FROM orders',
          tags: 'test,orders',
          status: 'PUBLISHED',
          createdAt: new Date()
        }
      ];
      
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.query = { tag: 'test', isPublic: 'true', search: 'Query' };
      
      // 设置服务返回值
      queryService.getQueries.mockResolvedValue(mockQueries);
      
      // 执行测试
      await queryController.getQueries(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.getQueries).toHaveBeenCalledWith({
        dataSourceId: 'test-ds-id',
        tag: 'test',
        isPublic: true,
        search: 'Query'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockQueries
      });
    });
  });
  
  describe('getQueryById', () => {
    it('应当返回查询详情', async () => {
      // 准备测试数据
      const mockQuery = {
        id: 'query-id',
        name: 'Test Query',
        dataSourceId: 'test-ds-id',
        sqlContent: 'SELECT * FROM users',
        tags: 'test,users',
        status: 'PUBLISHED',
        createdAt: new Date()
      };
      
      // 设置模拟请求参数
      mockReq.params = { id: 'query-id' };
      
      // 设置服务返回值
      queryService.getQueryById.mockResolvedValue(mockQuery);
      
      // 执行测试
      await queryController.getQueryById(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.getQueryById).toHaveBeenCalledWith('query-id');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockQuery
      });
    });
    
    it('应当处理查询不存在的情况', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'non-existent-id' };
      
      // 设置服务抛出错误
      const mockError = new ApiError('查询不存在', 404);
      queryService.getQueryById.mockRejectedValue(mockError);
      
      // 执行测试
      await queryController.getQueryById(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('updateQuery', () => {
    it('应当更新查询', async () => {
      // 准备测试数据
      const mockUpdateData = {
        name: 'Updated Query',
        sql: 'SELECT * FROM users WHERE active = true',
        isPublic: false
      };
      
      const mockUpdatedQuery = {
        id: 'query-id',
        name: 'Updated Query',
        dataSourceId: 'test-ds-id',
        sqlContent: 'SELECT * FROM users WHERE active = true',
        tags: 'test,users',
        status: 'DRAFT',
        updatedAt: new Date()
      };
      
      // 设置模拟请求参数
      mockReq.params = { id: 'query-id' };
      mockReq.body = mockUpdateData;
      
      // 设置服务返回值
      queryService.updateQuery.mockResolvedValue(mockUpdatedQuery);
      
      // 执行测试
      await queryController.updateQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.updateQuery).toHaveBeenCalledWith('query-id', mockUpdateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedQuery
      });
    });
  });
  
  describe('deleteQuery', () => {
    it('应当删除查询', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'query-id' };
      
      // 设置服务返回值
      queryService.deleteQuery.mockResolvedValue(true);
      
      // 执行测试
      await queryController.deleteQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.deleteQuery).toHaveBeenCalledWith('query-id');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: '查询已删除'
      });
    });
  });
  
  describe('cancelQuery', () => {
    it('应当取消正在执行的查询', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'query-id' };
      
      // 设置服务返回值
      queryService.cancelQuery.mockResolvedValue(true);
      
      // 执行测试
      await queryController.cancelQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.cancelQuery).toHaveBeenCalledWith('query-id');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: '查询已取消'
      });
    });
    
    it('应当处理取消查询失败的情况', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'query-id' };
      
      // 设置服务抛出错误
      const mockError = new ApiError('无法取消查询', 400);
      queryService.cancelQuery.mockRejectedValue(mockError);
      
      // 执行测试
      await queryController.cancelQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});