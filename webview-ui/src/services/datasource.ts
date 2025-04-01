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
import { mockDataSourceApi } from '@/mocks/datasource'

// 使用环境变量判断是否使用模拟API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

// API 基础路径
const API_BASE_URL = '/api/datasources'

// 元数据API基础路径 - 已更新为标准API路径
const METADATA_API_BASE_URL = '/api/metadata'

// 定义mock API接口
interface MockDataSourceApi {
  getDataSources: (params: DataSourceQueryParams) => Promise<PageResponse<DataSource>>;
  getDataSource: (id: string) => Promise<DataSource>;
  createDataSource: (data: DataSourceInput) => Promise<DataSource>;
  updateDataSource: (params: UpdateDataSourceParams) => Promise<DataSource>;
  deleteDataSource: (id: string) => Promise<void>;
  testConnection: (data: DataSourceInput) => Promise<ConnectionTestResult>;
  syncMetadata: (params: SyncMetadataParams) => Promise<MetadataSyncResult>;
  getTableMetadata: (dataSourceId: string, tableName?: string) => Promise<TableMetadata | Record<string, TableMetadata>>;
  getTableColumns: (dataSourceId: string, tableName: string) => Promise<ColumnMetadata[]>;
  getTableRelationships: (dataSourceId: string) => Promise<TableRelationship[]>;
  getTableDataPreview: (dataSourceId: string, tableName: string, params: any) => Promise<any>;
  searchMetadata: (dataSourceId: string, keyword: string) => Promise<any>;
  getDataSourceStats: (id: string) => Promise<DataSourceStats>;
}

// 处理统一响应格式
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json()
  // 处理后端统一响应格式
  if (data.success === false) {
    throw new Error(data.error?.message || '请求失败')
  }
  return data.success === undefined ? data : data.data
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
    type: (source.type?.toUpperCase() || 'MYSQL') as DataSourceType, // 后端返回小写的类型
    host: source.host,
    port: source.port,
    databaseName: source.databaseName || source.database || '', // 优先使用databaseName，其次使用database
    database: source.databaseName || source.database || '', // 同时记录database字段确保两边兼容
    username: source.username,
    // 密码通常不会返回
    status: (source.status || 'ACTIVE') as DataSourceStatus,
    syncFrequency: (source.syncFrequency || 'MANUAL') as SyncFrequency,
    lastSyncTime: source.lastSyncTime,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    // 其他可选字段
    errorMessage: source.errorMessage,
    connectionParams: source.connectionParams || {},
    // 额外字段处理
    metadata: source.metadata
  }
}

