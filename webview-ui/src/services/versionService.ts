/**
 * 版本管理服务
 * 提供查询版本相关的API调用
 */
import axios from 'axios';
import type { QueryVersion } from '@/types/queryVersion';
import { mockQueries } from '@/mock/data/query';

// 检查是否启用mock模式
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
console.log('版本服务 - Mock模式:', USE_MOCK ? '已启用' : '已禁用');

// 创建一个专用于版本管理的axios实例，指向后端API
const versionApi = axios.create({
  baseURL: import.meta.env.PROD 
    ? '/api' // 生产环境使用相对路径，通过代理访问
    : (USE_MOCK ? '' : 'http://localhost:3100/api'), // 开发环境直接访问后端，mock模式下使用空baseURL
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 开发调试信息
console.debug('版本管理服务初始化，baseURL:', versionApi.defaults.baseURL);

// 定义创建版本请求参数接口
export interface CreateVersionParams {
  sqlContent: string;
  dataSourceId: string;
  description?: string;
}

// 生成模拟版本数据
function generateMockVersions(queryId: string): QueryVersion[] {
  // 从mockQueries中查找对应的查询
  const query = mockQueries.find(q => q.id === queryId);
  
  if (!query) {
    console.warn(`未找到ID为${queryId}的查询，返回空版本列表`);
    return [];
  }
  
  // 如果查询中已有versions字段，使用该字段
  if (query.versions && Array.isArray(query.versions) && query.versions.length > 0) {
    // 转换为QueryVersion格式
    return query.versions.map((v, index) => ({
      id: v.id || `ver-${queryId}-${index + 1}`,
      queryId: queryId,
      versionNumber: v.versionNumber || index + 1,
      queryText: v.sql || query.queryText || '',
      status: v.status as any || 'PUBLISHED',
      isActive: index === 0, // 第一个版本是活跃的
      createdAt: v.createdAt || new Date(Date.now() - index * 86400000).toISOString(),
      updatedAt: v.createdAt || new Date(Date.now() - index * 86400000).toISOString(),
      dataSourceId: v.dataSourceId || query.dataSourceId
    }));
  }
  
  // 创建3个模拟版本记录
  return Array.from({ length: 3 }, (_, i) => {
    const versionNumber = 3 - i; // 最新的版本在前面
    return {
      id: `ver-${queryId}-${versionNumber}`,
      queryId: queryId,
      versionNumber: versionNumber,
      queryText: query.queryText || `SELECT * FROM example_table WHERE id > ${i} LIMIT 10`,
      status: i === 0 ? 'PUBLISHED' : (i === 1 ? 'DRAFT' : 'DEPRECATED'),
      isActive: i === 0, // 第一个版本是活跃的
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
      dataSourceId: query.dataSourceId
    };
  });
}

// 版本管理服务
export const versionService = {
  /**
   * 获取查询的所有版本
   * @param queryId 查询ID
   * @returns 版本列表
   */
  getVersions: async (queryId: string): Promise<QueryVersion[]> => {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回查询版本列表');
        return generateMockVersions(queryId);
      }
      
      // 更新为新的API路径格式
      console.log(`请求版本列表: ${versionApi.defaults.baseURL}/queries/versions/management/${queryId}`);
      const response = await versionApi.get(`/queries/versions/management/${queryId}`);
      
      if (response.data && response.data.success) {
        console.log('版本列表响应:', response.data);
        if (!response.data.data || !Array.isArray(response.data.data)) {
          console.warn('后端返回空数据或格式不正确，返回空数组');
          return [];
        }
        return response.data.data || [];
      }
      
      throw new Error(response.data?.error?.message || '获取版本数据失败');
    } catch (error: any) {
      console.error('获取查询版本失败:', error);
      throw error;
    }
  },
  
  /**
   * 获取指定版本详情
   * @param versionId 版本ID
   * @returns 版本详情
   */
  getVersionById: async (versionId: string): Promise<QueryVersion> => {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回版本详情');
        
        // 从版本ID中提取查询ID（假设格式为 ver-[queryId]-[number]）
        const parts = versionId.split('-');
        if (parts.length >= 3) {
          const queryId = parts.slice(1, parts.length - 1).join('-'); // 处理可能包含连字符的queryId
          const versionNumber = parseInt(parts[parts.length - 1]);
          
          // 获取该查询的所有版本
          const versions = generateMockVersions(queryId);
          
          // 查找匹配的版本
          const version = versions.find(v => v.id === versionId || v.versionNumber === versionNumber);
          
          if (version) {
            return version;
          }
        }
        
        // 如果找不到匹配的版本，创建一个通用的模拟版本
        return {
          id: versionId,
          queryId: 'unknown-query',
          versionNumber: 1,
          queryText: 'SELECT * FROM example_table LIMIT 10',
          status: 'PUBLISHED',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dataSourceId: 'ds-1'
        };
      }
      
      // 更新为新的API路径格式
      console.log(`请求版本详情: ${versionApi.defaults.baseURL}/queries/versions/${versionId}`);
      const response = await versionApi.get(`/queries/versions/${versionId}`);
      
      if (response.data && response.data.success) {
        console.log('版本详情响应:', response.data);
        return response.data.data;
      }
      
      throw new Error(response.data?.error?.message || '获取版本详情失败');
    } catch (error) {
      console.error('获取版本详情失败:', error);
      throw error;
    }
  },
  
  /**
   * 为指定查询创建新版本
   * @param queryId 查询ID 
   * @param params 版本参数 (SQL内容、数据源ID、描述)
   * @returns 创建的版本信息
   */
  createVersion: async (queryId: string, params: CreateVersionParams): Promise<QueryVersion> => {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据创建查询版本');
        
        // 获取查询的现有版本
        const versions = generateMockVersions(queryId);
        
        // 确定新版本号
        const maxVersionNumber = Math.max(...versions.map(v => v.versionNumber), 0);
        const newVersionNumber = maxVersionNumber + 1;
        
        // 创建新版本
        const newVersion: QueryVersion = {
          id: `ver-${queryId}-${newVersionNumber}`,
          queryId: queryId,
          versionNumber: newVersionNumber,
          queryText: params.sqlContent,
          status: 'DRAFT',
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dataSourceId: params.dataSourceId
        };
        
        return newVersion;
      }
      
      // 使用新的API路径格式
      const url = `/queries/${queryId}/versions`;
      console.log(`创建查询版本: ${versionApi.defaults.baseURL}${url}`, params);
      
      const response = await versionApi.post(url, params);
      
      if (response.data && response.data.success) {
        console.log('版本创建成功:', response.data);
        return response.data.data;
      }
      
      throw new Error(response.data?.error?.message || '创建版本失败');
    } catch (error: any) {
      console.error('创建版本失败:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || error.message || '创建版本失败');
    }
  },
  
  /**
   * 激活指定版本
   * @param queryId 查询ID
   * @param versionId 版本ID
   * @returns 激活结果
   */
  activateVersion: async (queryId: string, versionId: string): Promise<any> => {
    try {
      // 检查是否使用模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据激活查询版本');
        
        // 创建一个模拟的成功响应
        return {
          success: true,
          message: '版本激活成功',
          data: {
            id: versionId,
            queryId: queryId,
            status: 'PUBLISHED',
            isActive: true
          }
        };
      }
      
      // 使用正确的路径格式和HTTP方法
      const url = `/queries/versions/${versionId}/activate`;
      const fullUrl = `${versionApi.defaults.baseURL}${url}`;
      console.log(`准备激活版本:`, { queryId, versionId, fullUrl });
      
      console.time('activateVersionRequest');
      const response = await versionApi.post(url);
      console.timeEnd('activateVersionRequest');
      
      console.log('激活版本返回结果:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      // 直接返回完整响应对象，让调用方处理
      return response.data;
    } catch (error: any) {
      console.error('激活版本失败：', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      // 如果有响应数据，返回响应数据，否则抛出错误
      if (error.response && error.response.data) {
        return error.response.data;
      }
      
      throw new Error(error.message || '激活版本失败：响应数据格式不符合预期');
    }
  }
};

export default versionService;