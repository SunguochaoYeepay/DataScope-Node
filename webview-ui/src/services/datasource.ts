import type {
  DataSource,
  CreateDataSourceParams,
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
    connectionOptions: source.connectionParams || {},
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
      // 构建查询参数
      const queryParams = new URLSearchParams()
      if (params.name) queryParams.append('name', params.name)
      if (params.type) queryParams.append('type', params.type.toLowerCase()) // 发送小写类型
      if (params.status) queryParams.append('status', params.status)
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size) queryParams.append('size', params.size.toString())
      
      // 发送请求
      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error(`获取数据源列表失败: ${response.statusText}`)
      }
      
      // 处理响应数据 - 文档中明确返回的是数组而非分页对象
      const rawData = await handleResponse<any[]>(response)
      
      // 将后端数据适配为前端需要的格式
      const adaptedData: DataSource[] = Array.isArray(rawData) 
        ? rawData.map(adaptDataSource) 
        : [];
      
      // 手动构造分页对象
      return {
        items: adaptedData,
        total: adaptedData.length,
        page: params.page || 1,
        size: params.size || adaptedData.length,
        totalPages: Math.ceil(adaptedData.length / (params.size || adaptedData.length || 10))
      }
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
  async createDataSource(params: CreateDataSourceParams): Promise<DataSource> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.createDataSource(params)
    }

    try {
      // 转换参数格式以匹配后端期望
      const requestBody = {
        name: params.name,
        description: params.description,
        type: params.type.toLowerCase(), // 后端期望小写的类型
        host: params.host,
        port: params.port,
        database: params.database || params.databaseName, // 优先使用database，其次使用databaseName
        username: params.username,
        password: params.password,
        syncFrequency: params.syncFrequency,
        // 转换字段名称不同的属性
        connectionParams: params.connectionOptions || {} // 后端使用connectionParams
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
      
      // 处理响应数据 - 注意后端返回的格式可能是 { success: true, data: {...} }
      const result = await response.json()
      const data = result.data || result  // 兼容不同的响应格式
      
      return adaptDataSource(data)
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
        database: params.database || params.databaseName, // 优先使用database，其次使用databaseName
        username: params.username,
        // 只有在明确提供时才发送密码
        ...(params.password && { password: params.password }),
        syncFrequency: params.syncFrequency,
        // 转换字段名称不同的属性
        connectionParams: params.connectionOptions || {} // 后端使用connectionParams
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
      
      // 处理响应数据 - 注意后端返回的格式可能是 { success: true, data: {...} }
      const result = await response.json()
      const data = result.data || result  // 兼容不同的响应格式
      
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
      return mockDataSourceApi.testConnection(params)
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

      const data = await response.json();
      return {
        success: data.success,
        message: data.message,
        details: data.details
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
  async getTableMetadata(dataSourceId: string, tableName?: string): Promise<TableMetadata | Record<string, TableMetadata>> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getTableMetadata(dataSourceId, tableName as string)
    }

    try {
      console.log('获取表元数据，API路径:', `${METADATA_API_BASE_URL}/${dataSourceId}/tables${tableName ? `/${tableName}` : ''}`)
      
      // 使用新的元数据API路径格式
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/tables${tableName ? `/${tableName}` : ''}`)
      
      // 如果响应不成功，尝试另一种方式
      if (!response.ok) {
        console.warn(`获取表元数据失败: ${response.statusText}，尝试直接构建元数据`)
        
        // 尝试构建基本元数据
        if (tableName) {
          // 如果指定了表名，直接获取该表的列信息
          try {
            const columns = await this.getTableColumns(dataSourceId, tableName);
            console.log(`直接获取到表${tableName}的列信息:`, columns);
            
            // 手动构建表元数据
            const tableMetadata: TableMetadata = {
              name: tableName,
              type: 'TABLE',
              schema: 'public',
              columns: columns || []
            };
            
            return tableMetadata;
          } catch (err) {
            console.error(`获取表${tableName}列信息失败:`, err);
            return {} as TableMetadata;
          }
        } else {
          // 如果没有指定表名，尝试获取表列表并为每个表获取列信息
          const tablesResponse = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/tables`);
          if (!tablesResponse.ok) {
            console.error(`获取表列表失败: ${tablesResponse.statusText}`);
            return {};
          }
          
          const tablesData = await tablesResponse.json();
          console.log('获取到的表列表:', tablesData);
          
          if (!tablesData.success || !tablesData.data || !Array.isArray(tablesData.data)) {
            console.error('表列表格式不正确');
            return {};
          }
          
          // 获取表列表
          const tables = tablesData.data;
          const result: Record<string, TableMetadata> = {};
          
          // 只处理前3个表避免过多请求
          const limitedTables = tables.slice(0, 3);
          
          // 为每个表创建基本元数据
          for (const table of limitedTables) {
            const tableName = table.name.name;
            result[tableName] = {
              name: tableName,
              type: 'TABLE',
              schema: table.schema || 'public',
              columns: [] // 先设为空数组
            };
          }
          
          return result;
        }
      }
      
      // 解析正常响应
      const responseData = await response.json();
      console.log('解析后的API响应:', responseData);
      
      // 如果请求失败，返回空对象而不是抛出异常
      if (!responseData || (responseData.success === false)) {
        console.error(`获取表元数据失败: ${responseData?.message || '未知错误'}`)
        return tableName ? {} as TableMetadata : {}
      }
      
      // 处理不同的返回格式
      let tables;
      if (responseData.success && responseData.data) {
        // 新格式: { success: true, data: {...} }
        tables = responseData.data;
      } else if (Array.isArray(responseData)) {
        // 数组格式: [{table1}, {table2}]
        tables = responseData.reduce((acc, table) => {
          acc[table.name] = table;
          return acc;
        }, {});
      } else {
        // 假设是直接返回的对象: {table1: {...}, table2: {...}}
        tables = responseData;
      }
      
      console.log('处理后的表数据:', tables);
      
      // 如果指定了表名，尝试加载该表的字段信息
      if (tableName) {
        try {
          const tableData = tables[tableName] || {} as TableMetadata;
          // 如果表中没有列信息或列信息为空数组，尝试从新API获取
          if (!tableData.columns || tableData.columns.length === 0) {
            const columnsData = await this.getTableColumns(dataSourceId, tableName);
            if (columnsData && Array.isArray(columnsData)) {
              tableData.columns = columnsData;
            }
          }
          return tableData;
        } catch (columnsError) {
          console.error(`获取表${tableName}的列信息失败:`, columnsError);
          // 即使获取列失败，也返回已有的表信息
          return tables[tableName] || {} as TableMetadata;
        }
      }
      
      // 如果指定了表名，返回特定表的元数据；否则返回所有表
      return tableName ? tables[tableName] || {} as TableMetadata : tables
    } catch (error) {
      console.error(`获取数据源${dataSourceId}表元数据错误:`, error)
      // 返回空对象而不是抛出异常
      return tableName ? {} as TableMetadata : {}
    }
  },
  
  // 获取表字段信息
  async getTableColumns(dataSourceId: string, tableName: string): Promise<ColumnMetadata[]> {
    if (USE_MOCK_API) {
      // 返回模拟的列数据
      return Array(5).fill(null).map((_, i) => ({
        name: `column_${i + 1}`,
        type: ['VARCHAR', 'INTEGER', 'DATETIME', 'BOOLEAN', 'DECIMAL'][i % 5],
        nullable: i % 2 === 0,
        defaultValue: i % 3 === 0 ? 'default_value' : undefined,
        primaryKey: i === 0,
        foreignKey: i === 1,
        referencedTable: i === 1 ? 'referenced_table' : undefined,
        referencedColumn: i === 1 ? 'referenced_column' : undefined,
        unique: i === 2,
        autoIncrement: i === 0,
        comment: `示例列 ${i + 1}`,
        size: i === 0 ? undefined : i * 10
      }));
    }

    try {
      console.log('获取表字段信息，API路径:', `${METADATA_API_BASE_URL}/${dataSourceId}/tables/${tableName}/columns`);
      
      // 调用新的API端点获取表的列信息
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/tables/${tableName}/columns`);
      
      // 如果响应不成功，记录错误信息但不抛出异常
      if (!response.ok) {
        console.warn(`获取表${tableName}的列信息返回状态码:`, response.status);
        // 尝试获取错误信息
        const errorText = await response.text();
        console.warn('错误详情:', errorText);
        return [];
      }
      
      // 解析响应数据
      const responseData = await response.json();
      console.log('获取表字段的响应数据:', responseData);
      
      // 检查响应格式并提取列信息
      let columns: any[] = [];
      
      if (responseData.success && Array.isArray(responseData.data)) {
        // 标准格式: { success: true, data: [...columns] }
        columns = responseData.data;
      } else if (Array.isArray(responseData)) {
        // 数组格式: [column1, column2, ...]
        columns = responseData;
      } else {
        console.warn('未能识别的列数据格式:', responseData);
        return [];
      }
      
      // 将后端返回的字段格式转换为前端需要的ColumnMetadata格式
      return columns.map(col => {
        // 从后端响应解析数据类型和大小
        let type = col.dataType || col.type || '';
        let size: number | undefined = undefined;
        
        // 尝试从columnType中提取类型大小信息 (例如: varchar(191))
        if (col.columnType) {
          const sizeMatch = col.columnType.match(/\((\d+)\)/);
          if (sizeMatch && sizeMatch[1]) {
            size = parseInt(sizeMatch[1], 10);
          }
        }
        
        // 构造ColumnMetadata对象
        const columnMetadata: ColumnMetadata = {
          name: col.name,
          type: type.toUpperCase(), // 统一大写
          size: size,
          nullable: col.isNullable === 1 || col.isNullable === true || col.nullable === true,
          defaultValue: col.defaultValue === 'NULL' ? null : col.defaultValue,
          primaryKey: col.isPrimaryKey === 1 || col.isPrimaryKey === true || col.primaryKey === true,
          foreignKey: col.isForeignKey === 1 || col.isForeignKey === true || col.foreignKey === true,
          unique: col.isUnique === 1 || col.isUnique === true || col.unique === true, 
          autoIncrement: col.isAutoIncrement === 1 || col.isAutoIncrement === true || col.autoIncrement === true,
          comment: col.comment || ''
        };
        
        // 如果有外键引用信息，添加到结果中
        if (col.referencedTable) {
          columnMetadata.referencedTable = col.referencedTable;
        }
        if (col.referencedColumn) {
          columnMetadata.referencedColumn = col.referencedColumn;
        }
        
        return columnMetadata;
      });
    } catch (error) {
      console.error(`获取表${tableName}的字段信息失败:`, error);
      return [];
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
      
      // 检查不同的响应格式并适配
      if (data.data.rows !== undefined) {
        // 标准格式 data.data.rows
        rows = data.data.rows || [];
        
        // 处理columns格式转换，将MySQL格式的列定义转换为组件需要的格式
        if (data.data.columns && Array.isArray(data.data.columns)) {
          formattedColumns = data.data.columns.map((col: any) => {
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
        }
        
        // 处理分页信息
        if (data.data.pagination) {
          pagination = {
            ...pagination,
            page: data.data.pagination.page || params.page || 1,
            size: data.data.pagination.size || params.size || 10,
            total: data.data.pagination.total || 0,
            totalPages: data.data.pagination.totalPages || 0
          };
        }
      } else if (Array.isArray(data.data)) {
        // 如果直接返回了数据数组
        rows = data.data;
        // 尝试从第一行数据推断列
        if (rows.length > 0) {
          formattedColumns = Object.keys(rows[0]).map(key => ({
            name: key,
            type: typeof rows[0][key] === 'number' ? 'NUMBER' : 
                  typeof rows[0][key] === 'boolean' ? 'BOOLEAN' : 'VARCHAR'
          }));
        }
      } else {
        // 如果返回了其他结构，给出警告但尝试处理
        console.warn('未识别的表数据预览响应格式:', data);
        rows = [];
      }
      
      return {
        data: rows,
        columns: formattedColumns,
        page: pagination.page,
        size: pagination.size,
        total: pagination.total || rows.length,
        totalPages: pagination.totalPages || Math.ceil((pagination.total || rows.length) / pagination.size)
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