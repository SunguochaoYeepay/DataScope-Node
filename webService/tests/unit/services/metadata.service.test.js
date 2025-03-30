/**
 * 元数据服务测试
 * 测试元数据同步和获取功能
 */

const { MetadataService } = require('../../../src/services/metadata.service');
const { DatabaseError } = require('../../../src/utils/errors');
const { ApiError } = require('../../../src/utils/errors/types/api-error');

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
  getTables: jest.fn().mockResolvedValue([
    { name: 'users', type: 'TABLE' },
    { name: 'orders', type: 'TABLE' }
  ]),
  getColumns: jest.fn().mockResolvedValue([
    {
      name: 'id',
      dataType: 'int(11)',
      isNullable: false,
      defaultValue: null,
      isPrimaryKey: true,
      maxLength: null,
      precision: null,
      scale: null
    },
    {
      name: 'name',
      dataType: 'varchar(255)',
      isNullable: true,
      defaultValue: null,
      isPrimaryKey: false,
      maxLength: 255,
      precision: null,
      scale: null
    },
    {
      name: 'email',
      dataType: 'varchar(255)',
      isNullable: true,
      defaultValue: null,
      isPrimaryKey: false,
      maxLength: 255,
      precision: null,
      scale: null
    }
  ]),
  getPrimaryKeys: jest.fn().mockResolvedValue([
    { columnName: 'id' }
  ]),
  getForeignKeys: jest.fn().mockResolvedValue([
    {
      columnName: 'user_id',
      referencedTable: 'users',
      referencedColumn: 'id',
      constraintName: 'fk_orders_users',
      referencedSchema: 'test_db'
    }
  ]),
  previewTableData: jest.fn().mockResolvedValue({
    rows: [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ],
    columns: ['id', 'name', 'email'],
    rowCount: 2
  }),
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
  return { 
    __esModule: true,
    default: mockDataSourceService,
    DataSourceService: jest.fn().mockImplementation(() => mockDataSourceService)
  };
});

// 模拟关系检测器
const mockRelationshipDetector = {
  detectRelationships: jest.fn().mockResolvedValue(5)
};

// 模拟关系检测器
jest.mock('../../../src/services/metadata/relationship-detector', () => {
  return {
    __esModule: true,
    default: mockRelationshipDetector
  };
});

