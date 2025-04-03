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
      return mapVersionFromApi(result.data);
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
  return {
    id: result.id,
    queryId: result.queryId,
    versionNumber: result.versionNumber,
    status: result.status as QueryVersionStatus,
    queryText: result.queryText,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    publishedAt: result.publishedAt,
    deprecatedAt: result.deprecatedAt
  };
}