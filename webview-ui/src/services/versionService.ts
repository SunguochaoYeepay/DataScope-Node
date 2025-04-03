/**
 * 版本管理服务
 * 提供查询版本相关的API调用
 */
import axios from 'axios';
import type { QueryVersion } from '@/types/queryVersion';

// 创建一个专用于版本管理的axios实例，指向后端API
const versionApi = axios.create({
  baseURL: import.meta.env.PROD 
    ? '/api' // 生产环境使用相对路径，通过代理访问
    : 'http://localhost:5000/api', // 开发环境直接访问后端
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 开发调试信息
console.debug('版本管理服务初始化，baseURL:', versionApi.defaults.baseURL);

// 版本管理服务
export const versionService = {
  /**
   * 获取查询的所有版本
   * @param queryId 查询ID
   * @returns 版本列表
   */
  getVersions: async (queryId: string): Promise<QueryVersion[]> => {
    try {
      console.log(`请求版本列表: ${versionApi.defaults.baseURL}/query/version/management/${queryId}`);
      const response = await versionApi.get(`/query/version/management/${queryId}`);
      
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
      console.log(`请求版本详情: ${versionApi.defaults.baseURL}/query/version/${versionId}`);
      const response = await versionApi.get(`/query/version/${versionId}`);
      
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
   * 激活指定版本
   * @param versionId 版本ID
   * @returns 是否成功
   */
  activateVersion: async (versionId: string): Promise<boolean> => {
    try {
      const url = `/query/version/activate/${versionId}`;
      const fullUrl = `${versionApi.defaults.baseURL}${url}`;
      console.log(`准备激活版本:`, { versionId, fullUrl });
      
      console.time('activateVersionRequest');
      const response = await versionApi.put(url);
      console.timeEnd('activateVersionRequest');
      
      console.log('激活版本返回结果:', {
        status: response.status,
        statusText: response.statusText,
        success: response.data?.success,
        error: response.data?.error,
        data: response.data?.data
      });
      
      if (!response.data || !response.data.success) {
        console.warn('激活版本返回失败状态:', {
          message: response.data?.error?.message,
          code: response.data?.error?.code,
          details: response.data?.error?.details
        });
        throw new Error(response.data?.error?.message || '激活版本失败');
      }
      
      return true;
    } catch (error: any) {
      console.error('激活版本失败：', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      throw error;
    }
  }
};

export default versionService;