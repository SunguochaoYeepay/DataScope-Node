import type {
  QueryVersion,
  QueryVersionStatus,
  GetVersionsParams,
  CreateVersionParams,
  UpdateVersionParams
} from '@/types/queryVersion';
import { getApiBaseUrl } from './query';
import type { PageResponse } from '@/types/query';

// 模拟API
export const mockVersionApi = {
  // 获取版本列表
  async getVersions(params: GetVersionsParams): Promise<PageResponse<QueryVersion>> {
    console.log('模拟获取版本列表:', params);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 生成模拟数据
    const items: QueryVersion[] = [];
    const totalVersions = 8;
    
    for (let i = 1; i <= totalVersions; i++) {
      let status: QueryVersionStatus = 'PUBLISHED';
      
      // 分配不同状态
      if (i === totalVersions) {
        status = 'DRAFT'; // 最新版本为草稿
      } else if (i < 3) {
        status = 'DEPRECATED'; // 老版本为废弃
      }
      
      items.push({
        id: `version-${params.queryId}-${i}`,
        queryId: params.queryId,
        versionNumber: i,
        status: status,
        queryText: `SELECT * FROM table_${i} WHERE condition = true LIMIT 100`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
        publishedAt: status !== 'DRAFT' ? new Date(Date.now() - i * 86400000 + 3600000).toISOString() : undefined,
        deprecatedAt: status === 'DEPRECATED' ? new Date(Date.now() - 86400000).toISOString() : undefined,
      });
    }
    
    // 应用状态过滤
    let filteredItems = items;
    if (params.status) {
      filteredItems = items.filter(item => item.status === params.status);
    }
    
    // 按版本号降序排序
    filteredItems.sort((a, b) => b.versionNumber - a.versionNumber);
    
    // 分页处理
    const page = params.page || 1;
    const size = params.size || 10;
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedItems = filteredItems.slice(start, end);
    
    return {
      items: paginatedItems,
      total: filteredItems.length,
      page,
      size,
      totalPages: Math.ceil(filteredItems.length / size)
    };
  },
  
  // 获取单个版本
  async getVersion(versionId: string): Promise<QueryVersion> {
    console.log('模拟获取版本详情:', versionId);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 解析版本ID，提取版本号
    const parts = versionId.split('-');
    const queryId = parts[1];
    const versionNumber = parseInt(parts[2]);
    
    // 根据版本号生成不同状态
    let status: QueryVersionStatus = 'PUBLISHED';
    if (versionNumber === 8) {
      status = 'DRAFT';
    } else if (versionNumber < 3) {
      status = 'DEPRECATED';
    }
    
    return {
      id: versionId,
      queryId,
      versionNumber,
      status: status,
      queryText: `SELECT * FROM table_${versionNumber} WHERE condition = true LIMIT 100`,
      createdAt: new Date(Date.now() - versionNumber * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - versionNumber * 86400000).toISOString(),
      publishedAt: status !== 'DRAFT' ? new Date(Date.now() - versionNumber * 86400000 + 3600000).toISOString() : undefined,
      deprecatedAt: status === 'DEPRECATED' ? new Date(Date.now() - 86400000).toISOString() : undefined,
    };
  },
  
  // 创建版本
  async createVersion(params: CreateVersionParams): Promise<QueryVersion> {
    console.log('模拟创建版本:', params);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 获取最新版本号
    const versions = await this.getVersions({ queryId: params.queryId });
    const newVersionNumber = versions.items.length > 0 
      ? Math.max(...versions.items.map(v => v.versionNumber)) + 1 
      : 1;
    
    return {
      id: `version-${params.queryId}-${newVersionNumber}`,
      queryId: params.queryId,
      versionNumber: newVersionNumber,
      status: 'DRAFT',
      queryText: params.sqlContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  // 更新版本
  async updateVersion(params: UpdateVersionParams): Promise<QueryVersion> {
    console.log('模拟更新版本:', params);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 获取现有版本
    const currentVersion = await this.getVersion(params.id);
    
    // 检查版本状态
    if (currentVersion.status !== 'DRAFT') {
      throw new Error('只能更新草稿状态的版本');
    }
    
    // 返回更新后的版本
    return {
      ...currentVersion,
      queryText: params.sqlContent || currentVersion.queryText,
      updatedAt: new Date().toISOString()
    };
  },
  
  // 发布版本
  async publishVersion(versionId: string): Promise<QueryVersion> {
    console.log('模拟发布版本:', versionId);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // 获取现有版本
    const currentVersion = await this.getVersion(versionId);
    
    // 检查版本状态
    if (currentVersion.status !== 'DRAFT') {
      throw new Error('只能发布草稿状态的版本');
    }
    
    // 返回发布后的版本
    return {
      ...currentVersion,
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  // 废弃版本
  async deprecateVersion(versionId: string): Promise<QueryVersion> {
    console.log('模拟废弃版本:', versionId);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 获取现有版本
    const currentVersion = await this.getVersion(versionId);
    
    // 检查版本状态
    if (currentVersion.status !== 'PUBLISHED') {
      throw new Error('只能废弃已发布状态的版本');
    }
    
    // 返回废弃后的版本
    return {
      ...currentVersion,
      status: 'DEPRECATED',
      deprecatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  // 设置活跃版本
  async activateVersion(queryId: string, versionId: string): Promise<{ success: boolean }> {
    console.log('模拟设置活跃版本:', queryId, versionId);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 获取现有版本
    const currentVersion = await this.getVersion(versionId);
    
    // 检查版本状态
    if (currentVersion.status !== 'PUBLISHED') {
      throw new Error('只能将已发布状态的版本设为活跃版本');
    }
    
    return { success: true };
  }
};

// 使用环境变量判断是否使用模拟API
export const isUsingMockApi = () => {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
};

// 版本服务
export const versionService = {
  // 获取查询服务的版本列表
  async getVersions(params: GetVersionsParams): Promise<PageResponse<QueryVersion>> {
    if (isUsingMockApi()) {
      return mockVersionApi.getVersions(params);
    }
    
    try {
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
      
      const responseData = await response.json();
      const result = responseData.data || responseData;
      
      // 确保返回的数据符合PageResponse<QueryVersion>格式
      let versions: QueryVersion[] = [];
      let totalItems = 0;
      let currentPage = Number(params.page || 1);
      let pageSize = Number(params.size || 10);
      let totalPages = 1;
      
      if (Array.isArray(result)) {
        // 直接返回数组格式
        versions = result;
        totalItems = versions.length;
      } else if (result.items && Array.isArray(result.items)) {
        // {items: [...], total: number, ...} 格式
        versions = result.items;
        totalItems = result.total || versions.length;
        currentPage = result.page || currentPage;
        pageSize = result.size || pageSize;
        totalPages = result.totalPages || Math.ceil(totalItems / pageSize);
      }
      
      // 将后端返回的数据转换为前端所需的QueryVersion格式
      const mappedVersions = versions.map(item => ({
        id: item.id,
        queryId: item.queryId,
        versionNumber: item.versionNumber || item.version_number,
        status: item.status || item.version_status || 'DRAFT',
        queryText: item.queryText || item.sql_content,
        createdAt: item.createdAt || item.created_at,
        updatedAt: item.updatedAt || item.updated_at,
        publishedAt: item.publishedAt || item.published_at,
        deprecatedAt: item.deprecatedAt || item.deprecated_at,
        createdBy: item.createdBy || item.created_by,
        publishedBy: item.publishedBy || item.published_by,
        deprecatedBy: item.deprecatedBy || item.deprecated_by
      }));
      
      return {
        items: mappedVersions,
        total: totalItems,
        page: currentPage,
        size: pageSize,
        totalPages
      };
    } catch (error) {
      console.error('获取版本列表错误:', error);
      throw error;
    }
  },
  
  // 获取版本详情
  async getVersion(versionId: string): Promise<QueryVersion> {
    if (isUsingMockApi()) {
      return mockVersionApi.getVersion(versionId);
    }
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/versions/${versionId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`获取版本详情失败: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const result = responseData.data || responseData;
      
      // 转换为QueryVersion格式
      return {
        id: result.id,
        queryId: result.queryId || result.query_id,
        versionNumber: result.versionNumber || result.version_number,
        status: result.status || result.version_status || 'DRAFT',
        queryText: result.queryText || result.sql_content,
        createdAt: result.createdAt || result.created_at,
        updatedAt: result.updatedAt || result.updated_at,
        publishedAt: result.publishedAt || result.published_at,
        deprecatedAt: result.deprecatedAt || result.deprecated_at,
        createdBy: result.createdBy || result.created_by,
        publishedBy: result.publishedBy || result.published_by,
        deprecatedBy: result.deprecatedBy || result.deprecated_by
      };
    } catch (error) {
      console.error('获取版本详情错误:', error);
      throw error;
    }
  },
  
  // 创建新版本
  async createVersion(params: CreateVersionParams): Promise<QueryVersion> {
    if (isUsingMockApi()) {
      return mockVersionApi.createVersion(params);
    }
    
    try {
      // 构建请求体
      const requestBody = {
        queryText: params.sqlContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${params.queryId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`创建版本失败: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const result = responseData.data || responseData;
      
      // 转换为QueryVersion格式
      return {
        id: result.id,
        queryId: result.queryId || result.query_id,
        versionNumber: result.versionNumber || result.version_number,
        status: result.status || result.version_status || 'DRAFT',
        queryText: result.queryText || result.sql_content,
        createdAt: result.createdAt || result.created_at,
        updatedAt: result.updatedAt || result.updated_at,
        publishedAt: result.publishedAt || result.published_at,
        deprecatedAt: result.deprecatedAt || result.deprecated_at,
        createdBy: result.createdBy || result.created_by,
        publishedBy: result.publishedBy || result.published_by,
        deprecatedBy: result.deprecatedBy || result.deprecated_by
      };
    } catch (error) {
      console.error('创建版本错误:', error);
      throw error;
    }
  },
  
  // 更新版本
  async updateVersion(params: UpdateVersionParams): Promise<QueryVersion> {
    if (isUsingMockApi()) {
      return mockVersionApi.updateVersion(params);
    }
    
    try {
      // 构建请求体
      const requestBody = {
        queryText: params.sqlContent,
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${params.queryId}/versions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`更新版本失败: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const result = responseData.data || responseData;
      
      // 转换为QueryVersion格式
      return {
        id: result.id,
        queryId: result.queryId || result.query_id,
        versionNumber: result.versionNumber || result.version_number,
        status: result.status || result.version_status || 'DRAFT',
        queryText: result.queryText || result.sql_content,
        createdAt: result.createdAt || result.created_at,
        updatedAt: result.updatedAt || result.updated_at,
        publishedAt: result.publishedAt || result.published_at,
        deprecatedAt: result.deprecatedAt || result.deprecated_at,
        createdBy: result.createdBy || result.created_by,
        publishedBy: result.publishedBy || result.published_by,
        deprecatedBy: result.deprecatedBy || result.deprecated_by
      };
    } catch (error) {
      console.error('更新版本错误:', error);
      throw error;
    }
  },
  
  // 发布版本
  async publishVersion(versionId: string): Promise<QueryVersion> {
    if (isUsingMockApi()) {
      return mockVersionApi.publishVersion(versionId);
    }
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/versions/${versionId}/publish`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`发布版本失败: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const result = responseData.data || responseData;
      
      // 转换为QueryVersion格式
      return {
        id: result.id,
        queryId: result.queryId || result.query_id,
        versionNumber: result.versionNumber || result.version_number,
        status: result.status || result.version_status || 'PUBLISHED',
        queryText: result.queryText || result.sql_content,
        createdAt: result.createdAt || result.created_at,
        updatedAt: result.updatedAt || result.updated_at,
        publishedAt: result.publishedAt || result.published_at || new Date().toISOString(),
        deprecatedAt: result.deprecatedAt || result.deprecated_at,
        createdBy: result.createdBy || result.created_by,
        publishedBy: result.publishedBy || result.published_by,
        deprecatedBy: result.deprecatedBy || result.deprecated_by
      };
    } catch (error) {
      console.error('发布版本错误:', error);
      throw error;
    }
  },
  
  // 废弃版本
  async deprecateVersion(versionId: string): Promise<QueryVersion> {
    if (isUsingMockApi()) {
      return mockVersionApi.deprecateVersion(versionId);
    }
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/versions/${versionId}/deprecate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`废弃版本失败: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const result = responseData.data || responseData;
      
      // 转换为QueryVersion格式
      return {
        id: result.id,
        queryId: result.queryId || result.query_id,
        versionNumber: result.versionNumber || result.version_number,
        status: result.status || result.version_status || 'DEPRECATED',
        queryText: result.queryText || result.sql_content,
        createdAt: result.createdAt || result.created_at,
        updatedAt: result.updatedAt || result.updated_at,
        publishedAt: result.publishedAt || result.published_at,
        deprecatedAt: result.deprecatedAt || result.deprecated_at || new Date().toISOString(),
        createdBy: result.createdBy || result.created_by,
        publishedBy: result.publishedBy || result.published_by,
        deprecatedBy: result.deprecatedBy || result.deprecated_by
      };
    } catch (error) {
      console.error('废弃版本错误:', error);
      throw error;
    }
  },
  
  // 设置活跃版本
  async activateVersion(queryId: string, versionId: string): Promise<{ success: boolean }> {
    if (isUsingMockApi()) {
      return mockVersionApi.activateVersion(queryId, versionId);
    }
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/versions/${versionId}/activate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`设置活跃版本失败: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      return { success: responseData.success !== false };
    } catch (error) {
      console.error('设置活跃版本错误:', error);
      throw error;
    }
  },
  
  // 执行特定版本的查询
  async executeVersion(queryId: string, versionId: string, parameters?: any): Promise<any> {
    if (isUsingMockApi()) {
      // 模拟执行版本查询
      console.log('模拟执行版本查询:', queryId, versionId, parameters);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        data: {
          columns: ['id', 'name', 'value'],
          rows: [
            { id: 1, name: '测试1', value: 100 },
            { id: 2, name: '测试2', value: 200 },
            { id: 3, name: '测试3', value: 300 }
          ],
          rowCount: 3,
          executionTime: 245
        }
      };
    }
    
    try {
      const requestBody = { parameters };
      
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/versions/${versionId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`执行版本查询失败: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('执行版本查询错误:', error);
      throw error;
    }
  }
};

// 将API返回的版本对象映射为本地类型
function mapVersionFromApi(result: any): QueryVersion {
  return {
    id: result.id,
    queryId: result.queryId || result.query_id,
    versionNumber: result.versionNumber || result.version_number,
    status: result.status || result.version_status || 'DRAFT',
    queryText: result.queryText || result.sql_content,
    createdAt: result.createdAt || result.created_at,
    updatedAt: result.updatedAt || result.updated_at,
    publishedAt: result.publishedAt || result.published_at,
    deprecatedAt: result.deprecatedAt || result.deprecated_at,
    isActive: result.isActive || result.is_active
  };
}

export default versionService;