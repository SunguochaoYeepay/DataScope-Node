import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { QueryVersion, QueryVersionStatus, CreateVersionRequest } from '@/types/queryVersion';
import { useMessageService } from '@/services/message';

/**
 * 查询版本管理 Store
 */
export const useQueryVersionStore = defineStore('queryVersion', () => {
  // 消息服务
  const messageService = useMessageService();
  
  // 状态
  const isLoading = ref(false);
  const currentVersions = ref<Record<string, QueryVersion[]>>({});
  
  /**
   * 保存草稿版本
   * @param queryId 查询ID
   * @param request 版本请求参数
   * @returns 保存后的版本信息
   */
  async function saveDraft(queryId: string, request: CreateVersionRequest): Promise<QueryVersion | null> {
    try {
      isLoading.value = true;
      
      // 模拟 API 调用
      console.log(`保存草稿版本: 查询ID=${queryId}, 版本ID=${request.versionId}`);
      
      // 模拟成功响应
      const savedVersion: QueryVersion = {
        id: request.versionId,
        queryId: queryId,
        versionNumber: 1,
        queryText: request.queryText,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 保存成功提示
      messageService.success('草稿保存成功');
      
      return savedVersion;
    } catch (error) {
      console.error('保存草稿失败:', error);
      messageService.error('草稿保存失败，请重试');
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * 发布版本
   * @param queryId 查询ID
   * @param versionId 版本ID
   * @param setAsActive 是否设为活跃版本
   * @returns 发布结果
   */
  async function publishVersion(queryId: string, versionId: string, setAsActive = false): Promise<boolean> {
    try {
      isLoading.value = true;
      
      // 模拟 API 调用
      console.log(`发布版本: 查询ID=${queryId}, 版本ID=${versionId}, 设为活跃=${setAsActive}`);
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 发布成功提示
      messageService.success('版本发布成功');
      
      return true;
    } catch (error) {
      console.error('发布版本失败:', error);
      messageService.error('版本发布失败，请重试');
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * 设置活跃版本
   * @param queryId 查询ID
   * @param versionId 版本ID
   * @returns 设置结果
   */
  async function setActiveVersion(queryId: string, versionId: string): Promise<boolean> {
    try {
      isLoading.value = true;
      
      // 模拟 API 调用
      console.log(`设置活跃版本: 查询ID=${queryId}, 版本ID=${versionId}`);
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 设置成功提示
      messageService.success('已将该版本设为当前版本');
      
      return true;
    } catch (error) {
      console.error('设置活跃版本失败:', error);
      messageService.error('设置当前版本失败，请重试');
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * 创建新版本
   * @param queryId 查询ID
   * @param fromVersionId 基于的版本ID
   * @returns 新创建的版本信息
   */
  async function createNewVersion(queryId: string, fromVersionId: string): Promise<QueryVersion | null> {
    try {
      isLoading.value = true;
      
      // 模拟 API 调用
      console.log(`创建新版本: 查询ID=${queryId}, 基于版本ID=${fromVersionId}`);
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // 模拟新版本数据
      const newVersion: QueryVersion = {
        id: `new-version-${Date.now()}`,
        queryId: queryId,
        versionNumber: 2, // 假设为新的版本号
        queryText: '-- 从已发布版本创建的新草稿\nSELECT * FROM users LIMIT 100;',
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 创建成功提示
      messageService.success('已创建新的草稿版本');
      
      return newVersion;
    } catch (error) {
      console.error('创建新版本失败:', error);
      messageService.error('创建新版本失败，请重试');
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    currentVersions,
    saveDraft,
    publishVersion,
    setActiveVersion,
    createNewVersion
  };
});