import type {
  QueryVersion,
  QueryVersionStatus,
  GetVersionsParams,
  CreateVersionParams,
  UpdateVersionParams
} from '@/types/queryVersion';
import { getApiBaseUrl } from './query';
import type { PageResponse } from '@/types/query';

// 检查是否启用mock模式
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
console.log('查询版本服务 - Mock模式:', USE_MOCK ? '已启用' : '已禁用');

// 模拟数据：查询版本
const mockVersions: QueryVersion[] = [
  // 查询1的版本
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `ver-query-1-${i + 1}`,
    queryId: 'query-1',
    versionNumber: i + 1,
    queryText: `SELECT * FROM users WHERE id > ${i * 10}\nLIMIT 100;`,
    status: i === 0 ? 'PUBLISHED' : (i === 4 ? 'DEPRECATED' : 'DRAFT') as QueryVersionStatus,
    isActive: i === 0,
    createdAt: new Date(Date.now() - (5 - i) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (5 - i) * 86400000 + 3600000).toISOString(),
    publishedAt: i === 0 ? new Date(Date.now() - (5 - i) * 86400000 + 7200000).toISOString() : undefined,
    deprecatedAt: i === 4 ? new Date().toISOString() : undefined,
    dataSourceId: 'ds-1'
  })),
  
  // 查询2的版本
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `ver-query-2-${i + 1}`,
    queryId: 'query-2',
    versionNumber: i + 1,
    queryText: `SELECT * FROM products WHERE category_id = ${i + 1}\nORDER BY price DESC\nLIMIT 50;`,
    status: i === 0 ? 'PUBLISHED' : 'DRAFT' as QueryVersionStatus,
    isActive: i === 0,
    createdAt: new Date(Date.now() - (3 - i) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (3 - i) * 86400000 + 3600000).toISOString(),
    publishedAt: i === 0 ? new Date(Date.now() - (3 - i) * 86400000 + 7200000).toISOString() : undefined,
    dataSourceId: 'ds-1'
  })),
  
  // 查询3的版本
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `ver-query-3-${i + 1}`,
    queryId: 'query-3',
    versionNumber: i + 1,
    queryText: `SELECT o.id, o.order_date, c.name as customer_name, SUM(oi.quantity * oi.price) as total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN order_items oi ON o.id = oi.order_id\nWHERE o.order_date > '2023-01-01'\nGROUP BY o.id, o.order_date, c.name\nORDER BY total_amount DESC\nLIMIT ${(i + 1) * 10};`,
    status: i === 0 ? 'PUBLISHED' : 'DRAFT' as QueryVersionStatus,
    isActive: i === 0,
    createdAt: new Date(Date.now() - (2 - i) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (2 - i) * 86400000 + 3600000).toISOString(),
    publishedAt: i === 0 ? new Date(Date.now() - (2 - i) * 86400000 + 7200000).toISOString() : undefined,
    dataSourceId: 'ds-2'
  }))
];

