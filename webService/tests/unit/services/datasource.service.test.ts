import { DataSourceService } from '../../../src/services/datasource.service';
import { ApiError } from '../../../src/utils/error';

// 模拟数据
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        dataSource: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      };
    }),
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
    it('should return mock data sources in development with USE_MOCK_DATA=true', async () => {
      // 确保环境变量设置正确
      process.env.NODE_ENV = 'development';
      process.env.USE_MOCK_DATA = 'true';
      
      const result = await dataSourceService.getAllDataSources();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('type');
    });
  });
  
  describe('getDataSourceById', () => {
    it('should return a mock data source by id in development with USE_MOCK_DATA=true', async () => {
      // 确保环境变量设置正确
      process.env.NODE_ENV = 'development';
      process.env.USE_MOCK_DATA = 'true';
      
      const result = await dataSourceService.getDataSourceById('1');
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('type');
    });
    
    it('should throw an error for non-existent id in development with USE_MOCK_DATA=true', async () => {
      // 确保环境变量设置正确
      process.env.NODE_ENV = 'development';
      process.env.USE_MOCK_DATA = 'true';
      
      await expect(dataSourceService.getDataSourceById('999')).rejects.toThrow(ApiError);
    });
  });
  
  describe('createDataSource', () => {
    it('should create a new data source in development with USE_MOCK_DATA=true', async () => {
      // 确保环境变量设置正确
      process.env.NODE_ENV = 'development';
      process.env.USE_MOCK_DATA = 'true';
      
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
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Test Database');
      expect(result).toHaveProperty('type', 'MYSQL');
      expect(result).toHaveProperty('passwordEncrypted');
      expect(result).toHaveProperty('passwordSalt');
    });
  });
}); 