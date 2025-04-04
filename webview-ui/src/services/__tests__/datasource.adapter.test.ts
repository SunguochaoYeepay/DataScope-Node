/**
 * 数据源API适配测试
 * 验证数据源服务是否能够正确与后端API格式进行交互
 */

import { dataSourceService } from '../datasource';
import type { CreateDataSourceParams, DataSourceType } from '@/types/datasource';

// 设置环境变量，启用Mock模式
(window as any).ENV = { VITE_USE_MOCK_API: 'true' };

describe('数据源服务适配测试', () => {
  // 测试获取数据源列表
  test('获取数据源列表应返回符合后端格式的数据', async () => {
    const result = await dataSourceService.getDataSources({});
    
    // 验证分页结构
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('size');
    expect(result).toHaveProperty('totalPages');
    
    // 验证数据源字段
    if (result.items.length > 0) {
      const dataSource = result.items[0];
      expect(dataSource).toHaveProperty('id');
      expect(dataSource).toHaveProperty('name');
      expect(dataSource).toHaveProperty('type');
      expect(dataSource).toHaveProperty('isActive');
      
      // 验证类型是小写形式
      expect(dataSource.type).toMatch(/^(mysql|postgresql|oracle|sqlserver|mongodb|elasticsearch)$/);
      
      // 验证状态是小写形式
      expect(dataSource.status).toMatch(/^(active|inactive|error|syncing)$/);
    }
  });
  
  // 测试创建数据源
  test('创建数据源应使用小写类型', async () => {
    const params: CreateDataSourceParams = {
      name: '测试数据源',
      description: '这是一个测试数据源',
      type: 'mysql' as DataSourceType,
      host: 'localhost',
      port: 3306,
      databaseName: 'test_db',
      username: 'user',
      password: 'password',
      syncFrequency: 'manual'
    };
    
    const result = await dataSourceService.createDataSource(params);
    
    // 验证返回的数据源
    expect(result).toHaveProperty('id');
    expect(result.name).toBe(params.name);
    expect(result.type).toBe('mysql');
    expect(result.status).toBe('active');
    expect(result).toHaveProperty('isActive');
  });
  
  // 测试检查数据源状态
  test('检查数据源状态应返回标准格式', async () => {
    // 先获取一个数据源ID
    const dataSources = await dataSourceService.getDataSources({});
    if (dataSources.items.length === 0) {
      console.warn('没有可用的数据源进行测试');
      return;
    }
    
    const dataSourceId = dataSources.items[0].id;
    const result = await dataSourceService.checkDataSourceStatus(dataSourceId);
    
    // 验证状态结构
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('isActive');
    expect(result).toHaveProperty('lastCheckedAt');
    expect(result).toHaveProperty('message');
    
    // 验证状态是小写
    expect(result.status).toMatch(/^(active|inactive|error|syncing)$/);
  });
  
  // 测试同步元数据
  test('同步元数据应返回标准格式', async () => {
    // 先获取一个数据源ID
    const dataSources = await dataSourceService.getDataSources({});
    if (dataSources.items.length === 0) {
      console.warn('没有可用的数据源进行测试');
      return;
    }
    
    const dataSourceId = dataSources.items[0].id;
    const result = await dataSourceService.syncMetadata({
      id: dataSourceId,
      filters: {
        includeSchemas: ['public'],
        excludeTables: ['migrations']
      }
    });
    
    // 验证同步结果
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('tablesCount');
    expect(result).toHaveProperty('syncHistoryId');
  });
});