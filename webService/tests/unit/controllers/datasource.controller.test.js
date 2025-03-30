// 将测试文件使用JavaScript编写，避免类型问题
const { DataSourceController } = require('../../../src/api/controllers/datasource.controller');
const { ApiError } = require('../../../src/utils/errors/types/api-error');
const { validationResult } = require('express-validator');

// 在测试前修改控制器导入的ApiError路径，避免真实API调用
jest.mock('../../../src/utils/error', () => {
  const { ApiError } = require('../../../src/utils/errors/types/api-error');
  return { ApiError };
});

// 模拟dataSourceService
const mockDataSourceService = {
  getAllDataSources: jest.fn(),
  getDataSourceById: jest.fn(),
  createDataSource: jest.fn(),
  updateDataSource: jest.fn(),
  deleteDataSource: jest.fn(),
  testConnection: jest.fn()
};

jest.mock('../../../src/services/datasource.service', () => {
  return {
    __esModule: true,
    default: mockDataSourceService,
    DataSourceService: jest.fn().mockImplementation(() => mockDataSourceService)
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

describe('DataSourceController', () => {
  let dataSourceController;
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    jest.clearAllMocks();
    dataSourceController = new DataSourceController();
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
  
  describe('getAllDataSources', () => {
    it('应当返回所有数据源', async () => {
      // 准备测试数据
      const mockDataSources = [
        {
          id: 'ds-1',
          name: 'Test DB 1',
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          active: true
        },
        {
          id: 'ds-2',
          name: 'Test DB 2',
          type: 'postgresql',
          host: 'localhost',
          port: 5432,
          active: true
        }
      ];
      
      // 设置服务返回值
      mockDataSourceService.getAllDataSources.mockResolvedValue(mockDataSources);
      
      // 执行测试
      await dataSourceController.getAllDataSources(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.getAllDataSources).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockDataSources
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('应当处理获取数据源失败的情况', async () => {
      // 设置服务抛出错误
      const mockError = new ApiError('获取数据源失败', 500);
      mockDataSourceService.getAllDataSources.mockRejectedValue(mockError);
      
      // 执行测试
      await dataSourceController.getAllDataSources(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.getAllDataSources).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
  
  describe('getDataSourceById', () => {
    it('应当返回指定数据源', async () => {
      // 准备测试数据
      const mockDataSource = {
        id: 'ds-1',
        name: 'Test DB',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        active: true
      };
      
      // 设置请求参数
      mockReq.params.id = 'ds-1';
      
      // 设置服务返回值
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource);
      
      // 执行测试
      await dataSourceController.getDataSourceById(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('ds-1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockDataSource
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('应当处理数据源不存在的情况', async () => {
      // 设置请求参数
      mockReq.params.id = 'non-existent-id';
      
      // 设置服务返回值
      mockDataSourceService.getDataSourceById.mockResolvedValue(null);
      
      // 执行测试
      await dataSourceController.getDataSourceById(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('non-existent-id');
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
    });
    
    it('应当处理验证错误', async () => {
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { param: 'id', msg: 'ID格式不正确' }
        ])
      });
      
      // 执行测试
      await dataSourceController.getDataSourceById(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
  });
  
  describe('createDataSource', () => {
    it('应当创建新数据源', async () => {
      // 准备测试数据
      const dataSourceData = {
        name: 'New DB',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'testdb',
        description: 'Test database'
      };
      
      const createdDataSource = {
        id: 'new-ds-id',
        ...dataSourceData,
        active: true,
        createdAt: new Date()
      };
      
      // 设置请求体
      mockReq.body = dataSourceData;
      
      // 设置服务返回值
      mockDataSourceService.createDataSource.mockResolvedValue(createdDataSource);
      
      // 执行测试
      await dataSourceController.createDataSource(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.createDataSource).toHaveBeenCalledWith(dataSourceData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: createdDataSource
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('应当处理验证错误', async () => {
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { param: 'name', msg: '名称不能为空' }
        ])
      });
      
      // 执行测试
      await dataSourceController.createDataSource(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
    
    it('应当处理创建数据源失败', async () => {
      // 设置请求体
      mockReq.body = {
        name: 'New DB',
        type: 'mysql',
        host: 'localhost',
        port: 3306
      };
      
      // 设置服务抛出错误
      const mockError = new ApiError('创建数据源失败', 500);
      mockDataSourceService.createDataSource.mockRejectedValue(mockError);
      
      // 执行测试
      await dataSourceController.createDataSource(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.createDataSource).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('updateDataSource', () => {
    it('应当更新数据源', async () => {
      // 准备测试数据
      const dataSourceId = 'ds-1';
      const updateData = {
        name: 'Updated DB',
        description: 'Updated description'
      };
      
      const updatedDataSource = {
        id: dataSourceId,
        name: 'Updated DB',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        description: 'Updated description',
        active: true,
        updatedAt: new Date()
      };
      
      // 设置请求参数和请求体
      mockReq.params.id = dataSourceId;
      mockReq.body = updateData;
      
      // 设置服务返回值
      mockDataSourceService.updateDataSource.mockResolvedValue(updatedDataSource);
      
      // 执行测试
      await dataSourceController.updateDataSource(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.updateDataSource).toHaveBeenCalledWith(dataSourceId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: updatedDataSource
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('应当处理验证错误', async () => {
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { param: 'id', msg: 'ID格式不正确' }
        ])
      });
      
      // 执行测试
      await dataSourceController.updateDataSource(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
    
    it('应当处理更新数据源失败', async () => {
      // 设置请求参数和请求体
      mockReq.params.id = 'ds-1';
      mockReq.body = { name: 'Updated DB' };
      
      // 设置服务抛出错误
      const mockError = new ApiError('更新数据源失败', 500);
      mockDataSourceService.updateDataSource.mockRejectedValue(mockError);
      
      // 执行测试
      await dataSourceController.updateDataSource(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.updateDataSource).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('deleteDataSource', () => {
    it('应当删除数据源', async () => {
      // 设置请求参数
      mockReq.params.id = 'ds-1';
      
      // 设置服务返回值
      mockDataSourceService.deleteDataSource.mockResolvedValue(true);
      
      // 执行测试
      await dataSourceController.deleteDataSource(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.deleteDataSource).toHaveBeenCalledWith('ds-1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: '数据源已删除'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('应当处理验证错误', async () => {
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { param: 'id', msg: 'ID格式不正确' }
        ])
      });
      
      // 执行测试
      await dataSourceController.deleteDataSource(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
    
    it('应当处理删除数据源失败', async () => {
      // 设置请求参数
      mockReq.params.id = 'ds-1';
      
      // 设置服务抛出错误
      const mockError = new ApiError('删除数据源失败', 500);
      mockDataSourceService.deleteDataSource.mockRejectedValue(mockError);
      
      // 执行测试
      await dataSourceController.deleteDataSource(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.deleteDataSource).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('testConnection', () => {
    it('应当测试数据源连接成功', async () => {
      // 准备测试数据
      const connectionData = {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'testdb'
      };
      
      const testResult = {
        success: true,
        message: '连接成功'
      };
      
      // 设置请求体
      mockReq.body = connectionData;
      
      // 设置服务返回值
      mockDataSourceService.testConnection.mockResolvedValue(testResult);
      
      // 执行测试
      await dataSourceController.testConnection(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.testConnection).toHaveBeenCalledWith(connectionData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: testResult
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('应当处理测试连接失败', async () => {
      // 准备测试数据
      const connectionData = {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'wrong-password',
        database: 'testdb'
      };
      
      // 设置请求体
      mockReq.body = connectionData;
      
      // 设置服务抛出错误
      const mockError = new ApiError('连接测试失败', 500);
      mockDataSourceService.testConnection.mockRejectedValue(mockError);
      
      // 执行测试
      await dataSourceController.testConnection(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockDataSourceService.testConnection).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
    
    it('应当处理验证错误', async () => {
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { param: 'host', msg: '主机名不能为空' }
        ])
      });
      
      // 执行测试
      await dataSourceController.testConnection(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
  });
});