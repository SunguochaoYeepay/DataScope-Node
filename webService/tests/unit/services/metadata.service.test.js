/**
 * 元数据服务测试
 * 测试表结构分析和元数据获取功能
 */

const { MetadataService } = require('../../../src/services/metadata.service');
const { DatabaseError } = require('../../../src/utils/errors');

// 创建模拟数据源服务
const mockDataSourceService = {
  getDataSourceById: jest.fn().mockResolvedValue({
    id: 'test-ds-id',
    name: 'Test DB',
    type: 'mysql',
    host: 'localhost',
    databaseName: 'test_db'
  }),
  getConnector: jest.fn()
};

// 创建模拟数据库连接器
const mockConnector = {
  getSchemas: jest.fn().mockResolvedValue(['test_db', 'information_schema']),
  getTables: jest.fn().mockResolvedValue(['users', 'orders']),
  getColumns: jest.fn().mockResolvedValue([
    {
      name: 'id',
      dataType: 'int(11)',
      nullable: false,
      defaultValue: null,
      isPrimary: true,
      extra: 'auto_increment'
    },
    {
      name: 'name',
      dataType: 'varchar(255)',
      nullable: true,
      defaultValue: null,
      isPrimary: false,
      extra: ''
    },
    {
      name: 'email',
      dataType: 'varchar(255)',
      nullable: true,
      defaultValue: null,
      isPrimary: false,
      extra: ''
    }
  ]),
  getPrimaryKeys: jest.fn().mockResolvedValue(['id']),
  getForeignKeys: jest.fn().mockResolvedValue([
    {
      column: 'user_id',
      referencedTable: 'users',
      referencedColumn: 'id',
      constraintName: 'fk_orders_users'
    }
  ]),
  getIndexes: jest.fn().mockResolvedValue([
    {
      name: 'PRIMARY',
      columns: ['id'],
      isUnique: true
    },
    {
      name: 'idx_email',
      columns: ['email'],
      isUnique: true
    }
  ]),
  executeQuery: jest.fn().mockImplementation((sql) => {
    if (sql.includes('COUNT(*)')) {
      return Promise.resolve({
        rows: [{ 'COUNT(*)': 100 }],
        columns: ['COUNT(*)'],
        rowCount: 1
      });
    }
    return Promise.resolve({
      rows: [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' }
      ],
      columns: ['id', 'name', 'email'],
      rowCount: 2
    });
  })
};

// 模拟数据源服务
jest.mock('../../../src/services/datasource.service', () => {
  return { DataSourceService: jest.fn().mockImplementation(() => mockDataSourceService) };
});

// 模拟PrismaClient
const mockPrismaClient = {
  tableMetadata: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(data => Promise.resolve({ id: 'metadata-id', ...data.data })),
    update: jest.fn().mockImplementation(data => Promise.resolve({ id: 'metadata-id', ...data.data })),
    findMany: jest.fn().mockResolvedValue([])
  }
};

// 模拟prisma
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
  };
});

// 模拟logger
jest.mock('../../../src/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn()
}));