// 版本服务
export const versionService = {
  // 获取查询服务的版本列表
  async getVersions(params: GetVersionsParams): Promise<PageResponse<QueryVersion>> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据返回查询版本列表，查询ID: ${params.queryId}`);
        
        // 过滤版本数据
        let filteredVersions = [...mockVersions];
        
        // 按状态过滤
        if (params.status) {
          filteredVersions = filteredVersions.filter(v => v.status === params.status);
        }
        
        // 应用分页
        const page = params.page || 1;
        const size = params.size || 10;
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, filteredVersions.length);
        
        // 返回分页结果
        return {
          items: filteredVersions.slice(startIndex, endIndex),
          total: filteredVersions.length,
          page: page,
          size: size,
          totalPages: Math.ceil(filteredVersions.length / size)
        };
      }
      
      // 构建查询参数
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.size) queryParams.append('size', params.size.toString());
      if (params.status) queryParams.append('status', params.status);
      
      const url = `${getApiBaseUrl()}/api/queries/${params.queryId}/versions?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`获取版本列表失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return {
        items: result.data.map(mapVersionFromApi),
        total: result.total,
        page: result.page,
        size: result.size,
        totalPages: result.totalPages
      };
    } catch (error) {
      console.error('获取版本列表失败:', error);
      throw error;
    }
  },
  
  // 获取单个版本
  async getVersion(versionId: string): Promise<QueryVersion> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据返回查询版本详情，版本ID: ${versionId}`);
        
        // 查找模拟版本
        const mockVersion = mockVersions.find(v => v.id === versionId);
        
        // 如果找不到版本，抛出错误
        if (!mockVersion) {
          throw new Error(`获取版本详情失败: 未找到版本 ${versionId}`);
        }
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 返回找到的版本
        return mockVersion;
      }
      
      const url = `${getApiBaseUrl()}/api/queries/versions/${versionId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`获取版本详情失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('获取到版本详情原始数据:', result);
      
      // 尝试识别结果的格式（有些API返回包裹在data字段，有些直接返回对象）
      const versionData = result.data || result;
      
      // 确保结果非空
      if (!versionData || Object.keys(versionData).length === 0) {
        throw new Error(`获取版本详情失败: 服务器返回空数据`);
      }
      
      return mapVersionFromApi(versionData);
    } catch (error) {
      console.error('获取版本详情失败:', error);
      throw error;
    }
  },
  
  // 创建版本
  async createVersion(params: CreateVersionParams): Promise<QueryVersion> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据创建查询版本，查询ID: ${params.queryId}`);
        
        // 创建新的版本编号（当前最大版本号+1）
        const maxVersionNumber = Math.max(...mockVersions
          .filter(v => v.queryId === params.queryId)
          .map(v => v.versionNumber), 0);
        const newVersionNumber = maxVersionNumber + 1;
        
        // 创建新的模拟版本
        const newVersion: QueryVersion = {
          id: `ver-${params.queryId}-${newVersionNumber}`,
          queryId: params.queryId,
          versionNumber: newVersionNumber,
          queryText: params.sqlContent,
          status: 'DRAFT',
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dataSourceId: params.dataSourceId
        };
        
        // 添加到模拟数据中
        mockVersions.push(newVersion);
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return newVersion;
      }
      
      const url = `${getApiBaseUrl()}/api/queries/${params.queryId}/versions`;
      
      console.log('创建版本，请求URL:', url);
      console.log('创建版本，请求参数:', params);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sqlContent: params.sqlContent,
          dataSourceId: params.dataSourceId,
          description: params.description || ''
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('创建版本失败，状态码:', response.status, '错误信息:', errorText);
        throw new Error(`创建版本失败: ${response.statusText} (${response.status})`);
      }
      
      const result = await response.json();
      console.log('创建版本成功，返回结果:', result);
      return mapVersionFromApi(result.data);
    } catch (error) {
      console.error('创建版本失败:', error);
      throw error;
    }
  },
  
  // 更新版本
  async updateVersion(params: UpdateVersionParams): Promise<QueryVersion> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据更新查询版本，版本ID: ${params.id}`);
        
        // 查找模拟版本
        const index = mockVersions.findIndex(v => v.id === params.id);
        
        // 如果找不到版本，抛出错误
        if (index === -1) {
          throw new Error(`更新版本失败: 未找到版本 ${params.id}`);
        }
        
        // 更新版本
        if (params.sqlContent) {
          mockVersions[index].queryText = params.sqlContent;
        }
        
        mockVersions[index].updatedAt = new Date().toISOString();
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockVersions[index];
      }
      
      const url = `${getApiBaseUrl()}/api/queries/versions/${params.id}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sqlContent: params.sqlContent
        })
      });
      
      if (!response.ok) {
        throw new Error(`更新版本失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return mapVersionFromApi(result.data);
    } catch (error) {
      console.error('更新版本失败:', error);
      throw error;
    }
  },
  
  // 发布版本
  async publishVersion(versionId: string): Promise<QueryVersion> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据发布查询版本，版本ID: ${versionId}`);
        
        // 查找模拟版本
        const index = mockVersions.findIndex(v => v.id === versionId);
        
        // 如果找不到版本，抛出错误
        if (index === -1) {
          throw new Error(`发布版本失败: 未找到版本 ${versionId}`);
        }
        
        // 更新版本状态
        mockVersions[index].status = 'PUBLISHED';
        mockVersions[index].publishedAt = new Date().toISOString();
        mockVersions[index].updatedAt = new Date().toISOString();
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockVersions[index];
      }
      
      const url = `${getApiBaseUrl()}/api/queries/versions/${versionId}/publish`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`发布版本失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return mapVersionFromApi(result.data);
    } catch (error) {
      console.error('发布版本失败:', error);
      throw error;
    }
  },
  
  // 废弃版本
  async deprecateVersion(versionId: string): Promise<QueryVersion> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据废弃查询版本，版本ID: ${versionId}`);
        
        // 查找模拟版本
        const index = mockVersions.findIndex(v => v.id === versionId);
        
        // 如果找不到版本，抛出错误
        if (index === -1) {
          throw new Error(`废弃版本失败: 未找到版本 ${versionId}`);
        }
        
        // 更新版本状态
        mockVersions[index].status = 'DEPRECATED';
        mockVersions[index].deprecatedAt = new Date().toISOString();
        mockVersions[index].updatedAt = new Date().toISOString();
        
        // 如果该版本是活跃版本，取消活跃状态
        if (mockVersions[index].isActive) {
          mockVersions[index].isActive = false;
        }
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockVersions[index];
      }
      
      const url = `${getApiBaseUrl()}/api/queries/versions/${versionId}/deprecate`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`废弃版本失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return mapVersionFromApi(result.data);
    } catch (error) {
      console.error('废弃版本失败:', error);
      throw error;
    }
  },
  
  // 设置活跃版本
  async activateVersion(queryId: string, versionId: string): Promise<{ success: boolean }> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据设置活跃版本，查询ID: ${queryId}, 版本ID: ${versionId}`);
        
        // 查找模拟版本
        const index = mockVersions.findIndex(v => v.id === versionId);
        
        // 如果找不到版本，抛出错误
        if (index === -1) {
          throw new Error(`设置活跃版本失败: 未找到版本 ${versionId}`);
        }
        
        // 先取消所有版本的活跃状态
        mockVersions
          .filter(v => v.queryId === queryId)
          .forEach(v => v.isActive = false);
        
        // 设置新的活跃版本
        mockVersions[index].isActive = true;
        mockVersions[index].updatedAt = new Date().toISOString();
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { success: true };
      }
      
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/versions/${versionId}/activate`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`设置活跃版本失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return { success: result.success };
    } catch (error) {
      console.error('设置活跃版本失败:', error);
      throw error;
    }
  },
  
  // 执行版本
  async executeVersion(queryId: string, versionId: string, parameters?: any): Promise<any> {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据执行查询版本，查询ID: ${queryId}, 版本ID: ${versionId}`);
        
        // 查找模拟版本
        const version = mockVersions.find(v => v.id === versionId);
        
        // 如果找不到版本，抛出错误
        if (!version) {
          throw new Error(`执行版本失败: 未找到版本 ${versionId}`);
        }
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 生成随机查询结果
        const rowCount = Math.floor(Math.random() * 20) + 5;
        const rows = Array.from({ length: rowCount }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: Math.random() > 0.3 ? 'active' : 'inactive',
          value: Math.floor(Math.random() * 1000)
        }));
        
        return {
          success: true,
          data: {
            id: `execution-${Date.now()}`,
            queryId: queryId,
            versionId: versionId,
            status: 'COMPLETED',
            rowCount: rowCount,
            executionTime: 125,
            rows: rows,
            columns: ['id', 'name', 'created_at', 'status', 'value'],
            fields: [
              { name: 'id', type: 'INTEGER' },
              { name: 'name', type: 'VARCHAR' },
              { name: 'created_at', type: 'TIMESTAMP' },
              { name: 'status', type: 'VARCHAR' },
              { name: 'value', type: 'INTEGER' }
            ]
          }
        };
      }
      
      // 修改为符合后端API的正确URL和参数格式
      const url = `${getApiBaseUrl()}/api/queries/execute`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          queryId,
          versionId,
          dataSourceId: parameters?.dataSourceId, // 确保包含数据源ID
          params: parameters?.params || [] // 查询参数
        })
      });
      
      if (!response.ok) {
        throw new Error(`执行版本失败: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('执行版本失败:', error);
      throw error;
    }
  }
};

// 将API返回的版本数据映射为前端使用的格式
function mapVersionFromApi(result: any): QueryVersion {
  if (!result) {
    console.error('无法映射版本数据：数据为空');
    throw new Error('无法映射版本数据：数据为空');
  }
  
  console.log('映射版本数据:', result);
  
  // 处理可能为null的sqlContent字段
  let queryText = '';
  if (result.queryText) {
    queryText = result.queryText;
  } else if (result.sqlContent && result.sqlContent !== null) {
    queryText = result.sqlContent;
  } else {
    // 如果两者都为空或null，可能需要显示一个特殊提示
    console.warn('警告: 版本查询内容为空');
  }
  
  return {
    id: result.id,
    queryId: result.queryId || result.query_id,
    versionNumber: result.versionNumber || result.version_number || 1,
    status: result.status || result.versionStatus || 'DRAFT',
    queryText: queryText, // 使用处理过的queryText
    createdAt: result.createdAt || result.created_at || new Date().toISOString(),
    updatedAt: result.updatedAt || result.updated_at || new Date().toISOString(),
    publishedAt: result.publishedAt || result.published_at,
    deprecatedAt: result.deprecatedAt || result.deprecated_at,
    isActive: result.isActive || result.is_active || false,
    // 添加其他可能的映射字段
    dataSourceId: result.dataSourceId || result.datasource_id
  };
}