// 数据源服务
export const dataSourceService = {
  // 获取数据源列表
  async getDataSources(params: DataSourceQueryParams): Promise<PageResponse<DataSource>> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getDataSources(params)
    }

    try {
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
      
      // 发送请求
      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`获取数据源列表失败: ${response.statusText}`);
      }
      
      // 处理响应数据
      const responseData = await response.json();
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
      console.error('获取数据源列表错误:', error)
      throw error
    }
  },
  
  // 获取单个数据源详情
  async getDataSource(id: string): Promise<DataSource> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getDataSource(id)
    }

    try {
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
    if (USE_MOCK_API) {
      return mockDataSourceApi.createDataSource(data)
    }

    try {
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
    if (USE_MOCK_API) {
      return mockDataSourceApi.updateDataSource(params)
    }

    try {
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
    if (USE_MOCK_API) {
      await mockDataSourceApi.deleteDataSource(id)
      return
    }

    try {
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
    if (USE_MOCK_API) {
      return {
        success: true,
        message: '连接测试成功',
        details: {
          databaseType: params.type,
          databaseVersion: '8.0.27',
          driverVersion: '8.0.25',
          pingTime: 20
        }
      }
    }

    try {
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
    if (USE_MOCK_API) {
      return mockDataSourceApi.syncMetadata(params)
    }

    try {
      // 构建符合后端预期的请求体
      const requestBody = {
        filters: {
          includeSchemas: params.filters?.includeSchemas || [],
          excludeSchemas: params.filters?.excludeSchemas || [],
          includeTables: params.filters?.includeTables || [],
          excludeTables: params.filters?.excludeTables || []
        }
      }
      
      console.log(`开始同步元数据，数据源ID: ${params.id}`);
      console.log('请求体:', JSON.stringify(requestBody, null, 2));
      
      // 使用正确的元数据API路径
      const url = `${METADATA_API_BASE_URL}/sync/${params.id}`;
      console.log('请求URL:', url);
      
      const response = await fetch(url, {
        method: 'POST', // 明确指定方法为POST
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      // 获取原始响应文本以便记录
      const responseText = await response.text();
      console.log('原始响应:', responseText);
      
      let responseJson;
      try {
        responseJson = JSON.parse(responseText);
        console.log('解析后的响应:', JSON.stringify(responseJson, null, 2));
      } catch (e) {
        console.error('解析响应JSON失败:', e);
        return {
          success: false,
          message: `解析响应失败: ${responseText.substring(0, 100)}`
        };
      }
      
      if (!response.ok) {
        console.error(`同步元数据API返回错误: ${response.status} ${response.statusText}`);
        return {
          success: false,
          message: responseJson?.message || responseJson?.error || `服务器返回错误: ${response.status} ${response.statusText}`
        };
      }
      
      // 处理可能的嵌套结构
      const result = {
        success: responseJson.success === true,
        message: responseJson.message || '',
        // 兼容两种响应格式（嵌套和非嵌套）
        tablesCount: responseJson.data?.tablesCount || responseJson.tablesCount || 0,
        viewsCount: responseJson.data?.viewsCount || responseJson.viewsCount || 0,
        syncDuration: responseJson.data?.syncDuration || responseJson.syncDuration || 0,
        lastSyncTime: responseJson.data?.lastSyncTime || responseJson.lastSyncTime || new Date().toISOString(),
        syncHistoryId: responseJson.data?.syncHistoryId || responseJson.syncHistoryId || null
      };
      
      console.log('处理后的同步结果:', result);
      return result;
    } catch (error) {
      console.error(`同步数据源${params.id}元数据错误:`, error)
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        tablesCount: 0,
        viewsCount: 0
      }
    }
  },
  
  // 获取表元数据
  async getTableMetadata(dataSourceId: string, tableName?: string): Promise<TableMetadata[]> {
    if (USE_MOCK_API) {
      const result = await mockDataSourceApi.getTableMetadata(dataSourceId, tableName);
      // 确保返回数组格式
      return Array.isArray(result) ? result : (tableName ? [result as TableMetadata] : Object.values(result as Record<string, TableMetadata>));
    }

    try {
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
    if (USE_MOCK_API) {
      return mockDataSourceApi.getTableColumns(dataSourceId, tableName)
    }

    try {
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
    if (USE_MOCK_API) {
      return mockDataSourceApi.getTableRelationships(dataSourceId)
    }

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
    if (USE_MOCK_API) {
      return {
        data: Array(params.size || 10).fill(null).map((_, i) => {
          // 创建一个模拟行，每行包含5列示例数据
          return {
            id: i + 1,
            name: `示例数据 ${i + 1}`,
            created_at: new Date(Date.now() - i * 86400000).toISOString(),
            value: Math.round(Math.random() * 1000) / 10,
            status: ['活跃', '禁用', '待审核'][i % 3]
          };
        }),
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'VARCHAR' },
          { name: 'created_at', type: 'DATETIME' },
          { name: 'value', type: 'DECIMAL' },
          { name: 'status', type: 'VARCHAR' }
        ],
        page: params.page || 1,
        size: params.size || 10,
        total: 100,
        totalPages: 10
      };
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.size) queryParams.append('size', params.size.toString());
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
      
      // 处理过滤条件
      if (params.filters) {
        for (const [key, value] of Object.entries(params.filters)) {
          if (value !== undefined && value !== null) {
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
    if (USE_MOCK_API) {
      // 使用mock api中类似的功能
      const result = await mockDataSourceApi.getTableDataPreview(dataSourceId, tableName, { size: limit });
      return result.data || [];
    }

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
    if (USE_MOCK_API) {
      return mockDataSourceApi.searchMetadata(dataSourceId, keyword)
    }

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
    if (USE_MOCK_API) {
      return mockDataSourceApi.getDataSourceStats(id)
    }

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
    if (USE_MOCK_API) {
      // 模拟数据
      return []
    }

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
    if (USE_MOCK_API) {
      // 模拟数据
      return {}
    }

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
    if (USE_MOCK_API) {
      return {
        success: true,
        message: '连接成功',
        details: null
      };
    }

    try {
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
    if (USE_MOCK_API) {
      // 模拟数据
      return {
        items: [],
        total: 0,
        page: params.page || 1,
        size: params.size || 10,
        totalPages: 0
      }
    }

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
  }
}

export default dataSourceService