describe('MetadataService', () => {
  let metadataService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 设置默认连接器返回值
    mockDataSourceService.getConnector.mockResolvedValue(mockConnector);
    
    // 创建服务实例
    metadataService = new MetadataService();
  });
  
  describe('getSchemas', () => {
    it('应当获取数据库架构列表', async () => {
      // 执行测试
      const result = await metadataService.getSchemas('test-ds-id');
      
      // 验证
      expect(result).toEqual(['test_db', 'information_schema']);
      expect(mockDataSourceService.getConnector).toHaveBeenCalledWith('test-ds-id');
      expect(mockConnector.getSchemas).toHaveBeenCalled();
    });
    
    it('应当处理数据源不存在的情况', async () => {
      // 模拟数据源不存在
      mockDataSourceService.getDataSourceById.mockResolvedValueOnce(null);
      
      // 执行测试并验证抛出的错误
      await expect(metadataService.getSchemas('non-existent-ds-id')).rejects.toThrow();
    });
    
    it('应当处理获取架构失败的情况', async () => {
      // 模拟获取架构失败
      mockConnector.getSchemas.mockRejectedValueOnce(new Error('获取架构失败'));
      
      // 执行测试并验证抛出的错误
      await expect(metadataService.getSchemas('test-ds-id')).rejects.toThrow();
    });
  });
  
  describe('getTables', () => {
    it('应当获取表列表', async () => {
      // 执行测试
      const result = await metadataService.getTables('test-ds-id', 'test_db');
      
      // 验证
      expect(result).toEqual(['users', 'orders']);
      expect(mockConnector.getTables).toHaveBeenCalledWith('test_db');
    });
  });
  
  describe('getTableInfo', () => {
    it('应当获取表详细信息', async () => {
      // 执行测试
      const result = await metadataService.getTableInfo('test-ds-id', 'test_db', 'users');
      
      // 验证
      expect(result).toEqual({
        name: 'users',
        columns: expect.any(Array),
        primaryKeys: ['id'],
        foreignKeys: expect.any(Array),
        indexes: expect.any(Array),
        approxRowCount: 100
      });
      expect(mockConnector.getColumns).toHaveBeenCalledWith('test_db', 'users');
      expect(mockConnector.getPrimaryKeys).toHaveBeenCalledWith('test_db', 'users');
      expect(mockConnector.getForeignKeys).toHaveBeenCalledWith('test_db', 'users');
      expect(mockConnector.getIndexes).toHaveBeenCalledWith('test_db', 'users');
      expect(mockConnector.executeQuery).toHaveBeenCalledWith(expect.stringContaining('COUNT(*)'));
    });
  });
  
  describe('analyzeTableData', () => {
    it('应当分析表数据并生成统计信息', async () => {
      // 执行测试
      const result = await metadataService.analyzeTableData('test-ds-id', 'test_db', 'users');
      
      // 验证
      expect(result).toEqual({
        name: 'users',
        rowCount: 100,
        columnStats: expect.any(Object),
        samples: expect.any(Array)
      });
      expect(mockConnector.executeQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM'));
    });
    
    it('应当处理表不存在的情况', async () => {
      // 模拟表不存在
      mockConnector.executeQuery.mockRejectedValueOnce(new Error('Table not found'));
      
      // 执行测试并验证抛出的错误
      await expect(metadataService.analyzeTableData('test-ds-id', 'test_db', 'non_existent_table')).rejects.toThrow();
    });
  });
  
  describe('getColumnStatistics', () => {
    it('应当获取列统计信息', async () => {
      // 执行测试
      const result = await metadataService.getColumnStatistics('test-ds-id', 'test_db', 'users', 'name');
      
      // 验证
      expect(result).toEqual({
        column: 'name',
        dataType: expect.any(String),
        valueDistribution: expect.any(Object),
        nullPercentage: expect.any(Number),
        samples: expect.any(Array)
      });
      expect(mockConnector.executeQuery).toHaveBeenCalled();
    });
  });
  
  describe('syncTableMetadata', () => {
    it('应当同步表元数据到数据库', async () => {
      // 执行测试
      const result = await metadataService.syncTableMetadata('test-ds-id', 'test_db', 'users');
      
      // 验证
      expect(result).toEqual({
        id: 'metadata-id',
        dataSourceId: 'test-ds-id',
        schema: 'test_db',
        tableName: 'users',
        columns: expect.any(Array),
        primaryKeys: ['id'],
        foreignKeys: expect.any(Array),
        indexes: expect.any(Array),
        rowCount: 100,
        lastSyncAt: expect.any(Date)
      });
      expect(mockPrismaClient.tableMetadata.findFirst).toHaveBeenCalled();
      expect(mockPrismaClient.tableMetadata.create).toHaveBeenCalled();
    });
    
    it('应当更新已存在的表元数据', async () => {
      // 模拟元数据已存在
      mockPrismaClient.tableMetadata.findFirst.mockResolvedValueOnce({
        id: 'existing-metadata-id',
        dataSourceId: 'test-ds-id',
        schema: 'test_db',
        tableName: 'users'
      });
      
      // 执行测试
      const result = await metadataService.syncTableMetadata('test-ds-id', 'test_db', 'users');
      
      // 验证
      expect(mockPrismaClient.tableMetadata.update).toHaveBeenCalled();
    });
  });
  
  describe('detectRelationships', () => {
    it('应当检测表之间的关系', async () => {
      // 执行测试
      const result = await metadataService.detectRelationships('test-ds-id', 'test_db');
      
      // 验证
      expect(result).toEqual({
        relationships: expect.any(Array),
        summary: expect.any(Object)
      });
      expect(mockConnector.getTables).toHaveBeenCalled();
    });
  });
  
  describe('scanDatabase', () => {
    it('应当扫描整个数据库并收集元数据', async () => {
      // 执行测试
      const result = await metadataService.scanDatabase('test-ds-id', 'test_db');
      
      // 验证
      expect(result).toEqual({
        tables: expect.any(Array),
        relationships: expect.any(Array),
        scanTime: expect.any(Number)
      });
      expect(mockConnector.getTables).toHaveBeenCalled();
    });
  });
});