// 模拟PrismaClient
const mockPrismaClient = {
  schema: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(data => Promise.resolve({ id: 'schema-1', ...data.data })),
    update: jest.fn().mockImplementation(data => Promise.resolve({ id: 'schema-1', ...data.data })),
    findMany: jest.fn().mockResolvedValue([
      { 
        id: 'schema-1', 
        name: 'test_db', 
        dataSourceId: 'test-ds-id',
        tables: [
          { 
            id: 'table-1', 
            name: 'users', 
            columns: [
              { id: 'column-1', name: 'id', dataType: 'int' },
              { id: 'column-2', name: 'name', dataType: 'varchar' }
            ]
          }
        ]
      }
    ])
  },
  table: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(data => Promise.resolve({ id: 'table-1', ...data.data })),
    update: jest.fn().mockImplementation(data => Promise.resolve({ id: 'table-1', ...data.data }))
  },
  column: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(data => Promise.resolve({ id: 'column-1', ...data.data })),
    update: jest.fn().mockImplementation(data => Promise.resolve({ id: 'column-1', ...data.data })),
    deleteMany: jest.fn().mockResolvedValue({ count: 3 })
  },
  tableRelationship: {
    create: jest.fn().mockImplementation(data => Promise.resolve({ id: 'relationship-1', ...data.data })),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  columnRelationship: {
    create: jest.fn().mockImplementation(data => Promise.resolve({ id: 'col-rel-1', ...data.data })),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  metadataSyncHistory: {
    create: jest.fn().mockImplementation(data => Promise.resolve({ id: 'sync-1', ...data.data })),
    update: jest.fn().mockImplementation(data => Promise.resolve({ id: 'sync-1', ...data.data })),
    findMany: jest.fn().mockResolvedValue([
      { 
        id: 'sync-1', 
        dataSourceId: 'test-ds-id', 
        startTime: new Date(), 
        endTime: new Date(),
        status: 'COMPLETED',
        tablesCount: 2,
        viewsCount: 0
      }
    ]),
    count: jest.fn().mockResolvedValue(1)
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
  
  describe('基本功能测试', () => {
    it('应该能够实例化', () => {
      expect(metadataService).toBeDefined();
    });
  });
  
  describe('syncMetadata', () => {
    it('应当同步元数据并返回结果', async () => {
      // 执行测试
      const result = await metadataService.syncMetadata('test-ds-id');
      
      // 验证
      expect(mockDataSourceService.getConnector).toHaveBeenCalledWith('test-ds-id');
      expect(mockConnector.getSchemas).toHaveBeenCalled();
      expect(mockConnector.getTables).toHaveBeenCalled();
      expect(mockConnector.getColumns).toHaveBeenCalled();
      expect(mockPrismaClient.metadataSyncHistory.create).toHaveBeenCalled();
      expect(mockRelationshipDetector.detectRelationships).toHaveBeenCalledWith('test-ds-id');
      expect(result).toEqual(expect.objectContaining({
        tablesCount: expect.any(Number),
        viewsCount: expect.any(Number),
        syncHistoryId: expect.any(String)
      }));
    });
    
    it('应当处理同步失败的情况', async () => {
      // 模拟获取架构失败
      mockConnector.getSchemas.mockRejectedValueOnce(new Error('获取架构失败'));
      
      // 执行测试并验证抛出的错误
      await expect(metadataService.syncMetadata('test-ds-id')).rejects.toThrow(ApiError);
      expect(mockPrismaClient.metadataSyncHistory.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
          data: expect.objectContaining({
            status: 'FAILED'
          })
        })
      );
    });
    
    it('应当使用正确的同步选项', async () => {
      // 执行测试，带同步选项
      await metadataService.syncMetadata('test-ds-id', {
        syncType: 'INCREMENTAL',
        schemaPattern: 'test.*',
        tablePattern: 'user.*'
      });
      
      // 验证
      expect(mockPrismaClient.metadataSyncHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            syncType: 'INCREMENTAL'
          })
        })
      );
    });
  });
  
  describe('getMetadataStructure', () => {
    it('应当返回数据源的元数据结构', async () => {
      // 执行测试
      const result = await metadataService.getMetadataStructure('test-ds-id');
      
      // 验证
      expect(mockPrismaClient.schema.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            dataSourceId: 'test-ds-id'
          }
        })
      );
      expect(result).toEqual(expect.any(Array));
    });
    
    it('应当处理数据源元数据未同步的情况', async () => {
      // 模拟没有找到架构
      mockPrismaClient.schema.findMany.mockResolvedValueOnce([]);
      
      // 执行测试并验证抛出的错误
      await expect(metadataService.getMetadataStructure('test-ds-id')).rejects.toThrow(ApiError);
    });
  });
  
  describe('getSyncHistory', () => {
    it('应当返回同步历史记录', async () => {
      // 执行测试
      const result = await metadataService.getSyncHistory('test-ds-id', 10, 0);
      
      // 验证
      expect(mockPrismaClient.metadataSyncHistory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { dataSourceId: 'test-ds-id' },
          orderBy: { startTime: 'desc' },
          take: 10,
          skip: 0
        })
      );
      expect(result).toEqual(expect.objectContaining({
        history: expect.any(Array),
        total: expect.any(Number),
        limit: 10,
        offset: 0
      }));
    });
    
    it('应当使用默认分页参数', async () => {
      // 执行测试，不传分页参数
      await metadataService.getSyncHistory('test-ds-id');
      
      // 验证
      expect(mockPrismaClient.metadataSyncHistory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 0
        })
      );
    });
  });
  
  describe('previewTableData', () => {
    it('应当返回表数据预览', async () => {
      // 执行测试
      const result = await metadataService.previewTableData('test-ds-id', 'test_db', 'users');
      
      // 验证
      expect(mockDataSourceService.getConnector).toHaveBeenCalledWith('test-ds-id');
      expect(mockConnector.previewTableData).toHaveBeenCalledWith('test_db', 'users', 100);
      expect(result).toEqual(expect.objectContaining({
        rows: expect.any(Array),
        columns: expect.any(Array),
        rowCount: expect.any(Number)
      }));
    });
    
    it('应当处理表预览失败的情况', async () => {
      // 模拟预览失败
      mockConnector.previewTableData.mockRejectedValueOnce(new Error('预览表数据失败'));
      
      // 执行测试并验证抛出的错误
      await expect(metadataService.previewTableData('test-ds-id', 'test_db', 'users')).rejects.toThrow(ApiError);
    });
    
    it('应当使用自定义行数限制', async () => {
      // 执行测试，使用自定义行数
      await metadataService.previewTableData('test-ds-id', 'test_db', 'users', 50);
      
      // 验证
      expect(mockConnector.previewTableData).toHaveBeenCalledWith('test_db', 'users', 50);
    });
  });
});