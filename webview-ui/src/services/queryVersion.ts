import type {
  QueryVersion,
  QueryVersionStatus,
  GetVersionsParams,
  CreateVersionParams,
  UpdateVersionParams
} from '@/types/queryVersion';
import { getApiBaseUrl } from './query';
import type { PageResponse } from '@/types/query';

// 版本服务
export const versionService = {
  // 获取查询服务的版本列表
  async getVersions(params: GetVersionsParams): Promise<PageResponse<QueryVersion>> {
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
      const url = `${getApiBaseUrl()}/api/queries/${params.queryId}/versions`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sqlContent: params.sqlContent
        })
      });
      
      if (!response.ok) {
        throw new Error(`创建版本失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return mapVersionFromApi(result.data);
    } catch (error) {
      console.error('创建版本失败:', error);
      throw error;
    }
  },
  
  // 更新版本
  async updateVersion(params: UpdateVersionParams): Promise<QueryVersion> {
    try {
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
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/versions/${versionId}/execute`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ parameters })
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