import type {
  DataSource,
  CreateDataSourceParams as DataSourceInput,
  UpdateDataSourceParams,
  TestConnectionParams,
  SyncMetadataParams,
  DataSourceQueryParams,
  PageResponse,
  ConnectionTestResult,
  MetadataSyncResult,
  DataSourceStats,
  DataSourcePermissions,
  DataSourceType,
  DataSourceStatus,
  SyncFrequency
} from '@/types/datasource'
import type { TableMetadata, TableRelationship, ColumnMetadata } from '@/types/metadata'
import { getApiBaseUrl } from './query'
import { http } from '@/utils/http'

// 表数据预览结果接口
interface TableDataPreviewResult {
  data: any[];
  columns: { name: string, type: string }[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// 检查是否启用mock模式
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'
console.log('数据源服务 - Mock模式:', USE_MOCK ? '已启用' : '已禁用')

// API 基础路径
const API_BASE_URL = `${getApiBaseUrl()}/api/datasources`

// 元数据API基础路径 - 已更新为标准API路径
const METADATA_API_BASE_URL = `${getApiBaseUrl()}/api/metadata`

// 模拟数据源列表
const mockDataSources: DataSource[] = Array.from({ length: 5 }, (_, i) => ({
  id: `ds-${i+1}`,
  name: `模拟数据源 ${i+1}`,
  description: `这是一个模拟的数据源，用于开发测试 ${i+1}`,
  type: (i % 3 === 0 ? 'mysql' : (i % 3 === 1 ? 'postgresql' : 'oracle')) as DataSourceType,
  host: 'localhost',
  port: 3306 + i,
  databaseName: `test_db_${i+1}`,
  database: `test_db_${i+1}`,
  username: 'user',
  status: (i === 4 ? 'error' : 'active') as DataSourceStatus,
  syncFrequency: 'manual' as SyncFrequency,
  lastSyncTime: i === 0 ? new Date().toISOString() : (i === 4 ? null : null),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: i !== 4
}))

// 处理统一响应格式
const handleResponse = async <T>(response: Response): Promise<T> => {
  try {
    const data = await response.json();
    // 处理后端统一响应格式
    if (data.success === false) {
      throw {
        success: false,
        error: data.error || {
          statusCode: 400,
          code: 'API_ERROR',
          message: data.message || '请求失败',
          details: null
        }
      };
    }
    return data.success === undefined ? data : data.data;
  } catch (error) {
    console.error('处理API响应错误:', error);
    throw error;
  }
}

// 统一错误处理函数
const handleApiError = (error: any, defaultMessage: string = '操作失败') => {
  console.error('API错误:', error);
  
  // 如果已经是标准格式的错误，直接返回
  if (error && error.success === false && error.error) {
    return error;
  }
  
  // 构造标准错误响应
  return {
    success: false,
    error: {
      statusCode: error?.status || error?.statusCode || 500,
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || defaultMessage,
      details: error?.details || error?.stack
    }
  };
}

// 将后端返回的数据源对象转换为前端所需的格式
const adaptDataSource = (source: any): DataSource => {
  // 如果没有获取到数据，返回空对象
  if (!source) {
    return {} as DataSource;
  }

  return {
    id: source.id,
    name: source.name,
    description: source.description || '',
    type: source.type as DataSourceType, // 后端现在返回小写的类型，不需要转换
    host: source.host,
    port: source.port,
    databaseName: source.databaseName || source.database || '', // 优先使用databaseName，其次使用database
    database: source.databaseName || source.database || '', // 同时记录database字段确保两边兼容
    username: source.username,
    // 密码通常不会返回
    status: source.status as DataSourceStatus,
    syncFrequency: source.syncFrequency as SyncFrequency,
    lastSyncTime: source.lastSyncTime,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    // 其他可选字段
    errorMessage: source.errorMessage,
    connectionParams: source.connectionParams || {},
    isActive: source.isActive,
    // 额外字段处理
    metadata: source.metadata
  }
}

// 数据源服务
export const dataSourceService = {
  // 获取数据源列表
  async getDataSources(params: DataSourceQueryParams): Promise<PageResponse<DataSource>> {
    try {
      // 如果启用了Mock模式，返回模拟数据
      if (USE_MOCK) {
        console.log('返回模拟数据源列表数据');
        
        // 应用过滤
        let filteredItems = [...mockDataSources];
        
        if (params.name) {
          const keyword = params.name.toLowerCase();
          filteredItems = filteredItems.filter(ds => 
            ds.name.toLowerCase().includes(keyword) || 
            ds.description.toLowerCase().includes(keyword)
          );
        }
        
        if (params.type) {
          filteredItems = filteredItems.filter(ds => 
            ds.type.toLowerCase() === params.type?.toLowerCase()
          );
        }
        
        if (params.status) {
          filteredItems = filteredItems.filter(ds => 
            ds.status === params.status
          );
        }
        
        // 应用分页
        const page = params.page || 1;
        const size = params.size || 10;
        const start = (page - 1) * size;
        const end = start + size;
        const paginatedItems = filteredItems.slice(start, Math.min(end, filteredItems.length));
        
        // 返回模拟分页响应
        return {
          items: paginatedItems,
          page: page,
          size: size,
          total: filteredItems.length,
          totalPages: Math.ceil(filteredItems.length / size)
        };
      }
      
      // 构建查询参数 - 使用标准参数：page/size
      const queryParams = new URLSearchParams()
      
      // 添加过滤参数
      if (params.name) {
        queryParams.append('name', params.name);
      }
      if (params.type) {
        queryParams.append('type', params.type.toLowerCase());
      }
      if (params.status) {
        queryParams.append('status', params.status);
      }
      
      // 添加分页参数（使用标准page/size参数名）
      queryParams.append('page', String(params.page || 1));
      queryParams.append('size', String(params.size || 10));
      
      // 使用http工具函数发送请求
      const responseData = await http.get(`/api/datasources?${queryParams.toString()}`);
      console.log('数据源列表原始响应:', responseData);
      
      // 处理不同响应格式
      let items: any[] = [];
      let totalItems = 0;
      let totalPages = 1;
      let currentPage = Number(params.page || 1);
      let pageSize = Number(params.size || 10);
      
      // 1. 处理标准成功响应格式
      if (responseData.success === true && responseData.data) {
        // 提取items数组
        if (Array.isArray(responseData.data)) {
          items = responseData.data;
          totalItems = items.length;
        } else if (responseData.data.items && Array.isArray(responseData.data.items)) {
          items = responseData.data.items;
          
          // 从pagination对象中提取分页信息
          if (responseData.data.pagination) {
            totalItems = responseData.data.pagination.total || items.length;
            totalPages = responseData.data.pagination.totalPages || 
                        Math.ceil(totalItems / pageSize);
            currentPage = responseData.data.pagination.page || currentPage;
            pageSize = responseData.data.pagination.size || pageSize;
          }
        }
      } 
      // 2. 处理直接返回数组的格式
      else if (Array.isArray(responseData)) {
        items = responseData;
        totalItems = items.length;
      } 
      // 3. 处理其他格式
      else {
        // 尝试从各种可能的字段中提取数据
        if (responseData.items && Array.isArray(responseData.items)) {
          items = responseData.items;
        } else if (responseData.dataSources && Array.isArray(responseData.dataSources)) {
          items = responseData.dataSources;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          items = responseData.data;
        }
        
        // 提取分页信息
        totalItems = responseData.total || responseData.totalCount || items.length;
        totalPages = responseData.totalPages || 
                    responseData.pages || 
                    Math.ceil(totalItems / pageSize);
        currentPage = responseData.page || currentPage;
        pageSize = responseData.size || responseData.pageSize || pageSize;
      }
      
      // 适配数据源对象
      const dataSources: DataSource[] = items.map(adaptDataSource);
      
      // 返回标准分页响应
      return {
        items: dataSources,
        page: currentPage,
        size: pageSize,
        total: totalItems,
        totalPages: totalPages
      };
    } catch (error) {
      console.error('获取数据源列表错误:', error);
      // 使用统一的错误处理函数
      throw handleApiError(error, '获取数据源列表失败');
    }
  },
  
  // 获取单个数据源详情
  async getDataSource(id: string): Promise<DataSource> {
    try {
      // 如果启用了Mock模式，返回模拟数据
      if (USE_MOCK) {
        console.log('返回模拟数据源详情数据, id:', id);
        const mockDataSource = mockDataSources.find(ds => ds.id === id);
        
        if (!mockDataSource) {
          throw new Error(`未找到ID为${id}的数据源`);
        }
        
        return mockDataSource;
      }
      
      const response = await fetch(`${API_BASE_URL}/${id}`)
      if (!response.ok) {
        throw new Error(`获取数据源详情失败: ${response.statusText}`)
      }
      
      const data = await handleResponse<any>(response)
      return adaptDataSource(data)
    } catch (error) {
      console.error(`获取数据源${id}详情错误:`, error)
      throw error
    }
  },
  
  // 创建数据源
  async createDataSource(data: DataSourceInput): Promise<DataSource> {
    try {
      // 如果启用了Mock模式，返回模拟数据
      if (USE_MOCK) {
        console.log('创建模拟数据源:', data);
        
        // 创建新的模拟数据源
        const newId = `ds-${mockDataSources.length + 1}`;
        const newDataSource: DataSource = {
          id: newId,
          name: data.name,
          description: data.description || '',
          type: data.type,
          host: data.host,
          port: data.port,
          databaseName: data.databaseName,
          database: data.database || data.databaseName,
          username: data.username,
          status: 'active',
          syncFrequency: data.syncFrequency,
          lastSyncTime: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // 将新数据源添加到模拟列表
        mockDataSources.push(newDataSource);
        
        return newDataSource;
      }
      
      // 构建符合后端期望的请求体
      const requestBody = {
        name: data.name,
        description: data.description || '',
        type: data.type.toLowerCase(), // 后端期望小写的类型
        host: data.host,
        port: data.port,
        database: data.database || data.databaseName, // 优先使用database，其次使用databaseName
        username: data.username,
        password: data.password,
        syncFrequency: data.syncFrequency,
        connectionParams: data.connectionParams || {} // 使用统一的字段名
      }
      
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`创建数据源失败: ${response.statusText}`)
      }
      
      const result = await response.json()
      const responseData = result.data || result
      
      return adaptDataSource(responseData)
    } catch (error) {
      console.error('创建数据源错误:', error)
      throw error
    }
  },
  
  // 更新数据源
  async updateDataSource(params: UpdateDataSourceParams): Promise<DataSource> {
    try {
      // 如果启用了Mock模式，返回模拟数据
      if (USE_MOCK) {
        console.log('更新模拟数据源:', params);
        
        // 查找要更新的数据源
        const index = mockDataSources.findIndex(ds => ds.id === params.id);
        
        if (index === -1) {
          throw new Error(`未找到ID为${params.id}的数据源`);
        }
        
        // 更新数据源
        const updatedDataSource = {
          ...mockDataSources[index],
          ...params,
          updatedAt: new Date().toISOString()
        };
        
        // 替换原有数据源
        mockDataSources[index] = updatedDataSource;
        
        return updatedDataSource;
      }
      
      // 构建符合后端期望的请求体
      const requestBody: any = {
        id: params.id,
        name: params.name,
        description: params.description,
        host: params.host,
        port: params.port,
        database: params.database || params.databaseName,
        username: params.username,
        ...(params.password && { password: params.password }),
        syncFrequency: params.syncFrequency,
        connectionParams: params.connectionParams || {}
      }
      
      const response = await fetch(`${API_BASE_URL}/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`更新数据源失败: ${response.statusText}`)
      }
      
      const result = await response.json()
      const data = result.data || result
      
      return adaptDataSource(data)
    } catch (error) {
      console.error(`更新数据源${params.id}错误:`, error)
      throw error
    }
  },
  
  // 删除数据源
  async deleteDataSource(id: string): Promise<void> {
    try {
      // 如果启用了Mock模式
      if (USE_MOCK) {
        console.log('删除模拟数据源, id:', id);
        
        // 查找要删除的数据源索引
        const index = mockDataSources.findIndex(ds => ds.id === id);
        
        if (index === -1) {
          throw new Error(`未找到ID为${id}的数据源`);
        }
        
        // 从模拟列表中删除
        mockDataSources.splice(index, 1);
        
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`删除数据源失败: ${response.statusText}`)
      }
      
      await handleResponse<void>(response)
    } catch (error) {
      console.error(`删除数据源${id}错误:`, error)
      throw error
    }
  },
  
  // 测试数据源连接
  async testConnection(params: TestConnectionParams): Promise<ConnectionTestResult> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回连接测试结果');
        // 模拟1秒的延迟，模拟真实连接测试的时间
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 始终返回成功的连接测试结果
        return {
          success: true,
          message: '连接测试成功',
          details: {
            connectionTime: '100ms',
            serverVersion: `Mock ${params.type?.toUpperCase() || 'DATABASE'} Server 5.7.0`,
            dbName: params.databaseName || params.database || 'mock_database'
          }
        };
      }
      
      // 构建请求体
      const requestBody = {
        type: params.type,
        host: params.host,
        port: params.port,
        database: params.databaseName || params.database,
        username: params.username,
        password: params.password || '',
        connectionParams: params.connectionParams || {}
      };
      
      const response = await fetch(`${API_BASE_URL}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`测试连接API返回错误: ${response.status} ${response.statusText}`, errorText);
        
        let errorMessage = '连接测试失败';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // 如果无法解析JSON，使用原始错误文本
          errorMessage = errorText || errorMessage;
        }
        
        return {
          success: false,
          message: errorMessage,
          details: { status: response.status, statusText: response.statusText }
        };
      }

      const responseData = await response.json();
      return {
        success: responseData.success,
        message: responseData.message,
        details: responseData.details
      }
    } catch (error) {
      console.error('测试连接失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '连接测试失败，请检查连接详情后重试',
        details: error
      }
    }
  },
  
  // 同步数据源元数据
  async syncMetadata(params: SyncMetadataParams): Promise<MetadataSyncResult> {
    try {
      if (USE_MOCK) {
        console.log('执行模拟元数据同步:', params);
        
        // 查找数据源
        const mockDataSource = mockDataSources.find(ds => ds.id === params.id);
        if (!mockDataSource) {
          throw new Error(`未找到ID为${params.id}的数据源`);
        }
        
        // 延迟1-3秒模拟同步过程
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
        
        // 返回同步结果
        return {
          success: true,
          syncHistoryId: `sync-${Date.now()}`,
          message: '元数据同步完成',
          tablesCount: Math.floor(Math.random() * 20) + 5,
          viewsCount: Math.floor(Math.random() * 10) + 1,
          syncDuration: Math.floor(Math.random() * 5000) + 1000,
          lastSyncTime: new Date().toISOString()
        };
      }
      
      // 构建请求参数
      const syncParams = {
        filters: params.filters || {}
      };
      
      // 使用新的API路径格式，符合后端规范
      const url = `${METADATA_API_BASE_URL}/datasources/${params.id}/sync`;
      console.log('同步元数据请求URL:', url);
      
      const response = await http.post(url, syncParams);
      
      // 处理响应数据
      if (response.success === true && response.data) {
        // 如果是标准响应格式
        const syncResult = response.data;
        
        // 构建标准同步结果
        return {
          success: syncResult.success || true,
          message: syncResult.message || '同步完成',
          tablesCount: syncResult.tablesCount,
          viewsCount: syncResult.viewsCount,
          syncDuration: syncResult.syncDuration,
          lastSyncTime: syncResult.endTime || new Date().toISOString(),
          syncHistoryId: syncResult.syncId
        };
      }
      
      // 如果响应本身就是同步结果
      if (response.success !== undefined) {
        return {
          success: response.success,
          message: response.message || '同步完成',
          tablesCount: response.tablesCount,
          viewsCount: response.viewsCount,
          syncDuration: response.syncDuration,
          lastSyncTime: response.lastSyncTime || new Date().toISOString(),
          syncHistoryId: response.syncHistoryId
        };
      }
      
      throw new Error('同步元数据失败：无效的响应格式');
    } catch (error) {
      console.error('同步元数据错误:', error);
      throw error;
    }
  },
  
  // 获取表元数据
  async getTableMetadata(dataSourceId: string, tableName?: string): Promise<TableMetadata[]> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据返回表元数据，数据源ID: ${dataSourceId}${tableName ? ', 表名: ' + tableName : ''}`);
        
        // 模拟获取表元数据的延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 查找模拟数据源
        const mockDataSource = mockDataSources.find(ds => ds.id === dataSourceId);
        if (!mockDataSource) {
          throw new Error(`未找到ID为${dataSourceId}的数据源`);
        }
        
        // 模拟表元数据，确保符合TableMetadata接口定义
        const mockTables: TableMetadata[] = Array.from({ length: 15 }, (_, i) => ({
          name: `mock_table_${i+1}`,
          schema: 'public',
          type: i % 3 === 0 ? 'TABLE' : (i % 3 === 1 ? 'VIEW' : 'MATERIALIZED_VIEW'),
          comment: `这是一个模拟的${i % 3 === 0 ? '表' : '视图'} ${i+1}`,
          // 确保符合ColumnMetadata接口定义的列数据
          columns: Array.from({ length: 5 + i }, (_, j) => ({
            name: `column_${j+1}`,
            type: j % 5 === 0 ? 'INTEGER' : (j % 5 === 1 ? 'VARCHAR' : (j % 5 === 2 ? 'TIMESTAMP' : (j % 5 === 3 ? 'BOOLEAN' : 'DECIMAL'))),
            nullable: j % 2 === 0,
            primaryKey: j === 0,
            foreignKey: j === 1,
            unique: j === 2,
            autoIncrement: j === 0,
            comment: j === 0 ? `这是表${i+1}的主键列` : `这是表${i+1}的列${j+1}`,
            defaultValue: undefined,
            size: j % 5 === 1 ? 255 : undefined,
            scale: j % 5 === 4 ? 2 : undefined
          })),
          primaryKey: ['column_1']
        }));
        
        // 如果指定了表名，返回该表的元数据
        if (tableName) {
          const mockTable = mockTables.find(t => t.name === tableName);
          return mockTable ? [mockTable] : [];
        }
        
        return mockTables;
      }
      
      // 使用标准API路径
      const url = tableName 
        ? `${METADATA_API_BASE_URL}/${dataSourceId}/tables/${tableName}`
        : `${METADATA_API_BASE_URL}/${dataSourceId}/tables`;

      console.log(`获取表元数据URL: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`获取表元数据失败: ${response.statusText}`);
      }

      // 处理多种可能的响应格式
      const responseText = await response.text();
      console.log(`表元数据原始响应: ${responseText.substring(0, 100)}...`);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('解析表元数据响应失败:', e);
        throw new Error(`解析表元数据响应失败: ${responseText.substring(0, 100)}`);
      }
      
      // 处理标准化的 success/data/items/pagination 响应格式
      if (responseData.success === true && responseData.data && responseData.data.items) {
        console.log(`从标准化响应中提取表元数据: ${responseData.data.items.length}个表`);
        return responseData.data.items;
      } 
      // 处理直接返回表对象的情况
      else if (tableName && responseData.name) {
        console.log(`获取到单个表元数据: ${responseData.name}`);
        return [responseData];
      }
      // 处理直接返回表数组的情况
      else if (Array.isArray(responseData)) {
        console.log(`获取到表元数据数组: ${responseData.length}个表`);
        return responseData;
      }
      // 处理返回对象的情况
      else if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        // 如果是对象但不是数组，可能是旧格式的键值对
        if (Object.keys(responseData).length > 0 && typeof Object.values(responseData)[0] === 'object') {
          console.log(`从对象中提取表元数据: ${Object.keys(responseData).length}个表`);
          return Object.values(responseData);
        }
        // 单个表的情况
        else if (responseData.name) {
          console.log(`获取到单个表元数据对象: ${responseData.name}`);
          return [responseData];
        }
      }
      
      // 无法识别的响应格式
      console.error('无法识别的表元数据响应格式:', responseData);
      return [];
    } catch (error) {
      console.error('获取表元数据错误:', error);
      throw error;
    }
  },
  
  // 获取表字段信息
  async getTableColumns(dataSourceId: string, tableName: string): Promise<ColumnMetadata[]> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据返回表列信息，数据源ID: ${dataSourceId}, 表名: ${tableName}`);
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 生成模拟列数据，符合ColumnMetadata接口
        const mockColumns: ColumnMetadata[] = Array.from({ length: 10 }, (_, i) => ({
          name: `column_${i+1}`,
          type: i % 5 === 0 ? 'INTEGER' : (i % 5 === 1 ? 'VARCHAR' : (i % 5 === 2 ? 'TIMESTAMP' : (i % 5 === 3 ? 'BOOLEAN' : 'DECIMAL'))),
          nullable: i % 2 === 0,
          primaryKey: i === 0,
          foreignKey: i === 1,
          unique: i === 2,
          autoIncrement: i === 0,
          comment: i === 0 ? `这是表${tableName}的主键列` : `这是表${tableName}的列${i+1}`,
          defaultValue: undefined,
          size: i % 5 === 1 ? 255 : undefined,
          scale: i % 5 === 4 ? 2 : undefined,
          referencedTable: i === 1 ? 'mock_reference_table' : undefined,
          referencedColumn: i === 1 ? 'id' : undefined
        }));
        
        return mockColumns;
      }
      
      // 使用标准API路径
      const url = `${METADATA_API_BASE_URL}/${dataSourceId}/tables/${tableName}/columns`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`获取表字段信息失败: ${response.statusText}`)
      }

      const data = await handleResponse<any>(response)
      return data
    } catch (error) {
      console.error('获取表字段信息错误:', error)
      throw error
    }
  },
  
  // 获取表关系
  async getTableRelationships(dataSourceId: string): Promise<TableRelationship[]> {
    try {
      // 构建查询参数获取表关系，根据新API格式
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/relationships`)
      
      if (!response.ok) {
        throw new Error(`获取表关系失败: ${response.statusText}`)
      }
      
      // 从响应中提取关系信息
      const data = await handleResponse<any>(response)
      return data.relationships || []
    } catch (error) {
      console.error(`获取数据源${dataSourceId}表关系错误:`, error)
      throw error
    }
  },
  
  // 获取表数据预览
  async getTableDataPreview(
    dataSourceId: string, 
    tableName: string,
    params: { 
      page?: number, 
      size?: number, 
      sort?: string, 
      order?: 'asc' | 'desc',
      filters?: Record<string, any>
    } = {}
  ) {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据返回表数据预览，数据源ID: ${dataSourceId}, 表名: ${tableName}, 参数:`, params);
        
        // 模拟数据加载延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 生成随机数据行数（10-50之间）
        const totalRows = 45;
        
        // 计算当前页的数据
        const page = params.page || 1;
        const size = params.size || 10;
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, totalRows);
        const totalPages = Math.ceil(totalRows / size);
        
        // 创建列定义
        const columns = [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'VARCHAR' },
          { name: 'description', type: 'TEXT' },
          { name: 'price', type: 'DECIMAL' },
          { name: 'quantity', type: 'INTEGER' },
          { name: 'created_at', type: 'TIMESTAMP' },
          { name: 'is_active', type: 'BOOLEAN' }
        ];
        
        // 生成当前页的行数据
        const rows = Array.from({ length: endIndex - startIndex }, (_, i) => {
          const rowIndex = startIndex + i + 1;
          return {
            id: rowIndex,
            name: `Item ${rowIndex}`,
            description: `Description for item ${rowIndex}`,
            price: parseFloat((Math.random() * 1000).toFixed(2)),
            quantity: Math.floor(Math.random() * 100),
            created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
            is_active: Math.random() > 0.2
          };
        });
        
        return {
          data: rows,
          columns: columns,
          page: page,
          size: size,
          total: totalRows,
          totalPages: totalPages
        };
      }
      
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('page', (params.page || 1).toString());
      queryParams.append('size', (params.size || 10).toString());
      
      if (params.sort) {
        queryParams.append('sort', params.sort);
        if (params.order) {
          queryParams.append('order', params.order);
        }
      }
      
      // 添加过滤条件
      if (params.filters && typeof params.filters === 'object') {
        for (const key in params.filters) {
          const value = params.filters[key];
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(`filter[${key}]`, value.toString());
          }
        }
      }
      
      // 使用新的API路径格式
      const url = `/api/metadata/${dataSourceId}/tables/${tableName}/data?${queryParams.toString()}`;
      console.log('获取表数据预览, URL:', url);
      
      const response = await fetch(url);
      const responseText = await response.text();
      console.log('表数据预览原始响应文本:', responseText.substring(0, 500) + (responseText.length > 500 ? '...(截断)' : ''));
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('解析表数据预览响应失败:', e);
        throw new Error('解析服务器响应失败');
      }
      
      if (!data.success) {
        console.error('获取表数据预览失败:', data.message);
        throw new Error(data.message || '获取表数据预览失败');
      }
      
      // 处理数据格式，兼容不同的API响应结构
      let rows: any[] = [];
      let formattedColumns: { name: string, type: string }[] = [];
      let pagination = {
        page: params.page || 1,
        size: params.size || 10,
        total: 0,
        totalPages: 0
      };
      
      // 使用统一的API响应格式
      const responseData = data.data;
      
      // 现在使用items字段而不是rows
      if (responseData.items !== undefined) {
        rows = responseData.items || [];
      } else if (responseData.rows !== undefined) {
        // 兼容旧格式
        rows = responseData.rows || [];
      } else if (Array.isArray(responseData)) {
        // 直接返回数组的情况
        rows = responseData;
      }
      
      // 处理列信息
      if (responseData.columns && Array.isArray(responseData.columns)) {
        formattedColumns = responseData.columns.map((col: any) => {
          // 处理MySQL DESC格式的列
          if (col.Field) {
            return {
              name: col.Field,
              type: col.Type || 'VARCHAR'
            };
          }
          // 处理标准格式的列
          return {
            name: col.name || col.column_name || col.columnName || col.Field || '',
            type: col.type || col.data_type || col.dataType || col.Type || 'VARCHAR'
          };
        });
      } else if (rows.length > 0) {
        // 如果没有列信息但有数据，从数据中推断列
        formattedColumns = Object.keys(rows[0]).map(key => ({
          name: key,
          type: typeof rows[0][key] === 'number' ? 'NUMBER' : 
                typeof rows[0][key] === 'boolean' ? 'BOOLEAN' : 'VARCHAR'
        }));
      }
      
      // 处理分页信息 - 现在使用统一的pagination对象
      if (responseData.pagination) {
        pagination = {
          page: responseData.pagination.page !== undefined ? responseData.pagination.page : (params.page || 1),
          size: responseData.pagination.size !== undefined ? responseData.pagination.size : (params.size || 10),
          total: responseData.pagination.total || rows.length,
          totalPages: responseData.pagination.totalPages !== undefined ? 
                      responseData.pagination.totalPages : 
                      Math.ceil((responseData.pagination.total || rows.length) / (responseData.pagination.size || params.size || 10))
        };
      } else {
        // 兼容旧格式或简单格式
        pagination = {
          page: responseData.page !== undefined ? responseData.page : (params.page || 1),
          size: responseData.size !== undefined ? responseData.size : (params.size || 10),
          total: responseData.total || rows.length,
          totalPages: responseData.totalPages !== undefined ? 
                      responseData.totalPages : 
                      Math.ceil((responseData.total || rows.length) / (responseData.size || params.size || 10))
        };
      }
      
      return {
        data: rows,
        columns: formattedColumns,
        page: pagination.page,
        size: pagination.size,
        total: pagination.total,
        totalPages: pagination.totalPages
      };
    } catch (error) {
      console.error(`获取数据源${dataSourceId}表${tableName}预览错误:`, error);
      throw error;
    }
  },
  
  // 使用表格预览功能作为备选方案
  async getTablePreview(dataSourceId: string, tableName: string, limit: number = 10): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('limit', limit.toString())
      
      // 使用新的预览API路径
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/tables/${tableName}/preview?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`获取表预览数据失败: ${response.statusText}`)
      }
      
      return handleResponse<any[]>(response)
    } catch (error) {
      console.error(`获取数据源${dataSourceId}表${tableName}预览错误:`, error)
      throw error
    }
  },
  
  // 搜索数据源元数据
  async searchMetadata(dataSourceId: string, keyword: string): Promise<any> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('keyword', keyword)
      
      // 使用新的搜索API路径
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/search?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`搜索元数据失败: ${response.statusText}`)
      }
      
      return handleResponse<any>(response)
    } catch (error) {
      console.error(`搜索数据源${dataSourceId}元数据错误:`, error)
      throw error
    }
  },
  
  // 获取数据源统计信息
  async getDataSourceStats(id: string): Promise<DataSourceStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/stats`)
      
      if (!response.ok) {
        throw new Error(`获取数据源统计信息失败: ${response.statusText}`)
      }
      
      const result = await handleResponse<any>(response)
      
      // 转换为前端所需的格式
      return {
        dataSourceId: id,
        tablesCount: result.tablesCount || 0,
        viewsCount: result.viewsCount || 0,
        totalRows: result.totalRows || 0,
        totalSize: result.totalSize || '0 MB',
        lastUpdate: result.lastUpdate || new Date().toISOString(),
        queriesCount: result.queriesCount || 0,
        connectionPoolSize: result.connectionPoolSize || 0,
        activeConnections: result.activeConnections || 0,
        avgQueryTime: result.avgQueryTime || '0ms',
        totalTables: result.totalTables || result.tablesCount || 0,
        totalViews: result.totalViews || result.viewsCount || 0, 
        totalQueries: result.totalQueries || result.queriesCount || 0,
        avgResponseTime: result.avgResponseTime || 0,
        peakConnections: result.peakConnections || 0
      }
    } catch (error) {
      console.error(`获取数据源${id}统计信息错误:`, error)
      throw error
    }
  },
  
  // 新增: 获取同步历史记录
  async getSyncHistory(dataSourceId: string): Promise<any[]> {
    try {
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/sync-history`)
      
      if (!response.ok) {
        throw new Error(`获取同步历史失败: ${response.statusText}`)
      }
      
      return handleResponse<any[]>(response)
    } catch (error) {
      console.error(`获取数据源${dataSourceId}同步历史错误:`, error)
      throw error
    }
  },

  // 新增: 分析表列的详细信息
  async analyzeColumns(dataSourceId: string, tableName: string, columnNames?: string[]): Promise<any> {
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams()
      queryParams.append('tableName', tableName)
      if (columnNames && columnNames.length) {
        queryParams.append('columns', columnNames.join(','))
      }
      
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/columns/analyze?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`分析列详情失败: ${response.statusText}`)
      }
      
      return handleResponse<any>(response)
    } catch (error) {
      console.error(`分析数据源${dataSourceId}表${tableName}列错误:`, error)
      throw error
    }
  },

  // 测试现有数据源连接
  async testExistingConnection(id: string): Promise<ConnectionTestResult> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回现有数据源连接测试结果');
        
        // 查找模拟数据源
        const mockDataSource = mockDataSources.find(ds => ds.id === id);
        
        // 模拟1秒的延迟，模拟真实连接测试的时间
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 始终返回成功的连接测试结果
        return {
          success: true,
          message: '连接测试成功',
          details: {
            connectionTime: '120ms',
            serverVersion: `Mock ${mockDataSource?.type?.toUpperCase() || 'DATABASE'} Server 5.7.0`,
            dbName: mockDataSource?.database || 'mock_database'
          }
        };
      }
      
      // 使用API文档中的正确路径：/datasources/{id}/test
      const response = await fetch(`${API_BASE_URL}/${id}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`测试连接API返回错误: ${response.status} ${response.statusText}`, errorText);
        
        let errorMessage = '测试连接失败';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // 如果无法解析JSON，使用原始错误文本
          errorMessage = errorText || errorMessage;
        }
        
        return {
          success: false,
          message: errorMessage,
          details: { status: response.status, statusText: response.statusText }
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        message: data.message,
        details: data.details
      };
    } catch (error) {
      console.error('测试数据源连接失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '测试连接失败',
        details: error
      };
    }
  },

  // 高级搜索
  async advancedSearch(params: {
    keyword: string,
    dataSourceIds: string[],
    entityTypes: ('table' | 'column' | 'view')[],
    caseSensitive?: boolean,
    page?: number,
    size?: number
  }): Promise<any> {
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('keyword', params.keyword);
      
      if (params.dataSourceIds && params.dataSourceIds.length > 0) {
        params.dataSourceIds.forEach(id => queryParams.append('dataSourceIds', id));
      }
      
      if (params.entityTypes && params.entityTypes.length > 0) {
        params.entityTypes.forEach(type => queryParams.append('entityTypes', type));
      }
      
      if (params.caseSensitive !== undefined) {
        queryParams.append('caseSensitive', params.caseSensitive.toString());
      }
      
      if (params.page !== undefined) {
        queryParams.append('page', params.page.toString());
      }
      
      if (params.size !== undefined) {
        queryParams.append('size', params.size.toString());
      }
      
      // 发送请求
      const response = await fetch(`${METADATA_API_BASE_URL}/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`高级搜索失败: ${response.statusText}`);
      }
      
      // 解析响应
      const result = await response.json();
      console.log('高级搜索结果:', result);
      
      // 处理嵌套数据结构
      const data = result.success && result.data ? result.data : result;
      
      // 转换为标准分页格式
      return {
        items: data.items || [],
        total: data.total || 0,
        page: data.page || params.page || 1,
        size: data.size || params.size || 10,
        totalPages: data.totalPages || 0
      };
    } catch (error) {
      console.error('高级搜索失败:', error);
      throw error;
    }
  },

  // 根据ID获取数据源名称
  async getDataSourceName(id: string): Promise<string> {
    if (!id) return '未指定';
    
    try {
      const dataSource = await this.getDataSource(id);
      return dataSource?.name || '未指定';
    } catch (error) {
      console.error(`获取数据源${id}名称失败:`, error);
      return '未指定';
    }
  },
  
  // 批量获取数据源名称
  async getDataSourceNames(ids: string[]): Promise<Record<string, string>> {
    if (!ids || ids.length === 0) return {};
    
    try {
      // 获取所有数据源
      const response = await this.getDataSources({ page: 1, size: 100 });
      const dataSources = response.items || [];
      
      // 创建ID到名称的映射
      const nameMap: Record<string, string> = {};
      dataSources.forEach(ds => {
        if (ds.id && ids.includes(ds.id)) {
          nameMap[ds.id] = ds.name || '未指定';
        }
      });
      
      return nameMap;
    } catch (error) {
      console.error('批量获取数据源名称失败:', error);
      // 返回默认值映射
      return ids.reduce((map, id) => ({ ...map, [id]: '未指定' }), {});
    }
  },

  // 检查数据源状态
  async checkDataSourceStatus(id: string): Promise<{
    id: string,
    status: DataSourceStatus,
    isActive: boolean,
    lastCheckedAt: string,
    message: string,
    details?: Record<string, any>
  }> {
    try {
      if (USE_MOCK) {
        console.log('返回模拟数据源状态检查结果');
        // 查找数据源
        const mockDataSource = mockDataSources.find(ds => ds.id === id);
        
        if (!mockDataSource) {
          throw new Error(`未找到ID为${id}的数据源`);
        }
        
        return {
          id: mockDataSource.id,
          status: mockDataSource.status,
          isActive: mockDataSource.isActive || mockDataSource.status !== 'inactive',
          lastCheckedAt: new Date().toISOString(),
          message: mockDataSource.status === 'error' ? '连接失败' : '连接正常',
          details: {
            responseTime: Math.floor(Math.random() * 100) + 10,
            activeConnections: Math.floor(Math.random() * 5) + 1,
            connectionPoolSize: 10
          }
        };
      }
      
      const response = await http.get(`/api/datasources/${id}/check-status`);
      
      // 处理不同响应格式
      if (response.success === true && response.data) {
        return response.data;
      }
      
      // 如果是直接返回状态对象的格式
      if (response.id && response.status) {
        return response;
      }
      
      throw new Error('无法获取数据源状态');
    } catch (error) {
      console.error('检查数据源状态错误:', error);
      throw error;
    }
  }
}

export default dataSourceService