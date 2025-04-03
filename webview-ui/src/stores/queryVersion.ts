import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { QueryVersion, QueryVersionStatus, CreateVersionRequest } from '@/types/queryVersion';
import { useMessageService } from '@/services/message';
import versionService from '@/services/versionService';

/**
 * 查询版本管理 Store
 */
export const useQueryVersionStore = defineStore('queryVersion', () => {
  // 消息服务
  const messageService = useMessageService();
  
  // 状态
  const isLoading = ref(false);
  const currentVersions = ref<Record<string, QueryVersion[]>>({});
  const versions = ref<QueryVersion[]>([]);
  const currentVersion = ref<QueryVersion | null>(null);
  
  /**
   * 获取查询的所有版本
   * @param queryId 查询ID
   */
  async function getQueryVersions(queryId: string): Promise<void> {
    try {
      isLoading.value = true;
      
      // 调用API获取版本数据
      const data = await versionService.getVersions(queryId);
      versions.value = data || [];
    } catch (error) {
      console.error('获取查询版本失败:', error);
      messageService.error('获取版本列表失败，请重试');
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * 获取当前活跃版本
   * @param queryId 查询ID
   */
  async function getCurrentVersion(queryId: string): Promise<void> {
    try {
      isLoading.value = true;
      
      // 使用现有数据确定当前版本
      const activeVersion = versions.value.find(v => v.status === 'PUBLISHED' && v.isActive);
      
      if (activeVersion) {
        currentVersion.value = activeVersion;
      } else if (versions.value.length > 0) {
        // 如果没有活跃版本，使用最新的已发布版本
        const publishedVersions = versions.value.filter(v => v.status === 'PUBLISHED');
        if (publishedVersions.length > 0) {
          // 按版本号排序取最新
          currentVersion.value = publishedVersions.sort((a, b) => b.versionNumber - a.versionNumber)[0];
        }
      } else {
        currentVersion.value = null;
      }
    } catch (error) {
      console.error('获取当前版本失败:', error);
      messageService.error('获取当前版本失败，请重试');
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * 激活指定版本
   * @param queryId 查询ID
   * @param versionNumber 版本号
   */
  async function activateVersion(queryId: string, versionNumber: number): Promise<boolean> {
    console.log(`店铺开始激活版本: queryId=${queryId}, versionNumber=${versionNumber}`);
    console.log('当前版本集合:', versions.value.map(v => ({ id: v.id, number: v.versionNumber, active: v.isActive })));
    
    try {
      isLoading.value = true;
      
      // 找到要激活的版本
      const version = versions.value.find(v => v.versionNumber === versionNumber);
      console.log('匹配到的版本:', version);
      
      if (!version) {
        const error = new Error(`找不到指定版本: ${versionNumber}`);
        console.error(error.message, {
          availableVersions: versions.value.map(v => v.versionNumber),
          requestedVersion: versionNumber
        });
        throw error;
      }
      
      // 调用API激活版本
      console.log(`准备调用激活版本API, 版本ID: ${version.id}`);
      const success = await versionService.activateVersion(version.id);
      console.log(`激活版本API调用结果: ${success ? '成功' : '失败'}`);
      
      if (success) {
        // 更新当前版本
        const previousActiveVersion = currentVersion.value;
        console.log('更新当前版本:', {
          from: previousActiveVersion ? { id: previousActiveVersion.id, number: previousActiveVersion.versionNumber } : null,
          to: { id: version.id, number: version.versionNumber }
        });
        
        currentVersion.value = version;
        
        // 更新版本状态
        console.log('开始更新所有版本的活跃状态...');
        versions.value.forEach(v => {
          const oldValue = v.isActive;
          v.isActive = v.id === version.id;
          if (oldValue !== v.isActive) {
            console.log(`版本 ${v.versionNumber} 活跃状态从 ${oldValue} 变为 ${v.isActive}`);
          }
        });
        
        // 成功提示
        messageService.success('已将该版本设为当前版本');
      }
      
      return success;
    } catch (error: any) {
      console.error('激活版本失败:', {
        error: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      messageService.error(`激活版本失败: ${error.message}`);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

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
    versions,
    currentVersion,
    getQueryVersions,
    getCurrentVersion,
    activateVersion,
    saveDraft,
    publishVersion,
    setActiveVersion,
    createNewVersion
  };
});